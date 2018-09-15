#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Sep 15 00:24:59 2018

@author: jia_qu
"""

from flask import Flask, session, request, jsonify
import os
import sqlite3 as sq3
import requests
import json #json dumps and loads
import pandas as pd

app=Flask(__name__)
dbpath=os.path.join(os.getcwd(),'fc_db.db')

@app.route("/")
def index():
    return(jsonify({'hello_key':'hello_value'}))

@app.route("/login",methods=['GET','POST'])
def login():
    error=None
    if request.method=='POST':
        heads=request.headers
        X_Token=heads['X-Token']
        content=json.loads(request.json)
        

        conn=sq3.connect(dbpath)
        df=pd.read_sql_query("SELECT * FROM user;",conn)

        cur=conn.cursor()
        
        query='select id from '

        #cur.execute()
    
    if :
        success=False
    elif :
        success=False
    elif :
        success=True

    if success:
        json_output=json.dumps([{'token':X_Token,'success':True}])

    else:
        json_output=json.dumps([{'token':'somethingswrong',success:False}])
    
    str_output=str(json.loads(json_output))
    #return(json_output)
    #return(str_output)
    #return('hello')
    #return(str(df.values))
    return(str(content))

@app.route("/wallets",methods=['GET','POST'])
def update():
    return("")

@app.route("/transaction",methods=['GET','POST'])
def transaction():
    return()

#@app.route("/send-transaction",methods=['GET','POST'])
#def send_transaction():
#    content=request.json
#    cur_from=
#    cur_to=
#    return(jsonify({''}))


if __name__=="__main__":
    app.run(debug=True)
