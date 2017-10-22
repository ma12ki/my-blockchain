const sha256 = require('hash.js/lib/hash/sha/256');
const stringify = require('json-stable-stringify');
const cuid = require('cuid');
const axios = require('axios');

let chain = [];
let currentTransactions = [];
let nodeId = '';
const nodes = new Set();

const getChain = () => chain;

const init = () => {
    newBlock(1, 100);
    nodeId = cuid();
};

const registerNodes = (addresses) => [].concat(addresses).forEach(registerNode);

const registerNode = (address) => nodes.add(address);

const getNodes = () => [...nodes];

// consensus
const resolveConflicts = async () => {
    const chains = await Promise.all([getChain(), ...getNodes().map(getRemoteChain)]);
    chain = chains.reduce((longest, chain) => chain.length > longest.length && isValidChain(chain) ? chain : longest, []);

    return chain;
};

const getRemoteChain = async (node) => {
    let chain = [];
    try {
        const res = await axios(`${node}/chain`);
        chain = res.data.chain;
    } catch (e) {
        console.log(`Something went wrong when retrieving chain from ${node}`, e);
    }

    return chain;
};

const isValidChain = (chain) => chain.every((block, index) => {
    // first block is a special case and should just be empty
    if (index === 0) {
        return block.transactions.length === 0;
    }
    const previousBlock = chain[index - 1];

    return block.previousHash === hash(previousBlock) &&
        isValidProof(previousBlock.proof, block.previousHash, block.proof);
});

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

const mine = () => {
    const lastBlock = getLastBlock();
    const lastProof = lastBlock.proof;
    const lastHash = hash(lastBlock);
    const proof = proofOfWork(lastProof, lastHash);

    getReward();

    return newBlock(proof, lastHash);
};

const getReward = () => newTransaction('0', nodeId, 1);

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
    mine,
    isValidChain,
    registerNodes,
    getNodes,
    resolveConflicts,
};
