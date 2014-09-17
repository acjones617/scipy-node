from scipy import optimize as o
import clean as c

def minimize(func, guess):
    return o.minimize(func, guess)

def minimize_scalar(func, bracket=None, bounds=None, args=(), method='brent', tol=None, options=None):
    return o.minimize_scalar(func, bracket, bounds, args, method, tol, options)