<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links (App.vue v2)</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>

    <div class="container-fluid">
    	<div id="grid-view-model">
    	  <vue-custom-grid :fetchurl="fetchurl" :bus="bus" :language="language" :itemsperpage="itemsperpage" :actions="actions" :actionplus="actionplus">
    	  </vue-custom-grid>
        <vue-pagination :bus="bus" :limit="10" :display="previous-numbers-next"></vue-pagination>
    	</div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import VueAction from './components/vue-action/vue-action.vue'
import VueCustomGrid from './components/vue-custom-grid/vue-custom-grid.vue'
import VuePagination from './components/vue-pagination/vue-pagination.vue'

var actions =[
{glyphiconclass:'mdi mdi-thumb-up',buttonclass:'btn btn-sm btn-info',onclick:"launchBlank('http://www.aol.com?with-my-param=$members')"},
{glyphiconclass:'mdi mdi-pencil',buttonclass:'btn btn-sm btn-info',onclick:"goTo('http://www.aol.com?with-my-id=$id')"},
{glyphiconclass:'mdi mdi-account',buttonclass:'btn btn-sm btn-info',onclick:"launchModal('Users attached to the role','/users/role/form/$id/membership')"},
{glyphiconclass:'mdi mdi-camera-iris',buttonclass:'btn btn-sm btn-success',onclick:"launchModal('Copy or move','/docws/form/$id/$id/transfer')"},
{glyphiconclass:'mdi mdi-delete-outline',buttonclass:'btn btn-sm btn-warning',onclick:"launchModal('Delete the role', '/docws/form/$id/$id/$id/delete')"}
];

var EventBus = new Vue();

export default {
  name: 'app',
  components:{
     VueAction, VueCustomGrid, VuePagination
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      fetchurl: 'http://localhost:8080/jsonnoauth/get-users-roles',
      hcolumns: ["activated"],
      language: 'fr',
      actions: actions,
      actionplus: "goTo('/users/role/0/form')",
      itemsperpage: 3,
      bus: EventBus,
      app_title: 'My crazy application!',
      subtitle: 'A Vue js real world example',
      howto_title: 'How to use this crazy application',
      howto_imgsrc: 'assets/img/how_to_use.gif'

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
