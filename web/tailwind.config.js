/*
 * @Author: diana
 * @Date: 2023-05-16 18:59:32
 * @LastEditTime: 2023-05-28 19:46:30
 */
/** @type {import('tailwindcss').Config} */ 
module.exports = { 
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  theme: { 
       extend: {
          colors:{
               'leftc':'#5337ff',
               'middlec':'#386eff',
               'rightc':'#1ca5ff',
               'titlebg':'#4651b3',
               'marketbg':'#ffeef8',
               'marketbtn':'#e8ecfb',
               'marketbtnhover':'#d4dafb',
               'borderc':'#dde2f2',
               'inputc':'#f5f6fc',
               'buttonc':'#ffe2f1',
               'buttont':'#fb118e',
               'text-color':'#1a2b6b',
               'faucet-bg':'#f5f7fd',

               'adminbg':'#c51052',

               // admin按钮组
               'buttonnormal':'#f4f4f4',
               'buttohover': '#EAEAEA',
               
          },
          spacing:{
               '128':'32rem',
          }
       }, 
       
       },
       plugins: [require("daisyui")],
  }
  
  