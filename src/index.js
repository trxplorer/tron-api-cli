import axios from 'axios'
import AccountCli from './AccountCli'
import WitnessCli from './WitnessCli'
import {
    API_ACCOUNT_EXISTS
} from './Constants'
class Cli {

    /**
     * 
     * @param {Options} options 
     */
    constructor(options){
        this.options = options
    }

    /**
     * Get an instance of account client
     * @param {string} address the account address to query
     * @param {string} pkey the account private key (optional)
     * @return {AccountCli}
     */
    account(address,pkey){
        return new AccountCli(this.options.endpoint,address,pkey)
    }

    /**
     * Checks if an account with a name or an address (or both) exists
     * @param {AccountExistsCriteria} criteria (see api.trxplorer.io for details)
     */
    accountExists({name,address}){
        return axios.get(`${this.options.endpoint}${API_ACCOUNT_EXISTS}`,{params:{name,address}}).then((res)=>{return res.data})
    }

    /**
     * Get an instance of witness client
     */
    witness(){
        return new WitnessCli(this.options.endpoint)
    }

}


export default Cli;