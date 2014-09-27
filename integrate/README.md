# scipy-integrate NPM Module

## <a name='contents' href='#'/> Contents

[What is scipy's integrate package?](https://github.com/acjones617/scipy-node/tree/master/integrate#about)  
[Setup Process](https://github.com/acjones617/scipy-node/tree/master/integrate#setup)  
[API](https://github.com/acjones617/scipy-node/tree/master/integrate#use)  

------------------------------------------------------------------------------------------------------------

[The appropriate format for the "func" argument](https://github.com/acjones617/scipy-node/tree/master/integrate#func)  
[Compute a Definite Integral](https://github.com/acjones617/scipy-node/tree/master/integrate#single)  

------------------------------------------------------------------------------------------------------------

## <a name='about' href='#about'/>  What is scipy's integrate package?

Scipy is an extensively used, well-documented Python library for all your scientific needs. Integrate is a module of the library concerned with computing the integral of functions. This npm module is a node wrapper for which you can use JavaScript to access the power of the integrate module. It exists on the npm registry under the name "scipy-integrate". The code can be seen at my <a href='https://github.com/acjones617/scipy-node/tree/master/integrate'>scipy/integrate</a> github repo. A demo application is forthcoming.
    
    npm install scipy-integrate

Using the node.js command line interface, the underlying python engine is launched as a child process, with the results streamed to node. These results are divided into various variables based on the type of data they hold, and a user can gain access to all this raw analysis.

## <a name='setup' href='#setup'/> Setup Process

To utilize the Product-Recommender NPM module, the first step would be to make sure one has successfully installed node.js, npm, and a python version of >= 2.7.  To install these items, I would recommend you check out http://nodejs.org/download/ and https://www.python.org/download/.

In addition to these prerequisites, you will need to install scipy, numpy, and sympy. For installation instructions on scipy, please go to http://www.scipy.org/install.html. For installation instructions on sympy, please go to http://docs.sympy.org/dev/install.html. Some other python modules used in this project are argparse, ast, and json, though these should be included in the Python Standard Library so there is likely no need to download these.

## <a name='use' href='#use'/> API

To use my scipy-integrate algorithm, first install scipy-integrate:

    npm install scipy-integate

Then, require scipy-integrate in your js file. I'm going to use the variable 'integrate' to represent the module

    var integrate = require('scipy-integrate');

integrate is a function with some shortcut integration methods on it as well. 

<b>
The generalized function takes n-variables for a n-integration (e.g. univariate ==> single integral, two variables ==> double integral, etc.)
[integrate(func, ranges, options, callback)](https://github.com/acjones617/scipy-node/tree/master/integrate#multi)  

There is also a special-case method, integrate.univariate, to calculate the definite integral of a univariate function
[integrate.univariate(func, lower, upper, options, callback)](https://github.com/acjones617/scipy-node/tree/master/integrate#single)  
</b>

These functions require the user to pass in a "func" argument to integrate. Func requires a very specific format:

## <a name='func' href='#func'/> Appropriate format for "func"

Func represents the mathematical expression you want to integrate. It can be one of two things:

Func can be a function that takes a number of arguments. Make sure that the entire mathematical expression follows the "return" statement. For example, the following <b>IS</b> a valid function to pass to func:

    func = function (x, y){
      return Math.pow(x - 10, 4) * y + Math.log(Math.abs(x + 1)) - 10 * x;
    };
    // this is equivalent to f(x) = y * (x - 10)^4 + log(|x+1|) - 10 * x

However, the following is <b>NOT</b> a valid function to pass to func, both because it takes multiple arguments, and because it conducts relevant operations outside of the specific "return" statement:

    func = function (x, y){
      var res = x * y;
      res = Math.pow(res - 10, 4);
      return res;
    };

Again, for multivariate functions, func can take multiple arguments. For example:

    func = function(ind, param1, param2, param3) {
      return param1 * pow(ind, 2) + param2 * ind + param3;
    }

Func can also be a string representing the expression. You must specify the variables used in the "variables" section of the options object. Func could be:

    func = 'Math.pow(x - 10, 4) + Math.log(Math.abs(x + 1)) - 10 * x';

If we were to use a string to represent the expression for a multivariate function, we need to pass an array with the variable names to the "variables" property on the options object. For example:

    options = {
      variables: ['ind', 'param1', 'param2', 'param3']
    }

Your true range of possible operations is much greater than merely what is found in the JavaScript Math object. For example, while the JavaScript Math.log(x) by default is the natural logarithm, base e, you can compute the logarithm of any base with "log(x, base)." For example, log(x, 10) would be the logarithm of x, base 10. Please check the SymPy lambdify documentation for what it will take as an "expression" for more information.

For example, you could write func without the Math object entirely, like below:

    func = 'pow((x-10),4) - 5 * x + 3'
    // this is equivalent to f(x) = (x-10)^4 - 5x + 3


## <a name='multi' href='#multi'/> Compute the definite integral of a function

For example: 

    integrate(function (x, y, z){
      return Math.pow(x, 4) - Math.exp(2 * y - 5) - 2 * x * Math.log(Math.abs(z * 2) + 1) - 4;
    }, [[-1, 1], [2, 4], [-2, 0]], function(results) {
      console.log(results);
    });

    results = { 
      definiteIntegral : -69.83531496403245,
      absoluteError    : 7.753277460501856e-13
    }

integrate(func, range[, options[, callback]) takes up to four arguments:

#### func (required)

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/integrate#func)

Note that the order of arguments in your func, or your "variables" property is important. The integral will be evaluated from the inside out, and the order is the same as the order that we write our ranges. For example, if we had a func with the function signature: 

    func(x, y, z)
    range = [[-1, 1], [2, 4], [-2, 0]]

A triple definite integral would be evaluated, first with respect to x, from x = -1 to x = 1, then with respect to y, with y = 2 to y = 4, and finally with respect to z, from z = -2 to z = 0.

#### range (required)

The range we want to evaluate our definite integral over. This must be an array of two-element arrays. Even if we are evaluating a single integral, this would still need to be: [ [lower, upper] ]. As mentioned above, the first two-element array corresponds with the first variable specified in our function signature, and so on and so forth. -Infinity and Infinity are valid values to use in our range.

#### options (optional)

Here, you can customize how you want your minimization to run. 

Our options object looks for a single possible property:

    var options = {
      variables: ['x'] // can specify the variable names used in your func when you pass func in as a string. The order of variables specified will determine how the integral is evaluated, in the same way as mentioned above
    }

#### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: definiteIntegral and absoluteError. definiteIntegral is the computed value of the integral between the passed in lower and upper bounds. absoluteError is an estimate of the absolute error of the result. This could be higher if you use Infinity or -Infinity as one of or both of your bounds. 



## <a name='single' href='#single'/> Compute the definite integral of a univariate function

For example: 

    integrate.univariate(function(x) {
      return Math.pow(x-4, 4) - Math.pow(x, 3) + 10 * x - 1;
    }, -2, 2, function(results) {
      console.log(results);
    });
    
    results = { 
      definiteIntegral : 1544.8,
      absoluteError    : 1.7150725284409418e-11
    }

integrate.univariate(func, lower, upper[, options[, callback]) takes up to five arguments:

#### func (required)

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/integrate#func)

func will only take a single argument

#### lower (required)

Lower bound for the definite integral computation. -Infinity is a valid value.

#### upper (required)

Upper bound for the definite integral computation. Infinity is a valid value.

#### options (optional)

Here, you can customize how you want your minimization to run. 

Our options object looks for a single possible property:

    var options = {
      variable: 'x' // you must specify the variable name used in your func when you pass func in as a string.
    }

#### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: definiteIntegral and absoluteError. definiteIntegral is the computed value of the integral between the passed in lower and upper bounds. absoluteError is an estimate of the absolute error of the result. This will likely be higher if you use Infinity or -Infinity as one of or both of your bounds. 
