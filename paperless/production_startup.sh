#!/usr/bin/env bash
cd $(dirname $0)
gunicorn -b 0.0.0.0:5000 app:app
