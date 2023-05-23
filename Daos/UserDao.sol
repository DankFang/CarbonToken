// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "../CarbonToken/carbonToken.sol";
import "./Merklelibrary.sol";
contract userDao{
    address UserAddress;
    // mapping(address=>bool) isClaimed;
    // 默克尔树的树根
    bytes32 root;
    CTToken public cTToken;
    constructor(address userAddress,address CTaddress){
        UserAddress = userAddress;
        cTToken=CTToken(CTaddress);
    }
    // 确定是否是用户成员
    // function isMember(bytes32[] memory proof) public view returns(bool){
    //     bytes32 computedHash = keccak256(abi.encodePacked(UserAddress));
        
    //     for (uint256 i = 0; i < proof.length; i++) {
    //         bytes32 proofElement = proof[i];
            
    //         if (computedHash < proofElement) {
    //             computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
    //         } else {
    //             computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
    //         }
    //     }
    //     // 这里一直计算，直到计算到root，然后比较出来与root是否相等
    //     return computedHash == root;
    // }
    function isMember(bytes32[] memory proof) public view returns(bool){
        bytes32 leaf = keccak256(abi.encodePacked(UserAddress));
        return MerkleProof.verify(proof,root,leaf);
    }
    // 查看是否已经领取
    function isClaimed(bytes32[] memory proof) external view returns(bool){
        bool cangetClaim = isMember(proof);
        bool getClaime;
        if(cangetClaim){
            getClaime = cTToken.getClaimed(UserAddress);
        }
        return getClaime;
    }
    // 获取碳配额余量
    function claim() external view returns(uint256){
        
        return cTToken.balanceOf(UserAddress);
    }
}