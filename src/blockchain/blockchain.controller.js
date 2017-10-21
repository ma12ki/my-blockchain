const service = require('./blockchain.service');

const newTransaction = (req, res) => {
    const { sender, recipient, amount } = req.body;
    const blockIndex = service.newTransaction(sender, recipient, amount);

    res.json({ blockIndex });
};

const mine = (req, res) => res.json(service.mine());

const chain = (req, res) => {
    const chain = service.getChain();

    return res.json({
        chain,
        length: chain.length,
    });
};

const selfValidateChain = (req, res) => res.json(service.isValidChain(service.getChain()));

module.exports = {
    newTransaction,
    mine,
    chain,
    selfValidateChain,
};
