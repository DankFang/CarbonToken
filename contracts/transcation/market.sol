// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "contracts/carbonToken.sol";
import "contracts/dao/IpeInterface.sol";

contract Market{
    IPeInterface  private Person;
    IPeInterface  private Enterprise;
    CTToken private CT;
    constructor(address person,address enterprise,address payable CtAddress){
        Person = IPeInterface(person);
        Enterprise = IPeInterface(enterprise);
        CT = CTToken(CtAddress);
    }
    struct Order {
        uint256 orderId;
        uint256 purchaseLimit;
        uint256 unitPrice;
        uint256 remainingQuantity;
        bool isCompleted;
        address merchant;
        uint256 ETHremain;
    }

    // mapping(uint256 => Order) private orders;
    uint256 private orderCount;
    Order[] private orders;

function createOrder(uint256 purchaseLimit, uint256 unitPrice) external payable {
    require(IPeInterface(Enterprise).isMember(msg.sender), "You are not an enterprise");
    require(msg.value == purchaseLimit * unitPrice, "Incorrect payment amount");

    uint256 orderId = orderCount++;
    orders.push(Order(orderId, purchaseLimit, unitPrice, purchaseLimit, false,msg.sender,msg.value));

    // orders[orderId] = Order(purchaseLimit, unitPrice, purchaseLimit, false,msg.sender,msg.value);

    // emit OrderCreated(orderId, msg.sender, purchaseLimit, unitPrice);
}


function placeOrder(uint256 orderId, uint256 quantity) external payable {
        Order storage order = orders[orderId];
        require(!order.isCompleted, "Order is already completed");
        // require(msg.value == order.unitPrice * quantity, "Incorrect payment amount");
        require(quantity <= order.remainingQuantity, "Quantity exceeds remaining limit");
        require(address(this).balance >= order.unitPrice  * quantity , "exceed eth balance");
        // Perform the purchase logic here...
        
        CT.transfer(order.merchant,quantity);
        payable(msg.sender).transfer(order.unitPrice  * quantity);
        order.remainingQuantity -= quantity;
        if (order.remainingQuantity == 0) {
            order.isCompleted = true;
            delete orders[orderId];
        }
    }  
function cancelOrder(uint256 orderId) external {
    Order storage order = orders[orderId];
    require(!order.isCompleted, "Order is already completed");
    require(IPeInterface(Enterprise).isMember(msg.sender), "You are not an enterprise");
    require(order.merchant == msg.sender,"you are not the owner");
    // 将剩余的代币退还给企业用户
    uint256 remainingQuantity = order.remainingQuantity;
    payable(order.merchant).transfer(remainingQuantity);
    // 标记挂单为已完成，并从挂单列表中删除
    order.isCompleted = true;
    if (orderId < orders.length - 1) {
            orders[orderId] = orders[orders.length - 1];
    }
        orders.pop();
}
function getAllOrders() external view returns (Order[] memory) {
    return orders;
}
function getOrder(uint256 orderId) external view returns (Order memory) {
        require(orderId < orderCount, "Invalid order ID");
        return orders[orderId];
    }
}
