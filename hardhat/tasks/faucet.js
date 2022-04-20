const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .addPositionalParam("amount", "The amount of tokens")
  .setAction(async ({ receiver, amount }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const [sender] = await ethers.getSigners();
    console.log("==============================")
    console.log(sender.address)
    console.log("==============================")
    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther.mul(amount),
    });
    await tx2.wait();

    console.log(`Transferred ${amount} ETH to ${receiver}`);
  });