const sha256 = require('hash.js/lib/hash/sha/256');
const stringify = require('json-stable-stringify');

const chain = [];
let currentTransactions = [];

const getChain = () => chain;

const init = () => newBlock(1, 100);

const newBlock = (proof, previousHash) => {
    const block = {
        index: getNewBlockIndex(),
        timestamp: Date.now(),
        transactions: currentTransactions,
        proof,
        previousHash,
    };

    currentTransactions = [];
    chain.push(block);

    return block;
};

const newTransaction = (sender, recipient, amount) => {
    currentTransactions.push({
        sender,
        recipient,
        amount,
    });

    return getNewBlockIndex();
};

const hash = (block) => {
    const stringified = stringify(block);

    return sha256().update(stringified).digest('hex');
};

const getLastBlock = () => chain[chain.length - 1] || {};

const getNewBlockIndex = () => (getLastBlock().index || 0) + 1;

const proofOfWork = (lastProof, lastHash) => {
    let proof = 0;

    while (!isValidProof(lastProof, lastHash, proof)) {
        proof += 1;
    }

    return proof;
};

const isValidProof = (lastProof, lastHash, proof) => {
    const guess = sha256().update(`${lastProof}${lastHash}${proof}`).digest('hex');

    return guess.endsWith('000');
};

module.exports = {
    init,
    getChain,
    newTransaction,
};
