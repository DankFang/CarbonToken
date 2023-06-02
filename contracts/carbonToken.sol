// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "contracts/dao/IpeInterface.sol";

contract CTToken is ERC20 {

    mapping(address => mapping(uint256 => bool)) isDistributed;    ////本年度是否已分配碳配额
    uint256 constant public CT_DEFAULT = 1000;   //暂定一个默认值
    mapping(address => bool) public isAddressInMerkleTree;   //地址是否在merkel树中
    mapping(address => uint256) public debts;  //欠款字段
    uint256 private currentYear; //当前年份
    address public admin; //

    constructor() payable ERC20("CT", "CT") {
        _mint(msg.sender, 1000000000 * (10 ** decimals()));
        admin = msg.sender;
        currentYear = 1;
    }
    function _isDistributed(address addresses) public view returns (bool){    
            return isDistributed[addresses][currentYear];
    } 
    function getAdmin() public view returns (address){    
            return admin;
    }
    function distributeTokens(address addresses,uint256 amount) external {
            require(isDistributed[addresses][currentYear] == false,"you've got it");
             transferFrom(admin,addresses,amount);
             isDistributed[addresses][currentYear] = true;
    }
    // function distribute(address addresses) public {
    //         _mint(addresses,1);
    //     }
    function nextYear() internal {
        currentYear++;
        // resetDistributionStatus();
    }

    // function resetDistributionStatus() private {
    //     for (uint256 i = 0; i < addresses.length; i++) {
    //         addressInfo[addresses[i]].isDistributed = false;
    //     }
    // }

    //核算
    // function settleAccounts(address user, uint256 amount) public {
    //     require(msg.sender == address(this), "Only contract owner can call this function");

    //     if (balanceOf(user) >= amount) {                //如果余额足够
    //         _transfer(user,admin,amount);
    //     } else {
    //         _transfer(user,admin,balanceOf(user));
    //         debts[user] += amount - balanceOf(user) ;

    //     }
    // }
    function transferETHToExternalAccount(address payable recipient, uint256 amount) external {
        recipient.transfer(amount); 
    }
    receive() external payable {
        // 这个函数将会在转入 ETH 时被触发
    }
    // 将外部账户的 ETH 转入合约账户
    function depositETH() external payable {}
    // function getContractBalance() public view returns (uint256) {
    //     return address(this).balance;
    // }
    function getEthBalance() external view returns(uint256){
        return address(this).balance;
    }
}
