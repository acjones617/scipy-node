try:
    from numpy import inf
except:
    print 'Unable to find numpy library. Make sure you have downloaded numpy. See http://www.numpy.org/'

def clean_integrate(result):
    return {
        'definiteIntegral': result[0],
        'absoluteError'   : result[1]
    }

def parse_num(num):
    if num == 'Infinity':
        return inf
    if num == '-Infinity':
        return -inf
    return float(num)

def parse_range(r):
    result = []
    for tup in  r:
        result.append([parse_num(num) for num in tup])

    return result
