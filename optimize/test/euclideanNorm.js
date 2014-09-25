var opt = require('../index');
var should = require('should');

describe('euclidean norm', function(){
  var result;
  var A =  [[1 , 2 , -3],
            [-4, 5 ,  6],
            [7 , -8, -9]];
  var b = [5, 3, -1];

  before(function (done){
    opt.minimizeEuclideanNorm(A, b, function (results){
      result = results;
      done();
    });
  });

  it('correctly finds non-negative x to minimize the Eucliean Norm of the function', function() {
    Math.round(result.solution[0] * 100).should.equal(475);
    Math.round(result.solution[1] * 100).should.equal(250);
    Math.round(result.solution[2] * 100).should.equal(158);
    Math.round(result.residual * 100).should.equal(0);
  });
});
