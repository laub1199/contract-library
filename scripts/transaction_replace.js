const {
  getNamedAccounts,
  getChainId,
  getUnnamedAccounts,
  ethers: {
    utils: { formatEther, parseEther },
    getUnnamedSigners,
    getContract,
  },
  config,
  ethers,
} = require('hardhat')
const {envInit} = require("../utils/env")
const readlineSync = require('readline-sync')

const OPERATION = 'transaction_replace'

const main = async () => {
  const network = await envInit()

  console.log('============================================================')
  console.log(`Target network: ${network}`)
  console.log(`Operation ${OPERATION} start running...`)
  console.log('===========================================================')

  // =================== EDIT VARIABLE HERE ==========================

  const inputs = {
    from: process.env.TRANSACTION_REPLACE_FROM,
    to: process.env.TRANSACTION_REPLACE_TO,
  }

  // =================================================================

  console.log(`Please confirm the follow inputs for operation ${OPERATION}`)
  console.log('')
  for (const key in inputs) {
    console.log(`${key}: ${inputs[key]}`)
  }
  console.log('')

  const text = readlineSync.question(`Please input 'confirm' to proceed: `)
  if (text !== 'confirm') {
    console.log('Invalid input, terminating operation...')
    console.log('')
    console.log('===========================================================')
    return
  }
  console.log('Confirmed. Starting operation process...')
  console.log('')
  console.log('===========================================================')
  console.log('')

  // ================== EDIT DEPLOY SCRIPT HERE ======================

  console.log(`Start replacing transaction from nonce ${inputs.from} to nonce ${inputs.to}`)
  for(let i = inputs.from; i <= inputs.to; i++) {
    const txDetail = {data: '0x', to: ethers.constants.AddressZero, gasPrice: 50000000000, nonce: i};
    const tx = await deployer.sendTransaction(txDetail)
    console.log(`Replacing nonce ${i} with hash ${tx.hash}`)
  }
  console.log('')

  // =================================================================


  console.log('===========================================================')
  console.log('Done!')
  console.log('===========================================================')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
