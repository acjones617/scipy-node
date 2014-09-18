# scipy-optimize NPM Module

## <a name='contents' href='#'/> Contents

[What is scipy's optimize package?](#about)  
[Setup Process](#setup)
[API](#use)

## <a name='about' href='#'/>  What is scipy's optimize package?

Scipy is an extensively used, well-documented Python library for all your scientific needs. Optimize is a module of the library concerned with optimization of functions. This is a node wrapper for which you can use JavaScript to access the power of the optimize module. It exists on the npm registry under the name "scipy-optimize". The code can be seen at my <a href='https://github.com/acjones617/scipy/optimize'>scipy/optimize</a> github repo. A demo application is forthcoming.
    
    npm install --save scipy-optimize

Using the node.js command line interface, the underlying python engine is launched as a child process, with the results streamed to node. These results are divided into various variables based on the type of data they hold, and a user can gain access to all this raw analysis.

## <a name='setup' href='#'/> Setup Process

To utilize the Product-Recommender NPM module, the first step would be to make sure one has successfully installed node.js, npm, and a python version of >= 2.7.  To install these items, I would recommend you check out http://nodejs.org/download/ and https://www.python.org/download/.

In addition to these prerequisites, you will need to install scipy and sympy. For installation instructions on scipy, please go to http://www.scipy.org/install.html. For installation instructions on sympy, please go to http://docs.sympy.org/dev/install.html. Some other python modules used in this project are argparse, ast, and json, though these should be included in the Python Standard Library so there is likely no need to download these.

## <a name='use' href='#'/> API

To use my scipy-optimize algorithm, first install k-means:

    npm install --save scipy-optimize

Then, require scipy-optimize in your js file. I'm going to use the variable 'opt' to represent the module

    var opt = require('scipy-optimize');

opt is an object with many of the SciPy Optimization methods (and the rest to hopefully soon follow). Currently, the methods on opt are:

## minimize

opt.minimize(func, options, callback) takes three arguments: 

### func (required)

This should be a string representing the mathematical function we are interested in finding the min point. You must use "x" as the independent variable, unless otherwise specified in the options object. Currently, this library only supports scalar, univariate functions. When writing the function, you can use any normal JavaScript operators, such as your typical +, -, *, and /. You can use any of the methods or properties in the JavaScript "Math" object - abs, exp, log, sin, etc. You do not need to include the "Math." part of the expression when adding it to your function. Your true range of possible operations is much greater. For example, while the JavaScript Math.log(x) by default is the natural logarithm, base e, you can compute the logarithm of any base with "log(x, base)." For example, log(x, 10) would be the logarithm of x, base 10. Please check the SymPy lambdify documentation for what it will take as an "expression" for more information.

Example:

    func = 'pow((x-10),4) - 5 * x + 3'
    // this is equivalent to f(x) = (x-10)^4 - 5x + 3
    // minimizes to around -51.04 when x is around 11.07

Additionally, you can input a function as the "func" argument, but it needs to adhere to some strict constraints. It must be of the type:

    var func = function(x) {
      return Math.pow((x-10), 4) - (5 * x) + 3;
    }

Passing in either of the above two examples - func as a string and func as a function, will lead to an identical result. You must still use x as the variable name, unless otherwise specified in the options object. You must keep the entirety of your mathematical function expression next to your "return" statement. i.e. the following example would <b>not</b> work:

    var func = function(x) {
      var temp = 5 * x;
      return Math.pow((x-10), 4) - temp + 3;
    }


### options (optional)

Here, you can customize how you want your minimization to run. Our options object can take two properties:

    var options = {
      bounds: [5, 10] // can specify a two-element array corresponding to the optimization bounds. If we wanted to find the min point between x = 5 and x = 10, we would set bounds: [5, 10].
      variable: 'y' // can specify the variable name used in your func, as a string. You must specify this variable name if you are using something other than "x"
    }

### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: fun and x.

x is the value of x which minimizes the function. fun is the value of the function at that value of x (the minimum value of the function)