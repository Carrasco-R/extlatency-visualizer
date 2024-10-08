<script>
  export let formattedData;
  import { TreeView } from "carbon-components-svelte";

  console.log({ formattedData });

  let activeId = "";
  let selectedIds = [];
  let children = [];

  $: if (formattedData) {
    children = [];
    try {
      let tsArray = [];
      formattedData.forEach(({ keyword }, i) => {
        console.log({ keyword });
        if (keyword == "TS") {
          tsArray.push(i);
          console.log({ tsArray });
        }
        if (keyword == "TC") {
          console.log("foo?");

          const lastTSIndex = tsArray.pop();
          console.log({ lastTSIndex });
          if (lastTSIndex === undefined) {
            throw new Error("Error parsing tree view");
          }

          children = [
            ...children,
            {
              id: `Transaction${lastTSIndex}`,
              text: "Total Transaction",
              children: formattedData.slice(lastTSIndex + 1, i),
            },
          ];
          console.log({ tsArray });
        }
      });
	  
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
  on:select={({ detail }) => console.log("select", detail)}
  on:toggle={({ detail }) => console.log("toggle", detail)}
  on:focus={({ detail }) => console.log("focus", detail)}
/>

<!-- <div>Active node id: {activeId}</div>
<div>Selected ids: {JSON.stringify(selectedIds)}</div> -->

<style>
  div {
    margin-top: var(--cds-spacing-05);
  }
</style>
