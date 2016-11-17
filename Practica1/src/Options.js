'use strict';

var EventEmitter = require('events').EventEmitter;

function Options(group) {
  EventEmitter.call(this);
  this._group = typeof group === 'object' ? group : {};
}
Options.prototype = Object.create(EventEmitter.prototype);
Options.prototype.constructor = Options;

Options.prototype.list = function () {
  return Object.keys(this._group);
};

Options.prototype.get = function (id) {
  return this._group[id];
};

Options.prototype.select = function (id) {
  // Haz que se emita un evento cuando seleccionamos una opción.
  var list2 = this.list();
  var i = 0;
  var centinela = true;
  while(i < list2.length && centinela){
  if (list2[i] === id){
  centinela = false;
  this.emit('chose', id, this.get(id));
  }
  i++;
  }
  if ( i >= list2.length)
  this.emit('choseError', 'option-does-not-exist', id);
};

module.exports = Options;
