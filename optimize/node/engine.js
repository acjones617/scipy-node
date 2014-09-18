var parse = require('./parse');
var clean = require('./clean');

module.exports = Engine = {};

var pythons = {};
var outputs = {};
var pythonNum = 0;

Engine.runPython = function(operation, func, options, cb) {
  var cleanup = clean.clean(func, options, cb);
  func    = cleanup.func;
  options = cleanup.options;
  cb      = cleanup.callback;

  options = JSON.stringify(options);

  // immediately invoked function in case user invokes runPython multiple times,
  // starting multiple child processes, causing race condition, 
  // causing stdouts to potentially overlap.
  (function (num){
    pythons[num] = require('child_process').spawn(
      'python',
      [__dirname + '/../py/exec.py', operation, func, options]);
    outputs[num] = '';
    pythons[num].stdout.on('data', function(data){
      outputs[num] += data;
    });
    pythons[num].stdout.on('close', function(){
      // cb(outputs[num]);
      cb(JSON.parse(outputs[num]));
    });
  })(pythonNum++)
}
