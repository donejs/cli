var path = require('path');
var assert = require('assert');
var getNpmScripts = require('../../lib/cli/get-npm-scripts');

describe('getNpmScripts', function() {
  it('works', function() {
    var root = path.join(__dirname, '..', '..');

    var keys = Object.keys(getNpmScripts(root));

    assert(keys.indexOf('test') !== -1, 'should include "test" script');
    assert(keys.indexOf('jshint') !== -1, 'should include "jshint" script');
    assert(keys.indexOf('coverage') !== -1, 'should include "coverage" script');
  });

  it('returns empty object if package.json does not exist', function() {
    assert.deepEqual(getNpmScripts(__dirname), {}, 'should be an empty object');
  });

  it('throws an error if package.json is malformed', function() {
    var root = path.join(__dirname, '..', 'bad-package-json');

    try {
      Object.keys(getNpmScripts(root));
    } catch(e) {
      assert.ok(/SyntaxError/.test(e), 'SyntaxError thrown');
    }
  });
});
