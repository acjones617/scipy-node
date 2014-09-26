var clean = require('./clean');

module.exports = Engine = {};

var pythons = [];
var outputs = [];
var pythonNum = 0;

Engine.runPython = function(operation, func, options, cb, lower, upper) {
  if (operation === 'single') {
    var cleanup = clean.cleanInt(func, options, cb, lower, upper);
    func    = cleanup.func;
    options = JSON.stringify(cleanup.options);
    cb      = cleanup.callback;
  }

  // immediately invoked function in case user invokes runPython multiple times,
  // starting multiple child processes, causing race condition, 
  // causing stdouts to potentially overlap (otherwise).
  (function (num){
    pythons[num] = require('child_process').spawn(
      'python',
      [__dirname + '/../py/exec.py', operation, func, options]);
    outputs[num] = '';
    pythons[num].stdout.on('data', function(data){
      outputs[num] += data;
    });
    pythons[num].stdout.on('close', function(){
      try {
        cb(JSON.parse(outputs[num]));
      } catch (e) {
        cb(outputs[num]);
      }
    });
  })(pythonNum++)
}
