var parse = require('./parse');
var clean = require('./clean');

module.exports = Engine = {};

var pythons = [];
var outputs = [];
var pythonNum = 0;

Engine.runPython = function(operation, a, b, cb, x, y) {
  if (operation === 'local' || operation === 'global') {
    var cleanup = clean.cleanMin(operation, a, b, cb);
    a   = cleanup.func;
    b = JSON.stringify(cleanup.options);
    cb  = cleanup.callback;
  } else if (operation === 'nnls') {
    cb = clean.cleanCB(cb);
    a = JSON.stringify(a);
    b = JSON.stringify(b);
  } else if (operation === 'fit') {
    var cleanup = clean.cleanFit(a, b, cb, x, y);
    a = cleanup.func;
    b = JSON.stringify(cleanup.options);
    cb = cleanup.callback;
  } else if (operation === 'root') {
    var cleanup = clean.cleanRoot(a, b, cb, x, y);
    a = cleanup.func;
    b = JSON.stringify(cleanup.options);
    cb = cleanup.callback;
  } else if (operation === 'vectorRoot') {
    var cleanup = clean.cleanVector(a, b, cb, x);
    a = cleanup.func;
    b = JSON.stringify(cleanup.options);
    cb = cleanup.callback;
  } else if (operation === 'derivative') {
    var cleanup = clean.cleanDerivative(a, b, cb, x);
    a = cleanup.func;
    b = JSON.stringify(cleanup.options);
    cb = cleanup.callback;
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
      try {
        cb(JSON.parse(outputs[num]));
      } catch (e) {
        cb(outputs[num]);
      }
    });
  })(pythonNum++)
}
