/*
 * @Author: diana
 * @Date: 2023-05-16 18:46:38
 * @LastEditTime: 2023-05-25 01:19:49
 */

import React, { useState, useEffect } from 'react';
import { Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux';
import Header from '../../components/Header';


function Company() {
    const currentAccount = useSelector(state => state.currentAccount);

    return (
        
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-l from-lime-200">
            <header>
                <Header currentAccount={currentAccount}/>
            </header>
            <main>
                 <Outlet /> 
            </main>
          
        </div>
    )
}
export default Company;