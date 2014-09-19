from scipy import optimize as o
import numpy as np
import clean as c

def minimize_scalar(func, options):
    bracket = options['bracket']
    bounds  = options['bounds']
    method  = options['method']
    tol     = options['tol']
    options = options['options']

    try:
        return o.minimize_scalar(func, bracket=bracket, bounds=bounds, method=method, tol=tol, options=options)
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