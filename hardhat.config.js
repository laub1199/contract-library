require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("./tasks");
require("hardhat-gas-reporter");
require("hardhat-deploy");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 1337
    },
    devnet: {
      url: "http://ec2-35-88-7-74.us-west-2.compute.amazonaws.com",
      chainId: 1024,
      gasPrice: 14000000000
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ed08a8c8e8cc42ce869a2ca650ddf3f3",
      chainId: 4,
      // accounts: ['']
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/ed08a8c8e8cc42ce869a2ca650ddf3f3",
      chainId: 1,
      // accounts: [''],
      gasPrice: 50000000000
    }
  },
  gasReporter: {
    enabled: true,
    // token: 'BNB',
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    // gasPrice: 70,
    currency: 'ETH',
    coinmarketcap: 'e2d737ae-c334-4a87-9ff4-24eeb1087b76'
  },
  mocha: {
    timeout: 70000
  }
};
