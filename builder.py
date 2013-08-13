#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rjsmin
import argparse
import fnmatch
import os
import shutil

name = 'Cosmos2D-0.3-beta-mini.js'
try:
	os.remove(name)
except Exception:
	pass
mini_file = open(name, 'a')	
for root, dirnames, filenames in os.walk("."):
  for filename in fnmatch.filter(filenames, '*.js'):
  	if(len(root) == 1 or root == ".\\versions" or filename == "Canvas_WebGL.js"):
  		continue
  	print('Minifying "' + os.path.join(root, filename) + '"')
  	# mini_file.write(rjsmin.jsmin(open(os.path.join(root, filename), 'r').read()))
  	mini_file.write(open(os.path.join(root, filename), 'r').read())
  	mini_file.write('\n')
mini_file.close()
print('\nBuild succeeded!')
