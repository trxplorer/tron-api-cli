# tron-api-cli
TRON blockchain api client for nodejs and browser

Tron api cli uses trxplorer.io api (https://api.trxplorer.io) to interract with TRON blockchain protocol

## Install 

``` bash
yarn install tron-api-cli
```

### Features

- Query blockchain (blocks, transactions, accounts, representative etc ...)
- Create transactions for contracts (send trx, freeze/unfreeze trx, vote etc ...)
- Sign transaction 


## Usage example

``` javascript
import tronapi from "tron-api-client"

# Get user transactions
tronapi.account('TXuLKjf8J8aCKgDgA5uczwn1yQNYVPLocY').getTransactions().then((transactions)=>{ console.log(transactions)})

# Send trx with account/pkey (transaction is automatically signed before broadcasting to TRON network)
tronapi.account('TXuLKjf8J8aCKgDgA5uczwn1yQNYVPLocY',pkey).sendTRX({to:'TZuLFjf8J8aCKgDgA5uczwn1yQNYVPLocY',amount:100})

```

## Cli
**Kind**: global class  

* [Cli](#Cli)
    * [new Cli(options)](#new_Cli_new)
    * [.account(address, pkey)](#Cli+account) ⇒ <code>AccountCli</code>
    * [.accountExists(criteria)](#Cli+accountExists)
    * [.witness()](#Cli+witness)

<a name="new_Cli_new"></a>

### new Cli(options)

| Param | Type |
| --- | --- |
| options | <code>Options</code> | 

<a name="Cli+account"></a>

### cli.account(address, pkey) ⇒ <code>AccountCli</code>
Get an instance of account client

**Kind**: instance method of [<code>Cli</code>](#Cli)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | the account address to query |
| pkey | <code>string</code> | the account private key (optional) |

<a name="Cli+accountExists"></a>

### cli.accountExists(criteria)
Checks if an account with a name or an address (or both) exists

**Kind**: instance method of [<code>Cli</code>](#Cli)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>AccountExistsCriteria</code> | (see api.trxplorer.io for details) |

<a name="Cli+witness"></a>

### cli.witness()
Get an instance of witness client


## AccountCli
**Kind**: global class  

* [AccountCli](#AccountCli)
    * [new AccountCli(endpoint, address, privateKey)](#new_AccountCli_new)
    * [.getInfo()](#AccountCli+getInfo) ⇒ [<code>AccountInfo</code>](#AccountInfo)
    * [.getTransactions(criteria)](#AccountCli+getTransactions)
    * [.getAllVotes(criteria)](#AccountCli+getAllVotes)
    * [.getAllFreeze(criteria)](#AccountCli+getAllFreeze)
    * [.getTokens(criteria)](#AccountCli+getTokens)
    * [.sendTRX(toAddress, amount, pkey)](#AccountCli+sendTRX) ⇒ [<code>TransactionResult</code>](#TransactionResult)
    * [.sendToken(toAddress, tokenName, amount, pkey)](#AccountCli+sendToken) ⇒ [<code>TransactionResult</code>](#TransactionResult)
    * [.vote()](#AccountCli+vote)
    * [.freeze(amount, duration)](#AccountCli+freeze) ⇒ [<code>TransactionResult</code>](#TransactionResult)
    * [.unfreeze()](#AccountCli+unfreeze) ⇒ [<code>TransactionResult</code>](#TransactionResult)
    * [.widthdraw()](#AccountCli+widthdraw) ⇒ [<code>TransactionResult</code>](#TransactionResult)
    * [.sign(transaction)](#AccountCli+sign)
    * [.createWitness(url)](#AccountCli+createWitness)
    * [.update(name)](#AccountCli+update)

<a name="new_AccountCli_new"></a>

### new AccountCli(endpoint, address, privateKey)
Account client


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Api endpoint |
| address | <code>string</code> | Account address |
| privateKey | <code>string</code> | Account private key (optional) |

<a name="AccountCli+getInfo"></a>

### accountCli.getInfo() ⇒ [<code>AccountInfo</code>](#AccountInfo)
Get basic account informations

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
<a name="AccountCli+getTransactions"></a>

### accountCli.getTransactions(criteria)
Get transactions where current account is involved

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type |
| --- | --- |
| criteria | <code>TransactionCriteria</code> | 

<a name="AccountCli+getAllVotes"></a>

### accountCli.getAllVotes(criteria)
Get all votes associated to current account

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type |
| --- | --- |
| criteria | <code>VoteCriteria</code> | 

<a name="AccountCli+getAllFreeze"></a>

### accountCli.getAllFreeze(criteria)
Get all freeze/unfreeze history associated to current account

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type |
| --- | --- |
| criteria | <code>VoteCriteria</code> | 

<a name="AccountCli+getTokens"></a>

### accountCli.getTokens(criteria)
Get the token balances associated to this account

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type |
| --- | --- |
| criteria | <code>TokenCriteria</code> | 

<a name="AccountCli+sendTRX"></a>

### accountCli.sendTRX(toAddress, amount, pkey) ⇒ [<code>TransactionResult</code>](#TransactionResult)
Send an amount of TRX to an address

/!\ It is highly recommended to use this method with an offline signature strategy

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
**Returns**: [<code>TransactionResult</code>](#TransactionResult) - transaction result  

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| amount | <code>number</code> | 
| pkey | <code>string</code> | 

<a name="AccountCli+sendToken"></a>

### accountCli.sendToken(toAddress, tokenName, amount, pkey) ⇒ [<code>TransactionResult</code>](#TransactionResult)
Send an amount of the specified token to an address

/!\ It is highly recommended to use this method with an offline signature strategy

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
**Returns**: [<code>TransactionResult</code>](#TransactionResult) - transaction result  

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| tokenName | <code>string</code> | 
| amount | <code>number</code> | 
| pkey | <code>string</code> | 

<a name="AccountCli+vote"></a>

### accountCli.vote()
Vote for representatives

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
<a name="AccountCli+freeze"></a>

### accountCli.freeze(amount, duration) ⇒ [<code>TransactionResult</code>](#TransactionResult)
Freeze an amount of TRX for a given duration (in days) 

/!\ It is highly recommended to use this method with an offline signature strategy

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
**Returns**: [<code>TransactionResult</code>](#TransactionResult) - transaction result  

| Param | Type |
| --- | --- |
| amount | <code>number</code> | 
| duration | <code>number</code> | 

<a name="AccountCli+unfreeze"></a>

### accountCli.unfreeze() ⇒ [<code>TransactionResult</code>](#TransactionResult)
Unfreeze the amount of TRX that can be frozen at this time

/!\ It is highly recommended to use this method with an offline signature strategy

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
**Returns**: [<code>TransactionResult</code>](#TransactionResult) - transaction result  
<a name="AccountCli+widthdraw"></a>

### accountCli.widthdraw() ⇒ [<code>TransactionResult</code>](#TransactionResult)
Withdraw available allowance (for super representatives rewarded for producing blocks)

/!\ It is highly recommended to use this method with an offline signature strategy

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  
**Returns**: [<code>TransactionResult</code>](#TransactionResult) - transaction result  
<a name="AccountCli+sign"></a>

### accountCli.sign(transaction)
Sign a transaction with provided private key

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type |
| --- | --- |
| transaction | <code>Transaction</code> | 

<a name="AccountCli+createWitness"></a>

### accountCli.createWitness(url)
Make current account become a witness if possible

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | representative url |

<a name="AccountCli+update"></a>

### accountCli.update(name)
Update account informations

**Kind**: instance method of [<code>AccountCli</code>](#AccountCli)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name associated to current account address |

<a name="AccountInfo"></a>

## AccountInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| balance | <code>number</code> | Current trx balance |
| bandwidth | <code>number</code> | current accoutn bandwidth |
| frozen | <code>number</code> | amount of frozen trx |
| power | <code>number</code> | power associated to account |

<a name="TransactionResult"></a>

## TransactionResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| txId | <code>string</code> | Transaction id (if transaction succeeded) |
| success | <code>boolean</code> | transaction succeeded ? |
| messageError | <code>string</code> | the error message |


<a name="BlockCli"></a>

## BlockCli
**Kind**: global class  

* [BlockCli](#BlockCli)
    * [new BlockCli(endpoint)](#new_BlockCli_new)
    * [.getLatest()](#BlockCli+getLatest)
    * [.addRef(transaction)](#BlockCli+addRef)

<a name="new_BlockCli_new"></a>

### new BlockCli(endpoint)
Block client


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Api endpoint |

<a name="BlockCli+getLatest"></a>

### blockCli.getLatest()
Get the latest available block

**Kind**: instance method of [<code>BlockCli</code>](#BlockCli)  
<a name="BlockCli+addRef"></a>

### blockCli.addRef(transaction)
Add Bock reference to a transaction

**Kind**: instance method of [<code>BlockCli</code>](#BlockCli)  

| Param | Type |
| --- | --- |
| transaction | <code>Transaction</code> | 


<a name="WitnessCli"></a>

## WitnessCli
**Kind**: global class  

* [WitnessCli](#WitnessCli)
    * [new WitnessCli(endpoint)](#new_WitnessCli_new)
    * [.getAll(criteria)](#WitnessCli+getAll)

<a name="new_WitnessCli_new"></a>

### new WitnessCli(endpoint)
Witness client


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Api endpoint |

<a name="WitnessCli+getAll"></a>

### witnessCli.getAll(criteria)
Get all witnesses matching the criteria

**Kind**: instance method of [<code>WitnessCli</code>](#WitnessCli)  

| Param | Type |
| --- | --- |
| criteria | <code>WitnessCriteria</code> | 

