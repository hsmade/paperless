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
import json
import shutil
from datetime import datetime
import time

app = Flask(__name__)
images = [{'path': '/tmp/tmpLOKWW9', 'id': 'tmpLOKWW9'}]
base_path = '/home/wfournier/SpiderOak Hive/paperless'


# @app.route('/scan')
def test():
    time.sleep(1)
    return 'tmpLOKWW9', 200


@app.route('/destinations')
def destinations():
    directories = []
    for root, dirs, files in os.walk(base_path):
        directories.append(root[len(base_path) + 1:])
    return json.dumps(directories), 200


@app.route('/save')
def save():
    # return 'OK', 200
    image_id = request.args.get('id', '')
    location = request.args.get('location', '')
    name = request.args.get('name', '')
    file_name = '{datetime} {name}.jpg'.format(
        datetime=datetime.strftime(datetime.now(), '%Y%m%d-%H%M%S'),
        name=name)
    if not id or not location:
        return 'Missing id or location', 500
    image = find_image(image_id)
    if image:
        try:
            destination_path = os.path.join(base_path, location, file_name)
            print 'Saving {} to {}'.format(image['path'], destination_path)
            shutil.move(image['path'], destination_path)
        except shutil.Error as e:
            print e
            return str(e), 500
        return 'OK', 200
    else:
        return 'Image not found', 404


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
    return image_id, 200


def find_image(image_id):
    image = ''
    for item in images:
        if item['id'] == image_id:
            print 'found image at {}'.format(item['path'])
            image = item
    return image


@app.route('/view')
def view():
    print images
    image_id = request.args.get('id', '')
    if not image_id:
        return 'No image ID given', 500
    image = find_image(image_id)
    if image:
        return Response(open(image['path']).read(), mimetype='image/jpeg')
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


@app.after_request
def add_cors(resp):
    """ Ensure all responses have the CORS headers. This ensures any failures are also accessible
        by the client. """
    resp.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin','*')
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
    resp.headers['Access-Control-Allow-Headers'] = request.headers.get(
        'Access-Control-Request-Headers', 'Authorization' )
    # set low for debugging
    if app.debug:
        resp.headers['Access-Control-Max-Age'] = '1'
    return resp


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
