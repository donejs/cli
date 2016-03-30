var path = require('path');
var debug = require('debug')('donejs-cli:binary');

module.exports = function(root) {
  try {
    var curpkg = require(path.join(root, 'package.json'));
    return curpkg.scripts || {};
  }
  catch (e) {
    // otherwise no local package.json
    debug('Could not load local package.json');
  }
};
