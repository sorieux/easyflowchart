<template>
  <div class="home">
    <splitpanes class="default-theme">
      <pane min-size="30" max-size="50">
        <AceEditor mode="dot" theme="chrome" name="editor" :value="code" :onChange="onChange"
          height="100%"
          width="100%"
          :editorProps="{$blockScrolling: true}"
        />
      </pane>
      <pane size="70"><h2 v-on:click="parseDot">test</h2><GraphvizViewer dotCode="code"/></pane>
    </splitpanes>
  </div>
</template>

<script>
import brace from 'brace';
import { Ace as AceEditor } from 'vue2-brace-editor';
import { Splitpanes, Pane } from 'splitpanes';
import { mapGetters } from 'vuex';
import 'splitpanes/dist/splitpanes.css';
import GraphvizViewer from '../components/GraphvizViewer.vue';
import 'brace/mode/dot';
import 'brace/theme/chrome';


export default {
  name: 'home',
  components: {
    GraphvizViewer,
    Splitpanes,
    Pane,
    AceEditor,
  },
  $el: 'root',
  data() {
    return {
      code: '',
      edgeNumber: 0,
      isDotMode: true,
      errorMsg: null,
      annotations: [{
        row: 2, column: 0, type: 'error', text: 'ha',
      }],
    };
  },
  created() {
    this.code = this.$store.getters.getDotEditorContent;
  },
  mounted() {
  },
  updated() {
    this.$nextTick(() => {
      this.$store.dispatch('updateDotEditorContent', this.code);
    });
  },
  computed: {
    ...mapGetters({
      getDotEditorContent: 'getDotEditorContent',
      getErrorMsg: 'getErrorMsg',
    }),
  },
  watch: {
    getDotEditorContent(newContent) {
      this.updateDotEditorContent(newContent);
    },
    getErrorMsg(newContent) {
      const editor = brace.edit('editor');
      if (newContent) {
        const errorLigne = newContent.match(/in line ([0-9]+)+/i);
        editor.getSession().setAnnotations([{
          row: errorLigne[1] - 1,
          column: 1,
          text: newContent.replace(/in line [0-9]+ /g, ''),
          type: 'error',
        }]);
      } else {
        editor.getSession().clearAnnotations();
      }
    },
  },
  methods: {
    updateDotEditorContent(newContent) {
      this.code = newContent;
    },
    onChange(newValue) {
      this.code = newValue;
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
