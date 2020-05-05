
import VueAction from '../../vue-action/vue-action.vue';
import moment from 'moment';
import JQuery from 'jquery';
window.$ = JQuery;

require('bootstrap/js/dist/modal');
export default {
  name: 'VueCustomGrid',
  components: {
    VueAction
  },
  props: {
    feed: Array,
    fetchurl: String,
    dateformat: String,
    restitle: String,

    language: String,
    translator: Array,
    translatorservice: String,

    actions: Array,
    actionscolumns: Object,
    actionplus: String,
    actionsave: String,

    customrender: Object,
    itemsperpage: Number,
    searchquery: String,
    sortedby: String,
    sortedasc: Boolean,
    options: Object,
    bus: Object

  },

  data: function() {
    return {
      headers: Array,
      hheaders: Array,
      columns: Array,
      hcolumns: Array,
      page: 1,
      maxPage: 1,
      ordererBy: "",
      orderedAsc: true,
      searchTerm: "",
      appmessage: ""
    }
  },
  created: function() {

    //set default value
    if (this.options == undefined) {
      this.options = {
        ChooseFilter: true,
        ChooseDisplay: true,
        ChooseFields: true
      };
    }

    //fetch data from url
    this.fetchData();
    //this.simulFetch();


  },
  mounted: function() {
    var comp = this;
    comp.orderedBy = comp.sortedby;
    comp.orderedAsc = comp.sortedasc;

    comp.maxPage = Math.ceil(comp.feed.length / comp.itemsperpage);
    console.log('max page calculated is : ' + comp.maxPage);
    comp.bus.$emit('maxPage', comp.maxPage);

    comp.bus.$on('vue-paginator:pageUpdated', function(page) {
      console.log('(vue-table)... page number triggered:' + page);

      comp.page = page;
      console.log('(vue-table)... this is a registered version:' + comp.$parent.license);
      //comp.$parent.logPaginate(page);
    }.bind(this));

  },

  computed: {
    filteredData() {

      if (this.feed.length == 0) {
        this.appmessage = "Sorry, there is no result found.";
      } else {
        this.appmessage = "";
      }

      if ((this.searchTerm != "") && ((this.searchTerm).length < 4)) {
        return;
      }

      console.log(this.searchTerm);
      console.log("SORTED BY " + this.orderedBy + " " + this.orderedAsc);

      var prop = this.orderedBy;
      var asc = this.orderedAsc;

      var isDate = false;

      if (prop !== "" && prop != undefined) {
        isDate = this.checkDateType(prop);
        console.log("ISDATE ===" + isDate);
      }

      var filteredFeed = this.feed;
      console.log("DEBUT");
      console.log(filteredFeed);

      if (prop !== "" && prop != undefined) {
        filteredFeed = filteredFeed.sort(function(a, b) {
          if (asc) {

            if (!isDate) {
              //return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
              return a[prop].toString().localeCompare(b[prop].toString());
            } else {
              var date1 = moment(a[prop], "DD-MM-YYYY");
              var date2 = moment(b[prop], "DD-MM-YYYY");
              return (date1 > date2 ? 1 : date1 < date2 ? -1 : 0);
            }

          } else {

            if (!isDate) {
              //return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
              return b[prop].toString().localeCompare(a[prop].toString());
            } else {
              var date1 = moment(a[prop], "DD-MM-YYYY");
              var date2 = moment(b[prop], "DD-MM-YYYY");
              return (date2 > date1 ? 1 : date2 < date1 ? -1 : 0);
            }
          }
        })
      }


      //if server side pagination, only filter for first insertion
      //if (this.page == 1){
      if (true) {
        console.log("AVANT");
        console.log(filteredFeed);
        filteredFeed = filteredFeed.slice((this.itemsperpage) * (this.page - 1), (this.itemsperpage) * (this.page));
        console.log("APRES");
        console.log(filteredFeed);
      }

      if (this.searchTerm != "") {
        var st = this.searchTerm;
        filteredFeed = this.feed.filter(item => {
          var found = false;
          //var itemValues = Object.values(item);
          for (var itemProp in item) {
            console.log(item[itemProp]);
            var itemValue = item[itemProp];
            if (typeof (itemValue) == "string" && itemValue.toLowerCase().indexOf(st.toLowerCase()) > -1) {
              found = true;
              console.log("found!!!");
            }
          }
          return found;
          //return item[1].toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        });
      };

      return filteredFeed;
    },
    filteredColumns() {
      var fc = [];
      var comp = this;
      comp.headers.forEach(function(col, index) {
        if ((comp.hcolumns).indexOf(col) == -1) {
          fc.push(index);
        };
      });
      return fc;
    },

    filteredHeaders() {
      var fh = [];
      var comp = this;
      comp.hcolumns = ['activated'];
      console.log("HCOLUMNS====");
      console.log(JSON.stringify(comp.hcolumns));
      console.log("HCOLUMNS====");

      comp.headers.forEach(function(col, index) {
        if ((comp.hcolumns).indexOf(col) == -1) {
          fh.push({
            "datanamecol": col,
            "dataindexcol": index
          });
        };
      });
      return fh;
    },

    richHeaders() {
      var fh = [];
      var comp = this;
      comp.headers.forEach(function(col, index) {
        fh.push({
          "datanamecol": col,
          "dataindexcol": index
        });
      });
      return fh;
    }

  },//end computed

  filters: {
    orderByBusinessRules: function(data) {
      return data.slice().sort(function(a, b) {
        return a.power - b.power;
      });
    },
    capitalize: function(data) {
      return data[0].toUpperCase() + data.slice(1);
    }
  },//end filter

  methods: {
    fetchData: function() {
      var comp = this;
      comp.columns = [];
      //console.log(paramSearch);
      $.ajax({
        url: comp.fetchurl,
        type: 'GET',
        crossDomain: true,
        //headers: { 'X-Requested-With': 'XMLHttpRequest' },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        //data: JSON.stringify(paramSearch),
        timeout: 3000,
        async: false,
        success: function(dataresp) {
          console.log(JSON.stringify(dataresp));
          //var self = this;
          //console.log(JSON.parse(data));
          $.each((dataresp["dataRows"])[0], function(key, val) {
            console.log(key);
            comp.columns.push(key);
          });
          comp.headers = dataresp["dataColumns"];
          comp.feed = dataresp["dataRows"];
        },
        error: function(dataresp) {
          console.log('this is a failure !!!!!!!!!!');
          alert('this is a failure !!!!!!!!');
        }
      });
    },
    renderCell: function(key, entry) {
      var comp = this;
      if (comp.customrender != null && comp.customrender[key] != null) {
        //return('zo'+entry[key]);
        return '';
      } else {
        return (entry[key]);
      }
    },
    //renderHtml is to render raw html as '<a href=, in these version renderHtml = customRender but it could be different
    renderHtml: function(key, entry) {
      var comp = this;
      if (comp.customrender != null && comp.customrender[key] != null) {
        return (comp.customrender[key](entry[key]));
      } else {
        return '';
      }
    },
    checkDateType: function(prop) {
      var testDate = true;
      var maxLines = Math.min(100, this.feed.length);
      for (var i = 0; i < maxLines; i++) {
        var testString = this.feed[i][prop];

        if (!moment(testString, this.dateformat, true).isValid()) {
          console.log("TESTSTRING" + this.dateformat + "====" + testString);
          testDate = false;
          break;
        }

      }
      return testDate;

    },
    translate: function(key) {
      var comp = this;

      if (comp.language != null && comp.translator == null) {
        console.log("TRANSLATOR IS NULL");
        comp.getTranslator(comp.language);
      }

      if (comp.language != null && comp.translator != null && comp.translator[key] != null) {

        return comp.translator[key][comp.language]
      } else {
        return key
      }
    },
    getTranslator: function(language) {
      var comp = this;

      if (comp.translatorservice == null) {
        return;
      }

      if (comp.translator == null) {
        comp.translator = {};
      }
      $.ajax({
        url: comp.translatorservice + language,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(comp.headers),
        timeout: 3000,
        async: true,
        success: function(data) {
          console.log(data);
          data.forEach(function(col, index) {
            var itemKeyTranslated = {};
            if (col != "Translation not found") {
              itemKeyTranslated[language] = col;
              comp.translator[comp.headers[index]] = itemKeyTranslated;
            } else {
              console.log(comp.headers[index]);
              itemKeyTranslated[language] = comp.capitalizeFirstLetter(comp.headers[index]);
              comp.translator[comp.headers[index]] = itemKeyTranslated;
            }
          });
          console.log(comp.translator);
        }
      });
    },
    capitalizeFirstLetter(title) {
      return (title.charAt(0).toUpperCase() + title.substring(1));
    },
    getActionsColumn(field) {
      if (this.actionscolumns != null) {
        headerName = this.headers[field];
        return this.actionscolumns[headerName];
      }
    },
    //future
    getColByField(field) {
      var comp = this;
      this.headers.forEach(function(col, index) {
        if ((comp.hcolumns).indexOf(field) > 0) {
          return index;
        };
      });
      return -1;
    },
    //future
    getRowValueField(row, field) {
      var col = getColByField(field)
      var fieldValue = data[row][col]
      console.log(fieldValue);

    },
    //future
    getRowValueCol(row, col) {
      var colValue = data[row][col]
      console.log(colValue);
    },

    sortRowsBy(num) {
      //where reorder, restart at page 1

      //this.$bus.$emit('pageChanged',this.page);
      var asc = true;
      // this.sortedby = num;
      //
      // if (this.sortedasc == undefined) {
      //   asc = true
      // } else {
      //   //inverse order
      //   if (num == this.sortedby) {
      //     this.sortedasc = !this.sortedasc;
      //   }
      //   asc = this.sortedasc;
      // }

      this.orderedBy = num;

      if (this.orderedAsc == undefined) {
        asc = true
      } else {
        //inverse order
        if (num == this.orderedBy) {
          this.orderedAsc = !this.orderedAsc;
        }
        asc = this.orderedAsc;
      }
      if ($("#sortGlyph" + num).attr('class') == 'mdi mdi-chevron-up-circle-outline') {
        $("#sortGlyph" + num).attr('class', 'mdi mdi-chevron-down-circle-outline');
      } else {
        $("#sortGlyph" + num).attr('class', 'mdi mdi-chevron-up-circle-outline');
      }

      console.log("change the order of" + num);
    },

    makeLinkPlus: function() {
      var comp = this;
      console.log("seize the :" + comp.actionplus);
      return "jQuery()." + comp.actionplus;
    },

    makeLinkSave: function() {
      var comp = this;
      return "jQuery()." + comp.actionsave;
    },

    showModal: function() {
      $('#myGridModal').modal('show');
    },

    adaptHeaders: function() {

      //because find find does NOT return an array!
      var sHeaders = $(".selectClass:not(:checked)").toArray();
      console.log(sHeaders);

      var comp = this;
      console.log(comp.headers);
      comp.hcolumns = [];
      console.log('empty hidden columns!!');
      sHeaders.forEach(function(elem, index) {
        console.log('hide column:' + comp.headers[elem.value]);
        (comp.hcolumns).push((comp.headers)[elem.value]);

      });
    },
    simulFetch: function() {
      var comp = this;
      comp.columns = [];
      var dataresp = { "dataColumns": ["id", "title", "description", "activated", "created_at", "updated_at", "members"], "dataRows": [{ "0": 1, "1": "Admin", "2": "Can administer the whole system", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 2 }, { "0": 6, "1": "Atelier", "2": "Chefs d'alleirs et Directeur technique", "3": true, "4": "06/10/2019", "5": "06/10/2019", "6": 1 }, { "0": 4, "1": "Contributeurs", "2": "Chaque admin peut ajouter un utilisateur au groupe Contributeurs s'il juge celui-ci pertinent.", "3": true, "4": "23/09/2019", "5": "23/09/2019", "6": 2 }, { "0": 5, "1": "Direction", "2": "", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 }, { "0": 8, "1": "Marketing", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 3, "1": "Users", "2": "Standard users", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 3 }, { "0": 7, "1": "Ventes", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 2, "1": "Visitors", "2": "Users from invitation", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 0 }] };
      $.each((dataresp["dataRows"])[0], function(key, val) {
        console.log(key);
        comp.columns.push(key);
      });

      comp.headers = dataresp["dataColumns"];
      comp.feed = dataresp["dataRows"];
    }

  }//end methods

};
