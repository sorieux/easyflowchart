<template>
  <v-btn icon>
    <v-icon class="print-button" title="Print flowchart"
            v-on:click="exportToPDF">mdi-printer</v-icon>
  </v-btn>
</template>

<script>
import printJS from 'print-js';

export default {
  name: 'PrintButton',
  components: {
  },
  methods: {
    exportToPDF() {
      printJS('graph', 'html');
    },
  },
  data: () => ({
  }),
};
</script>

<style lang="scss">
  .print-button:focus {
    outline: none;
  }
</style>
