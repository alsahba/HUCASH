from flask import Flask, render_template, request, redirect
import requests
import json
import random
import os

app = Flask(__name__)


#random donus ekrani
@app.route("/wallet")
def returnScreen():
    return "Welcome"


#customer wallet yaratabilecegin url .../createCustomerWallet?walletId=9&balance=1000 seklinde kullaniliyor.
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


#customer yaratabilecegin url .../createCustomer?customerId=cust99&firstName=bihter&lastname=ziyagil seklinde kullaniliyor.
#customer yaratirken customer walletini de otomatik yaratiyor.
@app.route("/createCustomer")
def createCustomer():

    customerId = request.args['customerId']
    firstName = request.args['firstName']
    lastName = request.args['lastName'] 

    controlRequest = requests.get("http://localhost:3000/api/Customer/"+customerId)
    content = controlRequest.json()

    #control for customerId
    try: 
        check = content['error']
        jsonCustomer = {
        "$class": "org.example.basic.Customer",
        "customerId": customerId,
        "firstName": firstName,
        "lastName": lastName,
        "wallet": "org.example.basic.CustomerWallet#"+customerId + "Wallet"
        }

        jsonWallet = {
            "$class": "org.example.basic.CustomerWallet",
            "walletId": customerId + "Wallet",
            "balance": "0"
        }

        r = requests.post('http://localhost:3000/api/Customer', data = jsonCustomer)
        r = requests.post('http://localhost:3000/api/CustomerWallet', data = jsonWallet)
        return redirect ("/creditCardScreen")
    except:
        return None

#ileride customerID yi otomatik cekmemiz gerekiyor, o yuzden tamamlanmis degil
#hucash satin alma deneme url si normalde banka url sine baglanip ordan amountu ve customer cardindan id cekip islemin oyle yapilmasi gerekiyor bence
#suanlik kullanimi http://localhost:5000/buyHucash?customerId=customer2&amount=50000 su tarzda
@app.route("/buyHucash")
def buyHucash():
    customerId = request.args['customerId']
    amount = request.args['amount']

    jsonBuyHucash = { 
        "$class": "org.example.basic.BuyHucash",
        "buyer": "org.example.basic.Customer#"+customerId,
        "amount": amount
    }

    r = requests.post('http://localhost:3000/api/BuyHucash', data = jsonBuyHucash)
    return ("/creditCardScreen")


#tam tamamlanmadi kisinin id sini nasil alacagimizi bulmamiz lazim
@app.route("/creditCardScreen")
def buyWithCreditCard():
    creditCardNumber = request.args['customerId']
    cvvNumber = request.args['firstName']
    customerId = request.args['lastName'] 
    walletId = request.args['walletId']

    return "Shit"

if __name__ == "__main__":
    app.run(debug=True)