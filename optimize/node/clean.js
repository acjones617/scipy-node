var defaults = {
  bracket: null,
  bounds: null,
  method: 'brent',
  tol: null,
  options: null
};

var extendNoOverwrite = function (obj, defaults){
  for (key in defaults) {
    if (obj[key] === undefined) {
      obj[key] = defaults[key];
    }
  }
}

module.exports = {
  clean: function (options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    callback = callback || function (results){
      console.log(results);
    };

    options = options || {};

    extendNoOverwrite(options, defaults);
    return {
      options: options,
      callback: callback
    }
  }
}