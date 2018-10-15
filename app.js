const Tx = require('ethereumjs-tx')
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/ababe5982ca4452da54adcc689e42d04')

// console.log(web3.eth.accounts.create())

const acct1 = '0xC017001dD04Bee0756cb64DEE5D3dAc298EdDFCD'
const acct2 = '0xaD7e7Bcd70941569185c7064F2C0b5AEeA5acd74'
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
		value: web3.utils.toHex(web3.utils.toWei('1','ether')),
		gasLimit: web3.utils.toHex(21000),
		gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei'))
	}
	console.log(txObject)
	// sign
	//console.log('pk2=',pk2)
	const tx = new Tx(txObject)
	tx.sign(dir.fromPk)
	//console.log('tx=',tx)
	const serializedTx = tx.serialize()
	const raw = '0x' + serializedTx.toString('hex')
	// broadcast
	return web3.eth.sendSignedTransaction(raw)

}).then( function(res) { console.log("Successful Result:", res.transactionHash)
		//console.log('txHash',txHash)
		//console.log('err, txHash=',err, txHash)
}).catch( function(err) { console.log( "In error catcher:",err)
}).then( function(res) { console.log("All done")} )
