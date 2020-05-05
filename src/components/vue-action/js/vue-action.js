//console.log = console.debug = console.info = function(){};

import jquery from 'jquery';
window.$ = jquery;
window.jQuery = jquery;

jQuery.fn.goTo = function(url) {
  window.location.href = url;
}

$.fn.launchBlank = function(url, nameWindow) {

  if (nameWindow == undefined) {
    nameWindow = '_blank';
    window.open(url, nameWindow);
  } else {
    var windowhandle = window.open(url, nameWindow);
    windowhandle.focus();
  }

}

//https://www.jquery-az.com/how-to-increasedecrease-bootstrap-modal-width-and-height/
//https://www.jquery-az.com/wwh/demo.php?ex=32.0_2
//size can be 1024px, 800px, 30%, 70% it is the width
$.fn.launchModal = function(title, url, size) {

  if (size == undefined) {
    size = '1024px';
  }

  $.ajax({
    url: url,
    dataType: 'html',
    success: function(data) {
      $('#myModalAnything').find('#myModalTitle').html(title);
      $('#myModalAnything').find('#myModalBody').html(data);

      //happens in show modal
      $('#myModalAnything').on('show.bs.modal', function() {

        $(this).find('.modal-dialog').css({
          width: size,

        });

        $(this).find('.modal-content').css({
          height: '80%',
          'background-color': '#BBD6EC'
        });

      });

      //focus problem with textarea focus on rte
      $('#myModalAnything').on('shown.bs.modal', function(e) {
        $(document).off('focusin.modal');
      })

      //happens on close/hide
      $('#myModalAnything').on('hidden.bs.modal', function() {
        $('#myModalAnything').find('#myModalTitle').html("");
        $('#myModalAnything').find('#myModalBody').html("");

      });

      $('#myModalAnything').modal('show');
      $('#myModalAnything').off('show.bs.modal');




    },
    error: function(data) {
      $('#myModalAnything').find('#myModalTitle').html(title);
      $('#myModalAnything').find('#myModalBody').html("Erreur au lancement de la modale !");
      $('#myModalAnything').modal('show');
    }
  });
}


export default {
  name: 'VueAction',
  props: {
    def: Object,
    //def: Array,
    index: Number,
    target: Number,
    dataunit: String,
    //dataunit: Object,
    datacolumns: Array
  },
  methods: {

    makeLink: function(link, target, dataunit) {
      var comp = this;
      function replaceWithValue(match) {
        //console.log(match);
        var columnDollar = match.slice(1, match.length);
        var dataunitobj = JSON.parse(dataunit);
        var truevalue = dataunitobj[comp.datacolumns.indexOf(columnDollar)];

        if (typeof truevalue == 'string') { truevalue = "'" + truevalue + "'" }
        return truevalue;
      }

      link = link.replace("$du", dataunit);
      link = link.replace("$1", target);

      link = link.replace(/\$[\w_]+/g, replaceWithValue);
      //console.log("(vuetable) LINK: " + link);
      return "jQuery()." + link
    },

    makeClass: function(command, target, dataunit) {
      console.log(command);
      var comp = this;
      function replaceWithValue(match) {
        //console.log(match);
        var columnDollar = match.slice(1, match.length);
        var dataunitobj = JSON.parse(dataunit);
        var truevalue = dataunitobj[comp.datacolumns.indexOf(columnDollar)];

        //if (typeof truevalue =='string') { truevalue = "'" + truevalue + "'" };
        return truevalue;
      }

      command = command.replace("$du", dataunit);
      command = command.replace("$1", target);

      command = command.replace(/\$[\w_]+/g, replaceWithValue);

      return (eval(command))
    },

    setDisplay: function(conditionExp, dataunit) {
      if (conditionExp == undefined)
        return "display: inline";

      var comp = this;
      function replaceWithValue(match) {
        //console.log(match);
        var columnDollar = match.slice(1, match.length);
        var dataunitobj = JSON.parse(dataunit);
        var truevalue = dataunitobj[comp.datacolumns.indexOf(columnDollar)];

        //if (typeof truevalue =='string') { truevalue = "'" + truevalue + "'" };
        return truevalue;
      }

      conditionExp = conditionExp.replace(/\$[\w_]+/g, replaceWithValue)

      var result = (eval(conditionExp) == true) ? "display: inherit" : "display: none"

      return result
    }

  }
};
