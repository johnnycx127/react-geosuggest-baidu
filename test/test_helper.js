const jsdom = require('jsdom'),
  doc = jsdom.jsdom('<!doctype html><html><body></body></html>'),
  win = doc.defaultView;

global.document = doc;
global.window = win;

global.$ = window.$ = require('jquery');

Object.keys(window).forEach(key => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
