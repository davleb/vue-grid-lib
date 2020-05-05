var goTo;
var launchBlank;
var launchModal;

(function($) {
  function goTo(url) {
    window.location.href = url;
  }

  function launchBlank(url, nameWindow) {

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
  function launchModal(title, url, size) {

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

})(jQuery);

module.export = { goTo, launchBlank, launchModal };
