const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const {
  deployments,
  ethers: {
    utils: {parseEther, formatEther},
  },
  ethers,
} = require('hardhat')

chai.use(chaiAsPromised)
const expect = chai.expect
const DELTA = 0.001

const { deployContract, mineUntil, increaseTime } = require('./helper')

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

describe('Whitelist.sol', () => {
  let deployer
  let feeReceiver1
  let feeReceiver2
  let payer1
  let payer2
  let wallets = []
  let addresses = []

  beforeEach(async () => {
    [deployer, payer1, payer2] = await ethers.getUnnamedSigners()
    feeReceiver1 = ethers.Wallet.createRandom()
    feeReceiver2 = ethers.Wallet.createRandom()

    wallets.push(payer1)
    addresses.push(payer1.address)

    for (let i = 1; i < 32; i++) {
      wallets.push(ethers.Wallet.createRandom())
      addresses.push(wallets[i].address)
    }
  })

  describe('Add or remove tree', async () => {
    it('addTree', async () => {
      const whitelistMock = await deployContract('WhitelistMock', [])

      expect(await whitelistMock.getTreeCount()).to.be.equal(0)

      const tree = new MerkleTree(addresses, keccak256, { hashLeaves: true, sortPairs: true })
      const root = tree.getHexRoot()

      await whitelistMock.connect(deployer).addTree(root)

      expect(await whitelistMock.getTreeCount()).to.be.equal(1)
    })

    it('removeTree', async () => {
      const whitelistMock = await deployContract('WhitelistMock', [])

      const tree = new MerkleTree(addresses, keccak256, { hashLeaves: true, sortPairs: true })
      const root = tree.getHexRoot()

      await whitelistMock.connect(deployer).addTree(root)

      expect(await whitelistMock.getTreeCount()).to.be.equal(1)

      await whitelistMock.connect(deployer).removeTree(root)

      expect(await whitelistMock.getTreeCount()).to.be.equal(0)
    })
  })

  describe('mockOnlyWhitelisted', async () => {
    it('Success', async () => {
      const whitelistMock = await deployContract('WhitelistMock', [])
      const tree = new MerkleTree(addresses, keccak256, { hashLeaves: true, sortPairs: true })
      const root = tree.getHexRoot()

      await whitelistMock.connect(deployer).addTree(root)

      const leaf = keccak256(addresses[0])
      const proof = tree.getHexProof(leaf)

      await whitelistMock.connect(wallets[0]).mockOnlyWhitelisted(proof)
    })

    it('Revert due to Whitelist: whitelist is required', async () => {
      const whitelistMock = await deployContract('WhitelistMock', [])
      const tree = new MerkleTree(addresses, keccak256, { hashLeaves: true, sortPairs: true })
      const root = tree.getHexRoot()

      await whitelistMock.connect(deployer).addTree(root)

      const leaf = keccak256(addresses[1])
      const proof = tree.getHexProof(leaf)

      await expect(whitelistMock.connect(wallets[0]).mockOnlyWhitelisted(proof)).to.be.revertedWith('Whitelist: whitelist is required')
    })
  })
})
