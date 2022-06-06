const isAuthenticated = require("../policies/isAutheticated")
const config = require("../config/config")
const { getTotalTokens, getWalletBalance, transfer, transferFrom, mint, burn, createWallet, setContractOwner } = require("../functions/cryptoFunctions")
const { getStoredCryptoWallet, storeCryptoWallet, storeCryptoTransaction } = require("../functions/databaseFunctions")
const { postTxToWebhook, postNewWalletToWebhook } = require("../functions/requestFunctions")
const req = require("express/lib/request")

const mainPrivateKey = config.mainWallet.key,
webhookDefaultMessage = config.mainAdditionalData.webhookDefaultMessage


module.exports = app => {

  app.get("/crypto/total-tokens", async(req, res) => {

    let response

    try {
      response = await getTotalTokens()
    }catch (error) {
      console.log(error)
    } finally {
      res.send(response)
    }

  })

  app.get("/crypto/wallet-balance/:target", async(req, res) => {

    const { target } = req.params
    const targetStoredCryptoWallet = await getStoredCryptoWallet(target)
    let balanceOf

    try {
      balanceOf = await getWalletBalance(targetStoredCryptoWallet[0].wallet_address)      
    }catch (error) {
      console.log(error)
    } finally {
      res.send(balanceOf)
    }

  })

  app.post("/crypto/transfer", isAuthenticated, async(req, res) => {

    const { source, target, amount, event, background_process = true } = req.body
      const sourceStoredCryptoWallet = await getStoredCryptoWallet(source)
      const targetStoredCryptoWallet = await getStoredCryptoWallet(target)
      let mixedData, tx, receiptStatus

      if (background_process === true) res.send(webhookDefaultMessage) 

      try {
        tx = await transfer(sourceStoredCryptoWallet[0].wallet_private, targetStoredCryptoWallet[0].wallet_address, amount)
      }catch (error) {
        console.log(error)
      } finally {
        receiptStatus = tx.receiptStatus ?? { status: 0 }
        if(tx.error !== undefined) delete tx.error 
        // const receiptStatus = await geTxReceiptStatus(tx.hash)
        mixedData = { result: tx, payload: req.body, status: receiptStatus }
        await storeCryptoTransaction(target, mixedData, 'transfer')
        background_process === false ? res.send(mixedData) : await postTxToWebhook(mixedData)
      }

  })
  
  app.post("/crypto/transfer-user-to-main", isAuthenticated, async(req, res) => {

    const { source, amount, background_process = true } = req.body
    const sourceStoredCryptoWallet = await getStoredCryptoWallet(source)
    
    let mixedData, tx, receiptStatus

    if (background_process === true) res.send(webhookDefaultMessage) 

    try {
      tx = await transferFrom(sourceStoredCryptoWallet[0].wallet_address, amount)
    }catch (error) {
      console.log(error)
    } finally {
      receiptStatus = tx.receiptStatus ?? { status: 0 }
      if(tx.error !== undefined) delete tx.error 
      // const receiptStatus = await geTxReceiptStatus(tx.hash)
      mixedData = { result: tx, payload: req.body, status: receiptStatus }
      await storeCryptoTransaction(source, mixedData, 'transfer-user-to-main')
      background_process === false ? res.send(mixedData) : await postTxToWebhook(mixedData)
    }

  })

  app.post("/crypto/transfer-main-to-user", isAuthenticated, async(req, res) => {

    const { target, amount, background_process = true } = req.body
    const targetStoredCryptoWallet = await getStoredCryptoWallet(target)
      
    let mixedData, tx, receiptStatus

    if (background_process === true) res.send(webhookDefaultMessage) 

    try {
      tx = await transfer(mainPrivateKey, targetStoredCryptoWallet[0].wallet_address, amount)
    }catch (error) {
      console.log(error)
    } finally {
      receiptStatus = tx.receiptStatus ?? { status: 0 }
      if(tx.error !== undefined) delete tx.error 
      // const receiptStatus = await geTxReceiptStatus(tx.hash)
      mixedData = { result: tx, payload: req.body, status: receiptStatus }
      await storeCryptoTransaction(target, mixedData, 'transfer-main-to-user')
      background_process === false ? res.send(mixedData) : await postTxToWebhook(mixedData)
    }

  })

  app.post("/crypto/mint", isAuthenticated, async(req, res) => {

    const { target, amount, background_process = true } = req.body
    const targetStoredCryptoWallet = await getStoredCryptoWallet(target)
    let mixedData, tx, receiptStatus

    if (background_process === true) res.send(webhookDefaultMessage) 
      
    try {
      tx = await mint(targetStoredCryptoWallet[0].wallet_address, amount)
    } catch (error) {
      console.log(error)
    } finally {
      receiptStatus = tx.receiptStatus ?? { status: 0 }
      if(tx.error !== undefined) delete tx.error 
      mixedData = { result: tx, payload: req.body, status: receiptStatus }
      await storeCryptoTransaction(target, mixedData, 'mint')
      background_process === false ? res.send(mixedData) : await postTxToWebhook(mixedData)
    }

  })

  app.post("/crypto/burn", isAuthenticated, async(req, res) => {

    const { target, amount, background_process = true } = req.body
    const targetStoredCryptoWallet = await getStoredCryptoWallet(target)
    let mixedData, tx, receiptStatus

    if (background_process === true) res.send(webhookDefaultMessage) 
      
    try {
      tx = await burn(targetStoredCryptoWallet[0].wallet_address, amount)
    } catch (error) {
      console.log(error)
    } finally {
      receiptStatus = tx.receiptStatus ?? { status: 0 }
      if(tx.error !== undefined) delete tx.error 
      mixedData = { result: tx, payload: req.body, status: receiptStatus }
      await storeCryptoTransaction(target, mixedData, 'burn')
      background_process === false ? res.send(mixedData) : await postTxToWebhook(mixedData)
    }

  })

  app.post("/crypto/create-wallet", async(req, res) => {
    const { user_uuid, background_process = true } = req.body
    let mixedData, wallet

    if (background_process === true) res.send(webhookDefaultMessage) 

    try {
      wallet = await createWallet()
    } catch (error) {
      console.log(error)
    } finally {
      // console.log("wallet: ", wallet)
      const storedWallet = await storeCryptoWallet(user_uuid, wallet)
      mixedData = { result: wallet, payload: req.body }
      background_process === false ? res.send(mixedData) : await postNewWalletToWebhook(mixedData)
    }

  })

  app.post("/crypto/get-stored-wallet", isAuthenticated, async(req, res) => {
    const { target } = req.body
    let storedWallet

    try {
      storedWallet = await getStoredCryptoWallet(target)
    } catch (error) {
      console.log(error)
    } finally {
      //never return private key
      delete storedWallet[0].wallet_private
      //never return auto-incrementing ids
      delete storedWallet[0].id
      res.send(storedWallet[0])
    }

  })

}