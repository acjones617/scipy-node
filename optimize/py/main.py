try:
    from scipy import optimize as o
except:
    print 'Unable to find scipy library. Make sure you have downloaded scipy. See http://www.scipy.org/install.html'

try:
    import numpy as np
except:
    print 'Unable to find numpy library. Make sure you have downloaded numpy. See http://www.numpy.org/'

def local_minimize(func, options):
    bracket = options['bracket']
    bounds  = options['bounds']
    method  = options['method']
    tol     = options['tol']
    options = options['options']

    try:
        return o.minimize_scalar(func, bracket=bracket, bounds=bounds, method=method, tol=tol, options=options)
    except Exception as e:
        return str(e)

def global_minimize(func, options):
    guess            = options['guess']
    iterations       = options['iterations']
    temperature      = options['temperature']
    stepsize         = options['stepSize']
    include_all_mins = options['includeAllMinsFound']
    interval         = options['interval']

    res = []

    # basinhopping function accepts a callback - passes each intermediate local minima found to callback
    if (include_all_mins):
        def cb(a, b, c):
            res.append([a[0], b, c])
    else:
        cb = None
    try:
        answer = o.basinhopping(func, x0=guess, niter=iterations, stepsize=stepsize, T=temperature, callback=cb, interval=interval)
        answer['x'] = answer['x'].tolist()
        if (include_all_mins):
            answer['allMins'] = res
        return answer
    except Exception as e:
        return str(e)

def find_root(func, options):
    lower  = options['lower']
    upper  = options['upper']
    method = options['method']

    if method not in ['brenth', 'ridder', 'bisect']:
        method = 'brentq'

    try:
        return getattr(o, method)(func, a=lower, b=upper)
    except Exception as e:
        return str(e)

def find_vector_root(func, options):
    guess = options['guess']

    try:
        answer = o.root(func, x0=guess)
        for attr in answer:
            if (type(answer[attr]).__module__ == 'numpy'):
                answer[attr] = answer[attr].tolist()
        return answer
    except Exception as e:
        return str(e)

def calc_derivative_values(func, options):
    point   = options['point']
    epsilon = options['epsilon']

    try:
        return o.approx_fprime(point, func, epsilon).tolist()
    except Exception as e:
        e = str(e)
        if e is 'a float is required':
            return 'argument passed to function that you want to calculate the derivate for must take an array. Even for a univariate function, it expects an array of length 1'
        if e is "object of type 'int' has no len()":
            return 'the point at which the derivative is calculated must be an array. Even for a univariate function, point expects an array of length 1'
        return str(e)


def curve_fit(func, options):
    xdata = options['xData']
    ydata = options['yData']
    try:
        (popt, pcov) = o.curve_fit(f=func, xdata=xdata, ydata=ydata)
        return {
            'paramValues'     : popt.tolist(),
            'paramCovariance' : pcov.tolist()
        }
    except Exception as e:
        return str(e)

def nnls(A, b):
    try:
        solution, residual = o.nnls(np.array(A), np.array(b))
        return {
            'solution': solution.tolist(),
            'residual': residual
        }
    except Exception as e:
        return str(e)
