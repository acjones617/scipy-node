from scipy import optimize as o
import clean as c

def minimize(func, guess):
    return o.minimize(func, guess)



def minimize_scalar(func, options):
    bracket = options['bracket']
    bounds  = options['bounds']
    method  = options['method']
    tol     = options['tol']
    options = options['options']

    return o.minimize_scalar(func, bracket=bracket, bounds=bounds, method=method, tol=tol, options=options)
