# test kde
import sys
from scipy import stats
import numpy as np
import calc_kde_lines as ckl

def main(argv=None):
	n=1000
	m1 = np.random.normal(size=n)
	m2 = np.random.normal(scale=0.5, size=n)
	values = np.vstack([m1+m2, m1-m2])
	ckl.calculate_kde(values)

if __name__ == "__main__":
	sys.exit(main())