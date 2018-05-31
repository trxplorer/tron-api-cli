import axios from 'axios'
import {signTransaction} from "@tronprotocol/wallet-api/src/utils/crypto";
import {base64DecodeFromString,byteArray2hexStr} from "@tronprotocol/wallet-api/src/utils/bytes";
import TronProtocol from './protocol/core/Tron_pb';
import TransactionFactory from './transaction/Factory'
import BlockCli from './BlockCli'

import {
    API_DEFAULT_ENDPOINT,
    API_ACCOUNT_INFO,
    API_ACCOUNT_TOKENS,
    API_ACCOUNT_VOTES_ALL,
    API_ACCOUNT_FREEZE_ALL,
    API_ACCOUNT_TRANSACTIONS,
    API_TRON_BROADCAST
} from './Constants'

const pKeyRequired =(pkey)=>{
    if (!pkey){
        throw new Error("Private key is required to perform this operation")
    }
}


class AccountCli{

    /**
     * Account client
     * 
     * @param {string} endpoint Api endpoint
     * @param {string} address Account address
     * @param {string} privateKey Account private key (optional)
     */
    constructor(endpoint=API_DEFAULT_ENDPOINT,address,privateKey){
        this.endpoint = endpoint;
        this.address = address
        this.pkey = privateKey
        this.blockCli = new BlockCli(endpoint)
    }

    /**
     * Get basic account informations
     * @return {AccountInfo}
     */
    getInfo(){
        return axios.get(`${this.endpoint}${API_ACCOUNT_INFO}?address=${this.address}`).then((res)=>{return res.data})
    }

    /**
     * Get transactions where current account is involved
     * @param {TransactionCriteria} criteria 
     */
    getTransactions(criteria){
        return axios.get(`${this.endpoint}${API_ACCOUNT_TRANSACTIONS}`,{params:criteria}).then((res)=>{return res.data})
    }

    /**
     * Get all votes associated to current account
     * @param {VoteCriteria} criteria 
     */
    getAllVotes(criteria){
        return axios.get(`${this.endpoint}${API_ACCOUNT_VOTES_ALL}`,{params:criteria}).then((res)=>{return res.data})
    }

    /**
     * Get all freeze/unfreeze history associated to current account
     * @param {VoteCriteria} criteria 
     */
    getAllFreeze(criteria){
        return axios.get(`${this.endpoint}${API_ACCOUNT_FREEZE_ALL}`,{params:criteria}).then((res)=>{return res.data})
    }

    /**
     * Get the token balances associated to this account
     * @param {TokenCriteria} criteria 
     */
    getTokens(criteria){
        return axios.get(`${this.endpoint}${API_ACCOUNT_TOKENS}`,{params:criteria}).then((res)=>{return res.data})
    }

    /**
     * Send an amount of TRX to an address
     * 
     * /!\ It is highly recommended to use this method with an offline signature strategy
     * 
     * @param {string} toAddress 
     * @param {number} amount 
     * @param {string} pkey 
     * @return {TransactionResult} transaction result
     */
    sendTRX(toAddress,amount,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.TRANSFERCONTRACT,{owner:this.address,to:toAddress,amount})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Send an amount of the specified token to an address
     * 
     * /!\ It is highly recommended to use this method with an offline signature strategy
     * 
     * @param {string} toAddress 
     * @param {string} tokenName 
     * @param {number} amount 
     * @param {string} pkey 
     * @return {TransactionResult} transaction result
     */
    sendToken(toAddress,tokenName,amount,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.TRANSFERASSETCONTRACT,{owner:this.address,to:toAddress,tokenName,amount})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Vote for representatives
     */
    vote(votes,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.VOTEWITNESSCONTRACT,{owner:this.address,votes})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Freeze an amount of TRX for a given duration (in days) 
     * 
     * /!\ It is highly recommended to use this method with an offline signature strategy
     * 
     * @param {number} amount 
     * @param {number} duration
     * @return {TransactionResult} transaction result
     */
    freeze(amount,duration,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.FREEZEBALANCECONTRACT,{owner:this.address,amount,duration})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node:node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Unfreeze the amount of TRX that can be frozen at this time
     * 
     * /!\ It is highly recommended to use this method with an offline signature strategy
     * 
     * @return {TransactionResult} transaction result 
     */
    unfreeze(node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.UNFREEZEBALANCECONTRACT,{owner:this.address})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node:node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Withdraw available allowance (for super representatives rewarded for producing blocks)
     * 
     * /!\ It is highly recommended to use this method with an offline signature strategy
     * 
     * @return {TransactionResult} transaction result
     */
    widthdraw(){

    }

    /**
     * Sign a transaction with provided private key
     * @param {Transaction} transaction 
     */
    sign(transaction){
        pKeyRequired(this.pkey)
        let signedTx = signTransaction(this.pkey,transaction);
        let transactionBytes = signedTx.serializeBinary();
        let transactionString = byteArray2hexStr(transactionBytes);
        return transactionString
    }

    /**
     * Make current account become a witness if possible
     * @param {string} url representative url
     */
    createWitness(url,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.WITNESSCREATECONTRACT,{owner:this.address,url})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

    updateWitness(url,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.WITNESSUPDATECONTRACT,{owner:this.address,url})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

    /**
     * Update account informations
     * @param {string} name the name associated to current account address
     */
    update(name,node){
        pKeyRequired(this.pkey)
        let tx = TransactionFactory.createTx(TronProtocol.Transaction.Contract.ContractType.ACCOUNTUPDATECONTRACT,{owner:this.address,name})
        return this.blockCli.addRef(tx).then((txWithRef)=>{
            let transactionString = this.sign(txWithRef,this.pkey)
            return axios.post(`${this.endpoint}${API_TRON_BROADCAST}`,{payload:transactionString,node}).then((res)=>{return res.data})            
        })
    }

}

/**
 * @typedef {Object} AccountInfo
 * @property {number} balance Current trx balance
 * @property {number} bandwidth current accoutn bandwidth
 * @property {number} frozen amount of frozen trx
 * @property {number} power power associated to account
 */

/**
 * @typedef {Object} TransactionResult
 * @property {string} txId Transaction id (if transaction succeeded)
 * @property {boolean} success transaction succeeded ?
 * @property {string} messageError the error message
 */


export default AccountCli
