<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h2>{{ msg }}</h2>

    <ul>
      <li><a href="./../examples/index.html" target="_blank">Other example with CDN (direct usage in browser)</a></li>

    </ul>

    <div class="container-fluid">
    <link type="text/css" rel="stylesheet" href="./../dist/VueGridLib.css" />
    	<div id="grid-view-model">
    	  <vue-custom-grid :restitle="restitle" :fetchurl="fetchurl" :bus="bus" :language="language" :itemsperpage="itemsperpage" :actions="actions" :actionplus="actionplus">
    	  </vue-custom-grid>
        <vue-pagination :bus="bus" :limit="10" :display="previous-numbers-next"></vue-pagination>
    	</div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
//import VueAction from './components/vue-action/vue-action.vue'
//import VueCustomGrid from './components/vue-custom-grid/vue-custom-grid.vue'
//import VuePagination from './components/vue-pagination/vue-pagination.vue'

import { VueCustomGrid, VueAction, VuePagination} from "./../dist/VueGridLib.umd.js";

var actions =[
{glyphiconclass:'mdi mdi-thumb-up',buttonclass:'btn btn-sm btn-info',onclick:"launchBlank('http://www.aol.com?with-my-param=$members')"},
{glyphiconclass:'mdi mdi-pencil',buttonclass:'btn btn-sm btn-info',onclick:"goTo('http://www.aol.com?with-my-id=$id')"},
{glyphiconclass:'mdi mdi-account',buttonclass:'btn btn-sm btn-info',onclick:"launchModal('Users attached to the role','/users/role/form/$id/membership')"},
{glyphiconclass:'mdi mdi-camera-iris',buttonclass:'btn btn-sm btn-success',onclick:"launchModal('Copy or move','/docws/form/$id/$id/transfer')"},
{glyphiconclass:'mdi mdi-delete-outline',buttonclass:'btn btn-sm btn-warning',onclick:"launchModal('Delete the role', '/docws/form/$id/$id/$id/delete')"}
];

var jsonData = {
  "dataColumns": ["id", "title", "description", "activated", "created_at", "updated_at", "members"], "dataRows": [{ "0": 1, "1": "Admin", "2": "Can administer the whole system", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 2 }, { "0": 6, "1": "Atelier", "2": "Chefs d'alleirs et Directeur technique", "3": true, "4": "06/10/2019", "5": "06/10/2019", "6": 1 }, { "0": 4, "1": "Contributors", "2": "Contributors can initiate a document.", "3": true, "4": "23/09/2019", "5": "23/09/2019", "6": 2 }, { "0": 5, "1": "Managers", "2": "We have good ones", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 }, { "0": 8, "1": "Marketing", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 3, "1": "Users", "2": "Standard users", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 3 }, { "0": 7, "1": "Sells", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 2, "1": "Visitors", "2": "Users from invitation", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 0 }, { "0": 15, "1": "Back-Office employees", "2": "", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
  { "0": 16, "1": "Security", "2": "Do not mess with them", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
  { "0": 18, "1": "Accountancy", "2": "", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
  { "0": 5, "1": "Geeks", "2": "Can solve any problems", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 }]
};

var EventBus = new Vue();

export default {
  name: 'app',
  components:{
     VueAction, VueCustomGrid, VuePagination
  },
  data () {
    return {
      msg: 'Welcome to VueGridLib demo',
      restitle: 'List of registered users',
      //fetchurl: 'http://localhost:8080/jsonnoauth/get-users-roles',
      feed: jsonData,
      hcolumns: ["activated"],
      language: 'fr',
      actions: actions,
      actionplus: "goTo('/users/role/0/form')",
      itemsperpage: 3,
      bus: EventBus
    }
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
