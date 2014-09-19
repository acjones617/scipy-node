var eng = require('./node/engine');

module.exports = {
  minimize: function(func, options, callback) {
    eng.runPython('minimize', func, options, callback);
  },
  nonNegLeastSquares: function(A, b, callback) {
    eng.runPython('nnls', A, b, callback);
  }
}
