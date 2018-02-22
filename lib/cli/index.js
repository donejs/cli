var path = require('path');
var utils = require('../utils');
var program = require('commander');
var getLocalBins = require('./get-local-bins');
var getNpmScripts = require('./get-npm-scripts');
var debug = require('debug')('donejs-cli:index');
var isWindows = require('os').platform() === 'win32';

// commands
var add = require('./cmd-add');
var init = require('./cmd-init');
var generate = require('./cmd-generate');
var commandList = ['init', 'generate', 'add'];

module.exports = function(root) {
  var mypkg = require(path.join(__dirname, '..', '..', 'package.json'));

  debug('mypkg', mypkg);

  program.version(mypkg.version)
    .description(
      'The DoneJS command line utility lets you run generators, NPM scripts ' +
      'and binaries local to your project.'
    );

  // donejs init
  program.command('init [folder]')
    .option('-S, --skip-install')
    .option('-T, --type [type]')
    .option('-Y, --yes', 'Use only defaults and not prompt for any option')
    .description(
      'Initialize a new DoneJS application or plugin (--type plugin) in ' +
      'a new folder or the current one'
    )
    .action(function(folder, options) {
      utils.log(init(root, mypkg, folder, options));
    });

  // donejs generate
  program.command('generate <name> [options...]')
    .description('Run a generator.')
    .action(function(type, options) {
      utils.log(generate(root, type, options));
    });

  // donejs add
  program.command('add <name> [params...]')
    .description('Add functionality to your project')
    .action(function(name, params) {
      utils.log(add(root, name, params));
    });

  // add package npm scripts as commands
  var scripts = [];

  try {
    scripts = getNpmScripts(root);
  } catch(e) {
    console.error('Error getting NPM scripts:', e.message);
    return;
  }

  Object.keys(scripts).forEach(function(script) {
    if (commandList.indexOf(script) === -1) {
      commandList.push(script);
      program.command(script + ' [...args]')
        .description('`' + scripts[script] + '` (package.json)')
        .action(function(args) {
          debug('Running script', script, args);
          utils.log(utils.runScript(script, args));
        });
    }
  });

  // add all other local binaries
  var binPath = path.join(path.join(root, 'node_modules'), '.bin');
  getLocalBins(binPath).forEach(function(name) {
    if (commandList.indexOf(name) === -1) {
      commandList.push(name);

      program.command(name + ' [...args]')
        .description('')
        .action(function(args) {
          var filename = name + (isWindows ? '.cmd': '');
          debug('Running command', name, args);
          utils.log(utils.runCommand(path.join(binPath, filename), args));
        });
    }
  });

  // catchall
  program.command('*')
    .description('')
    .action(function(command) {
      console.error('Could not run `' + command + '`');
      program.help();
    });

  return program;
};
