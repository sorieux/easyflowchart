<template>
  <v-app>
    <v-app-bar class="flowchart-nav" app color="#36d1b2" dense dark flat>
        <v-img alt="Flowchart Logo" class="shrink mr-2" contain src="./assets/flow-chart.svg"
               transition="scale-transition"
               width="55"
        />
        <v-toolbar-title class="headline font-weight-black">EasyFlowchart</v-toolbar-title>
        <v-spacer></v-spacer>
        <LoadButton />
        <SaveButton />
        <PrintButton />
    </v-app-bar>
    <v-content class="content">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import PrintButton from './components/PrintButton.vue';
import SaveButton from './components/SaveButton.vue';
import LoadButton from './components/LoadButton.vue';

export default {
  name: 'App',

  components: {
    PrintButton,
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
    overflow: hidden;
  }
  .flowchart-nav{
    .v-toolbar__content{
      padding-left: 0.1rem;
    }
  }
</style>
