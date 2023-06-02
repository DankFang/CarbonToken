/*
 * @Author: diana
 * @Date: 2023-05-27 16:34:38
 * @LastEditTime: 2023-06-02 12:50:31
 */
/*
 * @Author: diana
 * @Date: 2023-05-27 16:34:38
 * @LastEditTime: 2023-06-01 12:55:31
 */
import React, { useState, useEffect, useContext } from 'react';
import { Form, Radio, Space, Switch, Table, Button, Tag, Modal } from 'antd';
import { MyContext } from '../../../interact';
import { ethers } from 'ethers';
import EchartsCircle from '../Detail';


const PUser = () => {

    const { contracts } = useContext(MyContext);

    const [data, setData] = useState();

    const [detail, setDetail] = useState();

    const [selectedRowData, setSelectedRowData] = useState(null);

    const [address, setAddress] = useState(null);

    const [charts, setCharts] = useState();
    const [options, setOptions] = useState();


    const handleButtonShow = async (rowData) => {
        // 将选中的行数据保存到state中
        setSelectedRowData(rowData);
        setAddress(rowData.address);

        showDetails(rowData.address);

        const data = {
            title: {
                show: true,
                x: 'center',
                y: 'center',
                textStyle: {
                    fontSize: '15',
                    color: 'red',
                    fontWeight: 'normal'
                }
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y: 'bottom',
                data: []
            },
            series: [
                {
                    name: 'emission',
                    type: 'pie',
                    radius: ['50%', '60%'],
                    center: ['50%', '50%'],

                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold',
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: [
                        { value: 100, name: 'emssion' },
                        { value: 100, name: 'total' },

                    ],
                },
            ],
        };
        setCharts(data);

        const options = {
            tooltip: {},
        };
        setOptions(options);

    }
    // 点击行内按钮的回调函数
    const handleButtonAward = (rowData) => {
        // 将选中的行数据保存到state中
        setSelectedRowData(rowData);
        setAddress(rowData.address);
        console.log(rowData.address, "this is selected")

        distributeToken(rowData.address);

    }

    // 点击行内按钮的回调函数
    const handleButtonAddDeprave = (rowData) => {
        setSelectedRowData(rowData);
        setAddress(rowData.address);
        console.log(rowData.address, "this is selected")
        addBlackList(rowData.address);

    }
    const columns = [
        // 序号
        {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            render: (text) => <a>{text}</a>,
        },

        // 地址
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleButtonShow(record)}>Show</Button>

                    <Button onClick={() => handleButtonAward(record)}>Award</Button>
                    <Button onClick={() => handleButtonAddDeprave(record)} danger>AddDeprave</Button>
                </Space>
            ),
        },
    ];

    //获取puser数据 
    const getUser = async () => {
        try {
            const DATA = await contracts[2].getAllMem();
            // 组装成需要的
            const users = DATA.map((item, index) => {
                return {
                    order: index + 1,
                    address: item,
                }
            })
            setData(users);
            console.log("users:", users);
            showDetails(users[0].address)
        } catch (e) {
            console.log(e);
        }
    }

    // 查看详细数据
    const showDetails = async (account) => {
        try {
            const DATA = await contracts[7].findUser(account);
            // 组装成需要的
            const det = {
                address: DATA.addr,
                qutoa: DATA.qutoa.toString(),
                total_emission: DATA.total_emission.toString(),
                balance: DATA.balance.toString(),
                isDistributed: DATA.isDistributed,
            }
            setDetail(det)
            console.log("det:", detail);
        } catch (e) {
            console.log(e);
        }

    }

    // 奖励代币
    const distributeToken = async (account) => {
        try {
            const RequestTx = await contracts[1].distributeTokens(
                account,
                100,
                { gasLimit: 500000 });
            RequestTx.wait();
            console.log(RequestTx)
        } catch (e) {
            console.log(e);
        }
    }
    // 加入黑名单
    const addBlackList = async (account) => {
        try {
            const tx = await contracts[4].addDeprave(
                account,
                { gasLimit: 500000 });
            tx.wait();
            console.log(tx)
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        getUser();
    }, [])


    return (
        <>
            <div className='flex flex-col items-center justify-center w-full min-h-screen py-2 px-2  rounded-lg mt-2 mb-5 '>
                  {/* 详情 */}
                  <div className='w-3/4 rounded-lg h-72 mt-2 py-2 bg-buttonnormal'>
                    {
                        detail ? (<>
                            <div className='flex flex-row '>
                                <div className='w-1/2 rounded-lg h-64 px-2 bg-white '>
                                    {/* 信息 */}
                                    <div className='h-16 py-2 px-2 flex flex-row'>
                                        <div className='flex flex-col -mt-1'>
                                            <div className='ml-3 text-gray-200 text-md'>
                                                CT(the user remain)
                                            </div>
                                            <div className='ml-3 text-3xl'>
                                                {detail.balance}
                                            </div>
                                        </div>
                                        <div className=' h-15 w-15 ml-40 px-1 py-1 '>
                                            <svg className="arrow" width="40" height="40" viewBox="0 0 1024 1024">
                                                <path d="M30.72 583.68a456.704 433.152 0 1 0 913.408 0 456.704 433.152 0 1 0-913.408 0Z" fill="#87C596" p-id="6789"></path><path d="M243.712 185.344c-11.776-10.752-68.096-57.856-77.824-90.624-9.216-32.256 40.448-100.864 177.152-32.256 0 0 145.92-99.328 288.768 0 0 0 164.864-86.016 177.152 39.424l-96.256 110.08c0.512-0.512-348.16 91.648-468.992-26.624z" fill="#87C596" p-id="6790"></path><path d="M494.08 150.528v866.816c252.416 0 456.704-194.048 456.704-433.152s-204.288-433.664-456.704-433.664z" fill="#649A76" p-id="6791"></path><path d="M632.32 62.464c-47.616-33.28-95.232-44.032-138.24-44.032v220.672c112.64-5.632 218.624-27.648 218.624-27.648L808.96 101.376c-12.288-124.928-176.64-38.912-176.64-38.912z" fill="#649A76" p-id="6792"></path><path d="M731.648 189.952s2.56 22.528-37.888 29.696c-40.96 7.168-243.712 42.496-411.136 0 0 0-18.432-7.168-16.384-19.456 0 0 0-10.24 24.576-5.632 0 0 177.152 54.784 419.84-4.608 0 0 19.456-7.168 20.992 0z" fill="#5E7A52" p-id="6793"></path><path d="M487.424 607.232c-5.12-2.048-10.24-4.096-15.872-6.656s-15.36-7.68-29.696-16.384c-14.336-8.192-25.6-17.92-34.304-28.16-8.704-10.752-15.36-21.504-19.456-32.768-4.096-11.264-6.144-23.552-5.12-37.376 1.024-22.528 7.168-39.936 17.92-52.224 11.264-12.288 22.016-21.504 33.28-27.648 11.264-6.144 22.016-10.24 33.28-12.8l19.968-4.096v-18.432h25.088v18.944c6.656 0 11.776 0.512 16.384 0.512 4.096 0.512 9.216 1.024 15.36 2.56 6.144 1.024 16.384 4.096 31.232 8.192 14.848 4.096 27.136 12.288 36.864 23.552 9.728 11.776 14.848 22.016 14.848 31.232 0 10.24-4.608 18.944-12.8 26.112-8.192 7.168-17.92 11.264-29.184 11.264s-20.992-3.584-28.16-10.24c-7.68-7.168-11.264-15.36-10.752-24.576 0-7.68 2.56-14.848 8.192-20.992 5.632-6.144 8.192-9.728 8.192-11.264 0-2.56-4.608-6.144-12.8-9.728s-15.872-6.144-22.528-6.656l-14.848-1.536V547.84c12.288 4.608 25.6 9.728 40.448 14.848 14.848 5.12 28.16 10.752 40.448 16.384 12.288 5.632 23.552 15.36 33.792 28.16s15.36 26.624 15.36 41.472c0 14.336-2.048 27.648-6.144 40.448-4.096 12.288-10.752 23.04-18.944 32.256-8.704 9.216-17.92 16.384-27.648 20.992-10.24 4.608-20.48 8.704-31.232 11.776-10.752 3.072-21.504 5.12-31.744 6.144l-13.312 1.536V783.36h-25.088v-21.504c-8.704-1.024-15.872-2.56-21.504-3.584-5.632-1.536-12.8-3.584-20.48-6.144-7.68-3.072-14.848-6.144-21.504-9.216-6.656-3.072-13.312-7.68-19.968-12.288s-13.312-11.776-19.968-19.968c-6.656-8.192-10.24-16.896-10.24-26.112 0-8.704 1.024-16.384 4.096-23.04 3.072-6.656 7.68-12.288 13.824-15.872 6.144-3.584 13.312-5.632 22.016-5.632 9.728 0 17.92 2.56 24.064 7.68 6.144 4.608 9.728 10.24 10.24 16.896 0.512 6.144 0 11.264-1.536 14.848-1.536 3.072-3.584 5.632-6.144 7.68l-12.288 7.168c-3.072 2.048-5.12 4.608-7.168 7.68-1.536 3.072 2.048 9.216 10.752 17.408 6.144 6.144 12.8 11.264 19.968 14.848 7.168 3.584 13.312 5.632 17.92 6.144l17.408 3.072V607.232z m0-197.12l-16.896 4.608c-5.632 1.536-11.264 5.12-16.896 9.216-6.144 4.608-11.264 11.264-15.36 19.456-4.608 8.704-6.656 17.92-6.144 28.16 0 14.336 4.096 26.112 11.776 34.816 7.68 8.704 17.408 16.384 29.696 22.528l14.336 7.68v-126.464z m24.576 334.848c8.704-1.024 18.432-3.072 30.208-6.144 11.776-3.072 21.504-9.728 29.184-19.968s11.776-22.016 11.776-34.816-2.56-23.04-7.68-30.208c-5.12-7.168-12.288-13.312-22.016-18.432-9.216-5.12-18.944-9.216-27.648-13.312l-13.824-5.632v128.512z" fill="#FFFFFF" p-id="6794"></path>
                                            </svg>
                                        </div>


                                    </div>
                                    {/* 图 */}
                                    <div className='h-44  mt-3'>
                                        <EchartsCircle remain={detail.balance} emssion={detail.emssion} />
                                    </div>

                                </div>
                                <div className='w-1/2 h-64 flex-col ml-5'>
                                    {/* 上栏 */}
                                    <div className='h-15 flex flex-row border bg-white  rounded-lg'>
                                        {/* svg */}
                                        <div className=' h-15 w-15 ml-3 px-1 py-1 '>
                                            <svg className="arrow" width="40" height="40" viewBox="0 0 1024 1024">
                                                <path d="M502.3 955.4c-223.7 0-405.7-182-405.7-405.7S278.6 144 502.3 144 908 326.1 908 549.8 726 955.4 502.3 955.4z m0-774.2c-203.2 0-368.6 165.3-368.6 368.6S299 918.4 502.3 918.4 870.9 753 870.9 549.8 705.6 181.2 502.3 181.2z" fill="#FCB932" p-id="5757"></path><path d="M436.3 478.8L268.5 311l15-13.1C338.6 250 406.2 222.1 479 217l19.8-1.4v237.2l-15 2.9c-12.6 2.5-24.4 7.3-34.9 14.4l-12.6 8.7zM323.4 313.4l118.2 118.2c6.5-3.3 13.2-6.1 20.2-8.3V256.1c-50.6 6.9-97.8 26.4-138.4 57.3zM263.6 783.5l-13-15c-47.9-55-75.9-122.6-80.9-195.5l-1.4-19.8h237.1l2.9 15c2.5 12.6 7.3 24.3 14.4 34.9l8.5 12.7-167.6 167.7z m-54.9-193.2c6.9 50.6 26.4 97.8 57.3 138.4l118.2-118.2c-3.3-6.5-6.1-13.2-8.3-20.2H208.7zM405.5 546.3H168.3l1.4-19.8c5-72.8 33-140.4 80.9-195.5l13-15 167.7 167.7-8.5 12.7c-7.1 10.6-12 22.4-14.4 35l-2.9 14.9z m-196.8-37.1h167.1c2.2-7 5-13.7 8.4-20.2L266 370.8c-30.9 40.6-50.4 87.8-57.3 138.4zM568.4 478.8l-12.7-8.5c-10.6-7.1-22.3-12-34.9-14.4l-15-2.9V215.7l19.8 1.4c72.8 5.1 140.4 33 195.5 80.9l15 13.1-167.7 167.7z m-25.5-55.6c7 2.2 13.7 5 20.2 8.3l118.2-118.2c-40.6-30.9-87.8-50.4-138.4-57.3v167.2zM741 783.5L573.3 615.8l8.5-12.7c7.1-10.6 12-22.3 14.4-34.9l2.9-15h237.1l-1.4 19.8c-5 72.8-33 140.4-80.9 195.5l-12.9 15z m-120.5-173l118.2 118.2c30.9-40.6 50.4-87.8 57.3-138.4H628.8c-2.2 7-5 13.7-8.3 20.2zM836.4 546.3H599.2l-2.9-15c-2.5-12.6-7.3-24.4-14.4-35l-8.5-12.7L741 316l13 15c48 55 75.9 122.6 81 195.4l1.4 19.9z m-207.6-37.1H796c-6.9-50.6-26.4-97.8-57.3-138.4L620.5 489c3.3 6.5 6.1 13.2 8.3 20.2zM505.8 883.8V646.6l15-2.9c12.6-2.5 24.4-7.3 34.9-14.4l12.7-8.5 167.7 167.7-15 13.1c-55.1 47.9-122.7 75.9-195.5 80.9l-19.8 1.3z m37.1-207.5v167.1c50.6-6.9 97.8-26.4 138.4-57.3L563.1 667.9c-6.5 3.3-13.2 6.1-20.2 8.4zM498.9 883.8l-19.8-1.4c-72.8-5.1-140.4-33-195.5-80.9l-15-13.1 167.7-167.7 12.7 8.5c10.6 7.1 22.3 12 34.9 14.4l15 2.9v237.3z m-175.5-97.7c40.6 30.9 87.8 50.4 138.4 57.3V676.3c-7-2.2-13.7-5-20.2-8.3L323.4 786.1z" fill="#FCB932" p-id="5758"></path>
                                            </svg>
                                        </div>
                                        <div className='mt-2 ml-20 flex flex-row'>
                                            <p className='text-gray-300 text-md mt-1'>qutoa:&nbsp;&nbsp;</p>
                                            <p className='text-2xl text-black'>{detail.qutoa}</p>
                                            <p className='text-gray-300 text-md mt-1'>&nbsp;&nbsp;/&nbsp;Year</p>
                                        </div>

                                    </div>
                                    {/* 下 */}
                                    <div className='h-48 flex flex-col items-center justify-center bg-white border rounded-lg mt-4'>
                                        <div>This year the client has </div>
                                        <br></br>
                                        <div className='text-adminbg'>{detail.isDistributed ? 'requested' : 'not requested'}</div>
                                    </div>
                                </div>

                                
                            </div>
                        </>) : (<>
                            <div className='flex flex-row items-center justify-center  border rounded-lg bg-white h-64'>
                                Choose you want to see detail
                            </div>
                        </>)
                    }


                </div>
                {/* 表格 */}
                <div className='w-3/4 border border-gray-300 rounded-lg flex flex-row h-128 bg-white'>
                    <div className='w-full h-full'>
                        <div className='px-2'>
                            <Table columns={columns} dataSource={data} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PUser;