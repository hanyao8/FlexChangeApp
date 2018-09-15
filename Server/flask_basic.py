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
    #error=None
    if request.method=='POST':
        heads=request.headers
        X_Token=heads['X-Token']
        content=request.json #decoded here into dict
        

        conn=sq3.connect(dbpath)
        df=pd.read_sql_query("SELECT * FROM user;",conn)
        conn.close()

    #success=True
    if not(content['username'] in df['username'].tolist()):
        success=False
        message='1'
    else: #the username does exist in the database
        user_row_index=(df.index[df['username']==content['username']].tolist())[0]
        if df.iloc[user_row_index]['password']==content['password']:
            success=True
            message='2'
        else: #password doesn't match
            success=False
            message='3'

    if success:
        app.config.update(dict(USERNAME=content['username']))
        json_output=json.dumps([{'token':X_Token,'success':True}])

    else:
        json_output=json.dumps([{'token':'somethingswrong','success':False}])
    
    str_output=str(json.loads(json_output))
    return(json_output)
    #return(str_output+message)
    #return(content['username'])
    #return(str(df['username'].tolist()))
    #return('hello_hello')
    #return(str(df.values))
    #return(str(df))
    #return(content)
    #return(str(content))

@app.route("/wallets")
def wallets():
    conn=sq3.connect(dbpath)
    df_user=pd.read_sql_query("SELECT * FROM user;",conn)
    df_wallets=pd.read_sql_query("SELECT * FROM wallets;",conn)
    conn.close()
    


    current_user=app.config['USERNAME']
    current_user_rowindex=(df_user.index[df_user['username']==current_user].tolist())[0]
    current_user_id=df_user['id'][current_user_rowindex]
    df_current_wallet=df_wallets.loc[df_wallets['user_id']==current_user_id]
    current_wallet=df_current_wallet.values

    n_wallets=current_wallet.shape[0]
    json_output=json.dumps({'wallets':[{'currency':df_current_wallet['currency'][i] , 'amount':str(df_current_wallet['amount'][i])} for i in range(0,n_wallets) ] })
    str_output=str(json.loads(json_output))
    
    #return(current_user)
    #return('hellolo')
    #return(output)
    #return(str(current_user_rowindex))
    #return(str(current_wallet))
    return(str_output)

@app.route("/transaction",methods=['GET','POST'])
def transaction():
    content=request.json #decoded here into dict
    
    conn=sq3.connect(dbpath)
    df_user=pd.read_sql_query("SELECT * FROM user;",conn)
    df_trans=pd.read_sql_query("SELECT * FROM trans;",conn)
    
    
    
    #try:
        #success=True
    #except:
        #success=False
    json_output=json.dumps([{'success':success}])
    
    conn.close()
    return(json_output)

#@app.route("/send-transaction",methods=['GET','POST'])
#def send_transaction():
#    content=request.json
#    cur_from=
#    cur_to=
#    return(jsonify({''}))


if __name__=="__main__":
    app.run(debug=True)
