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

if operation == 'minimize':
    func      = args.a
    options   = json.JSONDecoder().decode(args.b)
    results   = m.minimize_scalar(lambdify('x', func), options)
elif operation == 'nnls':
    A = json.JSONDecoder().decode(args.a)
    b = json.JSONDecoder().decode(args.b)
    results = m.nnls(A, b)
    
print json.JSONEncoder().encode(results)
