<template>
  <v-app>
    <v-app-bar
      app
      color="#36d1b2"
      dense
      dark
      flat
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/neural.svg"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="headline font-weight-black">EasyFlowchart</v-toolbar-title>
      </div>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
</style>
