const service = require('./blockchain.service');

const newTransaction = (req, res) => {
    const { sender, recipient, amount } = req.body;
    const blockIndex = service.newTransaction(sender, recipient, amount);

    return res.json({ blockIndex });
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

const registerNodes = (req, res) => {
    service.registerNodes(req.body.nodes);

    return res.json({ nodes: service.getNodes() });
};

const resolveConflicts = (req, res) => {

};

module.exports = {
    newTransaction,
    mine,
    chain,
    selfValidateChain,
    registerNodes,
};
