var parse = require('./parse');
var clean = require('./clean');

module.exports = Engine = {};

Engine.runPython = function(operation, func, options, cb) {
  var cleanup = clean.clean(options, cb);
  options = cleanup.options;
  cb = cleanup.callback;

  options = JSON.stringify(options);

  var python = require('child_process').spawn(
    'python',
    [__dirname + '/../py/exec.py', operation, func, options]);
  output = '';
  python.stdout.on('data', function(data){
    output += data;
  });
  python.stdout.on('close', function(){
    // cb(output);
    cb(JSON.parse(output));
  });
}
