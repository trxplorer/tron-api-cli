import axios from 'axios'
import {longToByteArray} from "@tronprotocol/wallet-api/src/utils/bytes"
import {hexStr2byteArray} from "@tronprotocol/wallet-api/src/lib/code"

import {
    API_DEFAULT_ENDPOINT,
    API_BLOCK_LAST
} from './Constants'

class BlockCli{
    constructor(endpoint=API_DEFAULT_ENDPOINT){
        this.endpoint = endpoint
    }

    /**
     * Get the latest available block
     */
    getLatest(){
        return axios.get(`${this.endpoint}${API_BLOCK_LAST}`).then((res)=>{
            return res.data
        })
    }

    /**
     * Add Bock reference to a transaction
     * @param {Transaction} transaction
     */
    addRef(transaction){
        return this.getLatest().then((latestBlock)=>{
            
                let latestBlockHash = latestBlock.hash;
                let latestBlockNum = latestBlock.num;

                let numBytes = longToByteArray(latestBlockNum);
                numBytes.reverse();
                let hashBytes = hexStr2byteArray(latestBlockHash);
            
                let generateBlockId = [...numBytes.slice(0, 8), ...hashBytes.slice(8, hashBytes.length - 1)];
            
                let rawData = transaction.getRawData();
                rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
                rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
                rawData.setExpiration(latestBlock.timestamp+(60*5*1000))
                transaction.setRawData(rawData);
            return transaction;
        })
    }
}

export default BlockCli