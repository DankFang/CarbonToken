// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MerkleTreeWithHistory {
    uint256 public constant TREE_HEIGHT = 20;

    bytes32[TREE_HEIGHT] public filledSubtrees;
    bytes32[TREE_HEIGHT] public zeros;

    function initialize() public {
        for (uint256 i = 0; i < TREE_HEIGHT; i++) {
            zeros[i] = bytes32(0);
            filledSubtrees[i] = zeros[i];
        }
    }

    function _hashLeftRight(bytes32 left, bytes32 right) internal pure returns (bytes32) {
        return sha256(abi.encodePacked(left, right));
    }

    function _getLeaf(uint256 index, bytes32 element) internal pure returns (bytes32) {
        return _hashLeftRight(element, bytes32(index));
    }

    function _getProofHelper(
        uint256 index,
        bytes32 root,
        bytes32[] memory proof
    ) internal pure returns (bytes32) {
        uint256 level = 0;
        bytes32 computedHash = _getLeaf(index, proof[0]);

        for (uint256 j = 1; j < proof.length; j++) {
            bytes32 proofElement = proof[j];

            if (index % 2 == 0) {
                computedHash = _hashLeftRight(computedHash, proofElement);
            } else {
                computedHash = _hashLeftRight(proofElement, computedHash);
            }

            index /= 2;
            level++;
        }

        return computedHash;
    }

    function getRoot(bytes32[] memory proof) public view returns (bytes32) {
        require(proof.length == TREE_HEIGHT, "Invalid proof length");

        return _getProofHelper(0, filledSubtrees[TREE_HEIGHT - 1], proof);
   
    }
}