<script>
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
</script>

<svelte:head>
  <title>ExtLatency Viewer</title>
</svelte:head>

<Header
  company="Ricardo Carrasco"
  platformName="IBM Datapower - Enhanced Messages Viewer"
></Header>

<Content>
  <Grid>
    <Row>
      <Column>
        <h1>ExtLatency Log Viewer</h1>
        <main>
          <slot />
        </main>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  @import "carbon-components-svelte/css/g10.css";
</style>
