var parse = require('./parse');

module.exports = Engine = {};

Engine.runPython = function(method, func, options, cb) {
  var python = require('child_process').spawn(
    'python',
    [__dirname + '/../lib/exec.py', method, func, options]);
  output = '';
  python.stdout.on('data', function(data){
    output += data;
  });
  python.stdout.on('close', function(){
    cb(JSON.parse(output));
  });
}

Engine.minimize = function(func, options, cb){
  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  cb = cb || function (results){
    console.log(results);
  };

  options           = options             || {};
  options.guess     = options.guess       || -2;
  options.operation = options.operation   || 'minimize';
  
  // func = parse.parseJS(func);
  options = JSON.stringify(options);

  var python = require('child_process').spawn(
    'python',
    [__dirname + '/../py/exec.py', func, options]);
  output = '';
  python.stdout.on('data', function(data){
    output += data;
  });
  python.stdout.on('close', function(){
    // cb(JSON.parse(output));
    cb(output);
  });
};

module.exports = Engine;
