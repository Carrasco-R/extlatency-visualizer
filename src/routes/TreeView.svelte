<script>
  export let formattedData;
  import { TreeView } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";

  console.log({ formattedData });

  let activeId = "";
  let selectedIds = [];
  let children = [];

  $: if (formattedData) {
    let nodes = formattedData.map(({ id, keyword, text }) => {
      return { id, keyword, text };
    });
    children = [];
    console.log({ nodes });

    function addTNodes(nodes) {
      console.log({ nodes });

      const startTracker = [];
      let tree = [];
      for (let i = 0; i < nodes.length; i++) {
        const { id, keyword, text } = nodes[i];
        if (keyword == "TS") {
          startTracker.push(i);
          console.log({ startTracker });
        }
        if (keyword == "TC") {
          if (startTracker.length == 1) {
            const firstStart = startTracker.pop();
            if (firstStart === undefined) {
              throw new Error("Error parsing Tnodes");
            }
            let slice = nodes.slice(firstStart + 1, i);
            const sliceKeys = slice.map(({ keyword }) => keyword);
            console.log({ sliceKeys });
            if (sliceKeys.includes("TS") || sliceKeys.includes("TC")) {
              slice = addTNodes(slice);
            }

            tree = [
              ...tree,
              {
                id: `Transaction${uuidv4()}`,
                text: `Transaction`,
                children: slice,
              },
            ];
          } else {
            startTracker.pop();
          }
        }
        if (keyword != "TC" && startTracker.length == 0) {
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
  {children}
  bind:activeId
  bind:selectedIds
/>

<!-- on:select={({ detail }) => console.log("select", detail)}
  on:toggle={({ detail }) => console.log("toggle", detail)}
  on:focus={({ detail }) => console.log("focus", detail)} -->

<!-- <div>Active node id: {activeId}</div>
<div>Selected ids: {JSON.stringify(selectedIds)}</div> -->

<style>
  div {
    margin-top: var(--cds-spacing-05);
  }
</style>
