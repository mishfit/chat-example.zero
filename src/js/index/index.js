var ViewComponent = require('../_base/viewcomponent'),
    View          = require('./views/index'),
    Radio         = require('backbone.radio'),
    appChannel    = Radio.channel('app'),
    _self;

module.exports = ViewComponent.extend({
  channelName: 'root',
  initialize: function () {

    this.view = new View();

    console.log('index.js initialized');
    _self = this;
  }
});
