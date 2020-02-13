<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn icon>
        <v-icon class="load-button" v-on="on">mdi-file-upload-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Load Dot file</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <input type="file" name="dotFile" accept=".dot, .txt" class="input-file"
                   @change="storeEvent($event.target.files)">
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="loadDot">Load</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'SaveButton',
  components: {
  },
  methods: {
    loadDot() {
      this.dialog = false;
      const reader = new FileReader();

      reader.onload = (evt) => {
        this.$store.dispatch('updateDotEditorContent', evt.target.result);
      };

      reader.readAsText(this.uploadedDotFile);
    },
    storeEvent(files) {
      [this.uploadedDotFile] = files;
    },
  },
  data: () => ({
    dialog: false,
    uploadedDotFile: null,
  }),
};
</script>

<style lang="scss">
  .load-button:focus {
    outline: none;
  }
</style>
