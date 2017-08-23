require('./bootstrap');

import App   from './app';
import Index from './index/index';

var app = new App();

app.addComponent({
  name: 'root',
  componentClass: Index,
  isRoot: true
});

app.start();
