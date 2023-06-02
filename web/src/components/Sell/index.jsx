/*
 * @Author: diana
 * @Date: 2023-05-19 22:10:06
 * @LastEditTime: 2023-06-01 21:50:56
 */
import React, { useState, useContext } from 'react';
import { MyContext } from '../../interact';
import { ethers } from 'ethers';

const Purchase = () => {

    const [amount, setAmount] = useState();
    const [price, setPrice] = useState();

    const { contracts } = useContext(MyContext);

    const handleAmount = (e) => {
        const { value } = e.target;
        setAmount(value);
    }
    const handlePrice = (e) => {
        const { value } = e.target;
        setPrice(value);
    }


    // Purchase
    const Purchase = async () => {
        try {
            const value = ethers.utils.formatUnits(amount * price, "gwei");
            const SellTx = await contracts[5].createOrder(amount, price, {
                // 使用模板字面量和字符串插值的方式传递值
                value: ethers.utils.parseUnits(value, 18),
                gasLimit: 10000000
            });
            console.log(SellTx);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className=' bg-gradient-to-b from-indigo-200 min-h-screen '>
            {/* 交易信息 */}
            <div className="flex flex-col items-center justify-center py-2 mt-10" >
                <div className='w-full max-w-md sticky top-3 z-50'>
                    <form className='bg-white shadow-md rounded-lg px-8 pt-2 pb-2 mb-5 border border-borderc h-72 mt-4'>
                        <div className='mt-2 mb-2'>
                            <p>Amount</p>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inputc' type="number" min="0" placeholder='Amount' onChange={handleAmount} required />
                        </div>
              
                        <div className='mb-2'>
                            <p>Price</p>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inputc' type="number" placeholder='Price' onChange={handlePrice} required />
                        </div>

                        <div className='flex items-left justify-between h-10'>
                            <button className='w-full  bg-indigo-200 hover:bg-indigo-300 text-center text-indigo-500 font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline' type="button" onClick={Purchase}>
                                Purchase
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Purchase;

