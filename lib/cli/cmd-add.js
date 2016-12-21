var path = require('path');
var add = require('../utils').add;
var generate = require('./cmd-generate');
var debug = require('debug')('donejs-cli:add');

module.exports = function(root, name, params) {
  var generators = require(path.join(root, 'node_modules', 'generator-donejs'));

  if (generators[name]) {
    debug('add called but running generate instead', name, params);
    return generate(root, name, params);
  }

  debug('add', name, params);
  return add(path.join(root, 'node_modules'), name, params);
};
