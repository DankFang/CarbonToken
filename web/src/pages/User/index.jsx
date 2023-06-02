import React, { useState, useContext } from 'react';
import { Space, Table, Tag } from 'antd';


import Swap from '../../components/Swap';
const MainHome = () => {

    const [totalCT, setTotalCt] = useState();
    const [remainCT, setRemainCT] = useState();

    const [hisTx, sethisTx] = useState();

    const getHistorical = () => {

    }

    const columns = [
        {
            title: 'From',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'succeed') {
                            color = 'red';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            address: 'New York No. 1 Lake Park',
            tags: ['succeed'],
        },
        {
            key: '2',
            name: 'Jim Green',
            address: 'London No. 1 Lake Park',
            tags: ['failed'],
        },
        {
            key: '3',
            name: 'Joe Black',
            address: 'Sydney No. 1 Lake Park',
            tags: ['succeed'],
        },
    ];

    // 待调合约
    const getInformation = async () => {
        try {

        } catch (err) {
            console.log(err);
        }
    }
    //  <div className='flex flex-row bg-gradient-to-b from-marketbg items-center w-full h-56'></div>
    return (
        <>


            <div className='flex flex-row bg-gradient-to-l from-indigo-200 items-center w-full h-56'>








                {/* <div className="flex flex-col ml-20 h-48 w-1/4 items-center justify-center">
                    <Swap></Swap>
                </div> */}

                <div className="ml-20 h-48 w-1/4  stat bg-gray-100 border-t-4 border-pink-600 rounded-lg">
                    <div className="stat-title">Total CT</div>
                    <div className="stat-value text-primary">2000</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="ml-20 h-48 w-1/4  stat bg-gray-100 border-t-4 border-primary  rounded-lg">
                    <div className="stat-title">CT remain</div>
                    <div className="stat-value text-primary">500</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>
            </div>



            <div className='bg-gray-100 px-2 py-2 min-h-screen px-8 py-5'>
                <div className='bg-white h-screen'>
                    <div className='w-full h-20 bg-indigo-300 text-4xl text-white  flex items-center px-5'>
                        Historical Transaction
                    </div>

                    <div className='px-2 py-2'>
                        <Table columns={columns} dataSource={data} />
                    </div>

                </div>
            </div>
        </>
    )
}
export default MainHome;