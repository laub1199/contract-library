const { ethers } = require("hardhat");

const deployContract = async (contractName, constructorArgs) => {
  let factory;
  try {
    factory = await ethers.getContractFactory(contractName);
  } catch (e) {
    console.log(e)
  }
  let contract = await factory.deploy(...(constructorArgs || []));
  await contract.deployed();
  return contract;
};

const mineUntil = async (targetBlock) => {
  while (await ethers.provider.getBlockNumber() < targetBlock) {
    await ethers.provider.send("evm_mine")
  }
}

const increaseTime = async (time) => {
  await ethers.provider.send('evm_increaseTime', [time])
  await ethers.provider.send('evm_mine')
}

const getBlockTime = async () => {
  return (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
}

module.exports = { deployContract, mineUntil, increaseTime, getBlockTime };
