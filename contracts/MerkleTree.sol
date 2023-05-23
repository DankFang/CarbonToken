// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./merkle-tree-solidity/contracts/MerkleProof.sol";

contract MerkleTree {
   uint256 public constant TREE_HEIGHT = 20;

    bytes32[TREE_HEIGHT] public filledSubtrees;
    bytes32[TREE_HEIGHT] public zeros;   
     bytes32 public root;
    mapping(bytes32 => bool) private includedLeaves;

    constructor(bytes32[] memory addresses) {
        require(addresses.length > 0, "No addresses provided");

        root = generateMerkleTree(addresses);
        for (uint256 i = 0; i < addresses.length; i++) {
            includedLeaves[addresses[i]] = true;
        }
    }

    function generateMerkleTree(bytes32[] memory addresses) private pure returns (bytes32) {
        require(addresses.length > 0, "No addresses provided");

        bytes32[] memory tree = addresses;
        uint256 length = addresses.length;

        while (length > 1) {
            uint256 offset = 0;

            for (uint256 i = 0; i < length; i += 2) {
                if (i + 1 < length) {
                    tree[offset] = sha256(abi.encodePacked(tree[i], tree[i + 1]));
                } else {
                    tree[offset] = tree[i];
                }
                offset++;
            }

            length = (length + 1) / 2;
        }

        return tree[0];
    }

    function getProof(bytes32 leaf) public view returns (bytes32[] memory) {
        require(includedLeaves[leaf], "Address not found in the Merkle tree");

        bytes32[] memory proof = new bytes32[](TREE_HEIGHT);
        bytes32[] memory nodes = new bytes32[](TREE_HEIGHT + 1);
        uint256 index = 0;
        uint256 level = 0;

        nodes[0] = leaf;

        for (uint256 i = 0; i < TREE_HEIGHT; i++) {
            if (index % 2 == 0) {
                nodes[level + 1] = _hashLeftRight(nodes[level], zeros[i]);
                proof[i] = nodes[level + 1];
            } else {
                nodes[level + 1] = _hashLeftRight(zeros[i], nodes[level]);
                proof[i] = nodes[level + 1];
            }

            index /= 2;
            level++;
        }

        return proof;
    }

    function _hashLeftRight(bytes32 left, bytes32 right) internal pure returns (bytes32) {
        return sha256(abi.encodePacked(left, right));
    }
}
