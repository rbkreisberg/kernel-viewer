#calculate kde.  output positions of contours for threshold densities


import numpy as np
from scipy import stats
from scipy.optimize import brentq

import os, numpy

import find_contours as fc

def calculate_kde(points):
	#change matrix into numpy matrix
	np_matrix = np.array(points,dtype=float)
	gkde = stats.gaussian_kde(np_matrix)

	min_x = np_matrix[:,0].min()
	max_x = np_matrix[:,0].max()
	min_y = np_matrix[:,1].min()
	max_y = np_matrix[:,1].max()

	x_flat = np.r_[min_x:max_x:128j]
	y_flat = np.r_[min_y:max_y:128j]
	x,y = np.meshgrid(x_flat,y_flat)
	area = np.append(x.reshape(-1,1),y.reshape(-1,1),axis=1)

	density = gkde(area.T)

	Z = density.reshape(128,128)

	dxdy = (max_x - min_x) * (max_y - min_y) / (128^2) # the area represented by each grid point

	peak = Z.max()

	# You can't quite do this since the function is discontinuous, and never
	# actually equals 0, but you can do a search along these lines.
	# Exercise left for the reader.
	def g(level):
		def f(s):
			mask = Z > s
			return level - (Z[mask].sum() * dxdy)
		return f

	print "calculating threshold value for 90%";

	h= g(0.9)

	contour_value = brentq(h, 0, peak,xtol=0.02,maxiter=300)  #0.02 tolerance, 300 iterations


	print "value: " + str(contour_value)
	print "Z: " + str(Z)
	lines = fc.find_contours(Z,contour_value)
	print lines

