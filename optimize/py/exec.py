import main as m

import jsonpickle as j
import argparse
import ast

parser = argparse.ArgumentParser()
parser.add_argument('func')
parser.add_argument('options')
args   = parser.parse_args()

func = args.func
options = ast.literal_eval(args.options)
operation = options['operation']

def f(func):
    def inner(x):
        return eval(func)
    return inner

func = f(func)

if operation == 'minimize':
    result = m.minimize_scalar(func)


print j.encode(result)


# 7. send back to node - need to convert cluster centers to list first
# print j.encode({
#     'finalMatrix'   : final_matrix,
#     'clusterCenters': cluster_centers
# })
