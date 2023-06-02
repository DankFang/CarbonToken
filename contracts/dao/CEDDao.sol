// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract CEDDao{
    //碳排放检测dao
    // 这个CEDDao的成员
    mapping(address=>bool) members;
    mapping(address=>bytes) desc;
    bytes32 root;
    constructor(address CEDmember ){
        members[CEDmember] = true;
    }
    function isMember(address CEDAddress) public view returns (bool){
//          bytes32 leaf = keccak256(abi.encodePacked(CEDAddress));
//        //   同时满足在树里，且是CEDDao的成员
//         bool isInTree =MerkleProof.verify(proof,root,leaf);
//         bool isCED= members[CEDAddress];
//         return(isInTree&&isCED);
        return members[CEDAddress];
     }
}