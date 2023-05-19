// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "../CarbonToken/carbonToken.sol";

contract enterpriseDao {
    address EnterpriseAddress;
    // 这里需要写死，之后再改
    address intendant;
    bytes32 root;
    mapping(address => uint256) theType;
    mapping(address=>uint256) efficacy;
    CTToken public cTToken;
    modifier onlyintendant() {
        require(msg.sender == intendant, "Only intendant can call this function");
        _;
    }

    constructor(address enterpriseAddress, address CTaddress) {
        EnterpriseAddress = enterpriseAddress;
        cTToken = CTToken(CTaddress);
    }

    function isMember(bytes32[] memory proof) public view returns (bool) {
        bytes32 computedHash = keccak256(abi.encodePacked(EnterpriseAddress));

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }
        // 这里一直计算，直到计算到root，然后比较出来与root是否相等
        return computedHash == root;
    }

    function setType(address setEnterpriseAddress, uint256 score,uint256 _efficacy) external onlyintendant{
        bool Distributed = cTToken.getDistributedType(setEnterpriseAddress);
        if (Distributed) {
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
