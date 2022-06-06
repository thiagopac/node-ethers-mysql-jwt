// const path = require("../.env");

module.exports = {
  port: process.env.APP_PORT,
  db: {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      dialect: process.env.DIALECT || "mysql",
      host: process.env.DB_HOST
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || "your-secret-key"
  },
  binanceApi: {
    url: process.env.BINANCE_API_URL,
    key: process.env.BINANCE_API_KEY,
    explorer: process.env.BINANCE_EXPLORER_URL
  },
  mainWallet: {
    key: process.env.MAIN_KEY,
    address: process.env.MAIN_ADDRESS,
  },
  smartContract: {
    rpcProviderUrl: process.env.RPC_PROVIDER_URL,
    tokenAddress: process.env.SMART_CONTRACT_ADDRESS
  },
  mainAdditionalData: {
    webhookUrl: process.env.MAIN_WEBHOOK_URL,
    webhookSignature: process.env.MAIN_WEBHOOK_SIGNATURE,
    webhookDefaultMessage: { "message": process.env.MAIN_WEBHOOK_DEFAULT_MESSAGE } 
  }
};