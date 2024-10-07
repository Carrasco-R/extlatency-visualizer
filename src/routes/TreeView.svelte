<script>
  export let actions;
  import { TreeView } from "carbon-components-svelte";

  let activeId = "";
  let selectedIds = [];
  let children = [
    
  ];
</script>

<TreeView
  labelText="Cloud Products"
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
