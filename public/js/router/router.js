$(function () {
  var DataRouter = Backbone.Router.extend({
    routes: {
      '': 'index', 
    },

    index: function () {
      window.inputView.render();
      window.graphView.render();
    },

  });
  window.dataRouter = new DataRouter();
  Backbone.history.start({pushState: false});
});