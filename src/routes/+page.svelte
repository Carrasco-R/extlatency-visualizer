<script>
  // sv
  import { text } from "@sveltejs/kit";
  import { page } from "$app/stores";
  // utils
  import { dictionary } from "../lib/dictionary";
  import { parseLogData, exampleLog } from "../lib/data";
  // custom components
  import CollapsibleView from "../lib/components/CollapsibleView.svelte";
  import TableView from "../lib/components/TableView.svelte";
  import FlameChartView from "../lib/components/FlameChartView.svelte";
  // carbon components
  import {
    Button,
    CopyButton,
    TextArea,
    InlineNotification,
    ContentSwitcher,
    Switch,
    Tile,
  } from "carbon-components-svelte";
  // carbon icons
  import { Copy, DecisionTree, Table, Fire } from "carbon-icons-svelte";

  let baseLogData = {};
  let selectedIndex;
  let log = "";
  let isLogFromUrl = false;

  if ($page.url.searchParams.has("log")) {
    const logParam = $page.url.searchParams.get("log");
    console.log("URL Param:" + logParam);
    log = logParam;
    isLogFromUrl = true;
  } else log = exampleLog;

  let shareableURL = "";
  // TODO: Add "==" in action table
  $: if (log) {
    baseLogData = parseLogData(log.trim());
    shareableURL = `${$page.url.host}?log=${encodeURIComponent(log.trim())}`;
  }
</script>

<div class="top-header">
  <h1>ExtLatency Log Viewer</h1>
  {#if !isLogFromUrl}
    <div class="create-link">
      <span>Copy Shareable URL</span>
      <CopyButton text={shareableURL} feedback="Copied URL!"></CopyButton>
    </div>
  {/if}
</div>

<main>
  {#if isLogFromUrl}
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="success"
      title="This Log was shared via URL"
      >Please clear the url to enter a new log
    </InlineNotification>
    <Tile>{log}</Tile>
  {:else}
    <TextArea
      labelText="ExtLatency Message"
      placeholder="ExtLatency: ......... [https://example.com]"
      bind:value={log}
    />
  {/if}
  {#if baseLogData.actions.length > 0}
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="info"
      title="Enhanced Latency Message type:"
      subtitle={baseLogData["logTypeDescription"]}
    />
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="info"
      title="Resource URL:"
      subtitle={baseLogData["logResourceUrl"]}
    />

    <ContentSwitcher style="margin-bottom: 2em" bind:selectedIndex>
      <Switch>
        <div class="switcher-tab">
          <Table />
          <span>Table with Keyword Descriptions (Default)</span>
        </div>
      </Switch>
      <Switch>
        <div class="switcher-tab">
          <DecisionTree />
          <span>Collapsible Tree View</span>
        </div>
      </Switch>
      <Switch>
        <div class="switcher-tab">
          <Fire />
          <span>Flame Chart</span>
        </div>
      </Switch>
    </ContentSwitcher>
    <div style="margin-top: 2em" />
    {#if selectedIndex === 0}
      <TableView data={baseLogData} />
    {:else if selectedIndex == 1}
      <CollapsibleView data={baseLogData} />
    {:else if selectedIndex == 2}
      <FlameChartView data={baseLogData} />
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
  .switcher-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .top-header {
    display: flex;
    justify-content: space-between;
  }
  .create-link {
    display: flex;
    align-items: center;
    gap: 1em;
  }
</style>
