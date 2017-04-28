$(function () {
  var EntryCollection = Backbone.Collection.extend({
    model: Entry
  });
  window.entryCollection = new EntryCollection();
});