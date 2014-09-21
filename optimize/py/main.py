from scipy import optimize as o
import numpy as np
import clean as c

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

def nnls(A, b):
    try:
        solution, residual = o.nnls(np.array(A), np.array(b))
        return {
            'solution': solution.tolist(),
            'residual': residual
        }
    except Exception as e:
        return str(e)
