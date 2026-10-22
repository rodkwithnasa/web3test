import { Web3 } from 'web3';
import { Common, Sepolia } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx';
import { hexToBytes } from '@ethereumjs/util';

const apiKey = `${process.env.infura_api_key}`;
const apiSecret = `${process.env.infura_api_key_secret}`;

// Encode credentials to Base64 format for HTTP Basic Auth
const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');


const provider = `https://sepolia.infura.io/v3/${process.env.infura_api_key}`;
const web3Provider = new Web3.providers.HttpProvider(provider, 
    {
      providerOptions: {
        headers: {
          'Authorization': authHeader
        }
      }
    })
	
const web3 = new Web3(web3Provider)


// console.log(web3.eth.accounts.create())

const acct1 = '0x305c360aefcbfca99d6bc4f6de58660f0cf0b524'
const acct2 = '0x487BbFaa3932dbC6AE20bF783a405287765e10ED'
var pk1;
var pk2;
var dir;

var pkPromises = [new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (process.env.PK1 != null) {
	pk1 = Buffer.from(process.env.PK1,'hex')
    resolve("PK1 present");
  }
  else {
    reject( Error("Need to define PK1"));
  }
}),
new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (process.env.PK2 != null) {
	pk2 = Buffer.from(process.env.PK2,'hex')
    resolve("PK2 present");
  }
  else {
    reject( Error("Need to define PK2"));
  }
})
]
console.log('PK1=',process.env.PK1);

console.log('PK2=',process.env.PK2);

Promise.all(pkPromises).then( function(res) {
	console.log(res)
	console.log('pk1=',pk1)
	console.log('pk2=',pk2);
	dir = process.argv[2] == 'from1' ? { from: acct1, fromPk: pk1, to: acct2, toPk: pk2 } :
		{ from: acct2, fromPk: pk2, to: acct1, toPk: pk1 }
		console.log(dir)

	return Promise.resolve('Dir set')
}).then( function(res){
	console.log(res)
	return web3.eth.getBalance(dir.from)
}).then( function(bal) {
	console.log('From acct', dir.from, ' bal:',web3.utils.fromWei(bal,'ether'))
	return web3.eth.getBalance(dir.to)
}).then( function(bal) {
	console.log('To acct', dir.to, ' bal:',web3.utils.fromWei(bal,'ether'))
	return web3.eth.getTransactionCount(dir.from)
}).then( function(txCount) {
	// build
	console.log("Got TX count:", txCount)
	const txObject = {
		nonce: web3.utils.toHex(txCount),
		to: dir.to,
		value: web3.utils.toHex(web3.utils.toWei('1','wei')),
		gasLimit: web3.utils.toHex(210000),
		gasPrice: web3.utils.toHex(web3.utils.toWei('1','wei')),
		chainId: 11155111
	}
//	console.log(txObject)
	// sign
	//console.log('pk2=',pk2)
	const common = new Common({ chain: Sepolia })
//	console.log('Before createLegacyTx')
	const tx = createLegacyTx(txObject, { common })
//	console.log('After createLegacyTx')
	//const tx = new Tx(txObject)
	const signedTx = tx.sign(dir.fromPk)
//	console.log('After sign')
//	console.dir(signedTx);
//console.log('tx=',tx)
	const serializedTx = signedTx.serialize()
//	console.dir(serializedTx);
// FIX: Safely convert Uint8Array to a properly formatted hex string
	const raw = web3.utils.bytesToHex(serializedTx) 

	// broadcast
	return web3.eth.sendSignedTransaction(raw)

}).then( function(res) { console.log("Successful Result:", res.transactionHash)
		//console.log('txHash',txHash)
		//console.log('err, txHash=',err, txHash)
}).catch( function(err) { console.log( "In error catcher:",err)
}).then( function(res) { console.log("All done")} )
