#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Sep 15 00:24:59 2018

@author: jia_qu
"""

from flask import Flask, session

app=Flask(__name__)

@app.route("/")

def index():
    return("hello")


if __name__=="__main__":
    app.run(debug=True)