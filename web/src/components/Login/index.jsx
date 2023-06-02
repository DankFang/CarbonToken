/*
 * @Author: diana
 * @Date: 2023-05-16 15:54:27
 * @LastEditTime: 2023-06-02 19:39:22
 */
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../interact'
import { ethers } from 'ethers';

import { Modal } from 'antd';
import { Select, Input } from 'antd';

import TimeLine from '../TimeLine';
import Footer from '../Footer';
import "../../index.css";
import { ToastContainer, toast } from 'react-toastify';


export default function Login() {

    // 合约对象获取
    const { contracts } = useContext(MyContext);

    // 是否连接，默认为未连接
    const [isConnect, setIsConnect] = useState(false);

    // 登录账户
    const [currentAccount, setCurrentAccount] = useState(null);

    // 账户类型 1是pUser,2是company,3是provider,99是admin
    const [memberType, setMemberType] = useState(0);

    // 选择
    const OPTIONS = ['Personal User', 'Company User'];
    const [selectedItems, setSelectedItems] = useState([]);
    // 添加成员
    const [joinMember, setJoinMember] = useState(null);



    // react-redux 状态管理，传输值
    const dispatch = useDispatch();

    // 路由跳转
    const navigate = useNavigate();

    // 弹出框 anti-design
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 下拉选择puser or company
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

    // 钱包是否连接
    const isConnected = async () => {
        try {
            const { ethereum } = window;
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                setIsConnect(true);
                setCurrentAccount(accounts[0]);
                console.log(`当前账户为：${currentAccount}`);
                const type = await whichMember(accounts[0]);
                setMemberType(type);
                console.log("this is ", type);
            } else {
                toast.warn("Make sure you have Metamask Connected", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (e) {
            toast.error(`${e.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }

    // 连接钱包并传送获得的地址
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                toast.warn("Make sure you have Metamask Connected", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            if (!currentAccount) {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                setCurrentAccount(accounts[0]);
                // 判断哪个类型
                await whichMember(accounts[0]);
                toast.success("Connected!", {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // localStorage.setItem('currentAccount',currentAccount);
                // dispatch({ type: 'send_type', currentAccount: accounts[0] });
            } else {
                // navigate('/home');
                // dispatch({ type: 'send_type', currentAccount: currentAccount });
            }
        } catch (e) {
            toast.error(`${e.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    // 连接后判断成员
    const whichMember = async (account) => {
        console.log('this is account:', account);

        try {
            const isPUser = await contracts[2].isMember(account);
            const isCompany = await contracts[3].isMember(account);

            const isICB = await contracts[8].isICB(account);
            const isTAX = await contracts[8].isICB(account);

            console.log('是不是',isICB||isTAX);

            if (isPUser) {
                return 1;
            }
            if (isCompany) {
                return 2;
            }
            if (account === '0xc8daba1bbcc9b2b19eb5c8bcc36a459a7f32a426') {
                return 99
            }
            if (isICB || isTAX) {
                return 3;
            }
            
            console.log(`this is pUser:${isPUser},,,this is company:${isCompany}`)
            console.log("this is memberType", memberType);

        } catch (e) {
            console.log(e)
        }

    }

    // 判断成员后进入对应主页
    const handleMain = async () => {
        localStorage.setItem('currentAccount', currentAccount);
        // 发送账户地址信息 
        // 跳转到对应主页
        dispatch({ type: 'send_type', currentAccount: currentAccount, userType: memberType });
        
        switch (memberType) {
            case 99:
                navigate('/admin');
                break;
            case 3:
                navigate('/provider');
                break;
            case 2:
                navigate('/home');
                break;
            case 1:
                navigate('/home');
                break;
            default:
                toast.warn("You are not our clients!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
    }

    // 不是成员，加入
    const Join = async () => {
        try {
            console.log('selectedItems:', selectedItems, joinMember)
            const isMember = await contracts[2].isMember(joinMember);
            const isCompany = await contracts[3].isMember(joinMember);

            if (isMember || isCompany) {
                toast.warn("You have already joined!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => { handleCancel() }, 1000)
                return;
            } else {
                if (selectedItems[0] === 'Personal User') {
                    console.log("entered", selectedItems)
                    await contracts[2].addMem(joinMember);
                    await contracts[2].LetMembertoTrue(joinMember);
                    
                    toast.success("Welcome to become our person client!", {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    whichMember(currentAccount)
                    setTimeout(() => { handleCancel() }, 1000)
                } else {
                    await contracts[3].addMem(joinMember);
                    await contracts[3].LetMembertoTrue(joinMember);
                    toast.success("Welcome to become our company client!", {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    whichMember(currentAccount)
                    setTimeout(() => { handleCancel() }, 1000)
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    // 获取输入框中的值
    const handleChange = (e) => {
        const { value } = e.target;
        setJoinMember(value)
    }


    useEffect(() => {
        isConnected();

    }, [currentAccount])
    // 判断登录账户类型
    // 用户、管理员、第三方上传节点
    // 管理原地址固定，第三方节点
    // 从后端读取
    // const accountType = async () => {

    //     // 后端读取
    //     const adminAccount = "";
    //     const providerAccounts = [];
    // }


    return (
        <>
            <div className='w-full min-h-screen bg-gradient-to-l from-indigo-300 to-lime-200 '>
                <div className='z-0 '>
                    {/* 账户连接按钮 */}
                    <div className='w-full h-10 flex flex-row justify-end'>

                        {isConnect ? (
                            <div className='h-10 border border-gray-300 rounded-lg px-2 py-2  text-gray-500 hover:border-white mt-2 mr-1'>
                                {currentAccount}
                            </div>) : (
                            <button className=' mt-2 mr-5 bg-lime-100 rounded-full border-gray-500 hover:border-gray-700 hover:text-indigo-700 text-indigo-400 py-1 px-6' onClick={connectWallet}>
                                Connect
                            </button>
                        )
                        }

                    </div>

                    {/* 标题和信息展示 */}
                    <div className='flex flex-col items-center justify-center mt-16'>
                        {/* 标题 */}
                        <h1 className='text-6xl text-white'>Welcome to CarbonSwap Platform</h1>


                        {/* 信息展示 */}
                        {/* 时间轴 */}
                        <TimeLine />

                        <div className='flex flex-row  items-center w-1/2 h-56 mb-1 -ml-60'>
                            <div className="h-48 w-1/4 stat text-black">
                                <div className="stat-title">Personal User</div>
                                <div className="stat-value text-gray-500">3000+</div>
                            </div>


                            <div className="ml-60 h-48 w-1/4 stat text-black">
                                <div className="stat-title">Company</div>
                                <div className="stat-value text-gray-500">1000+</div>
                            </div>

                            <div className="ml-60 h-48 w-1/4 stat text-black">
                                <div className="stat-title">Providers</div>
                                <div className="stat-value text-gray-500">30+</div>
                            </div>
                        </div>


                        {/* 按钮 */}
                        <div className='flex flex-row items-center justify-center ml-8'>
                            <button type="primary" className="mr-10 bg-lime-100 rounded-full border-gray-500  hover:border-gray-700 hover:text-indigo-700 text-indigo-400 py-2 px-6" onClick={showModal}>
                                Join Us
                            </button>

                            {/* 加入模态框 */}
                            <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
                                <div
                                    className="mb-0 mt-6 space-y-4 p-4  sm:p-6 lg:p-8"
                                >
                                    <h1 className="text-start text-2xl font-bold text-indigo-600 sm:text-3xl">
                                        Join Us
                                    </h1>

                                    <div>
                                        <label for="email" className="sr-only">Address</label>

                                        <div className="relative">
                                            <Input placeholder="Enter your Address" onChange={handleChange} className='mt-5 mb-5 h-10' />

                                            <Select
                                                className='mb-5 h-15'
                                                mode="multiple"
                                                placeholder="Inserted are removed"
                                                value={selectedItems}
                                                onChange={setSelectedItems}
                                                style={{
                                                    width: '100%',
                                                }}
                                                options={filteredOptions.map((item) => ({
                                                    value: item,
                                                    label: item,
                                                }))}
                                            />

                                        </div>
                                    </div>

                                    <button
                                        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                                        onClick={Join}>
                                        Join
                                    </button>

                                </div>
                            </Modal>

                            <button className='bg-lime-100 rounded-full border-gray-500 hover:border-gray-700 hover:text-indigo-700 text-indigo-400 py-2 px-6' onClick={handleMain}>
                                Main
                            </button>

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

                        <Footer />
                    </div>
                </div>


            </div>

        </>
    )
};