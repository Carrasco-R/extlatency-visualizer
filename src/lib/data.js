import { dictionary } from "./dictionary";

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
  console.log({ baseLogData });
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
