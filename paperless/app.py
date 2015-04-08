#!/usr/bin/env python2.7
# -*- coding: UTF-8 -*-
# File: paperless.py

#
__author__ = 'Wim Fournier <wim@fournier.nl>'
__docformat__ = 'plaintext'
__date__ = '2015-04-08'

from flask import Flask, redirect, url_for, Response, request
import pyinsane.abstract as pyinsane
from tempfile import NamedTemporaryFile
import os

app = Flask(__name__)
images = []

@app.route('/scan')
def scan():
    resolution = request.args.get('resolution', '')
    print 'resolution: {}'.format(resolution)
    devices = pyinsane.get_devices()
    assert(len(devices) > 0)
    device = devices[0]
    if resolution and resolution in ['75', '150', '300', '600', '1200', '2400']:
        device.options['resolution'].value = int(resolution)
    print device.options['resolution'].value
    print device.name
    # for option in device.options:
    #     try:
    #         print option, device.options[option].value
    #     except:
    #         print option
    scan_session = device.scan(multiple=False)
    try:
        while True:
            print '.'
            scan_session.scan.read()
    except EOFError:
        pass
    print 'scan done'

    image = scan_session.images[0]
    tmp_file = NamedTemporaryFile(delete=False)
    image.save(tmp_file.name, "JPEG")
    image_id = tmp_file.name.rpartition('/')[-1]
    images.append({'id': image_id, 'path': tmp_file.name})
    print 'redirecting'
    return redirect(url_for('view', id=image_id))


@app.route('/view')
def view():
    print images
    image_id = request.args.get('id', '')
    if not image_id:
        return 'No image ID given', 500
    image = ''
    for item in images:
        if item['id'] == image_id:
            print 'found image at {}'.format(item['path'])
            image = open(item['path']).read()
    if image:
        return Response(image, mimetype='image/jpeg')
    else:
        return 'Image not found', 404


@app.route('/delete')
def delete():
    image_id = request.args.get('id', '')
    if not image_id:
        return 'No image ID given', 500
    for item in images:
        if item['id'] == image_id:
            print 'found image at {}'.format(item['path'])
            os.remove(item['path'])
            return '{} has been removed'.format(image_id), 200
    return 'Image not found', 404


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
