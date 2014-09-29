# scipy-optimize NPM Module

## <a name='contents' href='#'/> Contents

[What is scipy's optimize package?](https://github.com/acjones617/scipy-node/tree/master/optimize#about)  
[Setup Process](https://github.com/acjones617/scipy-node/tree/master/optimize#setup)  
[API](https://github.com/acjones617/scipy-node/tree/master/optimize#use)  

------------------------------------------------------------------------------------------------------------

[The appropriate format for the "func" argument](https://github.com/acjones617/scipy-node/tree/master/optimize#func)  
[Find Minimum Value of a Mathematical Expression](https://github.com/acjones617/scipy-node/tree/master/optimize#min)  
[Find the Root of a Function](https://github.com/acjones617/scipy-node/tree/master/optimize#root)  
[Find the best-fit curve given data](https://github.com/acjones617/scipy-node/tree/master/optimize#fit)  
[Least Squares](https://github.com/acjones617/scipy-node/tree/master/optimize#nnls)  
[Calculate Partial Derivative Values at a Point](https://github.com/acjones617/scipy-node/tree/master/optimize#derive)  

------------------------------------------------------------------------------------------------------------

[Testing](https://github.com/acjones617/scipy-node/tree/master/optimize#testing)  

## <a name='about' href='#about'/>  What is scipy's optimize package?

Scipy is an extensively used, well-documented Python library for all your scientific needs. Optimize is a module of the library concerned with optimization of functions. This npm module is a node wrapper for which you can use JavaScript to access the power of the optimize module. It exists on the npm registry under the name "scipy-optimize". The code can be seen at my <a href='https://github.com/acjones617/scipy-node/tree/master/optimize'>scipy/optimize</a> github repo. A demo application is forthcoming.
    
    npm install scipy-optimize

Using the node.js command line interface, the underlying python engine is launched as a child process, with the results streamed to node. These results are divided into various variables based on the type of data they hold, and a user can gain access to all this raw analysis.

## <a name='setup' href='#setup'/> Setup Process

To utilize the Product-Recommender NPM module, the first step would be to make sure one has successfully installed node.js, npm, and a python version of >= 2.7.  To install these items, I would recommend you check out http://nodejs.org/download/ and https://www.python.org/download/.

In addition to these prerequisites, you will need to install scipy and sympy. For installation instructions on scipy, please go to http://www.scipy.org/install.html. For installation instructions on sympy, please go to http://docs.sympy.org/dev/install.html. Some other python modules used in this project are argparse, ast, and json, though these should be included in the Python Standard Library so there is likely no need to download these.

## <a name='use' href='#use'/> API

To use my scipy-optimize algorithm, first install scipy-optimize:

    npm install --save scipy-optimize

Then, require scipy-optimize in your js file. I'm going to use the variable 'opt' to represent the module

    var opt = require('scipy-optimize');

opt is an object with many of the SciPy Optimization methods (and the rest to hopefully soon follow). Currently, the methods on opt are:

<b>
[opt.localMinimize(func, options, callback) and opt.globalMinimize(func, options, callback)](https://github.com/acjones617/scipy-node/tree/master/optimize#min)  

[opt.findRoot(func, lower, upper, options, callback)](https://github.com/acjones617/scipy-node/tree/master/optimize#root)  

[opt.fitCurve.linear(xData, yData, callback), opt.fitCurve.quadratic(xData, yData, callback), and opt.fitCurve(func, xData, yData, options, callback)](https://github.com/acjones617/scipy-node/tree/master/optimize#fit)  

[opt.minimizeEuclideanNorm(A, b, callback)](https://github.com/acjones617/scipy-node/tree/master/optimize#nnls)

[opt.calcDerivatives(func, point, options, callback)](https://github.com/acjones617/scipy-node/tree/master/optimize#derive)
</b>

Many of these require the user to pass in a "func" argument to optimize. Func requires a very specific format:

## <a name='func' href='#func'/> Appropriate format for "func"

Func represents the mathematical expression you want to optimize. It can be one of two things:

For all but fitCurve, func can be a function that takes a single argument. Make sure that the entire mathematical expression follows the "return" statement. For example, the following <b>IS</b> a valid function to pass to func:

    func = function (x){
      return Math.pow(x - 10, 4) + Math.log(Math.abs(x + 1)) - 10 * x;
    };
    // this is equivalent to f(x) = (x - 10)^4 + log(|x+1|) - 10 * x
    // minimizes to around -107.66 when x is around 11.35

However, the following is <b>NOT</b> a valid function to pass to func, both because it takes multiple arguments, and because it conducts relevant operations outside of the specific "return" statement:

    func = function (x, y){
      var res = x * y;
      res = Math.pow(res - 10, 4);
      return res;
    };

For fitCurve, func can take multiple arguments. The first argument must be the independent variable, and the following arguments will be the parameters we are trying to fit. For example:

    func = function(ind, param1, param2, param3) {
      return param1 * pow(ind, 2) + param2 * ind + param3;
    }

Func can also be a string representing the expression. You must use "x" as the independent variable, unless otherwise specified in the options object. Func could be:

    func = 'Math.pow(x - 10, 4) + Math.log(Math.abs(x + 1)) - 10 * x';

If we were to use a different independent variable, we would need to pass that information through the options argument, on the "variable" property. For example, if were to use "ind" as the independent variable, our options argument would at least need to be:

    options = {
      variable: 'ind'
    }

If we were to use a string to represent the expression for fitCurve, we need to pass an array with the variable names to the "variables" property on the options object. The first variable would be the independent variable, and the remaining would be the parameters. For example:

    options = {
      variables: ['ind', 'param1', 'param2', 'param3']
    }

Your true range of possible operations is much greater than merely what is found in the JavaScript Math object. For example, while the JavaScript Math.log(x) by default is the natural logarithm, base e, you can compute the logarithm of any base with "log(x, base)." For example, log(x, 10) would be the logarithm of x, base 10. Please check the SymPy lambdify documentation for what it will take as an "expression" for more information.

For example, you could write func without the Math. object entirely, like below:

    func = 'pow((x-10),4) - 5 * x + 3'
    // this is equivalent to f(x) = (x-10)^4 - 5x + 3
    // minimizes to around -51.04 when x is around 11.07


## <a name='min' href='#min'/> Find Minimum Value of a Univariate Mathematical Expression

Two functions are available: opt.localMinimize(func[, options[, callback]]) and opt.globalMinimize(func[, options[, callback]]), in case your expression may have many local minima and you want to ensure that you're finding the global minimum. Example:

    opt.localMinimize(function(x) {
      return Math.pow(x-4, 4) - Math.pow(x, 3) + 10 * x - 1;
    }, {
      bounds: [-10, 10]
    }, function(results) {
      console.log(results);
    });
    
    results = {
      status  : 0, 
      nfev    : 15, 
      success : true, 
      fun     : -198.63648235818988, 
      x       : 7.3684735542053241, 
      message : "Solution found."
    }

Both opt.localMinimize and opt.globalMinimize take up to three arguments: 

#### func (required)

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/optimize#func)

#### options (optional)

Here, you can customize how you want your minimization to run. 

When calling opt.localMinimization, our options object can take two properties:

    var options = {
      bounds:   [5, 10] // can specify a two-element array corresponding to the optimization bounds. If we wanted to find the min point between x = 5 and x = 10, we would set bounds: [5, 10].
      variable: 'y' // can specify the variable name used in your func when you pass func in as a string. You must specify this variable name if you are using something other than "x"
    }

When calling opt.globalMinimization, our options object can take seven properties:

    var options = {
      guess:               0 // can specify an initial guess for x to minimize our expression. Default is 0.
      iterations:          100 // can specify the number of iterations we want the algorithm to run. This is the number of different local minima the algorithm will find before deciding on the global minimum. Default is 100.
      temperature:         1.0 // Defines the accept or reject criterion. Higher "temperatures" mean that larger jumps in function value will be accepted. For best results, temperature should be comparable to the separation (in function value) between local minima. Default is 1.0.
      stepSize:            0.5 // Initial step size for use in the random displacement. Default is 0.5.
      includeAllMinsFound: false // Whether or not all local minima will be included in the passed back results array. Default is false.
      variable:            'y' // can specify the variable name used in your func when you pass func in as a string. You must specify this variable name if you are using something other than "x"
    }

#### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: fun and x. "x" is the value of x which minimizes the function. "fun" is the value of the function at that value of x (the minimum value of the function). 

For the opt.globalMinimization function, if you specified "true" for includeAllMinsFound in the options object, the results object contains the array of all local minima found in an additional property named "allMins".


## <a name='root' href='#root'/> Find the Root of a Function (such that f(x) = 0)

Using opt.findRoot, you have access to four different methods of finding the root of a function within a given interval, such that f(x) = 0. Example:

    opt.findRoot(function(x) {
      return Math.pow(x-4, 4) - Math.pow(x, 3) + 10 * x - 1;
    }, 0, 4, {
      method: 'brentq'
    }, function(results) {
      console.log(results);
    });
    
    results = 3.1394513707104594;

opt.findRoot(func, lower, upper [, options [, callback]]) takes up to five arguments:

#### func (required):

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/optimize#func)

#### lower (required):

The lower bound value of x to search for a root.

#### upper (required):

The upper bound value of x to search for a root. <b>IMPORTANT:</b> If f(x) is the function we are searching for a root for, f(lower) and f(upper) must evaluate to opposite signs, even if there would have been a root in between them anwyay. In other words, if f(lower) > 0, then f(upper) must be < 0.

#### options (optional):

The options object can take up to two properties:

    var options = {
      method:    'brentq' // can specify the method you want scipy to run to find the root. If there are multiple roots between the specified intervals, different methods may find different roots. Valid methods are "brentq", "brenth", "ridder", or "bisect". Default is "brentq". See Root Finding -> Scalar Functions at http://docs.scipy.org/doc/scipy/reference/optimize.html for more details.
      variable:  'y' // can specify the variable name used in your func when you pass func in as a string. You must specify this variable name if you are using something other than "x"
    }

#### callback (optional):

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results is a value of x found such that f(x) = 0.


## <a name='fit' href='#fit'/> Find the best-fit curve to fit a given dataset

opt.fitCurve uses non-linear least squares to fit a function, f, to given data. 

There are two shortcut methods on the opt.fitCurve object that can be used: linear and quadratic, that just require the yData and xData. Example:

    opt.fitCurve.linear([1, 2, 3, 4], [10, 3, 0, 2], function(results) {
      console.log(results);
    })

    results = {
      paramValues: [-2.7, 10.5],
      paramCovariance: [[2.0   , -5.075], 
                        [-5.075, 15.225]]
    }
    // i.e. the best fit line is y = -2.7x + 10.5

    opt.fitCurve.quadratic([1, 2, 3, 4], [10, 3, 0, 2], function(results) {
      console.log(results);
    })
    results = {
      paramValues: [2.25, -13.95, 21.75],
      paramCovariance: [[0.0125 , -0.00625, 0.0625], 
                        [-0.0625, 0.3225 , -0.3375], 
                        [0.0625 , -0.4475, 0.3875]]
    }
    // i.e. the best fit curve is y = 2.25x^2 - 13.95x + 21.75

#### opt.fitCurve.linear(xData, yData[, callback]) and opt.fitCurve.quadratic(xData, yData[, callback]):

Fit data to either the linear function, y = ax + b, or the quadratic function, y = ax^2 + bx + c, where the data is represented by arrays xData and yData. fitCurve.linear and fitCurve.quadratic take three arguments:

#### xData and yData:

xData is an array of the data representing "x", while yData is an array of the data representing "y". For example, if we had four data points, "(1, 3), (2, 5), (3, 4), (4, 8)", then we would want to pass in:

    xData = [1, 2, 3, 4];
    yData = [3, 5, 4, 8];

#### callback (optional)

The results of fitCurve.linear will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: the values of the parameters, paramValues and the covariance matrix, paramCovariance. For example, if we called the below, passing in xData and yData defined above:

    opt.fitCurve.linear(xData, yData);

The results object would be:

    results = {
      paramValues:     [1.4, 1.5],
      paramCovariance: [[0.42, -1.05],
                        [-1.05, 3.15]]
    }

Where a = 1.4 and b = 1.5. The elements of the paramValues array and paramCovariance matrix are always going to be listed in the order in which they are presented in your function (for the generalized fitCurve below), or in alphabetical order for fitCurve.linear and fitCurve.quadratic. The diagonal of the covariance matrix represent the variance of the parameters. Therefore, in the above example, the one standard deviation error for "a" is sqrt(0.42) = 0.65, and for "b" is sqrt(3.15) = 1.77.

The results object for opt.fitCurve.quadratic(xData, yData), on the same xData and yData, would be:

    results = {
      paramValues: [0.5, -1.1, 4.0],
      paramCovariance: [[0.8,  -4.0,  4.0],
                        [-4.0, 20.6,  -21.6],
                        [4.0,  -21.6, 24.8]]
    }

Where a = 0.5, b = -1.1 and c = 4.0

You can also provide any custom univariate function to fit the curve to via opt.fitCurve. Example:

    opt.fitCurve(function(x, a, b) {
      return a * x + b;
    }, [1, 2, 3, 4], [10, 3, 0, 2], function(results) {
      console.log(results);
    })

    results = {
      paramValues: [-2.7, 10.5],
      paramCovariance: [[2.0   , -5.075], 
                        [-5.075, 15.225]]
    }
    // i.e. the best fit line is y = -2.7x + 10.5

#### opt.fitCurve(func, xData, yData[, options[, callback) takes two more arguments in addition to what opt.fitCurve.linear and opt.fitCurve.quadratic took:

#### func:

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/optimize#func) Pay special attention to the additional details for fitCurve.

In our results object, the order of the parameters will be the same as the order of the parameters defined when we defined func as a function, or as the order of the parameters in the "variables" property of the options object if we defined func as a string.

#### options:

The only option our options object takes is a variables array, in the case that our provided func is a string. Remember to pass in variable names as strings to the array.

## <a name='nnls' href='#nnls'/> minimizeEuclideanNorm

Minimize the Euclidean norm of Ax - b for x >= 0 (non-negative) where A is a matrix, and b is a vector. For example:

    opt.minimizeEuclideanNorm(
    [[1 , 2 , -3],
     [-4, 5 ,  6],
     [7 , -8, -9]],
    [5, 3, -1], function(results) {
      console.log(results);
    });

    results = {
      solution: [4.75, 2.5, 1.583333], 
      residual: 0.0
    }

opt.minimizeEuclideanNorm(A, b, callback) takes three arguments:

#### A:

A is a matrix, represented in JavaScript as a two-dimensional array. For example:

    A = [[1, 2, 3],
         [4, 5, 6],
         [7, 8, 9]];

The above A would represent a 3x3 matrix

#### b:

b is a vector of response variables, represented in JavaScript as a one-dimesional array. For example:

    b = [-5, -3, -1];

The above b would represent a 3x1 vector.

Note that the number of rows of A (A.length) must exactly equal the length of the b-vector (b.length). The solution, x, will be a column-vector of length equal to the number of columns of A (A[0].length).

#### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object contains two important pieces of data: solution and residual.

solution is an n-length solution vector equal to x that minimizes the Euclidean norm of Ax - b (for x >= 0), where n is the number of columns of A, or A[0].length.

residual is the minimum value found for the Euclidean norm of Ax - b, with x = solution.


## <a name='derive' href='#derive'/> Calculate Partial Derivate Values at a Point

Using opt.calcDerivatives, you can find the partial derivative values at any point, x = [a, b, c...], for f(x). Example:

    opt.calcDerivatives(function(x) {
      return Math.pow(x[0],2) * x[1] * 2 - Math.exp(x[0]) * Math.log(x[1]);
    }, [1, 1]);

    results = [ 4.002, -0.717];

The above is equivalent to calculating the partial derivative values of df/dx and df/dy for x = 1 and y = 1, where f(x, y) = x^2 * y * 2 - e^x * log(y)

opt.calcDerivatives(func, point[, options[, callback]]) takes up to four arguments:

#### func (required):

See above for details on how to [format func](https://github.com/acjones617/scipy-node/tree/master/optimize#func)

An additional note is that the argument that func takes must be an array. Even if you were trying to calculate the derivates of a univariate function, say, f(x) = x^3, the appropriate func to pass in would be either:

    func = function(x) {
      return Math.pow(x[0], 3);
    }

    or

    func = 'x[0]**3'

Notice that to access the value of our univariate function, we must still access the 0th element of the expected array argument, x.

#### point (required):

The values of the multivariate function at which we are trying to calculate the derivative for. The function expects an array of values. Even if we are calculating a univariate function, we need to pass in an array with length 1.

#### options (optional):

Our options object can take two properties: epsilon and the variable name if func is a string. Forward finite-difference approximation is used to approximate the gradient of the scalar function. Epsilon is the increment to x used to determine the function gradient. This can be either a scalar, in which case the same epsilon will be applied to all variables, or an array of length equal to the number of variables. The default value for epsilon is 10^-6. Small values are recommended for increased accuracy. Epsilon must be nonzero.

    options = {
      epsilon: [0.000001, 0.001]
    }

#### callback (optional)

The results of the minimization will be passed to a provided callback function. The default is:

    var callback = function (results){
      console.log(results)
    }

The passed-in results object is an array with the partial derivative values.


## <a name='Testing' href='#testing'/> Testing

I have written some simple tests in the test folder. If you clone the github repo and install the dev dependencies, you can run the test via "npm test". Please update the tests if you make substantial pull requests to other parts of the code.

