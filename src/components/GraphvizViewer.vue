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
  data() {
    return {
      code: '',
      width: null,
      height: null,
    };
  },
  created() {
    this.code = this.$store.getters.getDotEditorContent;
  },
  mounted() {
    this.width = document.getElementById('app').offsetWidth * 0.7;
    this.height = document.getElementById('app').offsetHeight;

    d3.select('#graph').graphviz().width(this.width).height(this.height)
      .fit(false)
      .zoomScaleExtent([0.01, 10])
      .tweenShapes(false)
      .tweenPaths(false)
      .convertEqualSidedPolygons(false)
      .onerror((errorMsg) => {
        this.updateErrorMsg(errorMsg);
      })
      .renderDot(this.code, this.updateErrorMsg(null));
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
      this.width = document.getElementById('app').offsetWidth * 0.7;
      this.height = document.getElementById('app').offsetHeight;

      this.code = this.$store.getters.getDotEditorContent;
      d3.select('#graph').graphviz().width(this.width).height(this.height)
        .fit(false)
        .zoomScaleExtent([0.01, 10])
        .tweenShapes(false)
        .tweenPaths(false)
        .convertEqualSidedPolygons(false)
        .onerror((errorMsg) => {
          this.updateErrorMsg(errorMsg);
        })
        .renderDot(this.code, this.updateErrorMsg(null));
    },
  },
  methods: {
    updateErrorMsg(newContent) {
      this.$store.dispatch('updateErrorMsg', newContent);
    },
  },
};
</script>

<style lang="scss">
  .splitpanes__pane{
    background-color: #fff !important;
  }
</style>
