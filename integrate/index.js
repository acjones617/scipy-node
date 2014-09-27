var eng = require('./node/engine');

var integrate = module.exports = function (func, range, options, callback){
  eng.runPython('multi', func, options, callback, range);
};

integrate.univariate = function (func, lower, upper, options, callback){
  eng.runPython('single', func, options, callback, lower, upper);
}
