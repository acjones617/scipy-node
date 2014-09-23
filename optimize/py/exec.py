import main as m
from sympy.utilities.lambdify import lambdify

import json
import argparse
import ast
parser = argparse.ArgumentParser()
parser.add_argument('operation')
parser.add_argument('a')
parser.add_argument('b')
args   = parser.parse_args()
operation = args.operation

if operation in ['local', 'global', 'fit']:
    func      = args.a
    options   = json.JSONDecoder().decode(args.b)
    if operation == 'local':
        results = m.local_minimize(lambdify('x', func), options)
    elif operation == 'global':
        results = m.global_minimize(lambdify('x', func), options)
    elif operation == 'fit':
        num_args = options['numArgs']
        args = ['x']
        ch = 'a'
        for i in range(0, num_args - 1):
            args.append(ch)
            ch = chr(ord(ch) + 1)
        results = m.curve_fit(lambdify(tuple(args), func), options)
elif operation == 'nnls':
    A = json.JSONDecoder().decode(args.a)
    b = json.JSONDecoder().decode(args.b)
    results = m.nnls(A, b)

try:
    print json.JSONEncoder().encode(results)
except Exception as e:
    print e
