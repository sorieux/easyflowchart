<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-icon v-if="options.length > 0" class="options-button" title="Options" v-on="on">
        mdi-dots-vertical
      </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Options</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-textarea
            v-model="newOptions"
            name="input-options"
            label="Options"
          ></v-textarea>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveOptions">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'OptionsButton',
  components: {
  },
  props: {
    nodeName: String,
    options: Array,
    callback: Function,
    type: {
      type: String,
      validator: prop => [
        'node',
        'predecessor',
      ].includes(prop),
    },
  },
  created() {
    this.newOptions = JSON.stringify(this.options, undefined, 4);
  },
  methods: {
    saveOptions() {
      this.dialog = false;
      this.callback(this.nodeName, this.type, JSON.parse(this.newOptions));
    },
  },
  data: () => ({
    dialog: false,
    newOptions: undefined,
  }),
};
</script>

<style lang="scss">
  .options-button {
    font-size: 1rem !important;
  }
</style>
