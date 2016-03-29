var path = require('path');
var assert = require('assert');
var child = require('child_process');
var concat = require('concat-stream');

describe('./bin/donejs', function() {
  var command;

  beforeEach(function() {
    command = path.join(__dirname, '..', '..', 'bin', 'donejs');
  });

  it('shows cli help when no options passed', function(done) {
    var proc = child.spawn(command, []);

    proc.stdout.pipe(concat(function(output) {
      var res = output.toString('utf8');

      assert(/Usage: donejs \[options\]/.test(res), 'should show cli help');
      done();
    }));
  });
});
