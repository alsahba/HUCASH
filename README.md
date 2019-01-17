

## **Installing Pre-requisites**

To run Hyperledger Composer and Hyperledger Fabric, we recommend you have at least 4Gb of memory.

The following are prerequisites for installing the required development tools:

    Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
    Docker Engine: Version 17.03 or higher
    Docker-Compose: Version 1.8 or higher
    Node: 8.9 or higher (note version 9 is not supported)
    npm: v5.x
    git: 2.9.x or higher
    Python: 2.7.x
    A code editor of your choice, we recommend VSCode.

**If installing Hyperledger Composer using Linux, be aware of the following advice:

    Login as a normal user, rather than root.
    Do not su to root.
    When installing prerequisites, use curl, then unzip using sudo.
    Run prereqs-ubuntu.sh as a normal user. It may prompt for root password as some of it's actions are required to be run as root.
    Do not use npm with sudo or su to root to use it.
    Avoid installing node globally as root.**

If you're running on Ubuntu, you can download the prerequisites using the following commands:

	-curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh

	-chmod u+x prereqs-ubuntu.sh

Next run the script - as this briefly uses sudo during its execution, you will be prompted for your password.

	./prereqs-ubuntu.sh



## Installing Components


**Step 1: Install the CLI tools**

There are a few useful CLI tools for Composer developers. The most important one is composer-cli, which contains all the essential operations, so we'll install that first. Next, we'll also pick up generator-hyperledger-composer, composer-rest-server and Yeoman plus the generator-hyperledger-composer. Those last 3 are not core parts of the development environment, but they'll be useful if you're following the tutorials or developing applications that interact with your Business Network, so we'll get them installed now.

Note that you should not use su or sudo for the following npm commands.

    1.	Essential CLI tools:

    	npm install -g composer-cli@0.19

    2.	Utility for running a REST Server on your machine to expose your business networks as RESTful APIs:

	npm install -g composer-rest-server@0.19

    3.	Useful utility for generating application assets:
	
	npm install -g generator-hyperledger-composer@0.19

    4.	Yeoman is a tool for generating applications, which utilises generator-hyperledger-composer:

	npm install -g yo


**Step 2: Install Playground**

If you've already tried Composer online, you'll have seen the browser app "Playground". You can run this locally on your development machine too, giving you a UI for viewing and demonstrating your business networks.

    1.	Browser app for simple editing and testing Business Networks:
	
	npm install -g composer-playground@0.19


**Step 3: Install Hyperledger Fabric**

This step gives you a local Hyperledger Fabric runtime to deploy your business networks to.

  
  1.	In a directory of your choice (we will assume ~/fabric-dev-servers), get the .tar.gz file that contains the tools to install Hyperledger 		Fabric:
  
	
	mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers
	curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
	tar -xvf fabric-dev-servers.tar.gz

A zip is also available if you prefer: just replace the .tar.gz file with fabric-dev-servers.zip and the tar -xvf command with a unzip command in the preceding snippet.

 2.	Use the scripts you just downloaded and extracted to download a local Hyperledger Fabric v1.2 runtime:

	cd ~/fabric-dev-servers
	export FABRIC_VERSION=hlfv12
	./downloadFabric.sh



## Starting and Stopping Hyperledger Fabric



You control your runtime using a set of scripts which you'll find in ~/fabric-dev-servers if you followed the suggested defaults.
	
The first time you start up a new runtime, you'll need to run the start script, then generate a PeerAdmin card:

	cd ~/fabric-dev-servers
    	export FABRIC_VERSION=hlfv12
    	./startFabric.sh
    	./createPeerAdminCard.sh

You can start and stop your runtime using  `~/fabric-dev-servers/stopFabric.sh`, and start it again with `~/fabric-dev-servers/startFabric.sh`.

At the end of your development session, you run `~/fabric-dev-servers/stopFabric.sh` and then `~/fabric-dev-servers/teardownFabric.sh`. Note that if you've run the teardown script, the next time you start the runtime, you'll need to create a new PeerAdmin card just like you did on first time startup.



## Deploy Application



> Sir, the last command opens the composer rest server, it needs to
> remain open in the background, please keep it open and switch to
> another terminal. Composer rest server is running on PORT:3000.

These commands need to be written in the directory which included bna file.
	
	composer network install -a ./hucashv8.bna -c PeerAdmin@hlfv1
	composer network start -n hucashv8 -c PeerAdmin@hlfv1 -V 0.5.1-deploy.18 -A admin -S adminpw
	composer card delete -c admin@hucashv8
	composer card import -f admin@hucashv8.card
	composer-rest-server -c admin@hucashv8 -n never -u true -d hucash -w true



## Start REST Server



> Sir, the last command opens the Hucash rest server, it needs to remain
> open in the background, please keep it open and switch to another
> terminal. Hucash rest server is running on PORT:8000.

Last command needs to be written in the directory which included hucashRest.py file.

	sudo apt-get install python-pip
	pip install flask 
	pip install flask_cors 
	pip install requests
	pip install json
	pip install bson.json_util
	pip install random 
	pip install os
	pip install re
	python hucashRest.py



## Start Web Application


	
For websites to work, you enter the directory where you copied the files and you write the following commands.

	npm install
	npm start

	Hucash web application is running on PORT:8080.
	Hepsisurada is running on PORT:8081.

-----------------------------------------------------------------------------------------------------------------------


> Sir, web applications are linked to server URLs, you can simply write
> web commands and try the applications.  Because the server's ram
> capacity is insufficient, server shuts down the rest servers,  so if
> you let us know before trying, we can make the server is running
> again.





