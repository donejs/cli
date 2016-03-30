var path = require('path');
var assert = require('assert');
var concat = require('concat-stream');
var spawn = require('cross-spawn-async');

describe('./bin/donejs', function() {
  var command;

  beforeEach(function() {
    command = path.join(__dirname, '..', '..', 'bin', 'donejs');
  });

  it.skip('shows cli help when no options passed', function(done) {
    var proc = spawn(command, []);

    proc.stdout.pipe(concat(function(output) {
      var res = output.toString('utf8');

      assert(/Usage: donejs \[options\]/.test(res), 'should show cli help');
      done();
    }));
  });
});
