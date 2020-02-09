<template>
  <v-btn icon>
    <v-icon class="export-button" v-on:click="exportToPNG">mdi-export-variant</v-icon>
  </v-btn>
</template>

<script>
import svgToPng from 'save-svg-as-png';

export default {
  name: 'PrintButton',
  components: {
  },
  methods: {
    exportToPNG() {
      console.log(document.getElementById('graph').firstChild);
      svgToPng.saveSvgAsPng(document.getElementById('graph').firstChild, 'diagram.png', { scale: 2 });
      console.log('export to PNG');
    },
  },
  data: () => ({
  }),
};
</script>

<style lang="scss">
  .export-button:focus {
    outline: none;
  }
</style>
