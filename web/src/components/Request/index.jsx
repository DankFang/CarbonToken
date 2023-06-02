/*
 * @Author: diana
 * @Date: 2023-05-19 22:10:06
 * @LastEditTime: 2023-06-02 19:40:33
 */
import React, { useState, useContext, useEffect } from 'react';
import { MyContext } from '../../interact';
import { useSelector } from 'react-redux';

const Request = () => {
    const currentAccount = useSelector(state => state.currentAccount);
    const userType = useSelector(state => state.userType);

    const { contracts } = useContext(MyContext);

    const [isRequested, setIsRequested] = useState(false);
    const [targetAccount, setTargetAccount] = useState();


    // 当前账户是否申请过
    const isClaimed = async () => {
        try {
            // puser
            if (userType === 1) {  
                const tx = await contracts[2].isClaimed(currentAccount);
                setIsRequested(tx)
                console.log("you have", tx)
            } else { console.log(currentAccount)
                const tx = await contracts[3].isClaimed(currentAccount);
                console.log("you have", tx)
                setIsRequested(tx)
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Request
    const requestToken = async () => {
        try {
            if (userType === 1) {
                const RequestTx = await contracts[2].claim({ gasLimit: 500000 });
                RequestTx.wait();
                await contracts[1].approve(contracts[4].address, 10000,{gasLimit:50000})
                console.log(RequestTx)
            }
            else {
                const RequestTx = await contracts[3].claim({ gasLimit: 500000 });
                RequestTx.wait();
                await contracts[1].approve(contracts[4].address, 10000,{gasLimit:50000})
                console.log("Company", RequestTx)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleInputChange = (e) => {
        const { value } = e.target;
        setTargetAccount(value);
    }

    useEffect(() => { isClaimed(); }, [])

    return (
        <div className="flex flex-col bg-faucet-bg w-full items-center min-h-screen px-2 py-2">
            {
                isRequested ?
                    (
                        <h1 className='text-3xl mt-40 text-red-500'>This Year You have Requested!</h1>
                    ) : (
                        <>
                            <div className="flex flex-row bg-faucet-bg mb-1 ml-4 w-full h-24 items-center">
                                <div className='text-text-color text-6xl lg:w-1/2 sm:w-full xs:w-full'>
                                    Requset for CT
                                </div>
                            </div>


                            <div className="flex flex-col bg-white border-2 rounded-lg w-full mb-1 ml-3 px-2 py-2 h-96">

                                <div className='bg-faucet-bg mb-5 py-4 px-2 mt-2 text-text-color'>
                                    This year you can request for 1000 CT!
                                </div>


                                <div className="flex flex-col mb-5">
                                    <h1 className='text-xl text-text-color'>Wallet address</h1>
                                    <div className="px-2 py-2 border rounded-md boder-gray-300  hover:border hover:border-gray-400 focus:border focus:border-gray-400  lg:w-1/3 md:w-full">
                                        <input className='w-full appearance-none hover:appearance-none  focus:outline-none' onChange={handleInputChange} />
                                    </div>

                                </div>


                                <div className='bg-faucet-bg border border-blue-100 rounded-md px-5 py-5 w-1/4 mb-6'>
                                    1000 CT
                                </div>

                                <div>
                                    <button className='bg-faucet-bg border border-blue-100 rounded-md px-2 py-5  hover:bg-blue-100' onClick={requestToken}>Send Me Token</button>
                                </div>
                                {/* 
                                <div className='mt-3 px-1'>
                                    now the targetAccount have  tokens
                                </div> */}
                            </div>
                        </>)
            }
        </div>

    )
}

export default Request;

