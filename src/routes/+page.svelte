<script>
  import TreeView from "./TreeView.svelte";
  import { dictionary } from "$lib/dictionary";
  import ActionTable from "./ActionTable.svelte";
  import { TextArea } from "carbon-components-svelte";
  import { InlineNotification } from "carbon-components-svelte";
  import { ContentSwitcher, Switch } from "carbon-components-svelte";
  import DecisionTree from "carbon-icons-svelte/lib/DecisionTree.svelte";
  import Table from "carbon-icons-svelte/lib/Table.svelte";

  let selectedIndex = 1;

  let log =
    "ExtLatency: TS=0,HR=0,BR=0,PS=0,RT=2,COR=2,CI=3,RL=59,SE=59,XS=60,SV=62,SV=63,JTG=68,JTV=75, == GS=77,IV=80,PAR=82,XSL=85,X2J=86,SW=86,XC=86,RES=87,PC=87,TC=87, [https://172.168.0.1:9090/apic/foo/bar]";
  let logType = "dp";
  let url = "";
  const logTypeMap = {
    dp: "Multiprotocol gateway | Web service proxy | XML firewall",
    apigw: "API gateway",
    "": "Unkown/Error",
  };
  let actions = [""];
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
  function update(log) {
    actions = [];
    logType = "";
    const datapowerLogRegex = /(?:ExtLatency: )(.*)(?: == )(.*)(\[.*\])$/;
    const apiGatewayLogRegex = /(?:ExtLatency: )(.*)(\[.*\])$/;
    if (datapowerLogRegex.test(log)) {
      try {
        const regexMatch = log.match(datapowerLogRegex);
        const requestProcessing = parseActions(regexMatch[1]);
        const responseProcessing = parseActions(regexMatch[2]);
        const logUrl = regexMatch[3];
        actions = [...requestProcessing, ...responseProcessing];
        logType = "dp";
        url = logUrl;
      } catch (error) {
        console.log({ error });
      }
    } else if (apiGatewayLogRegex.test(log)) {
      try {
        const regexMatch = log.match(apiGatewayLogRegex) ?? [""];
        const logUrl = regexMatch[2];
        actions = parseActions(regexMatch[1]);
        url = logUrl;
        logType = "apigw";
      } catch (error) {
        // console.log({ error });
      }
    }
    // console.log({ actions });
  }

  update({ target: { value: log } });

  // TODO: Add "==" in action table

  let formattedData = [{}];
  $: if (log) {
    update(log);
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
          keyword: keyword.trim(),
          duration,
          text: dictionary[keyword] ?? "Unknown keyword",
        },
      ];
      prevTime = time;
    });
    // console.log({ formattedData });
  }
</script>

<TextArea
  labelText="ExtLatency Message"
  placeholder="ExtLatency: ......... [https://example.com]"
  bind:value={log}
/>

{#if actions.length > 0}
  <InlineNotification
    lowContrast
    hideCloseButton
    kind="info"
    title="Enhanced Latency Message type:"
    subtitle={logTypeMap[logType]}
  />
  <InlineNotification
    lowContrast
    hideCloseButton
    kind="info"
    title="Resource URL:"
    subtitle={url}
  />
  <ContentSwitcher bind:selectedIndex>
    <Switch>
      <div style="display: flex; align-items: center;">
        <Table style="margin-right: 0.5rem;" /> Table (Default)
      </div>
    </Switch>
    <Switch>
      <div style="display: flex; align-items: center;">
        <DecisionTree style="margin-right: 0.5rem;" /> Tree View
      </div>
    </Switch>
  </ContentSwitcher>
  <div style="margin-top: 2em"></div>
  {#if selectedIndex === 0}
    <ActionTable {formattedData} />
  {:else if selectedIndex == 1}
    <TreeView {formattedData} />
  {/if}
{:else}
  Error
{/if}
