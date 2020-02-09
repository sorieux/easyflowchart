<template>
  <div class="home">
    <splitpanes class="default-theme">
      <pane min-size="30" max-size="50" id="graph-container2">
        <editor v-model="code" @init="editorInit" lang="dot" theme="chrome"
                width="100%" height="100%"></editor>
      </pane>
      <pane size="70"><div id="graph"></div></pane>
    </splitpanes>
  </div>
</template>

<script>
// @ is an alias to /src
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import editor from 'vue2-ace-editor';
import { mapGetters } from 'vuex';
import 'd3-graphviz';
import * as d3 from 'd3';

export default {
  name: 'home',
  components: {
    Splitpanes,
    Pane,
    editor,
  },
  data() {
    return {
      code: '',
      edgeNumber: 0,
    };
  },
  created() {
    this.code = this.$store.getters.getDotEditorContent;
  },
  mounted() {
    const width = document.getElementById('app').offsetWidth * 0.7;
    const height = document.getElementById('app').offsetHeight;

    d3.select('#graph').graphviz().width(width).height(height)
      .renderDot(this.code);
  },
  updated() {
    this.$nextTick(() => {
      this.$store.dispatch('updateDotEditorContent', this.code);

      d3.select('#graph').graphviz()
        .renderDot(this.code);
    });
  },
  computed: {
    ...mapGetters({
      getDotEditorContent: 'getDotEditorContent',
    }),
  },
  watch: {
  },
  methods: {
    editorInit() {
      /* eslint-disable */
      require('brace/ext/language_tools'); // language extension prerequsite...
      require('brace/mode/dot'); // language
      require('brace/theme/chrome');
      /* eslint-enable */
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
</style>
