var integrate = require('../index.js');

var should = require('should');

describe('single integral', function(){
  var f = function (a){
    return Math.pow(a, 4) - Math.exp(2 * a - 5) - 2 * a * Math.log(Math.abs(a * 2) + 1) - 4;
  };

  var g = 'y**4 - exp(2 * y - 5) - 2 * y * log(abs(y * 2) + 1) - 4';

  var infiniteTest = function (x){
    return 1 / (Math.pow(x, 2) + 1);
  };

  var resultF, resultG, resultI;

  before(function (done){
    var i = 0;
    integrate.univariate(f, -2, 2, function (results){
      resultF = results;
      if (++i === 3) {
        done();
      }
    });

    integrate.univariate(g, -2, 2, {
      variable: 'y',
    }, function (results){
      resultG = results;
      if (++i === 3) {
        done();
      }
    });

    integrate.univariate(infiniteTest, -Infinity, Infinity, function (results){
      resultI = results;
      if (++i === 3) {
        done();
      }
    })
  });

  it('correctly calculates the definite integral', function() {
    Math.round(resultF.definiteIntegral * 100).should.equal(-338);
    Math.round(resultF.absoluteError * 100).should.equal(0);
    Math.round(resultF.definiteIntegral * 10000).should.equal(Math.round(resultG.definiteIntegral * 10000));
    Math.round(resultF.absoluteError * 10000).should.equal(Math.round(resultG.absoluteError * 10000));
  });

  it('handles using infinity as the bounds', function() {
    Math.round(resultI.definiteIntegral * 100).should.equal(314);
    Math.round(resultI.absoluteError * 100).should.equal(0);
  })
});
