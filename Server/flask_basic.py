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
import datetime

app=Flask(__name__)

app.config.update(dict(SECRET_KEY='secret_key'))
dbpath=os.path.join(os.getcwd(),'fc_db.db')

@app.route("/")
def index():

    df_exch_rate=pd.DataFrame([0.86],index=['EUR'],columns=['USD']) #1 USD=X EUR

    nowtime=datetime.datetime.now()
    
    conn=sq3.connect(dbpath)
    df_user=pd.read_sql_query("SELECT * FROM user;",conn)
    df_wallet=pd.read_sql_query("SELECT * FROM wallets;",conn)
    df_trans=pd.read_sql_query("SELECT * FROM trans2;",conn)
    cur=conn.cursor()

    #if nowtime>untiltime: #execute last transaction and delete in database
    
    until_arr_str=df_trans['until'].tolist()
    until_arr=[datetime.datetime.strptime(time_item, '%Y-%m-%d')for time_item in until_arr_str]

    rows_to_exe_list=[]
    for i in range(0,len(until_arr)):
        if until_arr[i]<nowtime:
            rows_to_exe_list.append(i)

    n_to_exe=len(rows_to_exe_list) #the number of transactions to execute

    #for row_index in rows_to_exe_list:
        #query_from="update wallets set amount=%d where(user_id=%d and currency='%s');"%(df_wallet.loc[df_wallet['']==])
        #cur.execute(query_from)
        #conn.commit()
        
        #query_to="update wallets set amount=%d where(user_id=%d and currency='%s');"%()
        #cur.execute(query_to)
        #conn.commit()

    #for i in range(0,n_to_exe):
     #   cur.execute()
    

    conn.close()
    #return()
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
            session['logged_in']=True
        else: #password doesn't match
            success=False
            message='3'

    if success:
        app.config.update(dict(USERNAME=content['username']))
        json_output=json.dumps([{'token':X_Token,'success':True,'is_main':False}])

    else:
        json_output=json.dumps([{'token':'somethingswrong','success':False,'is_main':False}])
    
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
    json_output=json.dumps({'wallets':[{'currency':df_current_wallet['currency'][i] , 'amount':str(df_current_wallet['amount'][i])} for i in range(0,n_wallets) ] ,'is_main':True})
    

    
    str_output=str(json.loads(json_output))
    
    #return(current_user)
    #return('hellolo')
    #return(output)
    #return(str(current_user_rowindex))
    #return(str(current_wallet))
    return(json_output)
    #return(str_output)

@app.route("/transaction",methods=['GET','POST'])
def transaction():
    try:
        content=request.json #decoded here into dict
    
        conn=sq3.connect(dbpath)
        df_user=pd.read_sql_query("SELECT * FROM user;",conn)
        df_trans=pd.read_sql_query("SELECT * FROM trans2;",conn)
   
        current_user=app.config['USERNAME']
        current_user_rowindex=(df_user.index[df_user['username']==current_user].tolist())[0]
        current_user_id=df_user['id'][current_user_rowindex]


        cur=conn.cursor()
        write_query="insert into trans2(wallet_from_id, wallet_to_id, currency_from, currency_to, until, amount_from, processed) values(%d,%d,'%s','%s','%s',%.2f,%r);"%(current_user_id,current_user_id,content['currency_from'],content['currency_to'],content['until'],float(content['amount']),False)
        cur.execute(write_query) #to implement functionality to account for modification of column names
    #cur.execute("insert into trans(id, wallet_from_id, wallet_to_id, currency_from, currency_to, until, amount_from) values(1,1,1,'EUR','USD','2018-09-18',50.00);")
        conn.commit()
    #try:
        #success=True
    #except:
        #success=False
    #json_output=json.dumps([{'success':success}])
    
        conn.close()
        output_message='success'
        json_output=json.dumps({'success':True,'is_main':False})
    except:
        output_message='unsuccessful'
        json_output=json.dumps({'success':False,'is_main':False})
    #return(output_message)
    return(json_output)
    #return(write_query)
    #return()

#@app.route("/send-transaction",methods=['GET','POST'])
#def send_transaction():
#    content=request.json
#    cur_from=
#    cur_to=
#    return(jsonify({''}))


if __name__=="__main__":
    app.run(debug=True)
