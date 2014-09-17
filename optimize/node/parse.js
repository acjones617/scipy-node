module.exports = Parser = {};

Parser.parseJS = function (func){
  // return string that can be executed by python 'exec()'
  funcStr = func.toString();
  return funcStr.match(/{[\s\S]*}/)[0].replace(/[{};\n]/g,'').replace(/return/, '');
}

Parser.parsePython = function (func){
  // return string that can be executed by python 'exec()'
  funcStr = func.toString();
  return funcStr.match(/{.*}/)[0].replace(/[{}]/g,'').replace(/return/, '');
}
