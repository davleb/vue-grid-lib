import jquery from 'jquery';
window.$ = jquery;

export default {
  name: "VuePagination",
  props: {
    limit: Number,
    options: Object,
    verbose: Boolean,
    bus: Object
  },
  data() {
    return {
      page: 1,
      maxPage: 1,
      paginatorArray: [],
      next: true,
      previous: false
    };
  },

  created: function() {

    //set default value
    if (this.options == undefined) {
      this.options = {
        Style: "",
      };
    }
    if (this.options.Style == "") {
      this.options.Style = "font-family: Arial, Helvetica, sans-serif; font-size: 16px;";
    }

    this.$on('updatePaginator', function() {
      this.log('(vue-paginator) ... update Paginator');
      if (this.maxPage == 1) {
        this.next = false;
        this.previous = false;
        return;
      }

      if (this.page > 1) {
        this.previous = true;
      } else {
        this.previous = false;
      }

      if (this.page < this.maxPage) {
        this.next = true;
      } else {
        this.next = false;
      }

      this.makePaginator();
    }.bind(this));


    this.bus.$on('vue-custom-grid:maxPage', function(maxpage) {
      this.log('(vue-paginator)... old max page:' + this.maxPage + '... new max page:' + maxpage);
      if (this.maxPage != maxpage) {
        this.maxPage = maxpage;
        this.makePaginator();
      };
    }.bind(this));

  },

  mounted: function() {
    //this.$bus.$on('maxPage', function(maxpage){
    //console.log('... old max page:' + this.maxPage + '... new max page:'+ maxpage);
    //if (this.maxPage != maxpage){
    //	this.maxPage = maxpage;
    //	this.makePaginator();
    //};
    //}.bind(this));
    if (this.maxPage == 1) {
      this.next = false;
      this.previous = false;
      return;
    }

  },

  methods: {
    paginate(direction) {
      if (direction === 'previous') {
        this.page--;
      } else if (direction === 'next') {
        this.page++;
      }
      this.$emit('updatePaginator');
      this.$emit('pageUpdated', this.page);
      this.bus.$emit('vue-paginator:pageUpdated', this.page);
    },

    pageChanged(pageNumber) {
      this.page = pageNumber;
      this.$emit('updatePaginator');
      this.bus.$emit('vue-paginator:pageUpdated', this.page);
    },

    updatePagination(paginator) {
      this.next = paginator.next_page_url ? true : false;
      this.previous = paginator.prev_page_url ? true : false;
    },

    makePaginator() {
      this.log('(vue-paginator) ... makePaginator');
      this.paginatorArray = [];
      var tempArray = [];
      if (this.limit > 3 && this.maxPage > 6) {
        var start = 0;
        var makeafter = false;
        var middleNumber = Math.round((this.maxPage - this.page + 3) / 2) + this.page;

        //only present minus pages where page
        if (this.page < 4) {
          start = 1
        }
        else {
          start = this.page - 2
          makeafter = true;
        }

        if (makeafter && ((this.page + 2) > this.maxPage)) {

          tempArray.push(1);
          tempArray.push(2);
        }
        //always 2 pages after and 2 pages before
        //this.paginatorArray.push(start);
        //this.paginatorArray.push(start+1);
        tempArray.push(start);
        tempArray.push(start + 1);


        if ((start + 2) < this.maxPage) {
          //this.paginatorArray.push(start+2);
          tempArray.push(start + 2);
        }

        if (makeafter && ((this.page + 2) < this.maxPage)) {
          //this.paginatorArray.push(start+3);
          //this.paginatorArray.push(start+4);
        }

        for (var i = middleNumber; i < this.maxPage && i <= (middleNumber + this.limit); i++) {

          //this.paginatorArray.push(i);
          tempArray.push(i);

        }

        //always present last page
        //this.paginatorArray.push(this.maxPage);
        tempArray.push(this.maxPage);
        this.paginatorArray = tempArray;
        return;
      } else {

        for (var i = 1; i <= this.maxPage; i++) {

          tempArray.push(i);
        }
        this.paginatorArray = tempArray;
        return;
      }

    },

    getActiveClass(numberpager) {
      this.log("(vue-paginator) numberpager:" + numberpager + " , this.page:" + this.page + "so..." + (numberpager == this.page));
      return (numberpager == this.page) ? "page-active" : "page-unactive";

    },

    log: function(message) {
      if (this.verbose) {
        console.log(message);
      }

    },

  }
};
