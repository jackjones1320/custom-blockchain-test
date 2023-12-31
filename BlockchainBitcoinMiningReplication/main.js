const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
         return SHA256(this.index + this.previousHash+ this.timestamp +JSON.stringify(this.transactions) + this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10;

    }
    createGenesisBlock(){
        return new Block("01/02/2004", [], "0");

    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];

    }

    minePendingTransactions(miningRewardAddress){
        let previousBlock = this.getLatestBlock();
        let block = new Block(Date.now(), this.pendingTransactions,previousBlock.hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
    
        for(const block of this.chain){
            for(const transaction of block.transactions){
                if(transaction.fromAddress === address){
                    balance -= transaction.amount;
                }
                if(transaction.toAddress === address){
                    balance += transaction.amount;
                }
            }
        }
    
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let jujuBit = new Blockchain();
jujuBit.createTransaction(new Transaction('address1', 'address2', 10));
jujuBit.createTransaction(new Transaction('address2', 'address1', 5));

console.log('\n Starting the miner ...');
jujuBit.minePendingTransactions('jujus-address');

console.log('\nBalance of juju is', jujuBit.getBalanceOfAddress('jujus-address'));

console.log('\n Starting the miner again...');
jujuBit.minePendingTransactions('jujus-address');

console.log('\nBalance of juju is', jujuBit.getBalanceOfAddress('jujus-address'));

console.log(JSON.stringify(jujuBit, null, 4));

console.log('Blockchain valid? ' + jujuBit.isChainValid()); //blockchain validity check
