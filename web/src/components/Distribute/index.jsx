/*
 * @Author: diana
 * @Date: 2023-05-19 22:10:06
 * @LastEditTime: 2023-05-27 00:18:05
 */
import React, { useState, useContext, useEffect } from 'react';
import { MyContext } from '../../interact';
import { useSelector } from 'react-redux';

const Distribute = () => {

    const currentAccount = useSelector(state => state.currentAccount);

    const [isDistributeed, setIsDistributeed] = useState(false);

    const [targetAccount, setTargetAccount] = useState();

    const { contracts } = useContext(MyContext);


    const isDistribute = async () => {
        try {
            const tx = await contracts[1]._isDistributed(targetAccount, { gasLimit: 50000 }
            );
            setIsDistributeed(tx)
        } catch (e) {
            console.log(e);
        }
    }

    const handleTargetAccount = async (e) => {
        const { value } = e.target;
        setTargetAccount(value);
        isDistribute();
    }

    // Distribute
    const DistributeToken = async () => {
        console.log(currentAccount)
        try {
            if (!isDistributeed) {
                const approve = await contracts[1].approve(currentAccount, 1000, { gasLimit: 50000 })
                approve.wait();
                const DistributeTx = await contracts[1].distributeTokens(
                    targetAccount,
                    1000,
                    { gasLimit: 500000 }
                );
                DistributeTx.wait();
                console.log(DistributeTx);
            }
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => { }, [])

    return (


        <div className="flex flex-col bg-faucet-bg w-full items-center min-h-screen px-2 py-2">

            {
                isDistributeed ?
                    (
                        <h1 className='text-3xl mt-40'>you have Distributeed this month</h1>
                    ) : (
                        <>
                            <div className="flex flex-row bg-faucet-bg mb-1 ml-4 w-full h-24 items-center">
                                <div className='text-text-color text-6xl lg:w-1/2 sm:w-full xs:w-full'>
                                    Distribute CT
                                </div>
                            </div>


                            <div className="flex flex-col bg-white border-2 rounded-lg w-full mb-1 ml-3 px-2 py-2 h-96">

                                <div className='bg-faucet-bg mb-5 py-4 px-2 mt-2 text-text-color'>
                                     You can Distribute CT for clients!
                                </div>


                                <div className="flex flex-col mb-5">
                                    <h1 className='text-xl text-text-color'>Wallet address</h1>
                                    <div className="px-2 py-2 border rounded-md boder-gray-300  hover:border hover:border-gray-400 focus:border focus:border-gray-400  lg:w-1/3 md:w-full">
                                        <input className='w-full appearance-none hover:appearance-none  focus:outline-none' onChange={handleTargetAccount} />
                                    </div>

                                </div>

                                <div className='bg-faucet-bg border border-blue-100 rounded-md px-5 py-5 w-1/4 mb-6'>
                                    1000 CT
                                </div>

                                <div>
                                    <button className='bg-faucet-bg border border-blue-100 rounded-md px-2 py-5  hover:bg-blue-100' onClick={DistributeToken}>Send Token</button>
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

export default Distribute;

