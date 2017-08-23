import _ from 'underscore';

export default {
  _initComponent() {
    this.on('destroy', this._destroyComonent);
  },
  _destroyComonent() {
    const container = this._container;
    if (_.isObject(container)) {
      let components = container.getComponents(),
          key = _.findKey(components, k => { return components[k] == this; });

      delete components[key];

      delete this._container;
    }
  },
  getContainer() {
    return this._container;
  },
  setContainer(container) {
    this._container = container;
  }
};
