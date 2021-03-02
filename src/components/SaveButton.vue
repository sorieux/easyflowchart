<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn icon>
        <v-icon class="export-button" v-on="on" v-on:click="openModal"
                title="Save">mdi-floppy</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Export graph</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-radio-group v-model="exportType" :mandatory="false">
              <v-radio label="Png" value="PNG"></v-radio>
              <v-radio label="Pdf" value="PDF"></v-radio>
              <v-radio label=".dot" value="DOT"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row class="d-flex align-baseline">
            <h3 class="label-link">Get shareable link:</h3>
            <v-text-field
              dense
              class="text-field-link"
              id="base64StringInput"
              v-model="base64UrlString"
            ></v-text-field>
            <v-icon class="link-button" title="Copy to the clipboard"
                    v-on:click='base64Url'>mdi-link</v-icon>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="exportGraph">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import svgToPng from 'save-svg-as-png';
import svg2pdf from 'svg2pdf.js';
import JsPDF from 'jspdf-yworks';
import saveAs from 'file-saver';

export default {
  name: 'SaveButton',
  components: {
  },
  methods: {
    generateBase6URL() {
      return `${window.location.href}?base64Url=${encodeURIComponent(window.btoa(this.$store.getters.getDotEditorContent))}`;
    },
    openModal() {
      this.base64UrlString = this.generateBase6URL();
    },
    exportGraph() {
      this.dialog = false;
      if (this.exportType === 'PNG') {
        this.exportToPNG();
      } else if (this.exportType === 'PDF') {
        this.exportToPDF();
      } else if (this.exportType === 'DOT') {
        this.exportDot();
      }
    },
    exportToPNG() {
      svgToPng.saveSvgAsPng(document.getElementById('graph').firstChild, 'easyflowchart.png', { scale: 2 });
    },
    exportToPDF() {
      const svgElement = document.getElementById('graph').firstChild;
      const width = document.getElementById('app').offsetWidth * 0.7;
      const height = document.getElementById('app').offsetHeight;

      // create a new jsPDF instance
      const pdf = new JsPDF('l', 'pt', [width, height]);

      // render the svg element
      svg2pdf(svgElement, pdf, {
        xOffset: 0,
        yOffset: 0,
        scale: 1,
      });

      // or simply save the created pdf
      pdf.save('easyflowchart.pdf');
    },
    exportDot() {
      const blob = new Blob([this.$store.getters.getDotEditorContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'easyflowchart.dot');
    },
    base64Url() {
      const copyText = document.querySelector('#base64StringInput');
      copyText.select();
      document.execCommand('copy');
    },
  },
  data: () => ({
    dialog: false,
    exportType: 'PNG',
    base64UrlString: '',
  }),
};
</script>

<style lang="scss">
  .export-button:focus {
    outline: none;
  }
  .label-link, .text-field-link {
    margin-right: 1rem;
  }
  .link-button {
    outline: none;
  }
</style>
