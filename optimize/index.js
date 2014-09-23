var eng = require('./node/engine');

var index = module.exports = {
  localMinimize: function(func, options, callback) {
    eng.runPython('local', func, options, callback);
  },
  globalMinimize: function(func, options, callback) {
    eng.runPython('global', func, options, callback);
  },  
  nonNegLeastSquares: function(A, b, callback) {
    eng.runPython('nnls', A, b, callback);
  },
  fitCurve: function(func, xData, yData, options, callback) {
    eng.runPython('fit', func, options, callback, xData, yData);
  }
};

index.fitCurve.linear = function(xData, yData, callback) {
  eng.runPython('fit', 'a * x + b', { variables: ['x', 'a', 'b'] }, callback, xData, yData);
};

index.fitCurve.quadratic = function(xData, yData, callback) {
  eng.runPython('fit', 'a * (x**2) + b * x + c', { variables: ['x', 'a', 'b', 'c'] }, callback, xData, yData);
};
