<script>
  export let formattedData;
  import { TreeView } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";

  //   console.log({ formattedData });

  let activeId = "";
  let selectedIds = [];
  let children = [];
  let initialExpandedID = null

  $: if (formattedData) {
    let nodes = formattedData.map(({ id, keyword, text, time, duration }) => {
      return {
        id,
        keyword,
        text: `${text} (${duration}ms)`,
        time,
        duration,
      };
    });
    children = [];
    // console.log({ nodes });

    function addTNodes(nodes) {
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
            const transactionID = `Transaction${uuidv4()}`
            tree = [
              ...tree,
              {
                id: transactionID,
                text: `Transaction`,
                children: slice,
              },
            ];
            initialExpandedID = transactionID
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
    function addPNodes(nodes) {
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

    try {
      children = addTNodes(nodes);
        console.log({ children });
    } catch (error) {
      console.log(error);
      children = [];
    }
  }
</script>

<TreeView
  labelText="ExtLatency Tree View"
  expandedIds={[initialExpandedID]}
  {children}
  bind:activeId
  bind:selectedIds
/>
