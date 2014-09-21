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

if operation == 'local' or operation == 'global':
    func      = args.a
    options   = json.JSONDecoder().decode(args.b)
    if operation == 'local':
        results = m.local_minimize(lambdify('x', func), options)
    if operation == 'global':
        results = m.global_minimize(lambdify('x', func), options)
elif operation == 'nnls':
    A = json.JSONDecoder().decode(args.a)
    b = json.JSONDecoder().decode(args.b)
    results = m.nnls(A, b)

try:
    print json.JSONEncoder().encode(results)
except Exception as e:
    print e
