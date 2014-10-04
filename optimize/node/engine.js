var clean = require('./clean');

module.exports = Engine = {};

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

  // don't need to worry about race conditions with async process below
  // since each is wrapped in their own "runPython" closure
  var python = require('child_process').spawn(
  'python',
  [__dirname + '/../py/exec.py', operation, a, b]);
  var output = '';
  python.stdout.on('data', function (data){
    output += data;
  });
  python.stdout.on('close', function (){
    try {
      cb(JSON.parse(output));
    } catch (e) {
      cb(output);
    }
  });
}
