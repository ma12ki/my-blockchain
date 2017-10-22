const express = require('express');

const controller = require('./blockchain.controller');
const service = require('./blockchain.service');

service.init();

const router = express.Router();

router.post('/transactions/new', controller.newTransaction);
router.get('/mine', controller.mine);
router.get('/chain', controller.chain);
router.get('/chain/self-validate', controller.selfValidateChain);
router.post('/nodes/register', controller.registerNodes);

module.exports = {
    router,
};
