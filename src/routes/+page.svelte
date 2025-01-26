<script>
  // utils
  import { dictionary } from "$lib/dictionary";
  // custom components
  import CollapsibleView from "./CollapsibleView.svelte";
  import TableView from "./TableView.svelte";
  import { Button, CopyButton } from "carbon-components-svelte";
  // carbon design components
  import {
    TextArea,
    InlineNotification,
    ContentSwitcher,
    Switch,
  } from "carbon-components-svelte";
  import DecisionTree from "carbon-icons-svelte/lib/DecisionTree.svelte";
  import Table from "carbon-icons-svelte/lib/Table.svelte";
  import Fire from "carbon-icons-svelte/lib/Fire.svelte";
  import CollapsibleTreeView from "./CollapsibleView.svelte";
  import { Copy } from "carbon-icons-svelte";
  import { text } from "@sveltejs/kit";
  import { page } from "$app/stores";
  let selectedIndex = 0;

  //   let log = "";
  let log =
    "ExtLatency: TS=0,HR=0,BR=0,PS=0,RT=2,COR=2,CI=3,RL=59,SE=59,XS=60,SV=62,SV=63,JTG=68,JTV=75, == GS=77,IV=80,PAR=82,XSL=85,X2J=86,SW=86,XC=86,RES=87,PC=87,TC=0 [https://example.com/apic/foo/bar]";

  let shareableURL = ""
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
  function generateShareableURL(log){
    const url = `${$page.url.host}?log=${encodeURIComponent(log)}`;
    return url
  }
  update({ target: { value: log } });

  // TODO: Add "==" in action table

  let formattedData = [{}];
  $: if (log) {
    update(log.trim());
    shareableURL = generateShareableURL(log.trim());
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
  }
</script>
<div class="top-header">
  <h1>ExtLatency Log Viewer</h1>
  <div class="create-link">
    <span>Copy Shareable URL</span>
    <CopyButton text={shareableURL} feedback="Copied URL!">Hello?</CopyButton>
  </div>
</div>

<main>
  <TextArea
    labelText="ExtLatency Message"
    placeholder="ExtLatency: ......... [https://example.com]"
    bind:value={log}
    disabled
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
          <Table style="margin-right: 0.5rem;" />
          <span>Table (Default)</span>
        </div>
      </Switch>
      <Switch>
        <div style="display: flex; align-items: center;">
          <DecisionTree style="margin-right: 0.5rem;" />
          <span>Collapsible Tree View</span>
        </div>
      </Switch>
      <!-- <Switch>
        <div style="display: flex; align-items: center;">
          <Fire style="margin-right: 0.5rem;" />
          <span>Flame Chart</span>
        </div>
      </Switch> -->
    </ContentSwitcher>
    <div style="margin-top: 2em"></div>
    {#if selectedIndex === 0}
      <TableView {formattedData} />
    {:else if selectedIndex == 1}
      <CollapsibleView {formattedData} />
    {:else if selectedIndex == 2}
      <FlameChartView {formattedData} />
    {/if}
  {:else if log !== ""}
    <InlineNotification
      lowContrast
      hideCloseButton
      title="Error:"
      subtitle="Failed to parse log"
    />
  {/if}
</main>

<style>
  .top-header{
    display: flex;
    justify-content: space-between;
  }
  .create-link{
    display: flex;
    align-items: center;
    gap: 1em
  }
</style>