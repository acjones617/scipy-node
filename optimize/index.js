var eng = require('./node/engine');

module.exports = {
  localMinimize: function(func, options, callback) {
    eng.runPython('local', func, options, callback);
  },
  globalMinimize: function(func, options, callback) {
    eng.runPython('global', func, options, callback);
  },  
  nonNegLeastSquares: function(A, b, callback) {
    eng.runPython('nnls', A, b, callback);
  }
}
