
import VueAction from '../../vue-action/vue-action.vue';
import moment from 'moment';
import JQuery from 'jquery';
window.$ = JQuery;

export default {
  name: 'VueCustomGrid',
  components: {
    VueAction
  },
  props: {
    feed: {},
    fetchurl: String,
    dateformat: String,
    restitle: String,

    language: String,
    translator: [],
    translatorservice: String,

    actions: Array,
    actionscolumns: Object,
    actionplus: "",
    actionsave: "",

    verbose: false,
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
      headers: [],
      hheaders: [],
      columns: [],
      hcolumns: [],
      rows: [],
      page: 1,
      maxPage: 1,
      ordererBy: "",
      orderedAsc: true,
      searchTerm: "",
      appmessage: "",
      fontcss: ""
    }
  },
  created: function() {

    //set default value
    if (this.options == undefined) {
      this.options = {
        ChooseFilter: true,
        ChooseDisplay: true,
        ChooseFields: true,
        Style: "",
      };
    }
    if (this.options.Style == "") {
      this.options.Style = "font-family: Arial, Helvetica, sans-serif;";
    }

    //fetch data from url only if feed is empty array
    if (this.feed == {}) {
      this.log("(vue-custom-grid)...load data from url");
      this.fetchDataUrl();
    } else {
      this.log("(vue-custom-grid)...load data from local json data");
      //this.loadData();
      this.simulFetch();
    }


  },
  mounted: function() {
    var comp = this;
    comp.orderedBy = comp.sortedby;
    comp.orderedAsc = comp.sortedasc;

    comp.maxPage = Math.ceil(comp.rows.length / comp.itemsperpage);

    comp.bus.$emit('vue-custom-grid:maxPage', comp.maxPage);
    comp.log('(vue-custom-grid)... max page is:' + comp.maxPage);

    comp.bus.$on('vue-paginator:pageUpdated', function(page) {
      comp.log('(vue-custom-grid)... page number triggered:' + page);

      comp.page = page;
      comp.log('(vue-custom-grid)... this is a registered version:' + comp.$parent.license);

    }.bind(this));

  },

  computed: {
    filteredData() {

      if (this.rows.length == 0) {
        this.appmessage = "Sorry, there is no result found.";
      } else {
        this.appmessage = "";
      }

      if ((this.searchTerm != "") && ((this.searchTerm).length < 4)) {
        return;
      }

      var oBy = this.orderedBy;
      var oAsc = this.orderedAsc;

      var isDate = false;

      if (oBy !== "" && oBy != undefined) {
        isDate = this.checkDateType(oBy);

      }

      var filteredRows = this.rows;

      if (oBy !== "" && oBy != undefined) {
        filteredRows = filteredRows.sort(function(a, b) {
          if (oAsc) {

            if (!isDate) {
              //return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
              return a[oBy].toString().localeCompare(b[oBy].toString());
            } else {
              var date1 = moment(a[oBy], "DD-MM-YYYY");
              var date2 = moment(b[oBy], "DD-MM-YYYY");
              return (date1 > date2 ? 1 : date1 < date2 ? -1 : 0);
            }

          } else {

            if (!isDate) {
              //return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
              return b[oBy].toString().localeCompare(a[oBy].toString());
            } else {
              var date1 = moment(a[oBy], "DD-MM-YYYY");
              var date2 = moment(b[oBy], "DD-MM-YYYY");
              return (date2 > date1 ? 1 : date2 < date1 ? -1 : 0);
            }
          }
        })
      }


      //if server side pagination, only filter for first insertion
      //if (this.page == 1){
      if (true) {
        filteredRows = filteredRows.slice((this.itemsperpage) * (this.page - 1), (this.itemsperpage) * (this.page));
      }

      if (this.searchTerm != "") {
        var st = this.searchTerm;
        filteredRows = this.rows.filter(item => {
          var found = false;

          for (var itemProp in item) {
            var itemValue = item[itemProp];
            if (typeof (itemValue) == "string" && itemValue.toLowerCase().indexOf(st.toLowerCase()) > -1) {
              found = true;
            }
          }
          return found;

        });
      };

      return filteredRows;
    },
    filteredColumns() {

      var fc = [];
      var comp = this;
      comp.log("............filtering columns");
      comp.log(comp.hcolumns);
      comp.headers.forEach(function(col, index) {
        if ((comp.hcolumns).indexOf(col) == -1) {
          fc.push(index);
        };
      });
      comp.log(fc);
      return fc;
    },

    filteredHeaders() {
      var fh = [];
      var comp = this;
      //comp.hcolumns = ['activated'];

      comp.log("............filtering headers");
      comp.log(comp.hcolumns);

      comp.headers.forEach(function(col, index) {
        if ((comp.hcolumns).indexOf(col) == -1) {
          fh.push({
            "datanamecol": col,
            "dataindexcol": index
          });
        };
      });
      comp.log(fh);
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
    fetchDataUrl: function() {
      var comp = this;
      comp.columns = [];

      $.ajax({
        url: comp.fetchurl,
        type: 'GET',
        crossDomain: true,
        //headers: { 'X-Requested-With': 'XMLHttpRequest' },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',

        timeout: 3000,
        async: false,
        success: function(dataresp) {

          $.each((dataresp["dataRows"])[0], function(key, val) {
            comp.columns.push(key);
          });
          comp.headers = dataresp["dataColumns"];
          comp.rows = dataresp["dataRows"];
        },
        error: function(dataresp) {
          alert('Unable to fetch the url for data ? is the server available ?');
        }
      });
    },
    loadData: function() {
      var comp = this;
      comp.columns = [];

      $.each((comp.feed["dataRows"])[0], function(key, val) {
        comp.columns.push(key);
      });

      comp.headers = comp.feed["dataColumns"];
      comp.rows = comp.feed["dataRows"];

    },
    renderCell: function(key, entry) {
      var comp = this;
      if (comp.customrender != null && comp.customrender[key] != null) {
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
    checkDateType: function(oBy) {
      var testDate = true;
      var maxLines = Math.min(100, this.rows.length);
      for (var i = 0; i < maxLines; i++) {
        var testString = this.rows[i][oBy];

        if (!moment(testString, this.dateformat, true).isValid()) {
          testDate = false;
          break;
        }

      }
      return testDate;

    },
    translate: function(key) {
      var comp = this;

      if (comp.language != null && comp.translator == null) {
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

          data.forEach(function(col, index) {
            var itemKeyTranslated = {};
            if (col != "Translation not found") {
              itemKeyTranslated[language] = col;
              comp.translator[comp.headers[index]] = itemKeyTranslated;
            } else {

              itemKeyTranslated[language] = comp.capitalizeFirstLetter(comp.headers[index]);
              comp.translator[comp.headers[index]] = itemKeyTranslated;
            }
          });

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

    },
    //future
    getRowValueCol(row, col) {
      var colValue = data[row][col]

    },

    sortRowsBy(num) {
      //when sort, should restart at page 1
      var asc = true;
      this.page = 1;
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

    },

    makeLinkPlus: function() {
      var comp = this;
      return "jQuery()." + comp.actionplus;
    },

    makeLinkSave: function() {
      var comp = this;
      return "jQuery()." + comp.actionsave;
    },

    showModal: function() {
      var modal = document.getElementById("myGridModal");
      modal.style.display = "block";
    },

    closeModal: function() {
      var modal = document.getElementById("myGridModal");
      modal.style.display = "none";
    },

    adaptHeaders: function() {

      var comp = this;
      comp.hcolumns = [];
      //because find find does NOT return an array!
      var sHeaders = $(".selectClass:not(:checked)").toArray();

      sHeaders.forEach(function(elem, index) {
        (comp.hcolumns).push((comp.headers)[elem.value]);
        comp.log((comp.headers)[elem.value]);
      });
    },
    log: function(message) {
      if (this.verbose) {
        console.log(message);
      }

    },
    simulFetch: function() {
      var comp = this;
      comp.columns = [];
      var dataresp = {
        "dataColumns": ["id", "title", "description", "activated", "created_at", "updated_at", "members"], "dataRows": [{ "0": 1, "1": "Admin", "2": "Can administer the whole system", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 2 }, { "0": 6, "1": "Atelier", "2": "Chefs d'alleirs et Directeur technique", "3": true, "4": "06/10/2019", "5": "06/10/2019", "6": 1 }, { "0": 4, "1": "Contributors", "2": "Contributors can initiate a document.", "3": true, "4": "23/09/2019", "5": "23/09/2019", "6": 2 }, { "0": 5, "1": "Managers", "2": "We have good ones", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 }, { "0": 8, "1": "Marketing", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 3, "1": "Users", "2": "Standard users", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 3 }, { "0": 7, "1": "Sells", "2": "", "3": true, "4": "07/10/2019", "5": "07/10/2019", "6": 2 }, { "0": 2, "1": "Visitors", "2": "Users from invitation", "3": true, "4": "11/08/2019", "5": "11/08/2019", "6": 0 }, { "0": 15, "1": "Back-Office employees", "2": "", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
        { "0": 16, "1": "Security", "2": "Do not mess with them", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
        { "0": 18, "1": "Accountancy", "2": "", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 },
        { "0": 5, "1": "Geeks", "2": "Can solve any problems", "3": true, "4": "25/09/2019", "5": "25/09/2019", "6": 2 }]
      };
      $.each((dataresp["dataRows"])[0], function(key, val) {
        comp.columns.push(key);
      });

      comp.headers = dataresp["dataColumns"];
      comp.rows = dataresp["dataRows"];
    }

  }//end methods

};
