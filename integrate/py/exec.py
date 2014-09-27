import main as m
try:
    from sympy.utilities.lambdify import lambdify
except:
    print 'Unable to find sympy. Make sure you have downloaded sympy. See http://sympy.org/en/download.html'

try:
    import json
except:
    print 'Unable to find json. Make sure you have downloaded json module.' 
import argparse
import ast

parser = argparse.ArgumentParser()
parser.add_argument('operation')
parser.add_argument('func')
parser.add_argument('options')
args      = parser.parse_args()
operation = args.operation
func      = args.func
options   = json.JSONDecoder().decode(args.options)

if operation == 'single':
    results = m.integrate(lambdify('x', func), options)
elif operation == 'multi':
    num_args = options['numArgs']
    args = ['x']
    ch = 'a'
    for i in range(0, num_args - 1):
        args.append(ch)
        ch = chr(ord(ch) + 1)
    results = m.multi_integrate(lambdify(tuple(args), func), options)

try:
    print json.JSONEncoder().encode(results)
except Exception as e:
    print e
    print results
