from flask import Flask, render_template, request, redirect
import requests
import json
from bson.json_util import dumps
from flask_mail import Mail, Message
import random
import os

app = Flask(__name__)

errorJson={'error':'login'}
noPendingJson={'error':'no pending transaction'}

#######################################    SORUNLAR  ###############################################
####################################################################################################
#
# SIFRESINI UNUTAN KULLANICI NOLACAK
# E MAILI EKLEMEMIZ LAZIMMI CUSTOMER BILGILERINE
# KREDI KARTI EKRANININ TAMAMEN FRONTENNDE HANDLED KABUL EDIYORUM SADECE BUY HUCASH URLSI VAR
# SIFRE REGEXINI UNUTMA
# KULLANICI ADI REGEXI
# PENDINGDE BAKIYE YETERSIZ ERRORU KONTROLU (USER VARMI YOKMU )
#####################################################################################################

#random donus ekrani
@app.route("/wallet")
def returnScreen():
    return "Islemin basarili gecti sahip"

# Ornek url http://localhost:5000/login?username=nuribilge&password=cannes
# username password alip giris yapan kullaniciyi donderiyorjson seklinde
@app.route("/login")
def login():
    customerId = request.args['username']
    password = request.args['password']

    try:
        customer = requests.get("http://localhost:3000/api/Customer/" + customerId)
        customerJson = customer.json()

        if password == customerJson['password']:
            return dumps(customerJson)
        else:
            return dumps(errorJson)
    except:
        return dumps(errorJson)


# Ornek url http://localhost:5000/wallet/show?username=nuribilge
# sadece username aliyor oradan walletini cekip donderiyor json seklinde
@app.route("/wallet/show")
def showWallet():
    customerId = request.args['username']

    wallet = requests.get("http://localhost:3000/api/CustomerWallet/" + customerId + "-wallet")
    walletJson = wallet.json()

    try:
        walletJson['error']
        return dumps(errorJson)
        
    except:
        return dumps(walletJson)
        

#customer wallet yaratabilecegin url .../wallet/create?walletId=9&balance=1000 seklinde kullaniliyor.
# MUMKUN OLDUGUNCA BUNU KULLANMASAK IYI OLUR CUNKU REGISTERDA OTOMATIK YAPILIYOR LUTFEN KULLANMAYALIM :)))))))))
@app.route("/wallet/create")
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


#customer yaratabilecegin url http://localhost:5000/register?username=nuribilge&password=cannes&firstName=nuri&lastName=ceylan seklinde kullaniliyor.
#customer yaratirken customer walletini de otomatik yaratiyor.
@app.route("/register")
def createCustomer():

    customerId = request.args['username']
    password = request.args['password']
    firstName = request.args['firstName']
    lastName = request.args['lastName'] 

    checkUserRegisteredBefore = requests.get("http://localhost:3000/api/Customer/"+customerId)
    checkUserRegisteredBeforeJson = checkUserRegisteredBefore.json()

    try:
        checkUserRegisteredBeforeJson['error']
        jsonCustomer = {
            "$class": "org.example.basic.Customer",
            "customerId": customerId,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "tp": "[]",
            "wallet": "org.example.basic.CustomerWallet#" + customerId + "-wallet"
        }

        jsonWallet = {
            "$class": "org.example.basic.CustomerWallet",
            "walletId": customerId + "-wallet",
            "balance": "0"
        }

        r = requests.post('http://localhost:3000/api/Customer', data = jsonCustomer)
        r = requests.post('http://localhost:3000/api/CustomerWallet', data = jsonWallet)
        return dumps(jsonCustomer)

    except:
        return dumps(errorJson)

# bu direk kullanilmiyor pending show icin cagriliyor
# Ornek url http://localhost:5000/transaction/prototype?id=243823975fjdshf38547
@app.route("/transaction/prototype")
def getPendingTxContent():
    protoTxId = request.args['id']

    checkTxPrototypeExist = requests.get('http://localhost:3000/api/TransactionPrototype/' + protoTxId)
    checkTxPrototypeExistJson = checkTxPrototypeExist.json()

    try:
        checkTxPrototypeExistJson['error']
        return dumps(errorJson)
    except:
        return dumps(checkTxPrototypeExistJson)


