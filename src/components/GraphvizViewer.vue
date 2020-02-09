<template>
  <div id="graph"></div>
</template>

<script>
import 'd3-graphviz';
import * as d3 from 'd3';
import { mapGetters } from 'vuex';


export default {
  name: 'GrapvizViewer',
  components: {
  },
  props: {
    dotCode: String,
  },
  data() {
    return {
      code: '',
      width: null,
      height: null,
      edgeNumber: 0,
    };
  },
  created() {
    this.code = this.$store.getters.getDotEditorContent;
  },
  mounted() {
    this.width = document.getElementById('app').offsetWidth * 0.7;
    this.height = document.getElementById('app').offsetHeight;

    d3.select('#graph').graphviz().width(this.width).height(this.height)
      .renderDot(this.code);
  },
  updated() {
  },
  computed: {
    ...mapGetters({
      getDotEditorContent: 'getDotEditorContent',
    }),
  },
  watch: {
    getDotEditorContent() {
      this.code = this.$store.getters.getDotEditorContent;
      d3.select('#graph').graphviz().width(this.width).height(this.height)
        .renderDot(this.code);
    },
  },
  methods: {
  },
};
</script>

<style lang="scss">
  .splitpanes__pane{
    background-color: #fff !important;
  }
</style>
