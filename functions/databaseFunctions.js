const pool = require("../database")

const { randomUUID } = require('crypto')

module.exports.getStoredCryptoWallet = async(user_uuid) => {
    return result = pool.query(`SELECT * FROM wallets WHERE user_uuid = "${user_uuid}" LIMIT 1`)
}
  
module.exports.storeCryptoWallet = async(user_uuid, wallet) => {
    const sql = `INSERT INTO wallets (uuid, user_uuid, wallet_address, wallet_public, wallet_private)
                 VALUES('${randomUUID()}', '${user_uuid}', '${wallet.address}', '${wallet.publicKey}', '${wallet.privateKey}')`
    return result = pool.query(sql)
}
  
module.exports.storeCryptoTransaction = async(user_uuid, mixedData, type) => {
    const sql = `INSERT INTO crypto_transactions (uuid, user_uuid, data, type)
                 VALUES('${randomUUID()}', '${user_uuid}', '${JSON.stringify(mixedData)}', '${type}')`
    return result = pool.query(sql)
}