# Ornek url http://localhost:5000/transaction/pending/show?username=hacker12
# Kullanici icindeki tp degiskenine bagli olarak oradan idleri cekip icindeki prototype jsonlarini json list olarak donderiyor
@app.route("/transaction/pending/show")
def showPendingTXs():
    customerId = request.args['username']

    checkUserRegisteredBefore = requests.get("http://localhost:3000/api/Customer/"+customerId)
    checkUserRegisteredBeforeJson = checkUserRegisteredBefore.json()

    pendingTxList = []
    try:
        checkUserRegisteredBeforeJson['error']
        return dumps(errorJson)

    except:
        userJson = checkUserRegisteredBeforeJson
        if len(userJson['tp']) == 0:
            return dumps(noPendingJson)
        else:
            for protoTxId in userJson['tp']:
                split = protoTxId.split('#')
                contentRequest = requests.get('http://localhost:5000/transaction/prototype?id=' + split[1])
                contentJson = contentRequest.json()
                pendingTxList.append(contentJson)
            return dumps(pendingTxList)



#login olmus kullaniciyi direk sender olarak almamiz gerekiyor, bir de username demistik,
#usernameden receiver id ceken bir yapi olusturmamiz gerekir
#Ornek url http://localhost:5000/transaction/pending?senderId=customer-5&receiverId=customer-6&amount=2000
@app.route("/transaction/pending/create")
def sendHucashTxPending():

    senderId = request.args['senderId']
    receiverId = request.args['receiverId']
    amount = request.args['amount'] 

    #receiver id kontrolu 

    jsonPendingTx = {
        "$class": "org.example.basic.SendHucashTransactionPending",
        "sender": "resource:org.example.basic.Customer#" + senderId,
        "receiver": "resource:org.example.basic.Customer#" + receiverId,
        "amount": amount
    }

    r = requests.post('http://localhost:3000/api/SendHucashTransactionPending', data = jsonPendingTx)
    return redirect("/wallet")


#protoId yi bi yerden pass etmek lazim yoksa kullanici nerden bilsin protosunu falan
#Ornek Url http://localhost:5000/transaction/confirm?protoTxId=d9481e173f8f60194b23a4c9f0d39b9ef8714074 
@app.route("/transaction/confirm")
def confirmPendingTx():

    #balance kontrolu sonucu yapilmasi lazim 
    #basarili icin wallet donderiyoruz
    prototypeId = request.args['protoTxId']

    jsonConfirmTx = {
        "$class": "org.example.basic.ConfirmTransaction",
        "tp": "resource:org.example.basic.TransactionPrototype#" + prototypeId
    }

    r = requests.post('http://localhost:3000/api/ConfirmTransaction', data = jsonConfirmTx)
    return redirect("/wallet")


#hucash satin alma deneme url si normalde banka url sine baglanip ordan amountu ve customer cardindan id cekip islemin oyle yapilmasi gerekiyor bence
#suanlik kullanimi http://localhost:5000/buyHucash?customerId=customer2&amount=50000 su tarzda
@app.route("/buyHucash")
def buyHucash():

    #wallet donder basarili olan islem icin 

    customerId = request.args['customerId']
    amount = request.args['amount']

    checkUserRegisteredBefore = requests.get("http://localhost:3000/api/Customer/"+customerId)
    checkUserRegisteredBeforeJson = checkUserRegisteredBefore.json()

    try:
        checkUserRegisteredBeforeJson['error']
        return dumps(errorJson)

    except:
        jsonBuyHucash = { 
            "$class": "org.example.basic.BuyHucash",
            "buyer": "org.example.basic.Customer#"+customerId,
            "amount": amount
        }

        r = requests.post('http://localhost:3000/api/BuyHucash', data = jsonBuyHucash)
        return ("/wallet")


if __name__ == "__main__":
    app.run(debug=True)