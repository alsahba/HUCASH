from flask import Flask, render_template, request, redirect
import requests
import json 
import random
import os

app = Flask(__name__)



@app.route("/wallet")
def returnScreen():
    return "Welcome"

@app.route("/createCustomerWallet")
def createEntity():

	walletId = request.args['walletId']
	balance = request.args['balance']

	json_val = {
        "$class": "org.example.basic.CustomerWallet",
        "walletId": walletId,
        "balance": balance
    }

	r = requests.post('http://localhost:3000/api/CustomerWallet', data = json_val)
	return redirect ("/wallet")

@app.route("/createCustomer")
def createCustomer():

    customerId = request.args['customerId']
    firstName = request.args['firstName']
    lastName = request.args['lastName'] 
    walletId = request.args['walletId']

    jsonCustomer = {
        "$class": "org.example.basic.Customer",
        "customerId": customerId,
        "firstName": firstName,
        "lastName": lastName,
        "wallet": "org.example.basic.CustomerWallet"+walletId
    }

    jsonWallet = {
        "$class": "org.example.basic.CustomerWallet",
        "walletId": walletId,
        "balance": "0"
    }

    r = requests.post('http://localhost:3000/api/Customer', data = jsonCustomer)
    r = requests.post('http://localhost:3000/api/CustomerWallet', data = jsonWallet)
    return redirect ("/wallet")







if __name__ == "__main__":
    app.run(debug=True)