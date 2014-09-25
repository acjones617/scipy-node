var opt = require('../index');
var should = require('should');

describe('fitCurve', function(){
  var resultL, resultQ;
  var xData = [1, 2, 3, 4];
  var yData = [10, 3, 0, 2];

  describe('fitCurve.linear', function() {
    before(function (done){
      opt.fitCurve.linear(xData, yData, function (results){
        resultL = results;
        done();
      });
    });

    it('fits the data to the correct line', function (){
      Math.round(resultL.paramValues[0] * 100).should.equal(-270);
      Math.round(resultL.paramValues[1] * 100).should.equal(1050);
    });

    it('finds the correct covariance matrix for linear', function (){
      Math.round(resultL.paramCovariance[0][0] * 100).should.equal(203);
      var reduceSum = resultL.paramCovariance.reduce(function(acc, el) {
        return acc + el.reduce(function(accInner, elInner) {
          return accInner + elInner;
        }, 0);
      }, 0);
      Math.round(reduceSum * 100).should.equal(710);
    })
  });

  describe('fitCurve.quadratic', function() {
    before(function (done){
      opt.fitCurve.quadratic(xData, yData, function (results){
        resultQ = results;
        done();
      });
    });

    it('fits the data to the correct quadratic curve', function (){
      Math.round(resultQ.paramValues[0] * 100).should.equal(225);
      Math.round(resultQ.paramValues[1] * 100).should.equal(-1395);
      Math.round(resultQ.paramValues[2] * 100).should.equal(2175);
    });

    it('finds the correct covariance matrix for quadratic', function (){
      Math.round(resultQ.paramCovariance[0][0] * 100).should.equal(1);
      var reduceSum = resultQ.paramCovariance.reduce(function(acc, el) {
        return acc + el.reduce(function(accInner, elInner) {
          return accInner + elInner;
        }, 0);
      }, 0);
      Math.round(reduceSum * 100).should.equal(5);
    });

  });

  describe('fitCurve using custom function', function (){
    var resultF, resultG, paramCovF, paramCovG
    var xData = [1,2,3,4,5,6,7,8,9,10];
    var yData = [10,3,0,2,-9,12,14,21,1001,11004];

    var f = function (ind, param1, param2, param3, param4){
      return param1*Math.exp(ind) + param2*Math.log(Math.abs(ind+1)) + param3*Math.pow(ind, ind) + param4;
    }

    var g = 'A * exp(x) + B * log(abs(x+1)) + C * Math.pow(x, x) + D';

    before(function (done){
      var i = 0;
      opt.fitCurve(f, xData, yData, function (results) {
        resultF = results;
        paramCovF = resultF.paramCovariance.reduce(function(acc, el) {
          return acc + el.reduce(function(accInner, elInner) {
            return accInner + elInner;
          }, 0);
        }, 0);

        if (++i === 2) {
          done();
        }
      })
      opt.fitCurve(g, xData, yData, {
        variables: ['x', 'A', 'B', 'C', 'D']
      }, function (results){
        resultG = results;
        paramCovG = resultG.paramCovariance.reduce(function(acc, el) {
          return acc + el.reduce(function(accInner, elInner) {
            return accInner + elInner;
          }, 0);
        }, 0);

        if (++i === 2) {
          done();
        }
      });
    });

    it('fits the data to the custom function', function (){
      Math.round(resultF.paramValues[0] * 100).should.equal(8);
      Math.round(resultF.paramValues[1] * 100).should.equal(-8952);
      Math.round(resultF.paramValues[2] * 100).should.equal(0);
      Math.round(resultF.paramValues[3] * 100).should.equal(10519);
    });

    it('finds the correct covariance matrix for custom function', function (){
      Math.round(resultF.paramCovariance[0][0] * 10000).should.equal(2);
      Math.round(paramCovF * 100).should.equal(181417);
    });


    it('correctly finds minimum for string or function func', function() {
      var paramSumF = resultF.paramValues.reduce(function(acc, el) {
        return acc + el;
      }, 0);
      var paramSumG = resultG.paramValues.reduce(function(acc, el) {
        return acc + el;
      }, 0);
      
      Math.round(paramSumG * 10000).should.equal(Math.round(paramSumF * 10000));
      Math.round(paramCovG * 10000).should.equal(Math.round(paramCovF * 10000));
    })
  })
});
