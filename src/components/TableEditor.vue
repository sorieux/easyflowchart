<template>
  <div class="table-spreadsheet">
    <table class="table is-fullwidth is-bordered">
      <thead>
      <tr>
        <th></th>
        <th>Node Name</th>
        <th>Predecessors</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(row, index) in jsonDotGraph.nodes">
        <tr :key="`r-${index}`">
          <td class="prefix-td"
              :key="`r-${index}-prefix`"
              @mouseover="showByIndex = index" @mouseout="showByIndex = null"
          >
            <span class="row-number" v-show="showByIndex !== index || index === 0">{{index}}</span>
            <v-icon class="remove-row-button" title="Remove Row"
                      v-show="showByIndex === index && index > 0"
                      v-on:click="deleteRow(index, row.v)">mdi-trash-can-outline
            </v-icon>
          </td>
          <td :key="`col1-${index}`">
            <input
              class="input is-medium node-input"
              type="text"
              :value="row.v"
              :ref="`${index}-col1`"
              v-on:change="updateNodeName($event, row.v, index)"
            >
            <OptionsButton :nodeName="row.v" :options="[row]" type="node"
                           :callback="updateOptions"/>
          </td>
          <td :key="`col2-${index}`">
            <input
              class="input is-medium predecessor-input"
              type="text"
              :value="getPredecessors(row.v)"
              :ref="`${index}-col2`"
              v-on:change="updatePredecessors($event, row.v)"
            >
            <OptionsButton :nodeName="row.v" :options="getPredecessorOptions(row.v)"
                           type="predecessor" :callback="updateOptions"/>
          </td>
        </tr>
      </template>
      <v-icon class="add-row-button" title="Add New Row"
                v-on:click="addRow">mdi-plus-circle</v-icon>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dot from 'graphlib-dot';
import OptionsButton from './OptionsButton.vue';

const graphlib = require('graphlib');

const nodeIdIsExist = function nodeIdIsExist(nodeId, nodesArray) {
  return nodesArray.filter(el => el.v === nodeId).length > 0;
};

const updateNodeId = function updateNodeId(nodeId, newNodeId, nodesArray) {
  return nodesArray.map((it) => {
    const resObj = { ...it };
    if (resObj.v === nodeId) {
      resObj.v = newNodeId;
    }

    return resObj;
  });
};

const updateEdges = function updateEdges(nodeId, newNodeId, edgesArray) {
  return edgesArray.map((it) => {
    const resObj = { ...it };
    if (resObj.v === nodeId) {
      resObj.v = newNodeId;
    }

    if (resObj.w === nodeId) {
      resObj.w = newNodeId;
    }

    return resObj;
  });
};

const addNewNode = function addNewNode(nodeId, nodesArray) {
  return [...nodesArray, { v: nodeId, value: {} }];
};

export default {
  name: 'TableEditor',
  components: {
    OptionsButton,
  },
  data: () => ({
    code: null,
    jsonDotGraph: null,
    showByIndex: null,
  }),
  created() {
    this.code = this.$store.getters.getDotEditorContent;

    const graph = dot.read(this.code);
    this.jsonDotGraph = graphlib.json.write(graph);
  },
  methods: {
    updateNodeName(event, nodeName, index) {
      const oldNodeId = nodeName;
      const newNodeId = event.target.value;

      let newNodesArray = [];
      let newEdgesArray = [];
      if (nodeIdIsExist(oldNodeId, this.jsonDotGraph.nodes) && oldNodeId) {
        newNodesArray = updateNodeId(oldNodeId, newNodeId, this.jsonDotGraph.nodes);
        newEdgesArray = updateEdges(oldNodeId, newNodeId, this.jsonDotGraph.edges);
      } else {
        newNodesArray = addNewNode(newNodeId, this.jsonDotGraph.nodes);
        newNodesArray.splice(index, 1);
        newEdgesArray = this.jsonDotGraph.edges;
      }

      const newJsonDotGraph = { ...this.jsonDotGraph };
      newJsonDotGraph.nodes = newNodesArray;
      newJsonDotGraph.edges = newEdgesArray;

      this.jsonDotGraph = { ...newJsonDotGraph };

      const g = graphlib.json.read(this.jsonDotGraph);
      this.code = dot.write(g);
      this.$store.dispatch('updateDotEditorContent', this.code);
    },
    updatePredecessors(event, nodeName) {
      const newValues = event.target.value.split(/,|;/);
      const nodeIdOrigin = nodeName;

      const newEdgesArray = [...this.jsonDotGraph.edges].filter(el => el.w !== nodeIdOrigin);
      newValues.forEach((node) => {
        newEdgesArray.push({ v: node, w: nodeIdOrigin });
      });

      const newJsonDotGraph = { ...this.jsonDotGraph };
      newJsonDotGraph.edges = newEdgesArray;

      const g = graphlib.json.read(newJsonDotGraph);
      this.code = dot.write(g);
      this.$store.dispatch('updateDotEditorContent', this.code);
    },
    addRow() {
      this.jsonDotGraph.nodes.push({});
    },
    deleteRow(index, nodeName) {
      if (index > 0) {
        this.jsonDotGraph.nodes.splice(index, 1);
        this.jsonDotGraph.edges = this.jsonDotGraph.edges.filter(obj => obj.v !== nodeName
          && obj.w !== nodeName);
        const g = graphlib.json.read(this.jsonDotGraph);
        this.code = dot.write(g);
        this.$store.dispatch('updateDotEditorContent', this.code);
      }
    },
    getPredecessors(nodeName) {
      return this.jsonDotGraph.edges.filter(obj => obj.w === nodeName).map(obj => obj.v);
    },
    updateOptions(nodeName, optionsType, newOptions) {
      const newJsonDotGraph = { ...this.jsonDotGraph };

      if (optionsType === 'node') {
        newJsonDotGraph.nodes = [...newJsonDotGraph.nodes]
          .map(obj => newOptions.find(o => o.v === obj.v) || obj);
      } else if (optionsType === 'predecessor') {
        let newEdgesArray = [];
        newEdgesArray = [...newJsonDotGraph.edges].filter(obj => obj.w !== nodeName);
        newJsonDotGraph.edges = [...newEdgesArray, ...newOptions];
      }

      this.jsonDotGraph = newJsonDotGraph;

      const g = graphlib.json.read(newJsonDotGraph);
      this.code = dot.write(g);
      this.$store.dispatch('updateDotEditorContent', this.code);
    },
    getPredecessorOptions(nodeName) {
      return this.jsonDotGraph.edges.filter(obj => obj.w === nodeName);
    },
  },
  computed: {
    ...mapGetters({
      getDotEditorContent: 'getDotEditorContent',
    }),
  },
};
</script>

