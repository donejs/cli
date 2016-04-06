var Q = require('q');
var path = require('path');
var assert = require('assert');
var mockery = require('mockery');

describe('cli generate cmd', function() {
  it('calls generate with the right arguments', function() {
    var params = {};
    var name = 'component';
    var generateCalled = false;
    var root = path.join(__dirname, '..', '..');
    var cmdGeneratePath = '../../lib/cli/cmd-generate';

    mockery.registerAllowable(cmdGeneratePath);

    mockery.registerMock('../utils', {
      generate: function() {
        var args = Array.prototype.slice.call(arguments);

        assert.equal(args[0], path.join(root, 'node_modules'));
        assert.equal(args[1], 'generator-donejs');
        assert.deepEqual(args[2], [ ['component', {}] ]);
        generateCalled = true;

        return Q(true);
      }
    });

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    var generate = require(cmdGeneratePath);

    return generate(root, name, params)
      .then(function() {
        assert(generateCalled, 'generate should be called');
        mockery.disable();
        mockery.deregisterAll();
      });
  });
});
