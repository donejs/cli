var spawn = require('cross-spawn-promise');
var assert = require('assert');
var path = require('path');

// change back to root if this test placed after utils-test.js
var origCwd = process.cwd();
if (path.basename(process.cwd()) === 'test') {
  process.chdir(path.dirname(process.cwd()));
}

var donejsFakeDir = path.join(process.cwd(),'test','npm-link','donejs');
var cliFakeDir = path.join(process.cwd(),'test','npm-link','cli');
var nodeFakeDir = path.join(process.cwd(),'test','npm-link','node');

function npmCommand(arg, dir) {
  return spawn('npm', [arg], {
    cwd: dir || process.cwd()
  });
}

describe('npm link', function () {
  beforeEach(function() {
    process.env.NPM_CONFIG_PREFIX = nodeFakeDir;
  });

  afterEach(function() {
    delete process.env.NPM_CONFIG_PREFIX;
  });

  describe('donejs/bin/donejs and cli/bin/donejs', function () {
    after(function () {
      npmCommand(['unlink'], cliFakeDir);
    });

    var conflictTest = function (done) {
      npmCommand('link', donejsFakeDir)
        .then(function () {

          npmCommand('link', cliFakeDir)
            .then(function () {
              done(new Error('was expecting a conflict'));
            })
            .catch(function (error) {
              assert.notEqual(
                error.stderr.indexOf('EEXIST'),
                -1, 'bin file already exists');
              done();
            });

        })
        .catch(done);
      };

    it("has an expected conflict", conflictTest);
  });

  describe('donejs/bin/donejs and cli/bin/<current>', function () {
    after(function () {
      npmCommand('unlink');
      npmCommand('unlink', donejsFakeDir);
    });

    var noConflictTest = function (done) {
      npmCommand('link', donejsFakeDir)
        .then(function () {

         // linking current repo
          npmCommand('link')
            .then(function () {
              done();
            })
            .catch(function() {
              done(new Error('was not expecting a conflict'));
            });

        })
        .catch(done);
      };

    it("has no conflict", noConflictTest);
  });
});

process.chdir(origCwd);
