import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dotEditorContent: '# http://www.graphviz.org/content/cluster\n'
      + '\n'
      + 'digraph G {\n'
      + '\n'
      + '\tsubgraph cluster_0 {\n'
      + '\t\tstyle=filled;\n'
      + '\t\tcolor=lightgrey;\n'
      + '\t\tnode [style=filled,color=white];\n'
      + '\t\ta0 -> a1 -> a2 -> a3;\n'
      + '\t\tlabel = "process #1";\n'
      + '\t}\n'
      + '\n'
      + '\tsubgraph cluster_1 {\n'
      + '\t\tnode [style=filled];\n'
      + '\t\tb0 -> b1 -> b2 -> b3;\n'
      + '\t\tlabel = "process #2";\n'
      + '\t\tcolor=blue\n'
      + '\t}\n'
      + '\tstart -> a0;\n'
      + '\tstart -> b0;\n'
      + '\ta1 -> b3;\n'
      + '\tb2 -> a3;\n'
      + '\ta3 -> a0;\n'
      + '\ta3 -> end;\n'
      + '\tb3 -> end;\n'
      + '\n'
      + '\tstart [shape=Mdiamond];\n'
      + '\tend [shape=Msquare];\n'
      + '}\n',
  },
  getters: {
    getDotEditorContent: state => state.dotEditorContent,
  },
  mutations: {
    UPDATE_DOT_EDITOR_CONTENT: (state, content) => {
      state.dotEditorContent = content;
    },
  },
  actions: {
    updateDotEditorContent: ({ commit }, newContent) => {
      commit('UPDATE_DOT_EDITOR_CONTENT', newContent);
    },
  },
  modules: {
  },
});
