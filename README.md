# Common contract library for projects

## Dependencies

OpenZeppelin Contract Version: `^4.3.3`

Chainlink Contract Version: `^0.4.1`

Solidity Version: `^0.8.0`

## Installation
> Clone the repository as submodule and place it in the ~/contracts/library directory
> <br>
> ⚠️ Always remove the artifacts and cache directory when use it as a submodule ⚠️

## Folder & File Structure

```
.
├── contracts               # Contracts folder
│  ├── interfaces           # Interface contracts
│  ├── mocks                # Mock contracts for testing
│  ├── utils                # Utility contracts
│  └── ...
├── deploy                  # Deployment scripts folder
├── scripts                 # Operation scripts folder
├── tasks                   # Task scripts
│  ├── index.js             # Task index file, should require all tasks
│  └── ...
├── test                    # Test scripts folder
│  ├── helper.js            # Test helper functions for testing
│  └── ...                  # Test files with *.test.js
└── ...
```

## Version Control
Please be aware that new version of a contract should be created if any change is wanted to be made to a deployed contract with `Vn` while n is the version number
```
e.g.

Payable.sol to PayableV2.sol as Payable.sol has been deployed in other project
New version of PayableV2.sol will be PayableV3.sol, PayableV4.sol, PayableV5.sol, ...
```

## Contract List
### Contracts
- [`VRFRandomNumberGenerator`](#vrfrandomnumbergeneratorsol)

### Utility Contracts
- [`Payable`](#payablesol)
- [`StakingPeriodControl`](#stakingperiodcontrolsol)
- [`Whitelist`](#whitelistsol)

### Contract Interfaces
- `IVRFRandomNumberGenerator`

## Contracts Description

### VRFRandomNumberGenerator.sol

#### Type:
Contract

#### Description:
Random number generator contract that implements the Chainlink Oracle Service's Verifiable Random Function

#### Deployment:
1. Create a subscription to [Chainlink VRF](https://vrf.chain.link/) in the target chain
2. Fund the subscription with $LINK
3. Get the `vrfCoordinator` address and `keyHash` of the target chain in [Chainlink docs](https://docs.chain.link/docs/vrf-contracts/)
4. Deploy the contract with the following parameters:
    - `subcriptionId`: the subscription ID of the target chain created at [Chainlink VRF](https://vrf.chain.link/)
    - `vrfCoordinator`: the address of the VRF coordinator
    - `keyHash`: the key hash of the target chain
5. Copy the deployed `VRFRandomNumberGenerator` address and add it as a consumer in the created subscription in [Chainlink VRF](https://vrf.chain.link/)
6. Run `requestRandomWords` function to fill up the first queue
7. Always make sure the subscription is funded with $LINK`

### Payable.sol

#### Type:
Utility Contract

#### Description:
Utility contract that provides functions for payment control for both native tokens and ERC20 tokens with 1 fee receiver

#### Implementation:
Extends with
```solidity
import "./library/contracts/utils/PayableV2.sol";

contract Contract is Payable {
    constructor (
        address payable _feeReceiver
    )
    Payable(_feeReceiver)
    {
        // ...
    }
}
```

Switch between native token and ERC20 token
```javascript
// Run following functions with owner account

const erc20 = await ethers.getContract('Erc20')

await contract.setIsErc20(erc20.address)
await contract.setIsNonErc20()
```

Payment
```solidity
// Run following function in contract

function fn(uint256 _amount) public payable {
    pay(_amount);
    // ...
}
```

### StakingPeriodControl.sol

#### Type:
Utility Contract

#### Description:
Utility contract that provides functions for staking period control, including staking period start, end and reward end time in both `block.timestamp` and `block.number` measures

#### Implementation:
Extends with
```solidity
import "./library/contracts/utils/StakingPeriodControl.sol";

contract Contract is StakingPeriodControl {
    
    # instead of setting up with constructor, additional initailize() function should be used

    function initialize(
        uint256 _isTimestamp,
        uint256 _start,
        uint256 _end,
        uint256 _bonusEnd
    ) {
        __StakingPeriodControl__init(_isTimestamp, _start, _end, _bonusEnd);
    }
}
```

Provided modifiers

- `beforeStakeStart`
- `afterStakeStart`
- `beforeStakeEnd`
- `afterStakeEnd`
- `beforeBonusEnd`
- `afterBonusEnd`

### Whitelist.sol

#### Type:
Utility Contract

#### Description:
Utility contract that provides functions for whitelist control with merkle tree implementation

#### Implementation:
Extends with
```solidity
import "./library/contracts/utils/Whitelist.sol";

contract Contract is Whitelist {
   // ...
}
```

Provided modifier
- `onlyWhitelisted(bytes32[] memory proof)`
```solidity
 // Contract level implementation
 
 function fn(bytes32[] memory _proof) public onlyWhitelisted(_proof) {
    // ...
 }
```

To add whitelist
``` javascript
const keccal256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const addresses = [...]

const tree = new MerkleTree(addresses, keccak256, { hashLeaves: true, sortPairs: true })

await contract.addTree(tree.getRoot())

// save hashed addresses for later use
const hashedAddresses = addresses.map(address => keccal256(address))

// ...
```

To run function with whitelist
``` javascript
const keccal256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const targetAddress = '0x...'

// this should be generated when adding the address to the whitelist
const hashedAddresses = []

const tree = new MerkleTree(hashedAddresses, keccal256, { hashLeaves: false, sortPairs: true })

const leaf = keccal256(targetAddress)
const proof = tree.getProof(leaf)

// proof is always needed for whitelist checking, input [] when not needed
await contract.fn(proof)
```

## Additional package for static analysis

### [crytic/slither](https://github.com/crytic/slither)

#### Prerequisites
1. python3 & pip3
2. solc-select

To install solc-select
```shell
pip3 install solc-select
```

To install slither
```shell
pip3 install slither-analyzer
```

## After writing contracts and related test cases

### Reformat contracts with prettier
```shell
yarn run prettier
```

### Run coverage test with `solidity-coverage`

```shell
npx hardhat coverage

# with hardhat-shorthand installed
hh coverage
```

### Run static analysis with `slither`
```shell
yarn run slither
```

