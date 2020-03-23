<template>
  <div class="home">
    <splitpanes class="default-theme">
      <pane class="editor-pane" max-size="50">
        <v-btn
          color="blue darken-2" dark x-small absolute top right fab class="change-mode-btn">
          <v-icon v-if="!isTableMode" title="table mode" v-on:click="changeMode">mdi-table</v-icon>
          <v-icon v-else title="dot code mode" v-on:click="changeMode">mdi-code-braces</v-icon>
        </v-btn>
        <DotEditor v-if="!isTableMode"/>
        <TableEditor v-else />
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
import TableEditor from '../components/TableEditor.vue';

export default {
  name: 'home',
  components: {
    TableEditor,
    DotEditor,
    GraphvizViewer,
    Splitpanes,
    Pane,
  },
  data: () => ({
    isTableMode: false,
  }),
  methods: {
    changeMode() {
      this.isTableMode = !this.isTableMode;
    },
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
  .editor-pane {
    position: relative;
    .change-mode-btn {
      margin-top: 1.2rem;
      margin-right: -0.7rem;
    }
    .v-icon:focus::after {
      opacity: 0;
    }
  }
</style>
