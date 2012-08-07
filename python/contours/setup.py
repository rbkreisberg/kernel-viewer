import os, numpy

def configuration(parent_package='',top_path=None):
    from numpy.distutils.misc_util import Configuration
    config = Configuration('find_contours',parent_package,top_path)
    config.add_extension('_find_contours', sources=['_find_contoursmodule.c'])
    return config

if __name__ == '__main__':
    from numpy.distutils.core import setup
    setup(**configuration(top_path='').todict())
