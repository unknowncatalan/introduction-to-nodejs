const express = require('express');
const router = express.Router();
const accounts = require('./accounts');

router.get('/accounts', accounts.getAccounts);
router.post('/accounts', accounts.addAccount);
router.put('/accounts/:id', accounts.updateAccount);
router.delete('/accounts/:id', accounts.removeAccount);

router.all('*', function(req, res, next) {
    res.sendStatus(404)
});

module.exports = router;
