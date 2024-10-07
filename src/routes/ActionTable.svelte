<script>
  export let actions;
  import { dictionary } from "$lib/dictionary";
  import { DataTable } from "carbon-components-svelte";

  let formattedData = [{}];
  $: if (actions) {
    let prevTime = 0;
    formattedData = [];
    actions.forEach((action, i) => {
      let [keyword, time] = Object.entries(action)[0];
      let duration = time - prevTime;
      formattedData = [
        ...formattedData,
        {
          id: i,
          time,
          keyword,
          duration,
          description: dictionary[keyword] ?? "Unknown keyword",
        },
      ];
      prevTime = time;
    });
    // console.log({ formattedData });
  }
</script>

<DataTable
  size="short"
  headers={[
    { key: "time", value: "Elapsed Time (ms)" },
    { key: "duration", value: "Duration (ms)" },
    { key: "keyword", value: "Keyword" },
    { key: "description", value: "Description" },
  ]}
  rows={formattedData}
/>
