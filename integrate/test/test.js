var integrate = require('../index.js');

integrate(function(x) {
  return 1/Math.pow(x,2);
}, 1, Infinity);

    integrate(function(x) {
      return Math.pow(x-4, 4) - Math.pow(x, 3) + 10 * x - 1;
    }, -2, 2, function(results) {
      console.log(results);
    });


