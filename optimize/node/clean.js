var parse = require('./parse');

var globalDefaults = {
  guess:               0,
  iterations:          100,
  temperature:         1.0,
  stepSize:            0.5,
  includeAllMinsFound: false,
  interval:            50
};

var extendNoOverwrite = function (obj, defaults){
  for (key in defaults) {
    if (obj[key] === undefined) {
      obj[key] = defaults[key];
    }
  }
}

var optionalArgs = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  // provide default callback function (console.log)
  callback = cleanInputs.cleanCB(callback);

  options = options || {};

  return {
    callback: callback,
    options: options
  };
};

var cleanInputs = module.exports = {
  cleanMin: function (operation, func, options, callback) {
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;

    // clean provided function to be accepted by sympy lambdify function
    func = parse.cleanFunc(func, options.variable, false).func;
    // provide sensible defaults for the options object
    if (operation === 'local') {
      options = {
        bracket: null,
        method: 'Brent',
        bounds: options.bounds,
        tol: null,
        options: null
      }

      if (Array.isArray(options.bounds) && options.bounds.length === 2) {
        options.method = 'Bounded';
      } else {
        options.bounds = null;
        options.method = 'Brent';
      }
    } else if (operation === 'global') {
      extendNoOverwrite(options, globalDefaults);
    }

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanFit: function(func, options, callback, xData, yData) {
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;

    options.xData = xData;
    options.yData = yData;

    f = parse.cleanFunc(func, options.variables, true);
    options.numArgs = f.numArgs;
    func = f.func;

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanRoot: function(func, options, callback, lower, upper) {
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;

    options.lower = lower;
    options.upper = upper;
    options.method = options.method || 'brentq'

    func = parse.cleanFunc(func, options.variable, false).func;

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanVector: function(func, options, callback, guess) {
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;

    options.guess = guess;

    func = parse.cleanFunc(func, options.variable, false).func;

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanDerivative: function(func, options, callback, point) {
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;

    options.point = point;
    options.epsilon = options.epsilon || Math.pow(10, -9);

    func = parse.cleanFunc(func, options.variable, false).func;
    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanCB: function (callback){
    return callback || function (results){
      console.log(results);
    };
  }
}