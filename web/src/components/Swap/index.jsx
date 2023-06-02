/*
 * @Author: diana
 * @Date: 2023-05-19 22:10:06
 * @LastEditTime: 2023-06-01 22:03:57
 */
import React, { useState, useContext, useEffect } from 'react';
import { MyContext } from '../../interact';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const Swap = () => {

    const [ctNum, setCtNum] = useState();
    const [ethNum, setEthNum] = useState();

    const { contracts } = useContext(MyContext);
    // 当前地址
    const currentAccount = useSelector(state => state.currentAccount);

    // CTToken地址
    const ctAddress = contracts[1].address;
    // weth地址
    const wethAddress = contracts[6].address;

    const [token, setToken] = useState();

    const AddLiquidity = async () => {
        try {
            const tx = await contracts[0].addLiquidity(100000, 1000);
            tx.wait()
        } catch (e) {
            console.log(e);
        }
    }

    // 获取ct输入数据
    const handleCtInput = (e) => {
        const { value } = e.target;
        setCtNum(value);
        console.log(value, ctNum);
    }
    // 获取eth数据
    const handleEthInput = (e) => {
        const { value } = e.target;
        setEthNum(value);
        console.log(value, ctNum);
    }

    const getUserToken = async () => {
        try {
            const userToken = await contracts[1].balanceOf(currentAccount);
            setToken(userToken);
        } catch (e) {
            console.log(e);
        }

    }

    // swap
    const swap = async () => {
        if (ctNum > token) {
            toast.warn("You don't have so many tokens!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            const tx = await contracts[1].approve(contracts[0].address,1000,{gasLimit: 50000});
            tx.wait();
            try {
                const swapTx = await contracts[0].swap(
                    ctNum,
                    ethNum,
                    ctAddress,
                    wethAddress,
                    { value: ethNum, gasLimit: 100000 }
                );
                swapTx.wait();
                toast.success("Swap successfully!", {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log(swapTx)
            } catch (e) {
                console.log(e);
            }
        }
    }


    useEffect(() => {
        AddLiquidity();
        getUserToken();
    }, [])

    return (
        <div className=' bg-gradient-to-b from-indigo-200 min-h-screen '>
            {/* 交易信息 */}
            <div className="flex flex-col items-center justify-center py-2 mt-10" >
                <div className='w-full max-w-md sticky top-3 z-50'>
                    {/* z三维定位最上层，max-w最大宽度 */}
                    <form className='bg-white shadow-md rounded-lg px-8 pt-2 pb-2 mb-4 border border-borderc h-72 mt-4'>
                        <h1>Swap</h1>
                        <div className='mt-2'>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inputc' type="number" min="0" placeholder='CT Number' onChange={handleCtInput} required />
                        </div>
                        <div className='mt-0 mb-0 h-4 bg-white flex flex-row items-center justify-center'>
                            <div className='border-2 border-white rounded w-10 h-10 z-50 bg-inputc'>
                                <svg class="arrow" width="33" height="33" viewBox="0 0 1024 1024">
                                    <path d="M488.727273 242.757818v469.248l-170.565818-184.762182a34.909091 34.909091 0 1 0-51.293091 47.36l231.121454 250.414546a34.955636 34.955636 0 0 0 51.293091 0l231.121455-250.414546a34.862545 34.862545 0 0 0-1.954909-49.338181 34.909091 34.909091 0 0 0-49.338182 1.978181L558.545455 712.029091V242.734545a34.909091 34.909091 0 1 0-69.818182 0" fill="#797979"></path>
                                </svg>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inputc' type="number" placeholder='ETH Number' onChange={handleEthInput} required />
                        </div>

                        <div className='flex items-left justify-between h-10'>
                            <button className='w-full  bg-indigo-200 hover:bg-indigo-300 text-center text-indigo-500 font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline' type="button" onClick={swap}>
                                Swap
                            </button>

                        </div>

                    </form>

                </div>

            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
        </div>
    )
}

export default Swap;

