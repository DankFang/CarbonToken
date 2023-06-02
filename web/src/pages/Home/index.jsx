/*
 * @Author: diana
 * @Date: 2023-05-25 00:34:36
 * @LastEditTime: 2023-06-02 13:30:09
 */
import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';

import { MyContext } from '../../interact';

import Header from '../../components/Header';
import Provider from '../IProvider';
import Admin from '../Admin';

import Market from '../../components/Market';


// 所有角色登录后的主页
function Home() {
    const currentAccount = useSelector(state => state.currentAccount);
    // const isUser = true;

    const [isMember, setIsMember] = useState();
    const [isCompany, setIsCompany] = useState();

    // const dispatch = useDispatch();
    // const isProvider = false;
    // const isAdmin = false;

    const { contracts } = useContext(MyContext);

    const [transactions, setTransaction] = useState([]);

    // 判断user类型，
    const whichType = async () => {
        try {
            const member = await contracts[2].isMember(currentAccount);
            const company = await contracts[3].isMember(currentAccount);
            setIsMember(member);
            setIsCompany(company);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        whichType()
        // const getHistorical = (from, to, amount) => {
        //     setTransaction(pre => [
        //         ...pre,
        //         {
        //             From: from,
        //             To: to,
        //             Amount: ethers.utils.formatUnits(amount.toString(), "9"),
        //             Tags: currentAccount === from ? 'sell' : 'claim',
        //         }
        //     ])
        // }
        // contracts[1].on('Transfer', getHistorical)
        // return () => {
        //     contracts[1].off('Transfer', getHistorical)
        // };
    }, [])

    return (
        <div className="flex flex-col w-full bg-gradient-to-l from-indigo-200">
            {/* 导航栏 固定 */}

            {/* {isProvider ? (
                <IProvider />
            ) : (
                <></>
            )}

            {isAdmin ? (
                <Admin />
            ) : (
                <></>
            )} */}

            {/* {isUser ? (
                <> */}
            <Header currentAccount={currentAccount} isCompany={isCompany} />
            <Outlet />
            {/* </>
            ) : (
                <></>
            )

            } */}


        </div>
    )
}
export default Home;