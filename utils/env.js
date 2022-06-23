const {ethers} = require("hardhat");

exports.envInit = async () => {
  let network = await ethers.provider.getNetwork()
  network = network.name === 'unknown' ? 'devnet' : network.name
  require('dotenv').config({ path: `./env/.env.${network}` })

  return network
}
