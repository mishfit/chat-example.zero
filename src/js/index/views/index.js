var Marionette = require('backbone.marionette'),
    tmpl       = require('../templates/index.chbs'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    _self = this;
  },
  template: function () {
    if (_self.model) {
      return tmpl(_self.model.toJSON());
    } else {
      return tmpl();
    }
  }
});
