import main as m
from sympy.utilities.lambdify import lambdify

import json
import argparse
import ast

parser = argparse.ArgumentParser()
parser.add_argument('operation')
parser.add_argument('func')
parser.add_argument('options')
args   = parser.parse_args()
operation = args.operation
func      = args.func

options   = json.JSONDecoder().decode(args.options)

# def f(func):
#     def inner(x):
#         return eval(func)
#     return inner

# func = f(func)

if operation == 'minimize':
    results = m.minimize_scalar(lambdify('x', func), options)

print json.JSONEncoder().encode(results)
