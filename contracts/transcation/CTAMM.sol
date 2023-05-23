// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import  "./LP.sol";
import   "contracts/libraries/Math.sol";
import   "contracts/libraries/SafeMath.sol";

contract AMM is LP{
    using SafeMath for uint;
    address public tokenA;  // ERC20 代币地址
    uint256 private reserveA;  // ERC20 代币储备量
    uint256 private reserveB;  // ETH 储备量
   uint256 constant MINIMUM_LIQUIDITY = 1000;
    constructor(address _tokenA) {
        tokenA = _tokenA;
    }
    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        _reserve0 = reserveA;
        _reserve1 = reserveB;
    }
    function addLiquidity(uint256 amountA) external payable{
        require(msg.value >= 0, "ETH amount must be greater than 0");
        require(amountA >= 0, "Token amount must be greater than 0");
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Token transfer failed");
        (uint256 _reserve0, uint256 _reserve1) = getReserves(); // gas savings
        uint balance0 = IERC20(tokenA).balanceOf(address(this));
        uint balance1 = address(this).balance;
        uint amount0 = balance0.sub(_reserve0);
        uint amount1 = balance1.sub(_reserve1);
        reserveB += msg.value;
        reserveA += amountA;
        
    uint _totalSupply = totalSupply(); // gas savings, must be defined here since totalSupply can update in _mintFee
    uint256  liquidity;
    if (_totalSupply == 0) {
         liquidity = Math.sqrt(amount0 *amount1);
     } else {
        // 整型除法，选最小值（黑心）
        liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
    }
    require(liquidity > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED');
    _mint(msg.sender, liquidity);
}


function removeLiquidity() external  returns (uint amount0, uint amount1) {
    // (uint256 _reserve0, uint256 _reserve1) = getReserves(); // gas savings
    address _token0 = tokenA;                                // gas savings
    // address _token1;                             // gas savings
    uint balance0 = IERC20(_token0).balanceOf(address(this));    //获取合约地址持有的两种代币的余额
    uint balance1 = address(this).balance;
    //
    uint256 liquidity = balanceOf(address(msg.sender));
    uint _totalSupply = totalSupply(); // gas savings, must be defined here since totalSupply can update in _mintFee
    // 计算能领取的代币数量
    amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
    amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
    require(amount0 > 0 && amount1 > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_BURNED');
    _burn(msg.sender, liquidity);
        reserveA -= amount0;
    reserveB -= amount1;
    // _safeTransfer(_token0, to, amount0);
    payable(msg.sender).transfer(amount1);

}
function swap(
    uint256 amountIn,               //用户购买使用的货币数量
    uint256 amountOutMin,           //最小期望输出            
    address tokenIn,                //使用货币的地址
    address tokenOut                //期望得到的货币的地址
) external payable{
    require(amountIn > 0, "Invalid amount");
    require(amountOutMin > 0, "Invalid min amount");

    if (tokenIn == address(tokenA)) {
        require(tokenOut == address(0), "Invalid tokenOut");
        require(reserveB >= amountOutMin, "Insufficient ETH balance");
        require(IERC20(tokenA).balanceOf(msg.sender) >= amountIn, "Insufficient token balance");

        uint256 amountOut = getAmountOut(amountIn, tokenIn, tokenOut);
        require(amountOut >= amountOutMin, "Slippage exceeded");

        reserveA += amountIn;
        reserveB -= amountOut;
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");

        payable(msg.sender).transfer(amountOut);
    } else if (tokenIn == address(0)) {
        require(tokenOut == address(tokenA), "Invalid tokenOut");
        require(msg.value > 0,"Invalid value");
        require(reserveA >= amountOutMin, "Insufficient ETH balance");

        uint256 amountOut = getAmountOut(amountIn, tokenIn, tokenOut);
        require(amountOut >= amountOutMin, "Slippage exceeded");

        reserveA -= amountOut;
        reserveB += amountIn;
        require(IERC20(tokenA).transferFrom(address(this), msg.sender,amountIn), "Transfer failed");
    } else {
        revert("Invalid tokenIn");
    }
}

function getAmountOut(
    uint256 amountIn,
    address tokenIn,
    address tokenOut
) public view returns (uint256) {
    require(amountIn > 0, "Invalid amount");

    uint256 amountOut;
    uint256 reserveIn;
    uint256 reserveOut;

    if(tokenIn == tokenA) {
        require(tokenOut == address(0), "Invalid tokenOut");
        reserveIn = reserveA;
        reserveOut = reserveB;
    } else if (tokenIn == address(0)) {
        require(tokenOut == address(tokenA), "Invalid tokenOut");
        reserveIn = reserveB;
        reserveOut = reserveA;
    } else {
        revert("Invalid tokenIn");
    }

    uint256 numerator = amountIn * reserveOut*1000;
    uint256 denominator = 1000*(reserveIn + amountIn);
    amountOut = numerator / denominator;

    return amountOut;
}

function getAmountIn(
    uint256 amountOut,
    address tokenIn,
    address tokenOut
) public view returns (uint256) {
    require(amountOut > 0, "Invalid amount");

    uint256 amountIn;
    uint256 reserveIn;
    uint256 reserveOut;

    if (tokenIn == tokenA) {
        require(tokenOut == address(0), "Invalid tokenOut");
        reserveIn = reserveA;
        reserveOut = reserveB;
    } else if (tokenIn == address(0)) {
        require(tokenOut == address(this), "Invalid tokenOut");
        reserveIn = reserveB;
        reserveOut = reserveA;
    } else {
        revert("Invalid tokenIn");
    }

    uint256 numerator = reserveIn * amountOut.mul(1000);
    uint256 denominator = (reserveOut - amountOut).mul(1000);
    amountIn = (numerator / denominator) + 1;

    return amountIn;
}
// function getRemovableLiquidity(address user) public view returns (uint256) {
//     uint256 userLiquidity = userLiquidityMap[user];
//     uint256 totalLiquidity = totalSupply;
//     uint256 totalReserveA = reserveA;
//     uint256 totalReserveB = reserveB;

//     uint256 amountA = (userLiquidity * totalReserveA) / totalLiquidity;
//     uint256 amountB = (userLiquidity * totalReserveB) / totalLiquidity;

//     return amountA;
// }
    function getEthBalance() external view returns(uint256){
        return address(this).balance;
    }
    receive() external payable {
        // 这个函数将会在转入 ETH 时被触发
    }
}
