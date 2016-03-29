var Q = require('q');
var path = require('path');
var assert = require('assert');
var mockery = require('mockery');
var cmdAddPath = '../../lib/cli/cmd-add';

describe('cli add cmd', function() {
  it('calls generate if there is a built-in generator', function() {
    var params = {};
    var name = 'component'; // this is a built-in generator
    var generateCalled = false;
    var root = path.join(__dirname, '..', '..');
    var generator = path.join(root, 'node_modules', 'generator-donejs');

    mockery.registerAllowable(cmdAddPath);

    mockery.registerMock(generator, {
      component: {}
    });

    mockery.registerMock('./cmd-generate', function() {
      var args = Array.prototype.slice.call(arguments);

      assert.equal(args[0], root);
      assert.equal(args[1], name);
      assert.equal(args[2], params);
      generateCalled = true;

      return Q(true);
    });

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    var add = require(cmdAddPath);

    return add(root, name, params)
      .then(function() {
        assert(generateCalled, 'generate should be called');
        mockery.disable();
      });
  });

  it('calls utils.add if there is not a built-in generator', function() {
    var params = {};
    var name = 'foobar'; // not a built-in generator
    var utilsAddCalled = false;
    var root = path.join(__dirname, '..', '..');

    mockery.registerAllowable(cmdAddPath);

    mockery.registerMock('../utils', {
      add: function() {
        var args = Array.prototype.slice.call(arguments);

        assert.equal(args[0], path.join(root, 'node_modules'));
        assert.equal(args[1], name);
        assert.equal(args[2], params);
        utilsAddCalled = true;

        return Q(true);
      }
    });

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    var add = require(cmdAddPath);

    return add(root, name, params)
      .then(function() {
        assert(utilsAddCalled, 'utils.add should be called');
        mockery.disable();
      });
  });
});
