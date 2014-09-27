var integrate = require('../index.js');
var should = require('should');

describe('multivariate integral', function(){
  var f = function (x, y, z){
    return Math.pow(x, 4) - Math.exp(2 * y - 5) - 2 * x * Math.log(Math.abs(z * 2) + 1) - 4;
  };

  var g = 'x**4 - exp(2 * y - 5) - 2 * x * log(abs(z * 2) + 1) - 4';

  var infiniteTest = function (x){
    return 1 / (Math.pow(x, 2) + 1);
  };

  var resultF, resultG, resultI;

  before(function (done){
    var i = 0;
    integrate(f, [[-1,1],[2,4],[-2,0]], function (results){
      resultF = results;
      if (++i === 3) {
        done();
      }
    });

    integrate(g, [[-1,1],[2,4],[-2,0]], {
      variables: ['x', 'y', 'z']
    }, function (results){
      resultG = results;
      if (++i === 3) {
        done();
      }
    });

    integrate(infiniteTest, [[-Infinity, Infinity]], function (results){
      resultI = results;
      if (++i === 3) {
        done();
      }
    })
  });

  it('correctly calculates the definite integral', function() {
    Math.round(resultF.definiteIntegral * 100).should.equal(-6984);
    Math.round(resultF.absoluteError * 100).should.equal(0);
    Math.round(resultF.definiteIntegral * 10000).should.equal(Math.round(resultG.definiteIntegral * 10000));
    Math.round(resultF.absoluteError * 10000).should.equal(Math.round(resultG.absoluteError * 10000));
  });

  it('handles using infinity as the bounds', function() {
    Math.round(resultI.definiteIntegral * 100).should.equal(314);
    Math.round(resultI.absoluteError * 100).should.equal(0);
  })
});