<style lang="scss">
  .node-options-row-button {
    font-size: 1rem !important;
  }

  .node-input, .predecessor-input {
    width: 90%;
  }

  .add-row-button:focus {
    outline: none;
  }
  .add-row-button {
    color: #32cdff !important;
    font-size: 1.5em;
    position: relative;
    bottom: 0.5em;
    left: 0.1em;
  }
  .remove-row-button:focus {
    outline: none;
  }
  .row-number {
    font-size: 1.25em;
  }
  .remove-row-button {
    color: #32cdff !important;
    font-size: 1.25em !important;
    padding: 0px !important;
    margin-bottom: 10px !important;
    margin-left: -4px !important;
  }
  .table-spreadsheet {
    margin: 1em;
    height: 100vh;
    overflow: scroll;
  }
  .table.is-fullwidth {
    width: 100%;
  }
  .table td, .table th {
    border: 1px solid #e8e8e8;
    border-width: 0 0 1px;
    vertical-align: top;
  }
  table .input {
    border-radius: 0em;
    border-color: #fff;
    box-shadow: none;
    -webkit-box-shadow: none;
    font-family: DINNextRoundedLTPro-Medium, sans-serif;
  }
  .is-medium.input, .taginput .is-medium.taginput-container.is-focusable, .is-medium.textarea {
    font-size: 1rem;
  }
  input, .taginput .taginput-container.is-focusable, .textarea {
    -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    max-width: 100%;
    width: 100%;
  }
  .input, .taginput .taginput-container.is-focusable, .textarea, .select select {
    background-color: white;
    border-color: #dbdbdb;
    border-radius: 4px;
    color: #363636;
  }
  .button, .input, .taginput .taginput-container.is-focusable, .textarea, .select select,
  .file-cta, .file-name, .pagination-previous, .pagination-next, .pagination-link,
  .pagination-ellipsis {
    -moz-appearance: none;
    -webkit-appearance: none;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: none;
    box-shadow: none;
    display: -ms-inline-flexbox;
    display: inline-flex;
    font-size: 1rem;
    height: 2.25em;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    line-height: 1.5;
    padding-bottom: calc(0.375em - 1px);
    padding-left: calc(0.625em - 1px);
    padding-right: calc(0.625em - 1px);
    padding-top: calc(0.375em - 1px);
    position: relative;
    vertical-align: top;
  }
  button, input, select, textarea {
    margin: 0;
  }
  table .input:focus {
    border-color: #32CDFF;
    outline: none;
    outline-offset: -2px;
  }
  table .input {
    border-radius: 0em;
    border-color: #fff;
    box-shadow: none;
    -webkit-box-shadow: none;
    font-family: DINNextRoundedLTPro-Medium,sans-serif;
  }
  table {
      border-collapse: collapse;
      border-spacing: 0;
      background-color: white;
      color: #363636;
    .input{
      border-radius: 0em;
      border-color: #fff;
      box-shadow: none;
      -webkit-box-shadow: none;
      font-family: DINNextRoundedLTPro-Medium,sans-serif;
    }
    .input:focus{
      border-color: #32CDFF;
    }
    td{
      padding: 0em;
      border-color: #e8e8e8;
      border-width: 2px !important;
    }
    .prefix-td{
      font-family: DINNextRoundedLTPro-Medium,sans-serif;
      color: #363636;
      padding-bottom: calc(0.375em - 1px);
      padding-left: calc(0.625em - 1px);
      padding-top: calc(0.375em + 1px);
      font-size: 1rem;
      background-color: #f7f7f7;
      color: #c4c4c4;
      width: 1.9em;
      font-weight: bold;
    }
    th {
      background-color: #f7f7f7;
      color: #c4c4c4;
      font-family: DINNextRoundedLTPro-Medium,sans-serif;
      font-size: 1rem;
      border-color: #e8e8e8;
      border-width: 2px !important;
    }
  }
</style>
