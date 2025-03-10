<script>
    export let data;
    import { DataTable } from "carbon-components-svelte";
    import { addMetadata } from "../data";
</script>

<DataTable
    size="short"
    headers={[
        { key: "time", value: "Elapsed Time (ms)" },
        { key: "duration", value: "Duration (ms)" },
        { key: "keyword", value: "Keyword" },
        { key: "text", value: "Description" },
    ]}
    rows={addMetadata(data.actions)}
/>
