var fs = require('fs');
var assert = require('assert');
var rimraf = require('rimraf');
var getLocalBins = require('../../lib/cli/get-local-bins');

describe('getLocalBins', function() {
  it('returns empty array if given path is empty', function() {
    fs.mkdirSync('my-binaries');
    assert.deepEqual(getLocalBins(__dirname + '/my-binaries'), []);
    fs.rmdirSync('my-binaries');
  });

  it('returns array of binary names at given path', function() {
    var cwd = process.cwd();
    var binPath = 'my-binaries';

    fs.mkdirSync(binPath);

    process.chdir(binPath);
    fs.writeFileSync('mocha');
    fs.writeFileSync('jshint');
    process.chdir(cwd);

    var binaries = getLocalBins(binPath);

    assert(binaries.indexOf('mocha') !== -1, 'should include mocha');
    assert(binaries.indexOf('jshint') !== -1, 'should include jshint');

    rimraf.sync(binPath);
  });
});
