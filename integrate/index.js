var eng = require('./node/engine');

var integrate = module.exports = function (func, lower, upper, options, callback){
  eng.runPython('single', func, options, callback, lower, upper);
};


