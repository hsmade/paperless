#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup


readme = open('README.rst').read()
history = open('HISTORY.rst').read().replace('.. :changelog:', '')

# get the requirements from the requirements.txt
requirements_file = open('requirements.txt').read().split()
requirements = requirements_file

test_requirements = [
    # TODO: put package test requirements here
]

setup(
    name='paperless',
    version='0.1.0',
    description='A project to help me to go paperless',
    long_description=readme + '\n\n' + history,
    author='Wim Fournier',
    author_email='wim@fournier.nl',
    url='https://scm.office.comscore.com/scm/git/wfournier/paperless',
    packages=[
        'paperless',
    ],
    package_dir={'paperless':
                 'paperless'},
    include_package_data=True,
    install_requires=requirements,
    license="In-house",
    zip_safe=False,
    keywords='paperless',
    classifiers=[
        'Development Status :: Perpetual Beta',
        'Intended Audience :: DAx-OPS',
        'License :: In-house development',
        'Natural Language :: English',
        'Programming Language :: Python :: 2.7',
    ],
)
