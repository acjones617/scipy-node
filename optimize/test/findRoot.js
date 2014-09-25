var opt = require('../index');
var should = require('should');

describe('findRoot', function(){
  var resultF, resultG;
  var lower = 0;
  var upper = 4;

  var f = function(x) {
    return Math.pow(x-4, 4) - Math.pow(x, 3) + 10 * x - 1;
  };
  var g = '(a-4)**4 - a**3 + 10*a - 1';

  describe('find root via brentq method', function() {
    before(function (done){
      opt.findRoot(f, lower, upper, function (results){
        resultF = results;
        done();
      });
    });

    it('correctly finds a root of the function', function (){
      Math.round(resultF * 100).should.equal(314);
      Math.round(f(resultF) * 100).should.equal(0);
    });

  });

  describe('find root via other methods', function (){
    var bisect, ridder, brenth;
    var i = 0;

    before(function (done){
      opt.findRoot(f, lower, upper, {
        method: 'bisect',
      }, function (results){
        bisect = results;
        if (++i === 3) {
          done();
        }
      });
      opt.findRoot(f, lower, upper, {
        method: 'ridder',
      }, function (results){
        ridder = results;
        if (++i === 3) {
          done();
        }
      });
      opt.findRoot(f, lower, upper, {
        method: 'brenth',
      }, function (results){
        brenth = results;
        if (++i === 3) {
          done();
        }
      });

    });

    it('correctly finds a root of the function for all methods', function (){
      Math.round(bisect * 100).should.equal(314);
      Math.round(f(bisect) * 100).should.equal(0);
      Math.round(ridder * 100).should.equal(314);
      Math.round(f(ridder) * 100).should.equal(0);
      Math.round(brenth * 100).should.equal(314);
      Math.round(f(brenth) * 100).should.equal(0);
    });
  });

  describe('can find root with either string or function', function (){
    var i = 0;

    before(function (done){
      opt.findRoot(f, lower, upper, {
        method: 'bisect',
      }, function (results){
        resultF = results;
        if (++i === 2) {
          done();
        }
      });

      opt.findRoot(g, lower, upper, {
        variable: 'a'
      }, function (results){
        resultG = results;
        if (++i === 2) {
          done();
        }
      });
    });

    it ('finds the same root whether given a string or a function', function (){
      Math.round(resultF * 10000).should.equal(Math.round(resultG * 10000));
    })

  })
});
