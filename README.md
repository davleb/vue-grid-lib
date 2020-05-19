# vue-custom-grid

> A vue datagrid component with customization as a goal. Data can be local or server-based. Many ways to customize the cells content or action/link buttons.
Classical sorting and filtering features.
Localization feature as i18.
Pagination component included with bus event for more flexibility.
Bootstrap 4 oriented.

It is build as a library, including three vuejs compoments: VueCustomGrid, VueAction, VuePagination.

## Demo
 For a demo with node, run
 ```bash
 npm run dev
 ```

 [Online demo with CDN] (https://davleb.github.io/vue-custom-grid/examples/index.html)

## Install
```bash
npm install
```

### serve with hot reload at localhost:8080
```bash
npm run dev
```

### build for production with minification
```bash
npm run build-lib
```

## Usage for Browser (CDN)
Please look at examples for a simple or complex example with CDN.

```javascript
<link rel="stylesheet" href="path/to/vue-custom-grid-lib.css"/>
<script type="text/javascript" src="path/to/vue.min.js"></script>
<script type="text/javascript" src="path/to/vue-custom-grid-lib.js"></script>

<script text="text/javascript">
var EventBus = new Vue();
var gridViewModel = new Vue({
        el: '#app-view-model',
        components:{
          VueCustomGrid: VueCustomGridLib.VueCustomGrid,
          VuePagination: VueCustomGridLib.VuePagination
        },
        data: {
          fetchurl: 'http://localhost:8080/json/get-users-roles',
          itemsperpage: 10,
          bus: EventBus      
        }
      });
</script>
```

## Usage as Vue Single File
```javascript
<template>
    <div class="container-fluid">
    	<div id="app-view-model">
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

<style>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
```
## Components bundled in the library

### VueCustomGrid
VueCustomGrid is the main compoment. It will load json data from fetchurl if not empty or will use any json data as a feed.

### VueAction
VueAction is an action bar that can be used inside cells.
If used, it must be defined like this:
```javascript
var actions =[
{glyphiconclass:'mdi mdi-thumb-up',buttonclass:'btn btn-sm btn-info',onclick:"launchBlank('http://www.aol.com?with-my-param=$members')"},
{glyphiconclass:'mdi mdi-pencil',buttonclass:'btn btn-sm btn-info',onclick:"goTo('http://www.aol.com?with-my-id=$id')"}]
```

### VuePagination
VuePagination is receiving on the bus a single event from VueCustomGrid "vue-custom-grid:maxPage".
Vue-Pagination is emitting an event "vue-pagination:pageUpdated" wich allows VueCustomGrid for selecting a slice of data.


## Properties
|   | Description  |Type   |Required   |Default   |
|---|---|---|---|---|
| fetchurl |  url for api returning json data  | String   | No  | |
| feed | data for the grid  | Array  | yes if no fetchurl  ||
|  dateformat |date format to use when cells content is a date   | String   | No  | YYYY MM DD
| restitle | title above the grid| String| No||
| language | language used for the component and grid headers translation| String| No| en|
| translator | dico object with translation for grid headers| Object| No||
| translator service | url for the api returning a dico| String| No| |
| action | definition for action buttons in last column| Array| No||
| actionscolumns | definition for action buttons in specific columns | Object| No||
| actionplus | definition for action to add an item| String| No ||
| actionsave | definition for action to save grid parameters| String| No||
| customrender | optionnaly customize the render of specific column content| Object| No||
| itemsperpage | items per page for grid and paginator | Number| No||
| searchquery | search parameters to use with fetchurl | String| No||
| sortedby | name of the column to use for sort | String| No||
| sortedasc | asc or desc order to use with sortedby prop| Boolean| No| true|
| options | minor options for display| Object| No||
| bus | event bus | Object | yes if VuePaginator is used| |



Copyright (c) 2020 David Lebret
