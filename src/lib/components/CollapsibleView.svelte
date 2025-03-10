<script>
  export let data;
  import { TreeView } from "carbon-components-svelte";
  import { addMetadata, addTNodes } from "../data";

  let activeId = "";
  let selectedIds = [];
  let children = [];
  let initialExpandedID = null;

  $: if (data) {
    let actions = addMetadata(data.actions);
    let nodes = actions.map(({ id, keyword, text, time, duration }) => {
      return {
        id,
        keyword,
        text: `${text} (${duration}ms)`,
        time,
        duration,
      };
    });
    // console.log({ nodes });
    children = addTNodes(nodes);
    initialExpandedID = children[0].id;
    // console.log({ children });
  }
</script>

<TreeView
  labelText="Collapsible Tree View"
  expandedIds={[initialExpandedID]}
  {children}
  bind:activeId
  bind:selectedIds
/>
