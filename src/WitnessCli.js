import axios from 'axios'
import {longToByteArray} from "@tronprotocol/wallet-api/src/utils/bytes"
import {hexStr2byteArray} from "@tronprotocol/wallet-api/src/lib/code"

import {
    API_DEFAULT_ENDPOINT,
    API_WITNESS_ALL
} from './Constants'

class WitnessCli{
    constructor(endpoint=API_DEFAULT_ENDPOINT){
        this.endpoint = endpoint
    }

    /**
     * Get all witnesses matching the criteria
     * @param {WitnessCriteria} criteria 
     */
    getAll(criteria){
        console.log(criteria)
        return axios.get(`${this.endpoint}${API_WITNESS_ALL}`,{params:criteria}).then((res)=>{
            return res.data
        })
    }



}

export default WitnessCli