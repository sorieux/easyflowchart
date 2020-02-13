<template>
  <v-app>
    <v-app-bar
      app
      color="#36d1b2"
      dense
      dark
      flat
    >
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/neural.svg"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="headline font-weight-black">EasyFlowchart</v-toolbar-title>
        <v-spacer></v-spacer>
        <SaveButton />
        <LoadButton />
        <ExportButton />
        <PrintButton />
        <SettingsButton v-if="false"/>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import PrintButton from './components/PrintButton.vue';
import ExportButton from './components/ExportButton.vue';
import SettingsButton from './components/SettingsButton.vue';
import SaveButton from './components/SaveButton.vue';
import LoadButton from './components/LoadButton.vue';

export default {
  name: 'App',

  components: {
    SettingsButton,
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
    height: 100%;
  }
  #app{
    height: 100%;
    .section{
      margin: 0rem;
      padding: 0rem;
    }
    .easyflowchart-container{
      height: 93%;
      min-height: 93%;
      display: flex;
      flex-direction: column;
      .boxf {
        display: flex;
        flex-direction: column;
      }
      .boxf-1 {
        flex: 1;
      }
    }
  }
</style>
