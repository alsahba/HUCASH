from flask import Flask, render_template, request, redirect
import requests
import json
from bson.json_util import dumps
from flask_mail import Mail, Message
import random
import os
import re

app = Flask(__name__)

errorJson = {'error': 'login'}
generalErrorJson = {'error': 'general'}
txHistoryRecordNotFoundErrorJson = {'error': 'no transaction record found'}
unsuccesfullLoginErrorJson = {'error': 'login process is unsuccessful'}
usernameAlreadyTakenErrorJson = {'error': 'username already taken'}
unregisteredCustomerErrorJson = {'error': 'there is no registered customer found'}
noPendingErrorJson = {'error':'no pending transaction'}
usernamePasswordErrorJson = {'error': 'username or password is in invalid form'}
insufficientBalanceErrorJson = {'error': 'customer has not sufficient balance'}
txSuccessfulJson = {'tx': 'successfull'}


#######################################    SORUNLAR  ###############################################
####################################################################################################
#
# SIFRESINI UNUTAN KULLANICI NOLACAK
# E MAILI EKLEMEMIZ LAZIMMI CUSTOMER BILGILERINE
# KREDI KARTI EKRANININ TAMAMEN FRONTENNDE HANDLED KABUL EDIYORUM SADECE BUY HUCASH URLSI VAR
#
####################################################################################################

#random donus ekrani
@app.route("/wallet")
def returnScreen():
    return "Isleminiz basarili gecti"

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
            return dumps(unsuccesfullLoginErrorJson)
    except:
        return dumps(unregisteredCustomerErrorJson)


# Ornek url http://localhost:5000/wallet/show?username=nuribilge
# sadece username aliyor oradan walletini cekip donderiyor json seklinde
@app.route("/wallet/show")
def showWallet():
    customerId = request.args['username']

    wallet = requests.get("http://localhost:3000/api/CustomerWallet/" + customerId + "-wallet")
    walletJson = wallet.json()

    try:
        walletJson['error']
        return dumps(unregisteredCustomerErrorJson)
        
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


#customer yaratabilecegin url http://localhost:5000/register?username=nuribilge&password=Cannes12&firstName=nuri&lastName=ceylan seklinde kullaniliyor.
#username minimum 6 karakterli olmak zorunda, password minimum 8 karakter olmali buyuk kucuk harf ve sayi icermek zorunda.
#customer yaratirken customer walletini de otomatik yaratiyor.
@app.route("/register")
def createCustomer():

    customerId = request.args['username']
    password = request.args['password']
    firstName = request.args['firstName']
    lastName = request.args['lastName'] 

    if re.match(r'[A-Za-z0-9@#$%^&+=]{8,}', password) and re.match(r'[A-Za-z0-9]{6,}', customerId):
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
                "transactionHistory": "[]",
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
            return dumps(usernameAlreadyTakenErrorJson)

    else:
        return dumps(usernamePasswordErrorJson)

# bu direk kullanilmiyor pending show icin cagriliyor
# Ornek url http://localhost:5000/transaction/prototype?id=243823975fjdshf38547
@app.route("/transaction/prototype")
def getPendingTxContent():
    protoTxId = request.args['id']

    checkTxPrototypeExist = requests.get('http://localhost:3000/api/TransactionPrototype/' + protoTxId)
    checkTxPrototypeExistJson = checkTxPrototypeExist.json()

    try:
        checkTxPrototypeExistJson['error']
        return dumps(generalErrorJson)
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
        return dumps(unregisteredCustomerErrorJson)

    except:
        userJson = checkUserRegisteredBeforeJson
        if len(userJson['tp']) == 0:
            return dumps(noPendingErrorJson)
        else:
            for protoTxId in userJson['tp']:
                split = protoTxId.split('#')
                contentRequest = requests.get('http://localhost:5000/transaction/prototype?id=' + split[1])
                contentJson = contentRequest.json()
                pendingTxList.append(contentJson)
            return dumps(pendingTxList)



#login olmus kullaniciyi direk sender olarak almamiz gerekiyor, bir de username demistik,
#usernameden receiver id ceken bir yapi olusturmamiz gerekir
#Ornek url http://localhost:5000/transaction/pending/create?senderId=customer-5&receiverId=customer-6&amount=2000
@app.route("/transaction/pending/create")
def sendHucashTxPending():

    senderId = request.args['senderId']
    receiverId = request.args['receiverId']
    amount = request.args['amount'] 

    checkReceiverRegisteredBefore = requests.get("http://localhost:3000/api/Customer/" + receiverId)
    checkReceiverRegisteredBeforeJson = checkReceiverRegisteredBefore.json()

    try:
        checkReceiverRegisteredBeforeJson['error']
        return dumps(unregisteredCustomerErrorJson)

    except:
        jsonPendingTx = {
            "$class": "org.example.basic.SendHucashTransactionPending",
            "sender": "resource:org.example.basic.Customer#" + senderId,
            "receiver": "resource:org.example.basic.Customer#" + receiverId,
            "amount": amount
        }

        r = requests.post('http://localhost:3000/api/SendHucashTransactionPending', data = jsonPendingTx)
        return dumps(txSuccessfulJson)


