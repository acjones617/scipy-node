var clean = require('./clean');

module.exports = Engine = {};

Engine.runPython = function (operation, func, options, cb, a, b){
  if (operation === 'single') {
    var cleanup = clean.cleanSingle(func, options, cb, a, b);
    func    = cleanup.func;
    options = JSON.stringify(cleanup.options);
    cb      = cleanup.callback;
  } else if (operation === 'multi') {
    var cleanup = clean.cleanMulti(func, options, cb, a);
    func    = cleanup.func;
    options = JSON.stringify(cleanup.options);
    cb      = cleanup.callback;
  }

  // don't need to worry about race conditions with async process below
  // since each is wrapped in their own "runPython" closure
  var python = require('child_process').spawn(
    'python',
    [__dirname + '/../py/exec.py', operation, func, options]);
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
