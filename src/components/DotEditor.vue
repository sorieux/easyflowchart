<template v-slot:extension>
  <AceEditor mode="dot" theme="chrome" name="editor" :value="code" :onChange="onChange"
             height="100%"
             width="100%"
             :editorProps="{$blockScrolling: true}"
  />
</template>

<script>
import brace from 'brace';
import { Ace as AceEditor } from 'vue2-brace-editor';
import { mapGetters } from 'vuex';
import 'brace/mode/dot';
import 'brace/theme/chrome';

export default {
  name: 'DotEditor',
  components: {
    AceEditor,
  },
  data: () => ({
    code: '',
    annotations: [],
  }),
  created() {
    this.code = this.$store.getters.getDotEditorContent;
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
</style>