# Burada listeden secse ve confirm edecegi prototype transactionun idsini kullanici icindeki tp fieldidan almali.
# Eger kullanicinin yeterli bakiyesi yoksa error donderiyor.
# Ornek Url http://localhost:5000/transaction/confirm?protoTxId=d9481e173f8f60194b23a4c9f0d39b9ef8714074 
@app.route("/transaction/confirm")
def confirmPendingTx():

    prototypeId = request.args['protoTxId']

    jsonConfirmTx = {
        "$class": "org.example.basic.ConfirmTransaction",
        "tp": "resource:org.example.basic.TransactionPrototype#" + prototypeId
    }

    postRequest = requests.post('http://localhost:3000/api/ConfirmTransaction', data = jsonConfirmTx)
    postRequestContent = postRequest.json()

    try:
        postRequestContent['error']
        return dumps(insufficientBalanceErrorJson)

    except:
        return dumps(txSuccessfulJson)


# Sonuc her zaman basarili donuyor sadece user register degilse basarisiz donuyor ama zaten login olan kullanici yapabilecegi icin sikinti olmaz
#suanlik kullanimi http://localhost:5000/buyHucash?username=bilge&amount=100000 su tarzda
@app.route("/buyHucash")
def buyHucash():

    customerId = request.args['username']
    amount = request.args['amount']

    checkUserRegisteredBefore = requests.get("http://localhost:3000/api/Customer/"+customerId)
    checkUserRegisteredBeforeJson = checkUserRegisteredBefore.json()

    try:
        checkUserRegisteredBeforeJson['error']
        return dumps(unregisteredCustomerErrorJson)

    except:
        jsonBuyHucash = { 
            "$class": "org.example.basic.BuyHucash",
            "buyer": "org.example.basic.Customer#"+customerId,
            "amount": amount
        }

        r = requests.post('http://localhost:3000/api/BuyHucash', data = jsonBuyHucash)
        walletRequest = requests.get('http://localhost:3000/api/CustomerWallet/' + customerId + '-wallet')
        return dumps(walletRequest.json())

def getUsernameFromRecord(record):
    getWallet = record.split('#')
    getUsername = getWallet[1].split('-')
    return getUsername[0]


def getHistorianById(historianId):

    getRequest = requests.get('http://localhost:3000/api/system/historian/' + historianId)
    getRequestContent = getRequest.json()

    return getRequestContent['eventsEmitted']

def eventParser(eventContent, senderOrReciever, customerId):

    #buyHucash
    if len(eventContent) == 1:

        oldBalance = eventContent[0]['oldBalance']
        newBalance = eventContent[0]['newBalance']

        buyHucashEventJson = {
            'event': 'buyHucash',
            'sender': '-',
            'receiver': customerId,
            'oldBalance': oldBalance,
            'newBalance': newBalance,
        }
        return buyHucashEventJson

    #sendHucash
    else:
        print(senderOrReciever)
        if senderOrReciever == '0}':
            oldBalance = eventContent[0]['oldValue']
            newBalance = eventContent[0]['newValue']
            receiver = getUsernameFromRecord(eventContent[1]['wallet'])

            sendHucashJson = {
                'event': 'sendHucash',
                'sender': '-',
                'receiver': receiver,
                'oldBalance': oldBalance,
                'newBalance': newBalance,
            }

            return sendHucashJson
        else:
            oldBalance = eventContent[1]['oldValue']
            newBalance = eventContent[1]['newValue']
            sender = getUsernameFromRecord(eventContent[0]['wallet'])

            sendHucashJson = {
                'event': 'sendHucash',
                'sender': sender,
                'receiver': '-',
                'oldBalance': oldBalance,
                'newBalance': newBalance,
            }

            return sendHucashJson
   

@app.route("/transaction/history")
def showTxHistory():
    customerId = request.args['username']

    checkUserRegisteredBefore = requests.get("http://localhost:3000/api/Customer/" + customerId)
    checkUserRegisteredBeforeJson = checkUserRegisteredBefore.json()

    txHistoryJsonList = []

    try:
        checkUserRegisteredBeforeJson['error']
        return dumps(unregisteredCustomerErrorJson)

    except:
        userJson = checkUserRegisteredBeforeJson
        historyRecordList = userJson['transactionHistory']

        if len(historyRecordList) == 0:
            return dumps(txHistoryRecordNotFoundErrorJson)
        else:
            for record in historyRecordList:
                splittedRecord = record.split('#')
                txHistoryEventJson = eventParser(getHistorianById(splittedRecord[1]), splittedRecord[2], customerId)
                txHistoryJsonList.append(txHistoryEventJson)
            return dumps(txHistoryJsonList)

if __name__ == "__main__":
    app.run(debug=True)