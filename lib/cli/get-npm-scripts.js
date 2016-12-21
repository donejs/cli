var path = require('path');
var debug = require('debug')('donejs-cli:get-npm-scripts');

module.exports = function(root) {
  var scripts = {};

  try {
    var curpkg = require(path.join(root, 'package.json'));
    scripts = curpkg.scripts || {};
  }
  catch (e) {
    // otherwise no local package.json
    debug('Could not load local package.json');
  }

  return scripts;
};
