$(function () {
  var InputView = Backbone.View.extend({
    el: $('.input-manager'),
    events: {
      'click .add-entry': 'addEntry',
      'click .delete-entry': 'deleteEntry'  
    },

    appendToContainer: function (html, $container, data) {
      $(Mustache.render(html, data)).appendTo($container);
    },

    render: function () {
      this.appendToContainer($('#search-template').html(), $(this.el).find('#search-container'));
      this.appendToContainer($('#table-headers').html(), $(this.el).find('#result-container'));
    },

    addEntry: function (e) {
      var x = document.getElementById('xentry').value;
      var y = document.getElementById('yentry').value;

      var newData = {
        xlabel: x,
        yvalue: y
      }

      if (x === '' || y === '' || isNaN(y)) {
        $('.error').empty();
        $('<p>Invalid Input!</p>').appendTo( '.error' );
      } else if (window.entryCollection.where({xlabel: x}).length === 0) {
          $('.error').empty();
          window.entryCollection.add(newData);
          this.appendToContainer($('#result-template').html(), $(this.el).find('#result-container'), newData);
      }

    },

    deleteEntry: function (e) {
      var target = $(e.target).attr('xlabel');
      $('#' + target).remove();
      window.entryCollection.remove(window.entryCollection.where({xlabel: $(e.target).attr('xlabel')}));
    }

  });

  window.inputView = new InputView();
});