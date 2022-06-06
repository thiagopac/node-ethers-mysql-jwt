const { ethers } = require("ethers")
const config = require("../config/config")
const mainTokenContractABI = require("../contractABI.json")

const blockExplorerURL = config.binanceApi.explorer,
provider = new ethers.providers.JsonRpcProvider(config.smartContract.rpcProviderUrl),
mainPrivateKey = config.mainWallet.key,
mainAddress = config.mainWallet.address,
wallet = new ethers.Wallet(mainPrivateKey, provider),
mainTokenContractAddress = config.smartContract.tokenAddress,
mainTokenContractView = new ethers.Contract(mainTokenContractAddress, mainTokenContractABI, provider),
mainTokenContractWrite = mainTokenContractView.connect(wallet)

// Returns the total tokens in the contract
module.exports.getTotalTokens = async () => {
  try {
      const result = await mainTokenContractView.totalSupply()
      const totalTokens = ethers.utils.formatEther(result)
      console.log('totalTokens: ', totalTokens)
      return totalTokens
  } catch (e) {
      console.log('Error: ', e.stack || e.toString() || e)
      return e
  }
}

// Returns the balance of a given wallet address
module.exports.getWalletBalance = async (walletAddress) => {

  console.log("walletAddress: ", walletAddress)
  
  try {
    const result = await mainTokenContractView.balanceOf(walletAddress)
    const walletBalance = ethers.utils.formatEther(result)
    console.log('walletBalance: ', walletBalance)
    return walletBalance.toString()
  } catch (e) {
    console.log('Error: ', e.stack || e.toString() || e)
    return e
  }
}

// Set contract wallet owner
module.exports.setContractOwner = async () => {
  try {
    const owner = await mainTokenContractWrite.setMainWallet(mainAddress)
    console.log('setMainWallet: ', owner)
    return owner
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}
      
// Transfers a given amount of tokens between wallets
// Has to be called by the source wallet
module.exports.transfer = async (sourceWalletKey, targetWalletAddress, amount) => {

  // console.log("targetWalletAddress: ", targetWalletAddress)
  // console.log("amount: ", amount)

  const sourceWallet = new ethers.Wallet(sourceWalletKey, provider)
  const transactionTokenContractWrite = mainTokenContractView.connect(sourceWallet)

  try {
    // The amount needs to be converted to the precision in the smart contract (18 zeroes)
    amount = ethers.utils.parseUnits(`${ amount }`, 18);

    let tx = await transactionTokenContractWrite.transfer(targetWalletAddress, amount)
    tx.receiptStatus = await tx.wait();
    // console.log("tx.receiptStatus: ", tx.receiptStatus)

    txViewUrl = blockExplorerURL + '/tx/', tx.hash
    console.log('Transaction created!: ', txViewUrl)
    return tx
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}

// Transfers a given amount of tokens between wallets
// Has to be called by the owner wallet
module.exports.transferFrom = async (sourcetWalletAddress, amount) => {

  const ownerWallet = new ethers.Wallet(mainPrivateKey, provider)
  const transactionTokenContractWrite = mainTokenContractView.connect(ownerWallet)

  try {
    // The amount needs to be converted to the precision in the smart contract (18 zeroes)
    amount = ethers.utils.parseUnits(`${ amount }`, 18);

    let tx = await transactionTokenContractWrite.transferFrom(sourcetWalletAddress, mainAddress, amount)
    tx.receiptStatus = await tx.wait();
    // console.log("tx.receiptStatus: ", tx.receiptStatus)

    txViewUrl = blockExplorerURL + '/tx/' + tx.hash
    console.log('Transaction created!: ', txViewUrl)
    return tx
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}

// Mints new tokens into a given wallet
// Has to be called by the owner account
module.exports.mint = async (targetWallet, amount) => {
  try {
    // The amount needs to be converted to the precision in the smart contract (18 zeroes)
    amount = ethers.utils.parseUnits(`${ amount }`, 18);

    let tx = await mainTokenContractWrite.mint(targetWallet, amount)
    tx.receiptStatus = await tx.wait();
    // console.log("tx.receiptStatus: ", tx.receiptStatus)

    txViewUrl = blockExplorerURL + '/tx/' + tx.hash
    console.log('Transaction created!: ' + txViewUrl)
    return tx
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}

// Burns existing tokens from a given wallet
// Has to be called by the owner account
module.exports.burn = async (targetWallet, amount) => {
  try {
    // The amount needs to be converted to the precision in the smart contract (18 zeroes)
    amount = ethers.utils.parseUnits(`${ amount }`, 18);

    let tx = await mainTokenContractWrite.burn(targetWallet, amount)
    tx.receiptStatus = await tx.wait();
    // console.log("tx.receiptStatus: ", tx.receiptStatus)
    
    txViewUrl = blockExplorerURL + '/tx/' + tx.hash
    console.log('Transaction created!: ', txViewUrl)
    return tx
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}

// Create a new wallet
module.exports.createWallet = async () => {
  try {
    const wallet = ethers.Wallet.createRandom().connect(provider);
    console.log('Wallet created! ', 'addr: ' + wallet.address + ' | ' + 'pub: ' + wallet.publicKey + ' | ' +'priv: ' + wallet.privateKey)
    return wallet
  } catch (e) {
    console.log(e.message || e)
    return e
  }
}