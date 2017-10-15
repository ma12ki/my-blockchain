import sha256 from 'hash.js/lib/hash/sha/256';

const chain = [];
let currentTransactions = [];

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
};

const getLastBlock = () => chain[chain.length - 1];

const getNewBlockIndex = () => getLastBlock().index + 1;

const proofOfWork = (lastProof, lastHash) => {
    let proof = 0;
};

const isValidProof = (lastProof, proof) => {

};