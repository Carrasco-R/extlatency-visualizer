<script>
  export let formattedData;
  import { DataTable } from "carbon-components-svelte";
</script>

<DataTable
  size="short"
  headers={[
    { key: "time", value: "Elapsed Time (ms)" },
    { key: "duration", value: "Duration (ms)" },
    { key: "keyword", value: "Keyword" },
    { key: "text", value: "Description" },
  ]}
  rows={formattedData}
/>
