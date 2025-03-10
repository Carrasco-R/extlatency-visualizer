import { dictionary } from "./dictionary";
import { v4 as uuidv4 } from "uuid";


const logTypeMap = {
  dp: "Multiprotocol gateway | Web service proxy | XML firewall",
  apigw: "API gateway",
  "": "Unkown/Error",
};
export const exampleLog =
  "ExtLatency: TS=0,HR=0,BR=0,PS=0,RT=2,COR=2,CI=3,RL=59,SE=59,XS=60,SV=62,SV=63,JTG=68,JTV=75, == GS=77,IV=80,PAR=82,XSL=85,X2J=86,SW=86,XC=86,RES=87,PC=87,TC=88 [https://example.com/apic/foo/bar]";

function parseActions(str) {
  return str
    .trim()
    .split(",")
    .filter((i) => i != "")
    .map((i) => {
      let [key, value] = i.split("=");
      if (
        typeof key === undefined ||
        key.trim() == "" ||
        typeof value === "undefined" ||
        value.trim() == "" ||
        isNaN(value)
      ) {
        throw new Error(`Error parsing action ${key} : ${value}`);
      }
      value = parseInt(value);
      return { [key]: value };
    });
}

export function parseLogData(log) {
  let baseLogData = {
    logType: "",
    logTypeDescription: "",
    logResourceUrl: "",
    actions: [],
  };

  const datapowerLogRegex = /(?:ExtLatency: )(.*)(?: == )(.*)(\[.*\])$/;
  const apiGatewayLogRegex = /(?:ExtLatency: )(.*)(\[.*\])$/;
  if (datapowerLogRegex.test(log)) {
    try {
      // parse regex
      const regexMatch = log.match(datapowerLogRegex);
      const requestProcessing = parseActions(regexMatch[1]);
      const responseProcessing = parseActions(regexMatch[2]);
      const logUrl = regexMatch[3];
      // assign vars
      baseLogData.actions = [...requestProcessing, ...responseProcessing];
      baseLogData.logResourceUrl = logUrl;
      baseLogData.logType = "dp";
    } catch (error) {
      console.log({ error });
    }
  } else if (apiGatewayLogRegex.test(log)) {
    try {
      // parse regex
      const regexMatch = log.match(apiGatewayLogRegex) ?? [""];
      const logUrl = regexMatch[2];
      // assign vars
      baseLogData.actions = parseActions(regexMatch[1]);
      baseLogData.logResourceUrl = logUrl;
      baseLogData.logType = "apigw";
    } catch (error) {
      console.log({ error });
    }
  }
  baseLogData.logTypeDescription = logTypeMap[baseLogData.logType];
//   console.log({ baseLogData });
  return baseLogData;
}

export function addMetadata(actions) {
  let prevTime = 0;
  let newActions = [];
  actions.forEach((action, i) => {
    let [keyword, time] = Object.entries(action)[0];
    let duration = time - prevTime;
    newActions = [
      ...newActions,
      {
        id: i,
        time,
        keyword: keyword.trim(),
        duration,
        text: dictionary[keyword] ?? "Unknown keyword",
      },
    ];
    prevTime = time;
  });
  return newActions;
}


export function addTNodes(nodes) {
    //   console.log({ nodes });

    const startTracker = [];
    let tree = [];
    for (let i = 0; i < nodes.length; i++) {
      const { id, keyword, text, time, duration } = nodes[i];
      if (keyword == "TS") {
        startTracker.push(i);
        //   console.log({ startTracker });
      }
      if (keyword == "TC") {
        if (startTracker.length == 1) {
          const firstStart = startTracker.pop();
          if (firstStart === undefined) {
            throw new Error("Error parsing Tnodes");
          }
          let slice = nodes.slice(firstStart + 1, i);
          const sliceKeys = slice.map(({ keyword }) => keyword);
          // console.log({ sliceKeys });
          if (sliceKeys.includes("TS") || sliceKeys.includes("TC")) {
            slice = addTNodes(slice);
          } else {
            slice = addPNodes(slice);
          }
          const transactionID = `Transaction${uuidv4()}`;
          tree = [
            ...tree,
            {
              id: transactionID,
              text: `Transaction`,
              children: slice,
            },
          ];
        } else {
          startTracker.pop();
        }
      }
      if (keyword != "TC" && startTracker.length == 0) {
        //   console.log("add tc leaf");

        //   console.log(`${text} (${time}ms)`);

        tree = [
          ...tree,
          {
            id,
            keyword,
            text,
          },
        ];
      }
    }
    return tree;
  }


export function addPNodes(nodes) {
    //   console.log({ nodes });

    const startTracker = [];
    let tree = [];
    for (let i = 0; i < nodes.length; i++) {
      const { id, keyword, text, time, duration } = nodes[i];
      if (keyword == "PS") {
        startTracker.push(i);
        //   console.log({ startTracker });
      }
      if (keyword == "PC") {
        if (startTracker.length == 1) {
          const firstStart = startTracker.pop();
          if (firstStart === undefined) {
            throw new Error("Error parsing pNodes");
          }
          let slice = nodes.slice(firstStart + 1, i);
          const sliceKeys = slice.map(({ keyword }) => keyword);
          // console.log({ sliceKeys });
          if (sliceKeys.includes("PS") || sliceKeys.includes("PC")) {
            slice = addPNodes(slice);
          }

          tree = [
            ...tree,
            {
              id: `Processing Rule${uuidv4()}`,
              text: `Processing Rule`,
              children: slice,
            },
          ];
        } else {
          startTracker.pop();
        }
      }
      if (keyword != "PC" && startTracker.length == 0) {
        //   console.log("add duration?");
        //   console.log(`${text} (${duration}ms)`);

        tree = [
          ...tree,
          {
            id,
            text,
            keyword,
          },
        ];
      }
    }
    return tree;
  }