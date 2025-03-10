<script>
  import { Header, Content, Grid, Row, Column } from "carbon-components-svelte";
  import "carbon-components-svelte/css/g10.css";
</script>

<Header company="Ricardo Carrasco" platformName="ExtLatency Log Viewer" />

<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>
