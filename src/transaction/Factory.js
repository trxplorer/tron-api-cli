import {decode58Check} from "@tronprotocol/wallet-api/src/utils/crypto";
import {base64DecodeFromString} from "@tronprotocol/wallet-api/src/lib/code";
import moment from 'moment'
import AnyPb from 'google-protobuf/google/protobuf/any_pb'

import {
    FreezeBalanceContract,
    UnfreezeBalanceContract,
    WitnessCreateContract,
    WitnessUpdateContract,
    AccountUpdateContract,
    TransferContract,
    TransferAssetContract,
    VoteWitnessContract
} from '../protocol/core/Contract_pb'

import {
    Transaction
} from '../protocol/core/Tron_pb'

// For reference:
// ACCOUNTCREATECONTRACT: 0,
// TRANSFERCONTRACT: 1,
// TRANSFERASSETCONTRACT: 2,
// VOTEASSETCONTRACT: 3,
// VOTEWITNESSCONTRACT: 4,
// WITNESSCREATECONTRACT: 5,
// ASSETISSUECONTRACT: 6,
// DEPLOYCONTRACT: 7,
// WITNESSUPDATECONTRACT: 8,
// PARTICIPATEASSETISSUECONTRACT: 9,
// ACCOUNTUPDATECONTRACT: 10,
// FREEZEBALANCECONTRACT: 11,
// UNFREEZEBALANCECONTRACT: 12,
// WITHDRAWBALANCECONTRACT: 13,
// UNFREEZEASSETCONTRACT: 14,
// CUSTOMCONTRACT: 20
function encodeString(str) {
    return Uint8Array.from(base64DecodeFromString(btoa(str)));
  }

const contractName = {
    [Transaction.Contract.ContractType.ACCOUNTCREATECONTRACT] : 'AccountCreateContract',
    [Transaction.Contract.ContractType.TRANSFERCONTRACT] : 'TransferContract',
    [Transaction.Contract.ContractType.TRANSFERASSETCONTRACT] : 'TransferAssetContract',
    [Transaction.Contract.ContractType.VOTEASSETCONTRACT] : 'VoteAssetContract',
    [Transaction.Contract.ContractType.VOTEWITNESSCONTRACT] : 'VoteWitnessContract',
    [Transaction.Contract.ContractType.WITNESSCREATECONTRACT] : 'WitnessCreateContract',
    [Transaction.Contract.ContractType.ASSETISSUECONTRACT] : 'AssetIssueContract',
    [Transaction.Contract.ContractType.WITNESSUPDATECONTRACT] : 'WitnessUpdateContract',
    [Transaction.Contract.ContractType.PARTICIPATEASSETISSUECONTRACT] : 'ParticipateAssetIssueContract',
    [Transaction.Contract.ContractType.ACCOUNTUPDATECONTRACT] : 'AccountUpdateContract',
    [Transaction.Contract.ContractType.FREEZEBALANCECONTRACT] : 'FreezeBalanceContract',
    [Transaction.Contract.ContractType.UNFREEZEBALANCECONTRACT] : 'UnfreezeBalanceContract',
    [Transaction.Contract.ContractType.WITHDRAWBALANCECONTRACT] : 'WidthdrawBalanceContract'
}

const createTransaction=(contractMessage, type)=>{

    let typeName = contractName[type]

    if (!typeName){
        throw new Error(`Unknow contract type ${type}`)
    }

    let parameter = new AnyPb.Any()
    parameter.pack(contractMessage.serializeBinary(), `protocol.${typeName}`)


    let contract = new Transaction.Contract()
    contract.setType(type)
    contract.setParameter(parameter)
    
    let raw = new Transaction.raw()
    raw.addContract(contract)
    raw.setTimestamp(moment().utc().unix())

    let transaction = new Transaction()
    transaction.setRawData(raw)

    return transaction
}

const factory= {
 
        [Transaction.Contract.ContractType.FREEZEBALANCECONTRACT]({owner,amount,duration}){

            let contract = new FreezeBalanceContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setFrozenBalance(amount);
            contract.setFrozenDuration(duration);

            return createTransaction(contract,Transaction.Contract.ContractType.FREEZEBALANCECONTRACT)
        },
        [Transaction.Contract.ContractType.UNFREEZEBALANCECONTRACT]({owner}){

            let contract = new UnfreezeBalanceContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));

            return createTransaction(contract,Transaction.Contract.ContractType.UNFREEZEBALANCECONTRACT)
        },
        [Transaction.Contract.ContractType.WITNESSCREATECONTRACT]({owner,url}){

            let contract = new WitnessCreateContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setUrl(encodeString(url));

            return createTransaction(contract,Transaction.Contract.ContractType.WITNESSCREATECONTRACT)
        },

        [Transaction.Contract.ContractType.WITNESSUPDATECONTRACT]({owner,url}){

            let contract = new WitnessUpdateContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setUpdateUrl(encodeString(url));

            return createTransaction(contract,Transaction.Contract.ContractType.WITNESSUPDATECONTRACT)
        },

        [Transaction.Contract.ContractType.ACCOUNTUPDATECONTRACT]({owner,name}){

            let contract = new AccountUpdateContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setAccountName(encodeString(name));

            return createTransaction(contract,Transaction.Contract.ContractType.ACCOUNTUPDATECONTRACT)
        },
 

        [Transaction.Contract.ContractType.TRANSFERCONTRACT]({owner,to,amount}){

            let contract = new TransferContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setToAddress(Uint8Array.from(decode58Check(to)));
            contract.setAmount(amount);

            return createTransaction(contract,Transaction.Contract.ContractType.TRANSFERCONTRACT)
        },
        [Transaction.Contract.ContractType.TRANSFERASSETCONTRACT]({owner,to,tokenName,amount}){
            console.log(owner,to,tokenName,amount)
            let contract = new TransferAssetContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            contract.setToAddress(Uint8Array.from(decode58Check(to)));
            contract.setAssetName(encodeString(tokenName));
            contract.setAmount(amount);          

            return createTransaction(contract,Transaction.Contract.ContractType.TRANSFERASSETCONTRACT)
        },
        [Transaction.Contract.ContractType.VOTEWITNESSCONTRACT]({owner,votes}){

            let contract = new VoteWitnessContract();
            contract.setOwnerAddress(Uint8Array.from(decode58Check(owner)));
            
            votes.forEach(vote => {

                    if ('votes' in vote && parseInt(vote.votes)>0){
                        let pVote = new VoteWitnessContract.Vote();

                        pVote.setVoteCount(parseInt(vote.votes));
                        pVote.setVoteAddress(Uint8Array.from(decode58Check(vote.address)))

                        contract.addVotes( pVote);
                    }

            });


            return createTransaction(contract,Transaction.Contract.ContractType.VOTEWITNESSCONTRACT)
        },

}

export default {

    createTx(type,options){

        return factory[type](options)


    }

}