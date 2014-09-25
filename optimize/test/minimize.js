var opt = require('../index');
var should = require('should');

describe('minimize', function(){

  var f = function(a) {
    return Math.pow(a, 4) + Math.pow(a, 3) - 13 * Math.pow(x, 2) - x + 12;
  };

  var g = 'y**4 + y**3 - 13*y**2 - y + 12';

  describe('localMinimize', function(){
    var resultF, resultG;

    before(function (done){
      var i = 0;
      opt.localMinimize(f, {
        bounds: [0, 10]
      }, function (results){
        resultF = results;
        if (++i === 2) {
          done();
        }
      });
      opt.localMinimize(g, {
        bounds: [0, 10],
        variable: 'y'
      }, function (results){
        resultG = results;
        if (++i === 2) {
          done();
        }
      });
    });

    it('correctly finds a local minima of a function', function() {
      Math.round(resultF.x * 100).should.equal(222);
      Math.round(resultF.fun * 100).should.equal(-1906);
    });

    it('correctly finds minimum for string or function func', function() {
      Math.round(resultF.x * 10000).should.equal(Math.round(resultG.x * 10000));
      Math.round(resultF.fun * 10000).should.equal(Math.round(resultG.fun * 10000));
    })

  });

  describe('globalMinimize', function(){
    var resultF;
    var resultG;

    before(function (done){
      var i = 0;
      opt.globalMinimize(f, function (results){
        resultF = results;
        if (++i === 2) {
          done();
        }
      });
      opt.globalMinimize(g, {
        variable: 'y'
      }, function (results){
        resultG = results;
        if (++i === 2) {
          done();
        }
      });
    });

    it('correctly finds the global minima of a function', function(){
      Math.round(resultF.x * 100).should.equal(-294);
      Math.round(resultF.fun * 100).should.equal(-4813);
    });

    it('correctly finds the minimum for a string or function func', function() {
      Math.round(resultF.x * 10000).should.equal(Math.round(resultG.x * 10000));
      Math.round(resultF.fun * 10000).should.equal(Math.round(resultG.fun * 10000));
    });
  });

  
});

// // opt.minimize('(x-10)**2', {
// //   method: 'Bounded',
// //   bounds: [15,16]
// // }); 

// // opt.minimize('(x-2)**4 - (x+1)**2 - 5*x + 10');

// // var f = function(num) {
// //   return Math.pow(num, 4) - log(num);
// // }

// // opt.minimize(f, {variable: 'num'});

// // opt.nonNegLeastSquares([[2,4,1],[5,1,2],[5,2,-1]], [9,8,2]);

// // opt.globalMinimize('(x-2)**4 - (x+1)**2 - 5*x + 10', {
// //     includeAllMinsFound: false,
// // });

// // opt.globalMinimize('(what-2)**4 - (what+1)**2 - 5*what + 10', {
// //     variable: 'what',
// // });

// // opt.findRoot('(what-2)**3 - (what+1)**2 - 5*what + 10', -100, 100, {
// //     variable: 'what',
// //     method: 'testme'
// // });

// // opt.findVectorRoot('[y[0] + 1, y[1] - 10]', [0,0], {
// //     variable: 'y'
// // });

// // var f = function(x) {
// //   return [Math.cos(x), x-2];
// // }

// // opt.findVectorRoot(f, 0);

// opt.calcDerivatives(function(x) {
//   return Math.pow(x[0],2) * x[1] * 2 - Math.exp(x[0]) * Math.log(x[1]);
// }, [1,1], {epsilon: [0.0001, -0.10]});


// // opt.globalMinimize(function (x){
// //   return Math.pow(x - 10, 4) + Math.log(Math.abs(x + 1)) - 10 * x;
// // }, {
// //   includeAllMinsFound: true,
// //   iterations: 10
// // }, function(results) {
// //   console.log(results.length, results);
// // });

// // var f = function(track, frack, mack) {
// //   return frack * track + mack;
// // }

// // opt.fitCurve(f, [1,2,3], [-1,0,1]);

// // opt.fitLinear([1,2,3], [-1,0,1])

// // opt.fitQuadratic([1,2,3,-2,6], [-1,0,1,4,2])

// // opt.fitCurve.linear([1,2,3,4], [3, 5, 4, 8])
// // opt.fitCurve.quadratic([1,2,3,4], [3, 5, 4, 8])

// // opt.fitCurve('param1 * ind + param2', [1,2,3,4], [3, 5, 4, 8], {variables: ['ind', 'param1', 'param2']})