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
      <template v-for="(row, index) in dotTable">
        <tr :key="`r-${index}`">
          <td class="prefix-td"
              :key="`r-${index}-prefix`"
              @mouseover="showByIndex = index" @mouseout="showByIndex = null"
          >
            <span class="row-number" v-show="showByIndex !== index || index === 0">{{index}}</span>
            <v-icon class="remove-row-button" title="Remove Row"
                      v-show="showByIndex === index && index > 0"
                      v-on:click="deleteRow(index)">mdi-trash-can-outline
            </v-icon>
          </td>
          <td :key="`col1-${index}`">
            <input
              class="input is-medium"
              type="text"
              :value="row[0]"
              :ref="`${index}-col1`"
              v-on:change="updateNodeName($event, index)"
            >
          </td>
          <td>
            <input
              class="input is-medium"
              type="text"
              :value="row[1]"
              :ref="`${index}-col1`"
              v-on:change="updatePredecessors($event, index)"
            >
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

// eslint-disable-next-line no-unused-vars
const addNewEdge = function addNewEdge(nodeIdOrigin, nodeIdDestination, edgesArray) {
  return [...edgesArray, { v: nodeIdOrigin, w: nodeIdDestination }];
};

export default {
  name: 'TableEditor',
  components: {
  },
  data: () => ({
    code: null,
    dotTable: null,
    showByIndex: 1,
  }),
  created() {
    this.code = this.$store.getters.getDotEditorContent;
    this.dotTable = this.dot2Array(this.code);
  },
  methods: {
    dot2Array(dotCode) {
      const graph = dot.read(dotCode);

      // Find technical nodes (like SG[0-9]+)
      const technicalNodes = new Set();
      graph.nodes().forEach((node) => {
        const parent = graph.parent(node);
        if (parent) {
          technicalNodes.add(parent);
        }
      });

      const realNodes = graph.nodes().filter(x => ![...technicalNodes].includes(x));

      const dotTable = [];

      realNodes.forEach((nodeId) => {
        dotTable.push([nodeId, graph.predecessors(nodeId)]);
      });
      return dotTable;
    },
    updateNodeName(event, index) {
      const oldNodeId = this.dotTable[index][0];
      const newNodeId = event.target.value;
      this.dotTable[index][0] = newNodeId;

      const graph = dot.read(this.code);
      const jsonDotGraph = graphlib.json.write(graph);

      let newNodesArray = [];
      let newEdgesArray = [];
      if (nodeIdIsExist(oldNodeId, jsonDotGraph.nodes) && oldNodeId) {
        newNodesArray = updateNodeId(oldNodeId, newNodeId, jsonDotGraph.nodes);
        newEdgesArray = updateEdges(oldNodeId, newNodeId, jsonDotGraph.edges);
      } else {
        newNodesArray = addNewNode(newNodeId, jsonDotGraph.nodes);
        newEdgesArray = jsonDotGraph.edges;
      }

      const newJsonDotGraph = { ...jsonDotGraph };
      newJsonDotGraph.nodes = newNodesArray;
      newJsonDotGraph.edges = newEdgesArray;

      const g = graphlib.json.read(newJsonDotGraph);
      this.code = dot.write(g);
      this.dotTable = this.dot2Array(this.code);
      this.$store.dispatch('updateDotEditorContent', this.code);
    },
    updatePredecessors(event, index) {
      const newValues = event.target.value.split(/,|;/);
      const nodeIdOrigin = this.dotTable[index][0];
      this.dotTable[index][1] = newValues;

      const graph = dot.read(this.code);
      const jsonDotGraph = graphlib.json.write(graph);

      // Remove Current Node Edges
      const newEdgesArray = [...jsonDotGraph.edges].filter(el => el.w !== nodeIdOrigin);
      newValues.forEach((node) => {
        newEdgesArray.push({ v: node, w: nodeIdOrigin });
      });

      const newJsonDotGraph = { ...jsonDotGraph };
      newJsonDotGraph.edges = newEdgesArray;

      const g = graphlib.json.read(newJsonDotGraph);
      this.code = dot.write(g);
      this.dotTable = this.dot2Array(this.code);
      this.$store.dispatch('updateDotEditorContent', this.code);
    },
    addRow() {
      this.dotTable.push(['', '']);
    },
    deleteRow(index) {
      if (index > 0) {
        this.dotTable.splice(index, 1);
      }
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
