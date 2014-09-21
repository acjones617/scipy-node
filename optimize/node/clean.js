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

var extractFunc = function (func) {
  // if function given is a function,
  // extract the argument name, extract the return value,
  // replace the argument name with 'x'
  // return the return value as a string, with x as the independent variable
  func = func.toString();
  var arg = func.match(/^function\s*[^\(]*\(\s*([^\)\,]*)[\,\)]/m)[1];
  var regex = new RegExp('\\b' + arg + '\\b', 'g')
  func = func.replace(regex, 'x');
  func = func.match(/return\s*([^\;}]*)[\;}]/m)[1];
  // func = func.replace(/Math./g, '');
  return func;
}

var cleanFunc = function (func, newVarName){
  if (typeof func === 'function') {
    func = extractFunc(func);
  } else if (typeof func === 'string') {
    if (newVarName && typeof newVarName === 'string') {
      var regex = new RegExp('\\b' + newVarName + '\\b', 'g');
      func = func.replace(regex, 'x');
    }
  } else {
    throw 'function to be optimized needs to be a function or a string expression';
  }

  func = func.replace(/Math./gi,'');
  func = func.replace(/LN2/gi, 'ln(2)');
  func = func.replace(/LN10/gi, 'ln(10)');
  func = func.replace(/LOG2E/gi, 'log(e,2)');
  func = func.replace(/LOG10E/gi, 'log(e,10)');
  func = func.replace(/SQRT1_2/gi, 'sqrt(1/2)');
  func = func.replace(/SQRT2/gi, 'sqrt(2)');
  func = func.toLowerCase();

  return func;
}

module.exports = {
  cleanMin: function (operation, func, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    // provide default callback function (console.log)
    callback = this.cleanCB(callback);

    options = options || {};

    // clean provided function to be accepted by sympy lambdify function
    func = cleanFunc(func, options.variable);

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

  cleanCB: function(callback) {
    return callback || function (results){
      console.log(results);
    };
  }
}