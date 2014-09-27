try:
    from scipy import integrate as i
except:
    print 'Unable to find scipy library. Make sure you have downloaded scipy. See http://www.scipy.org/install.html'

try:
    import numpy as np
except:
    print 'Unable to find numpy library. Make sure you have downloaded numpy. See http://www.numpy.org/'

import clean as c

def integrate(func, options):
    lower = c.parse_num(options['lower'])
    upper = c.parse_num(options['upper'])

    try:
        result = i.quad(func, lower, upper)
        return c.clean_integrate(result)
    except Exception as e:
        return str(e)

def multi_integrate(func, options):
    r = c.parse_range(options['range'])

    try:
        result = i.nquad(func, r)
        return c.clean_integrate(result)
    except Exception as e:
        return str(e)
