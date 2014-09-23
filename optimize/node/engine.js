var parse = require('./parse');
var clean = require('./clean');

module.exports = Engine = {};

var pythons = [];
var outputs = [];
var pythonNum = 0;

Engine.runPython = function(operation, a, b, cb, xData, yData) {
  if (operation === 'local' || operation === 'global') {
    var cleanup = clean.cleanMin(operation, a, b, cb);
    a   = cleanup.func;
    b   = cleanup.options;
    cb  = cleanup.callback;
    b = JSON.stringify(b);
  } else if (operation === 'nnls') {
    cb = clean.cleanCB(cb);
    a = JSON.stringify(a);
    b = JSON.stringify(b);
  } else if (operation === 'fit') {
    var cleanup = clean.cleanFit(a, b, cb, xData, yData);
    a = cleanup.func;
    b = cleanup.options;
    cb = cleanup.callback;
    b = JSON.stringify(b);
  }

  // immediately invoked function in case user invokes runPython multiple times,
  // starting multiple child processes, causing race condition, 
  // causing stdouts to potentially overlap (otherwise).
  (function (num){
    pythons[num] = require('child_process').spawn(
      'python',
      [__dirname + '/../py/exec.py', operation, a, b]);
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
