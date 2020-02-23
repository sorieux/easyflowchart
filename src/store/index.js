import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dotEditorContent: '// https://graphviz.gitlab.io\n'
      + '\n'
      + 'digraph finite_state_machine {\n'
      + '\trankdir=LR;\n'
      + '\tsize="8,5"\n'
      + '\tnode [shape = doublecircle]; LR_0 LR_3 LR_4 LR_8;\n'
      + '\tnode [shape = circle];\n'
      + '\tLR_0 -> LR_2 [ label = "SS(B)" ];\n'
      + '\tLR_0 -> LR_1 [ label = "SS(S)" ];\n'
      + '\tLR_1 -> LR_3 [ label = "S($end)" ];\n'
      + '\tLR_2 -> LR_6 [ label = "SS(b)" ];\n'
      + '\tLR_2 -> LR_5 [ label = "SS(a)" ];\n'
      + '\tLR_2 -> LR_4 [ label = "S(A)" ];\n'
      + '\tLR_5 -> LR_7 [ label = "S(b)" ];\n'
      + '\tLR_5 -> LR_5 [ label = "S(a)" ];\n'
      + '\tLR_6 -> LR_6 [ label = "S(b)" ];\n'
      + '\tLR_6 -> LR_5 [ label = "S(a)" ];\n'
      + '\tLR_7 -> LR_8 [ label = "S(b)" ];\n'
      + '\tLR_7 -> LR_5 [ label = "S(a)" ];\n'
      + '\tLR_8 -> LR_6 [ label = "S(b)" ];\n'
      + '\tLR_8 -> LR_5 [ label = "S(a)" ];\n'
      + '}',
    errorMsg: null,
  },
  getters: {
    getDotEditorContent: state => state.dotEditorContent,
    getErrorMsg: state => state.errorMsg,
  },
  mutations: {
    UPDATE_DOT_EDITOR_CONTENT: (state, content) => {
      state.dotEditorContent = content;
    },
    UPDATE_ERROR_MSG: (state, content) => {
      state.errorMsg = content;
    },
  },
  actions: {
    updateDotEditorContent: ({ commit }, newContent) => {
      commit('UPDATE_DOT_EDITOR_CONTENT', newContent);
    },
    updateErrorMsg: ({ commit }, newContent) => {
      commit('UPDATE_ERROR_MSG', newContent);
    },
  },
  modules: {
  },
});
