composer network install -a ./hucashv5.bna -c PeerAdmin@hlfv1
composer network start -n hucashv5 -c PeerAdmin@hlfv1 -V 0.5.1-deploy.0 -A admin -S adminpw
composer card delete -c admin@hucashv5
composer card import -f admin@hucashv5.card
composer-rest-server -c admin@hucashv5 -n never -u true -d hucash -w true