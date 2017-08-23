import _            from 'underscore';
import Backbone     from 'backbone';
import ContainerApp from './_base/container-app';

const App = ContainerApp.extend({
  channelName: 'app',
  radioRequests: {
    'service:get': 'getService'
  },
  region: '#app',
  addService: function (options) {
    var serviceOptions = _.omit(options, 'serviceClass'),
        service = new options.serviceClass(serviceOptions);

    this.services[options.name] = service;

    return service;
  },
  getService: function (options) {
    
    if (this.services[options.name]) {
      return this.services[options.name];
    } else {
      return this.addService(options);
    }
  },
  initialize: function () {
    this.services = {};
  },
  onStart: function () {
    var rootComponent =
      _.find(Object.values(this.getComponents()),
      function (component) {
        return component.options.isRoot;
      });

    if (!rootComponent) {
      throw new Error('no root component found');
    }

    this.showView(rootComponent.getView());
    Backbone.history.start();
  }
});

export default App;
