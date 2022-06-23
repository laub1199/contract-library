// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
  bytes32[] public merkleTrees;

  modifier onlyWhitelisted (bytes32[] memory proof) {
    bool isWhitelisted = false;
    for (uint256 i = 0; i < merkleTrees.length; i++) {
      if (MerkleProof.verify(proof, merkleTrees[i], keccak256(abi.encodePacked(msg.sender)))) {
        isWhitelisted = true;
        break;
      }
    }
    require(isWhitelisted, 'Whitelist: whitelist is required');
    _;
  }

  function addTree(bytes32 root) external onlyOwner {
    merkleTrees.push(root);
  }

  function removeTree(bytes32 root) external onlyOwner {
    for (uint256 i = 0; i < merkleTrees.length; i++) {
      if (merkleTrees[i] == root) {
        merkleTrees[i] = merkleTrees[merkleTrees.length - 1];
        merkleTrees.pop();
        break;
      }
    }
  }

  function getTreeCount() external view returns (uint256) {
    return merkleTrees.length;
  }
}
