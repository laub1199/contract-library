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
} = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const from = 1
  const to = 2

  for(let i = from; i <= to; i++) {
    const tx = {data: '0x', to: ethers.constants.AddressZero, gasPrice: 50000000000, nonce: i};
    const x = await deployer.sendTransaction(tx)
    console.log(i)
    console.log(x.hash)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
