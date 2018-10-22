const Tx = require('ethereumjs-tx')
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/ababe5982ca4452da54adcc689e42d04')
const BigNumber = require('bignumber.js');

// console.log(web3.eth.accounts.create())

const acct1 = '0xC017001dD04Bee0756cb64DEE5D3dAc298EdDFCD'
const acct2 = '0xaD7e7Bcd70941569185c7064F2C0b5AEeA5acd74'
var pk1
var pk2
var dir
var contract
var nonce

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
//console.log('PK1=',process.env.PK1);

//console.log('PK2=',process.env.PK2);

Promise.all(pkPromises).then( function(res) {
//	console.log(res)
//	console.log('pk1=',pk1)
//	console.log('pk2=',pk2);
	dir = process.argv[2] == 'from1' ? { from: acct1, fromPk: pk1, to: acct2, toPk: pk2 } :
		{ from: acct2, fromPk: pk2, to: acct1, toPk: pk1 }
//		console.log(dir)

	return Promise.resolve('Dir set')
}).then( function(res){
//	console.log(res)
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
	nonce = txCount
	//const data = '0x60806040526012600260006101000a81548160ff021916908360ff16021790555034801561002c57600080fd5b5060025460ff600061010081900a909204811616600a0a62200b209081026003819055600160a060020a033381161683526004602080850191825290810184209190915560408051808201909152600781527f686d6154657374000000000000000000000000000000000000000000000000009181019182525191926100b492909190610100565b5060408051808201909152600681527f686d6153796d00000000000000000000000000000000000000000000000000006020820190815290516100f991600191610100565b505061019b565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061014157805160ff191683800117855561016e565b8280016001018555821561016e579182015b8281111561016e578251825591602001919060010190610153565b5061017a92915061017e565b5090565b61019891905b8082111561017a5760008155600101610184565b90565b610883806101aa6000396000f3006080604052600436106100ae5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100b3578063095ea7b31461013d57806318160ddd1461017b57806323b872dd146101a3578063313ce567146101d457806342966c681461020557806370a082311461021d57806379cc67901461023e57806395d89b4114610265578063a9059cbb1461027a578063dd62ed3e146102a1575b600080fd5b3480156100bf57600080fd5b506100c86102cb565b6040516020808201828103835283518152835183929182019185019080838360005b838110156101025781810151838201526020016100ea565b50505050905090810190601f16801561012f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561014957600080fd5b5061016460048035600160a060020a03169060200135610357565b604080519115151515825251602090910181900390f35b34801561018757600080fd5b506101906103cc565b6040805191825251602090910181900390f35b3480156101af57600080fd5b50610164600160a060020a0360048035821691602091820180359091169101356103d2565b3480156101e057600080fd5b506101e9610474565b604051808260ff1660ff16815260200191505060405180910390f35b34801561021157600080fd5b50610164600435610485565b34801561022957600080fd5b50610190600160a060020a036004351661052a565b34801561024a57600080fd5b5061016460048035600160a060020a0316906020013561053c565b34801561027157600080fd5b506100c8610656565b34801561028657600080fd5b5061016460048035600160a060020a031690602001356106af565b3480156102ad57600080fd5b5061019060048035600160a060020a039081169160200135166106c5565b600080546040805160206002600180861615610100020390941693909304601f8101849004840284018201909252818152929183018282801561034f5780601f106103245761010080835404028352916020019161034f565b820191906000526020600020905b81548152906001019060200180831161033257829003601f168201915b505050505081565b600160a060020a033381168082166000908152600560208083019182528181018084208887169687168552909252908220859055604080518681529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929190910181900390a350600192915050565b60035481565b60006005600085600160a060020a0316600160a060020a03168152602001908152602001600020600033600160a060020a0316600160a060020a0316815260200190815260200160002054821115151561042b57600080fd5b600160a060020a03808516811660009081526005602080830191825281018083203385169094168352929052208054839003905561046a8484846106e2565b5060019392505050565b60025460006101000a900460ff1681565b6000816004600033600160a060020a0316600160a060020a0316815260200190815260200160002054101515156104bb57600080fd5b600160a060020a03338116908116600090815260046020808301918252908101909120805485900390556003805485900390556040805185815290517fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5929190910181900390a2506001919050565b60046020526000908152604090205481565b6000816004600085600160a060020a0316600160a060020a03168152602001908152602001600020541015151561057257600080fd5b6005600084600160a060020a0316600160a060020a03168152602001908152602001600020600033600160a060020a0316600160a060020a031681526020019081526020016000205482111515156105c957600080fd5b600160a060020a0380841680821660008181526004602080830191825281810180842080548a90039055938352600582528383203387169096168352949052208054859003905560038054859003905560408051858152905191927fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca592910181900390a250600192915050565b600180546040805160206002848616156101000286900390941693909304601f8101849004840284018201909252818152929183018282801561034f5780601f106103245761010080835404028352916020019161034f565b60006106bc3384846106e2565b50600192915050565b600560209081526000928352604080842090915290825290205481565b600082600160a060020a03166000141515156106fd57600080fd5b816004600086600160a060020a0316600160a060020a03168152602001908152602001600020541015151561073157600080fd5b600160a060020a03808416166000818152600460208083018281529081018084205494845291905290205483011015151561076b57600080fd5b50600160a060020a03808316808216600081815260046020808301828152808201808520548b89169889168087528584528287205490875285845282872080548c90039055968652939091529092208054870190556040805187815290519390910194927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929190910181900390a3806004600085600160a060020a0316600160a060020a03168152602001908152602001600020546004600087600160a060020a0316600160a060020a03168152602001908152602001600020540114151561085157fe5b505050505600a165627a7a72305820fd8545a117de68080c503f476d1820b1b5c18c68b263b5e24e4556552de7ca750029'
	
	contractAddress = '0x3A3e245C24655D222A9e19DD156c3C4F85281Ea4'
	contractAbi = [
		{
			"constant": true,
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_spender",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "approve",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "totalSupply",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_from",
					"type": "address"
				},
				{
					"name": "_to",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "transferFrom",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "decimals",
			"outputs": [
				{
					"name": "",
					"type": "uint8"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "burn",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_from",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "burnFrom",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "symbol",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_to",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "allowance",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Transfer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_owner",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "_spender",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "Approval",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Burn",
			"type": "event"
		}
	]

	contract = new web3.eth.Contract(contractAbi,contractAddress)
	return contract.methods.balanceOf(dir.from).call()
}).then( function(bal) {
	console.log('From bal=',bal)
	return contract.methods.balanceOf(dir.to).call()
}).then( function(bal) {

	console.log('To bal=',bal)

	const amount = new BigNumber('1000000000000000000')

	const data = contract.methods.transfer(dir.to,amount.toString()).encodeABI()

	const txObject = {
		nonce: web3.utils.toHex(nonce),
		gasLimit: web3.utils.toHex(1000000),
		gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
		to: contractAddress,
		data: data
	}
	//console.log(txObject)
	// sign
	//console.log('pk2=',pk2)
	const tx = new Tx(txObject)
	tx.sign(dir.fromPk)
	//console.log('tx=',tx)
	const serializedTx = tx.serialize()
	const raw = '0x' + serializedTx.toString('hex')
	// broadcast
	return web3.eth.sendSignedTransaction(raw)

}).then( function(res) { 
	console.log("Successful Result:", res.transactionHash)
	return contract.methods.balanceOf(dir.from).call()
}).then( function(bal) {
	console.log('From bal=',bal)
	return contract.methods.balanceOf(dir.to).call()
}).then( function(bal) {
	console.log('To bal=',bal)
}).catch( function(err) {
	console.log( "In error catcher:",err)
}).then( function(res) { console.log("All done")} )
