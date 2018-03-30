const Account = require('../models/account').Account;

module.exports = {

    getAccounts(req, res, next) {
        Account.find({}).exec(function (err, accounts){
            if (err) {
                res.status(400).send();
            } else {
                res.status(200).send(accounts);
            }  
        });
        
    },

    addAccount(req, res, next) {
        let account = new Account(req.body);
        account.save(function(err) {
            if (err) {
                if (err && err.name == 'ValidationError'){
                    res.status(400).send(err);
                } else {
                    res.status(500).send(err);
                }
            } else {
                res.status(201).send(account);
            }
        });
        
    },

    updateAccount(req, res, next) {
        Account.findOne({_id: req.params.id}, function(err, account) {
            if (err) {
                res.status(500).send();
            } else if (!account) {
                res.status(404).send({"message": "Not found"});
            } else {
                if (req.body.name) {
                    account.name = req.body.name;
                }
                if (req.body.balance) {
                    account.balance = req.body.balance;
                }
                account.save(function(err) {
                    if (err && err.name == 'ValidationError'){
                        res.status(400).send(err);
                    } else {
                        res.status(200).send(account);
                    }
                });
            }
        });
    },

    removeAccount(req, res, next) {
        Account.findOne({_id: req.params.id}).remove().exec(function(err) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(204).send();
            }
        });
    }
}