var Q = require('q');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var debug = require('debug')('donejs-cli:init');

var utils = require('../utils');
var generate = utils.generate;
var installIfMissing = utils.installIfMissing;

module.exports = function(root, mypkg, folder, options) {
  debug('Initializing new application', folder);

  if (folder) {
    var appDir = path.join(process.cwd(), folder);

    if (fs.existsSync(appDir)) {
      return Q.reject(new Error('Folder `' + folder + '` already exists.'));
    }

    console.log('Creating folder ' + folder);
    mkdirp.sync(appDir);
    process.chdir(appDir);
  }

  var nodeModules = path.join(process.cwd(), 'node_modules');

  if(!fs.existsSync(nodeModules)) {
    nodeModules = path.join(root, 'node_modules');
  }

  debug('Generating application in folder', process.cwd());

  var type = options.type || 'app';
  var genVersion = mypkg.donejs.dependencies['generator-donejs'];

  return installIfMissing(nodeModules, 'generator-donejs', genVersion)()
    .then(function() {
      return generate(nodeModules, 'generator-donejs', [type, {
        version: mypkg.version,
        packages: mypkg.donejs,
        useDefaults: options.yes,
        skipInstall: options.skipInstall
      }]);
    });
};
