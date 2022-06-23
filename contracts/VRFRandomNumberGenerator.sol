// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFRandomNumberGenerator is VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;

  uint64 s_subscriptionId;

  address vrfCoordinator;

  bytes32 keyHash;

  uint32 callbackGasLimit = 2500000;

  uint16 requestConfirmations = 3;

  mapping (uint256=>Storage) randomNumberStorage;

  uint256 public queueIndex;
  uint256 public queueCounter;

  uint32 queueLength;

  uint256 queueBlob;

  uint256 public s_requestId;

  address s_owner;

  struct Storage {
    uint256[] queue;
  }

  event GeneratedRandomNumber(uint256 number);

  constructor(uint64 _subscriptionId, uint32 _queueLength, address _vrfCoordinator, bytes32 _keyHash) VRFConsumerBaseV2(vrfCoordinator) {
    require(_queueLength <= 100, 'VRFRandomNumberGenerator: queue length exceed limit');

    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_owner = msg.sender;
    s_subscriptionId = _subscriptionId;
    queueLength = _queueLength;

    vrfCoordinator = _vrfCoordinator;
    keyHash = _keyHash;
  }

  function requestRandomWords() public virtual onlyOwner {
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      queueLength
    );
  }

  function _requestRandomWords() internal virtual {
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      queueLength
    );
  }

  function fulfillRandomWords(
    uint256,
    uint256[] memory randomWords
  ) internal override {
    uint256 index = queueIndex == 0 && randomNumberStorage[0].queue.length > 0 ? 1 : 0;
    if (randomNumberStorage[0].queue.length > 0 && randomNumberStorage[1].queue.length > 0) {
      index = queueBlob == randomNumberStorage[queueIndex].queue[queueCounter] && queueCounter == 0 ? queueIndex : index;
    }
    randomNumberStorage[index].queue = randomWords;
  }

  function getRandomNumber(uint256 _range) public returns(uint256) {
    if (queueCounter == 0 && randomNumberStorage[queueIndex].queue[queueCounter] == queueBlob && randomNumberStorage[1].queue.length > 0) {
      uint256 rand = _fallbackRandom() % _range;

      emit GeneratedRandomNumber(rand % _range);
      return rand;
    } else {
      uint256 rand = randomNumberStorage[queueIndex].queue[queueCounter];

      if (queueCounter == queueLength / 2) {
        queueBlob = randomNumberStorage[1 - queueIndex].queue.length > 0 ? randomNumberStorage[1 - queueIndex].queue[0] : 0;
        _requestRandomWords();
      }

      queueIndex = queueCounter == queueLength - 1 ? 1 - queueIndex : queueIndex;
      queueCounter = queueCounter == queueLength - 1 ? 0 : queueCounter + 1;

      emit GeneratedRandomNumber(rand % _range);
      return rand % _range;
    }
  }

  function _fallbackRandom() internal virtual view returns(uint256) {
    return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
  }

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}
