var opt = require('../index');
var should = require('should');

describe('calcDerivatives', function(){
  var f = function(a) {
    return Math.pow(a[0], 4) * Math.exp(2 * a[1] - 5) - 2 * a[0] * Math.pow(a[1], 2) * Math.log(a[2] * 2) - 4;
  };

  var g = 'y[0]**4 * Math.exp(2 * y[1] - 5) - 2 * y[0] * Math.pow(y[1], 2) * Math.log(y[2] * 2) - 4';
  var resultF, resultG;

  before(function (done){
    var i = 0;
    opt.calcDerivatives(f, [1, 1, 1], function (results){
      resultF = results;
      if (++i === 2) {
        done();
      }
    });
    opt.calcDerivatives(g, [1, 1, 1], {
      variable: 'y',
    }, function (results){
      resultG = results;
      if (++i === 2) {
        done();
      }
    });
  });

  it('correctly calculates partial derivatives', function() {
    Math.round(resultF[0] * 100).should.equal(-119);
    Math.round(resultF[1] * 100).should.equal(-267);
    Math.round(resultF[2] * 100).should.equal(-200);
    Math.round(resultF[0] * 10000).should.equal(Math.round(resultG[0] * 10000));
    Math.round(resultF[1] * 10000).should.equal(Math.round(resultG[1] * 10000));
    Math.round(resultF[2] * 10000).should.equal(Math.round(resultG[2] * 10000));
  });
});