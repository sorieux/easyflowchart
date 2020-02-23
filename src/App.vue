<template>
  <v-app>
    <v-app-bar app color="#36d1b2" dense dark flat>
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="./assets/neural.svg"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="headline font-weight-black">EasyFlowchart</v-toolbar-title>
        <v-spacer></v-spacer>
        <SaveButton />
        <LoadButton />
        <ExportButton />
        <PrintButton />
    </v-app-bar>
    <v-content class="content">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import PrintButton from './components/PrintButton.vue';
import ExportButton from './components/ExportButton.vue';
import SaveButton from './components/SaveButton.vue';
import LoadButton from './components/LoadButton.vue';

export default {
  name: 'App',

  components: {
    PrintButton,
    ExportButton,
    SaveButton,
    LoadButton,
  },
  methods: {
  },
  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
  html, body {
    margin: 0;
    height: 100%;
    overflow: hidden
  }
</style>
