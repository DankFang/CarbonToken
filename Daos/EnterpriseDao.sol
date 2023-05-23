// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "../CarbonToken/carbonToken.sol";
import "./Merklelibrary.sol";
contract enterpriseDao {
    address EnterpriseAddress;
    // 这里需要写死，之后再改
    address intendant;
    bytes32 root;
    mapping(address => uint256) theType;
    mapping(address=>uint256) efficacy;
    CTToken public cTToken;
    modifier onlyintendant() {
        require(msg.sender==intendant, "Only intendant can call this function");
        _;
    }

    constructor(address enterpriseAddress, address CTaddress) {
        EnterpriseAddress = enterpriseAddress;
        cTToken = CTToken(CTaddress);
    }

     function isMember(bytes32[] memory proof) public view returns (bool){
          bytes32 leaf = keccak256(abi.encodePacked(EnterpriseAddress));
          return MerkleProof.verify(proof,root,leaf);
     }

    function setType(address setEnterpriseAddress, uint256 score,uint256 _efficacy) external onlyintendant{
        bool Enterprise = cTToken.getEnterpriseType(setEnterpriseAddress);
        if (Enterprise) {
            theType[setEnterpriseAddress] = score;
            efficacy[setEnterpriseAddress] = _efficacy;
        }
    }
     // 查看是否已经领取
    function isClaimed(bytes32[] memory proof) external view returns(bool){
        bool cangetClaim = isMember(proof);
        bool getClaime;
        if(cangetClaim){
            getClaime = cTToken.getClaimed(EnterpriseAddress);
        }
        return getClaime;
    }
    // 获取碳配额余量
    function claim() external view returns(uint256){
        return cTToken.balanceOf(EnterpriseAddress);
    }
}
