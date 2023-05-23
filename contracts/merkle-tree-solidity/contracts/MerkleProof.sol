// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
 
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
 
 
contract MerkleVerify {
 
    //记录当前默克尔树
    bytes32 public merkleRoot = 0x5880c9cfd7eee8136772d1e6374b064077fb776409747cdd23cd39302a043110;
 
    //限制每个默克尔树，每个用户只能提现一次
    mapping(bytes32 => mapping(uint256 => uint256)) private merkleRootRecord;
 
    //计算 默克尔树。
    function withdraw(uint256 _index, uint256 _amount, bytes32[] calldata _proofs,address user)
    external
    view
    {
        //每个默克尔树，每个用户只能提现一次
        //验证默克尔树
        bytes32 _node = keccak256(abi.encodePacked(_index,user, _amount));
        require(MerkleProof.verify(_proofs, merkleRoot, _node), "Validation failed");
 
    }
 
    //验证这个证明是否用过
    function _isClaimed(uint256 index) public view returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = merkleRootRecord[merkleRoot][claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }
 
    //添加用过的证明
    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        merkleRootRecord[merkleRoot][claimedWordIndex] = merkleRootRecord[merkleRoot][claimedWordIndex] | (1 << claimedBitIndex);
    }
}