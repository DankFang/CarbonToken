// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/merkle-tree-solidity/contracts/MerkleProof.sol";
import "contracts/carbonToken.sol";
import "./IpeInterface.sol";
import "./intenddantDao.sol";

contract Enterprise is IPeInterface {

    uint256 constant quota = 10000; 
    mapping(address => bool) public members;
    mapping(address => uint256) public _type;
    mapping(address => uint256) public efficiency;
    CTToken private CT;
    IntendantDao private Intendant;
    bytes32 public root;

    constructor(address payable CtAddress,address payable IntAdress) {
        CT = CTToken(CtAddress);
        Intendant = IntendantDao(IntAdress);
    }
    function getQuota( ) external view returns (uint256){
        return quota;
    }
    function claim() external {
        require(_isMember(msg.sender), "Address is not a member");
        // CT.transferFrom(CT.getAdmin(),msg.sender,quota);
        CT.distributeTokens(msg.sender,quota);

    }
    function LetMembertoTrue(address user) external   {
        members[user] = true;
    }
    function _isClaimed(address user) internal view returns (bool) {
        return CT._isDistributed(user);
    }

    function _isMember(address user) internal view returns (bool) {
        return members[user];
    }
    function isClaimed(address user) external view returns (bool) {
        return _isClaimed(user);
    }

    function isMember(address user) external view returns (bool) {
        return members[user];
    }
    function setType(address user,uint256 _type1) external {
        require(Intendant.isICB(msg.sender) || Intendant.isTAX(msg.sender),"must be the intendant");
        _type[user] = _type1;
    }
}