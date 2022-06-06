const request = require('request-promise')
const config = require("../config/config")

const mainWebhookUrl = config.mainAdditionalData.webhookUrl
  
module.exports.postTxToWebhook = async(mixedData) => {
  
    return request({
      method: 'POST',
      uri: `${mainWebhookUrl}/tx`,
      body: mixedData,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer yourbearertemporarytokenfortests'
      }
    })
}

module.exports.postNewWalletToWebhook = async(mixedData) => {
  
  return request({
    method: 'POST',
    uri: `${mainWebhookUrl}/new-wallet`,
    body: mixedData,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourbearertemporarytokenfortests'
    }
  })
}