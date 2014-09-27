var parse = require('./parse');

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
  cleanSingle: function (func, options, callback, lower, upper){
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;
    func = parse.cleanFunc(func, options.variable, false).func;

    options.lower = parse.parseNum(lower);
    options.upper = parse.parseNum(upper);

    return {
      func    : func,
      options : options,
      callback: callback
    };
  },

  cleanMulti: function (func, options, callback, range){
    var optional = optionalArgs(options, callback);
    options  = optional.options;
    callback = optional.callback;
    
    f = parse.cleanFunc(func, options.variables, true);
    options.numArgs = f.numArgs;
    func = f.func;

    options.range = parse.parseRange(range);

    return {
      func    : func,
      options : options,
      callback: callback
    };
  },

  cleanCB: function(cb) {
    return cb || function (results){
      console.log(results);
    };
  }
}
