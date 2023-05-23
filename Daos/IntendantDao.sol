// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./EnterpriseDao.sol";
contract intendantDao{
    mapping(address=>bool) ICB;
    mapping(address=>bool) TAX;
    
    enterpriseDao public theEnterpriseDao;
    // address public Enterprisedaoaddr;
    constructor(address enterpriseDaoAddr){
        
        theEnterpriseDao=enterpriseDao(enterpriseDaoAddr);
    }
    function isICB(address ICBaddr) external view returns (bool){
        return ICB[ICBaddr];
    }
    function isTAX(address TAXaddr) external view returns (bool){
        return TAX[TAXaddr];
    }
    function setICB(address addr) external {
        ICB[addr]=true;
    }
    function setTAX(address addr) external {
        TAX[addr] = true;
    }
    function setType(address setEnterpriseAddress, uint256 score,uint256 _efficacy) external{
        require(ICB[msg.sender]);
        theEnterpriseDao.setType(setEnterpriseAddress,score,_efficacy);
    }
}