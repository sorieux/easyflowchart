<template>
  <div class="home">
    <splitpanes class="default-theme">
      <pane min-size="30" max-size="50">
        <DotEditor />
      </pane>
      <pane size="70">
        <GraphvizViewer />
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import GraphvizViewer from '../components/GraphvizViewer.vue';
import DotEditor from '../components/DotEditor.vue';

export default {
  name: 'home',
  components: {
    DotEditor,
    GraphvizViewer,
    Splitpanes,
    Pane,
  },
};
</script>

<style lang="scss">
  .home{
    height: 100%;
  }
  .splitpanes__pane{
    background-color: #fff !important;
  }
</style>
