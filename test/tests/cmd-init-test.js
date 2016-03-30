var Q = require('q');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var mockery = require('mockery');

var initPath = '../../lib/cli/cmd-init';

var mockUtilsModule = {
  installIfMissing: function() {
    return function() {
      return Q(true);
    };
  },

  generate: function() {
    return Q(true);
  }
};

describe('cli init cmd', function() {
  it('rejects with error if folder exists', function(done) {
    var mypkg = {};
    var options = {};
    var root = __dirname;
    var folder = 'foobar';
    var init = require(initPath);

    fs.mkdirSync(folder);

    init(root, mypkg, folder, options)
      .then(function() {
        assert(false, 'should fail, folder already exists');
        done();
      })
      .catch(function(err) {
        var hasMessage = /already exists/.test(err.message);
        assert(hasMessage, 'should fail with message');
        fs.rmdirSync(folder);
        done();
      });
  });

  it('creates folder if it does not exist', function(done) {
    var folder = 'foobar';
    var cwd = process.cwd();
    var root = path.join(__dirname, '..', '..');
    var mypkg = require(path.join(root, 'package.json'));

    mockery.registerAllowable(initPath);
    mockery.registerMock('../utils', mockUtilsModule);
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

    var init = require(initPath);
    process.chdir(root);

    if (fs.existsSync(folder)) {
      fs.rmdirSync(folder);
    }

    init(root, mypkg, folder, {})
      .then(function() {
        var folderPath = path.join(root, folder);
        assert(fs.existsSync(folderPath), 'should have been created');
        process.chdir(cwd);
        fs.rmdirSync(folderPath);
        mockery.disable();
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
