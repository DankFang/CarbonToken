import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { Space, Table, Tag, Button, Modal, Input } from 'antd';
import { MyContext } from '../../interact';

import { ToastContainer, toast } from 'react-toastify';


const Info = () => {
    const currentAccount = useSelector(state => state.currentAccount);

    const [Quota, setQuota] = useState();
    const [token, setToken] = useState();
    const [Eth, setEth] = useState();

    const { contracts, provider } = useContext(MyContext);

    // 4合约,当前账户数据信息展示
    const getInformation = async () => {
        try {
            // 额度
            const userQuota = await contracts[2].getQuota();
            console.log(userQuota.toString());
            setQuota(userQuota.toString());

            // 用户token余额
            const token = await contracts[1].balanceOf(currentAccount);
            setToken(ethers.utils.formatUnits(token, "wei"));
            console.log("token", token)

            // 用户eth余额
            const eth = await provider.getBalance(currentAccount);
            const balance = Number(ethers.utils.formatUnits(eth, "ether"))
            setEth(balance.toFixed(4));
        } catch (err) {
            console.log(err);
        }
    }

    // 弹出框 anti-design
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 数据
    const [data, setData] = useState();

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [purchaseAmount, setpurchaseAmount] = useState();

    // 市场表格数据
    const getData = async () => {
        try {
            const Data = await contracts[5].getAllOrders();
            const orders = Data.map(data => {
                return {
                    orderId: Number(data[0].toString()) + 1,
                    // 数量
                    purchaseLimit: Number(data[1]),
                    // 价格
                    price: Number(data[2].toString()),
                    // 剩余收购量
                    remainingQuantity: data[3].toString(),
                    // 状态
                    tags: data[4] === true ? ['Sold out'] : ['On Sell'],
                    // 订单创建者地址
                    merchant: data[5]
                }
            })
            setData(orders);
            console.log("this is market data:", data);

        } catch (e) {
            console.log(e)
        }
    }

    // 选中数字
    const chooseAmount = (e) => {
        const { value } = e.target;
        setpurchaseAmount(value);
    }

    // 下单
    const placeOrder = async () => {
        if (purchaseAmount > token) {
            toast.warn("You don't have so many tokens!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            await contracts[1].approve(contracts[5].address, 100000)
            const tx = await contracts[5].placeOrder(
                selectedRowData.orderId - 1,
                parseInt(purchaseAmount),
                {
                    value: ethers.utils.parseEther("0.0001"),
                    gasLimit: 4000000
                })
            await tx.wait()
            getData();
            getInformation();
            console.log("this is tx data", tx)
        }

    }

    // 点击行内按钮的回调函数,传入选中行数据
    const handleButtonClicked = (rowData) => {
        // 将选中的行数据保存到state中
        setSelectedRowData(rowData);
        setIsModalOpen(true);
        console.log(selectedRowData, "this is selected")
    }

    // 表格栏
    const columns = [
        // id
        {
            title: 'Id',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <a>{text}</a>,
        },
        // 公司地址
        {
            title: 'Company',
            dataIndex: 'merchant',
            key: 'merchant',
        },
        // 交易状态
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render:
                (_, { tags }) => (
                    <>
                        {tags.map((tag) => {
                            let color = tag === "On Sell" ? 'green' : 'red';
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </>
                ),
        },
        // 数量
        {
            title: 'PurchaseLimit',
            dataIndex: 'purchaseLimit',
            key: 'purchaseLimit',
        },
        // 价格
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        // 剩余收购量
        {
            title: 'RemainingQuantity',
            dataIndex: 'remainingQuantity',
            key: 'remainingQuantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleButtonClicked(record)}>Purchase</Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getInformation();
        getData();
    }, [])

    return (
        <>
            {/* 账户信息 */}
            <div className='flex flex-row bg-gradient-to-l from-indigo-200 items-center w-full h-56'>
                <div className="ml-20 h-48 w-1/4  stat bg-gray-100 border-t-4 border-pink-600 rounded-lg">
                    <div className="stat-title">Year Quota</div>
                    <div className="stat-value text-primary">{Quota}</div>
                    <div className="stat-desc">Let's contribute to carbon neutrality</div>
                </div>

                <div className="ml-20 h-48 w-1/4  stat bg-gray-100 border-t-4 border-primary  rounded-lg">
                    <div className="stat-title">CT(wei)</div>
                    <div className="stat-value text-primary">{token}</div>
                    <div className="stat-desc">
                        {token > Quota ? 'you have emssion so much CT' : 'keep reducing emssion ct'}</div>
                </div>
                <div className="ml-20 h-48 w-1/4  stat bg-gray-100 border-t-4 border-primary  rounded-lg">
                    <div className="stat-title">ETH(ether)</div>
                    <div className="stat-value text-primary">{Eth}</div>
                    <div className="stat-desc">eth you can use</div>
                </div>
            </div>

            {/* 市场交易 */}
            <div className='bg-gray-100 px-2 py-2 min-h-screen px-8 py-5'>
                <div className='bg-white h-screen'>
                    <div className='w-full h-20 bg-indigo-300 text-4xl text-white  flex items-center px-5'>
                        CT Market
                    </div>
                    <div className='px-2 py-2'>
                        <div className='flex flex-col '>
                            {/* 交易市场 */}
                            <div className='px-6'>
                                <Table columns={columns} dataSource={data} />
                            </div>
                            {/* 下单弹出 */}
                            <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
                                <div
                                    className="mb-0 mt-6 space-y-4 p-4  sm:p-6 lg:p-8"
                                >
                                    <h1 className="text-start text-2xl font-bold text-indigo-600 sm:text-3xl mb-10">
                                        Amount you want
                                    </h1>

                                    <div className='w-full mb-10 h-10'>
                                        <Input type="number" style={{
                                            width: '100%',
                                            height: '100%',
                                        }} min={1} value={purchaseAmount} onChange={chooseAmount} />
                                    </div>

                                    <button
                                        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white mt-10"
                                        onClick={placeOrder}  >
                                        Place Order
                                    </button>

                                </div>
                            </Modal>

                        </div>
                    </div>

                </div>
            </div>

            {/* 提示框 */}
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
        </>
    )
}
export default Info;