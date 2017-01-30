var path = require('path');
var assert = require('assert');
var pkg = require('../../package.json');
var cli = require('../../lib/cli/index');

describe('./bin/donejs', function() {
  var program;

  beforeEach(function() {
    program = cli(__dirname);
  });

  it('reports the correct package version', function() {
    assert.equal(program.version(), pkg.version);
  });

  it('includes the init, add and generate commands', function() {
    var cliCommands = program.commands.map(function(cmd) {
      return cmd._name;
    });

    assert(has(cliCommands, 'init'), 'should include init');
    assert(has(cliCommands, 'add'), 'should include add');
    assert(has(cliCommands, 'generate'), 'should include generate');
  });

  it('includes local scripts and binaries as commands', function() {
    program = cli(path.join(__dirname, '..', '..'));

    var cliCommands = program.commands.map(function(cmd) {
      return cmd._name;
    });

    assert(has(cliCommands, 'test'), 'should include test');
    assert(has(cliCommands, 'jshint'), 'should include jshint');
    assert(has(cliCommands, 'coverage'), 'should include coverage');
    assert(has(cliCommands, 'mocha'), 'should include mocha');
  });

  function has(coll, cmd) {
    return coll.indexOf(cmd) !== -1;
  }
});
