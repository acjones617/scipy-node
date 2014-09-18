var defaults = {
  bracket: null,
  bounds: null,
  method: 'Brent',
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

var extractFunc = function (func) {
  func = func.toString();
  func = func.match(/return[\s\S]*}/)[0];
  func = func.replace(/return/, '');
  func = func.replace(/[{};\n\r]/g, '');
  return func;
}

var cleanFunc = function (func, newVarName){
  if (typeof func === 'function') {
    func = extractFunc(func);
  }

  if (newVarName && typeof newVarName === 'string') {
    var regex = new RegExp('\\b' + newVarName + '\\b', 'g');
    func = func.replace(regex, 'x');
  }

  func = func.toLowerCase();
  func = func.replace(/Math./g,'');
  func = func.replace(/LN2/g, 'ln(2)');
  func = func.replace(/LN10/g, 'ln(10)');
  func = func.replace(/LOG2E/g, 'log(e,2)');
  func = func.replace(/LOG10E/g, 'log(e,10)');
  func = func.replace(/SQRT1_2/g, 'sqrt(1/2)');
  func = func.replace(/SQRT2/g, 'sqrt(2)');


  return func;
}

module.exports = {
  clean: function (func, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    callback = callback || function (results){
      console.log(results);
    };

    options = options || {};

    func = cleanFunc(func, options.variable);
  console.log(func);

    options = {
      bracket: null,
      method: 'Brent',
      bounds: options.bounds,
      tol: null,
      options: null
    }

    // extendNoOverwrite(options, defaults);

    if (Array.isArray(options.bounds) && options.bounds.length === 2) {
      options.method = 'Bounded';
    } else {
      options.bounds = null;
      options.method = 'Brent';
    }

    return {
      func:     func,
      options:  options,
      callback: callback
    }
  }
}