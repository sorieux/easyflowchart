<template>
  <v-btn icon>
    <v-icon class="save-button" v-on:click="saveDot"
            title="Save Dot file">mdi-file-download-outline</v-icon>
  </v-btn>
</template>

<script>
import saveAs from 'file-saver';

export default {
  name: 'SaveButton',
  components: {
  },
  methods: {
    saveDot() {
      const blob = new Blob([this.$store.getters.getDotEditorContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'easyflowchart.dot');
    },
  },
  data: () => ({
  }),
};
</script>

<style lang="scss">
  .save-button:focus {
    outline: none;
  }
</style>
