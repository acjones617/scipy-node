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

var extractFunc = function (func, multipleParams) {
  // if function given is a function,
  // extract the argument name, extract the return value,
  // replace the argument name with 'x'
  // return the return value as a string, with x as the independent variable
  func = func.toString();
  if (!multipleParams) {
    var arg = func.match(/^function\s*[^\(]*\(\s*([^\)\,]*)[\,\)]/m)[1];
    var regex = new RegExp('\\b' + arg.trim() + '\\b', 'g')
    func = func.replace(regex, 'x');
  } else {
    // args are going to be f(x, a, b, c...) - x is independent variable, a, b... are parameters
    var args = func.match(/^function\s*[^\(]*\(\s*([^\)]*)[\)]/m)[1];
    args = args.split(',');
    var ch = 'a';
    for (var i = 0; i < args.length; i++) {
      var regex = new RegExp('\\b' + args[i].trim() + '\\b', 'g');
      if (i === 0) {
        func = func.replace(regex, 'x');
      } else {
        func = func.replace(regex, ch);
        ch = String.fromCharCode(ch.charCodeAt(0) + 1);
      }
    }
  }
  func = func.match(/return\s*([^\;}]*)[\;}]/m)[1];
  return {
    func   : func, 
    numArgs: args.length
  }
}

var cleanFunc = function (func, newVarName, multipleParams){
  var numArgs;
  if (typeof func === 'function') {
    f = extractFunc(func, multipleParams);
    func = f.func;
    numArgs = f.numArgs;
  } else if (typeof func === 'string') {
    if (newVarName && typeof newVarName === 'string' && !multipleParams) {
      var regex = new RegExp('\\b' + newVarName + '\\b', 'g');
      func = func.replace(regex, 'x');
    } else if (newVarName && typeof newVarName === 'object' && multipleParams) {
      numArgs = newVarName.length;
      var ch = 'a';
      for (var i = 0; i < newVarName.length; i++) {
        var regex = new RegExp('\\b' + newVarName[i] + '\\b', 'g');
        if (i === 0) {
          func = func.replace(regex, 'x');
        } else {
          func = func.replace(regex, ch);
          ch = String.fromCharCode(ch.charCodeAt(0) + 1);
        }
      }
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

  return {
    func   : func,
    numArgs: numArgs
  };
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
    func = cleanFunc(func, options.variable, false).func;

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
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    // provide default callback function (console.log)
    callback = this.cleanCB(callback);

    options = options || {};
    options.xData = xData;
    options.yData = yData;

    f = cleanFunc(func, options.variables, true);
    options.numArgs = f.numArgs;
    func = f.func;

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  },

  cleanRoot: function(func, options, callback, lower, upper) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    callback = this.cleanCB(callback);

    options = options || {};
    options.lower = lower;
    options.upper = upper;
    options.method = options.method || 'brentq'

    func = cleanFunc(func, options.variable, false).func;

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