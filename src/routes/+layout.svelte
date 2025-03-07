<script>
  import { Header, Content, Grid, Row, Column } from "carbon-components-svelte";
</script>

<svelte:head>
  <title>ExtLatency Viewer</title>
</svelte:head>

<Header
  company="Ricardo Carrasco"
  platformName="IBM Datapower - ExtLatency Log Viewer"
/>

<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  @import "carbon-components-svelte/css/g10.css";
</style>
