# scipy-optimize NPM Module

## <a name='contents' href='#'/> Contents

[What is scipy's optimize package?](https://github.com/acjones617/scipy-node/tree/master/optimize#about)  
[Setup Process](https://github.com/acjones617/scipy-node/tree/master/optimize#setup)  
[API](https://github.com/acjones617/scipy-node/tree/master/optimize#use)  
[Find Minimum Value of a Mathematical Expression](https://github.com/acjones617/scipy-node/tree/master/optimize#min)  
[Least Squares](https://github.com/acjones617/scipy-node/tree/master/optimize#nnls)  

## <a name='about' href='#about'/>  What is scipy's optimize package?

Scipy is an extensively used, well-documented Python library for all your scientific needs. Optimize is a module of the library concerned with optimization of functions. This is a node wrapper for which you can use JavaScript to access the power of the optimize module. It exists on the npm registry under the name "scipy-optimize". The code can be seen at my <a href='https://github.com/acjones617/scipy/optimize'>scipy/optimize</a> github repo. A demo application is forthcoming.
    
    npm install --save scipy-optimize

Using the node.js command line interface, the underlying python engine is launched as a child process, with the results streamed to node. These results are divided into various variables based on the type of data they hold, and a user can gain access to all this raw analysis.

## <a name='setup' href='#setup'/> Setup Process

To utilize the Product-Recommender NPM module, the first step would be to make sure one has successfully installed node.js, npm, and a python version of >= 2.7.  To install these items, I would recommend you check out http://nodejs.org/download/ and https://www.python.org/download/.

In addition to these prerequisites, you will need to install scipy and sympy. For installation instructions on scipy, please go to http://www.scipy.org/install.html. For installation instructions on sympy, please go to http://docs.sympy.org/dev/install.html. Some other python modules used in this project are argparse, ast, and json, though these should be included in the Python Standard Library so there is likely no need to download these.

## <a name='use' href='#use'/> API

To use my scipy-optimize algorithm, first install k-means:

    npm install --save scipy-optimize

Then, require scipy-optimize in your js file. I'm going to use the variable 'opt' to represent the module

    var opt = require('scipy-optimize');

opt is an object with many of the SciPy Optimization methods (and the rest to hopefully soon follow). Currently, the methods on opt are:

## <a name='min' href='#min'/> Find Minimum Value of a Univariate Mathematical Expression

Two functions are available: opt.localMinimize(func, options, callback) and opt.globalMinimize(func, options, callback), in case your expression may have many local minima and you want to ensure that you're finding the global minimum.

Both opt.localMinimize(func, options, callback) and opt.globalMinimize(func, options, callback) take three arguments: 

#### func (required)

Func represents the mathematical expression you want to optimize. It can be one of two things:

Func can be a function that takes a single argument. Make sure that the entire mathematical expression follows the "return" statement. For example, the following <b>IS</b> a valid function to pass to func:

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

Func can also be a string representing the expression. You must use "x" as the independent variable, unless otherwise specified in the options object (see below). Func could be:

    func = 'Math.pow(x - 10, 4) + Math.log(Math.abs(x + 1)) - 10 * x';

Your true range of possible operations is much greater than merely what is found in the JavaScript Math object. For example, while the JavaScript Math.log(x) by default is the natural logarithm, base e, you can compute the logarithm of any base with "log(x, base)." For example, log(x, 10) would be the logarithm of x, base 10. Please check the SymPy lambdify documentation for what it will take as an "expression" for more information.

For example, you could write func without the Math. object entirely, like below:

    func = 'pow((x-10),4) - 5 * x + 3'
    // this is equivalent to f(x) = (x-10)^4 - 5x + 3
    // minimizes to around -51.04 when x is around 11.07

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

## <a name='nnls' href='#nnls'/> nonNegLeastSquares

Minimize the Euclidean norm of Ax - b for x >= 0 where A is a matrix, and b is a vector

opt.nonNegLeastSquares(A, b) takes three arguments:

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