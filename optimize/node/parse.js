var Parser = module.exports = {};

Parser.extractFromFunction = function (func, multipleParams) {
  // if function given is a function,
  // extract the argument name, extract the return value,
  // replace the argument name with 'x'
  // return the return value as a string, with x as the independent variable
  func = func.toString();
  var args;
  if (!multipleParams) {
    var arg = func.match(/^function\s*[^\(]*\(\s*([^\)\,]*)[\,\)]/m)[1];
    var regex = new RegExp('\\b' + arg.trim() + '\\b', 'g')
    func = func.replace(regex, 'x');
  } else {
    // args are going to be f(x, a, b, c...) - x is independent variable, a, b... are parameters
    args = func.match(/^function\s*[^\(]*\(\s*([^\)]*)[\)]/m)[1];
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
  args = args || {};
  return {
    func   : func, 
    numArgs: args.length
  }
};

Parser.extractFromString = function (func, newVarName, multipleParams) {
  if (newVarName && typeof newVarName === 'string' && !multipleParams) {
    var regex = new RegExp('\\b' + newVarName + '\\b', 'g');
    func = func.replace(regex, 'x');
    return {
      func: func,
      numArgs: 1
    };
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
    return {
      func: func,
      numArgs: numArgs
    }
  }
}

Parser.cleanFunc = function (func, newVarName, multipleParams){
  var f;
  if (typeof func === 'function') {
    f = Parser.extractFromFunction(func, multipleParams);
  } else if (typeof func === 'string') {
    f = Parser.extractFromString(func, newVarName, multipleParams);
  } else {
    throw 'function to be optimized needs to be a function or a string expression';
  }
  func = f.func;
  var numArgs = f.numArgs;

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