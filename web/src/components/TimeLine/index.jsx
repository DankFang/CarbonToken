import React from 'react'

function Timeline() {
    return (
        <>
            <div className='min-h-screen flex flex-col w-full mt-20 z-0 mb-10'>
                {/* 左 */}
                <div className='w-full h-56 flex justify-start mt-10'>
                    <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0 w-1/2">
                        {/* 圆点 */}
                        <div className=" w-7 h-7 bg-blue-400 absolute -right-0 -top-6 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0 text-center text-lg">
                            1
                        </div>

                        {/* 客片内容 */}
                        <div className="flex-auto border-r-8 border-blue-400 text-black h-56">

                            <div className="text-end text-5xl mr-20 text-white">
                                What is Carbon neutrality?
                            </div>
                            <div className="text-end mr-20  text-white">
                                Carbon neutrality refers to the state where a country, enterprise, product, activity, or individual produces an equal amount of carbon emissions as they offset through the use of low-carbon energy, afforestation, energy conservation, and other forms to achieve a relative zero-emission.
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右 */}
                <div className='w-full h-56 flex justify-end -ml-4'>
                    <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0 w-1/2">
                        {/* 圆点 */}
                        <div className=" w-12 h-12 bg-blue-400 absolute left-7 -top-9 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0 text-center text-5xl">
                            2
                        </div>

                        {/* 客片内容 */}
                        <div className="flex-auto border-l-8 border-blue-400 text-black h-56">
                            <div className="text-start text-5xl text-white ml-20">
                                How to Get it?
                            </div>
                            <div className="text-start ml-20 text-white">
                                1.through carbon offset mechanisms, which equalize the carbon emissions produced elsewhere, such as afforestation or purchase of renewable energy certificates
                                <br />
                                2.through the use of low- or zero-carbon emission technologies, such as renewable energy (such as wind and solar energy) to avoid carbon emissions into the atmosphere. The ultimate goal is to only use low-carbon energy, rather than fossil fuels, to balance the release and absorption of carbon into and from the Earth.
                            </div>
                        </div>
                    </div>
                </div>

                {/* 左 */}
                <div className='w-full h-56 flex justify-start -mt-4'>
                    <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0 w-1/2">
                        {/* 圆点 */}
                        <div className=" w-7 h-7 bg-blue-400 absolute -right-0 -top-6 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0 text-center  text-lg">
                            3
                        </div>

                        {/* 客片内容 */}
                        <div className="flex-auto border-r-8 border-blue-400 text-black h-56">

                            <div className="text-end text-5xl mr-20 text-white">
                                What we do?
                            </div>
                            <div className="text-end mr-20 text-white">
                                1.Carbon Quota
                                A token, also called Carbon Credit, CT
                                Divided into enterprises and individuals
                                <br/>
                                2.Carbon Trading
                                Public trading platform (similar to Uniswap, interval liquidity), transaction participants use payment methods such as CNY
                                <br/>
                                3.Incentive mechanism
                                Excellent performance and high conversion efficiency (reward with tokens or tax reduction)
                            </div>
                        </div>
                    </div>
                </div>


            </div>



            {/* <div className='w-full border border-black flex flex-col h-56 justify-between'>
                <div className='flex flex-row justify-start w-full h-24'>
                    <div className=" w-7 h-7 bg-green-600 rounded-full z-10 mt-0 mr-0  text-center">
                        1
                    </div>
                    <div className='w-1/2 border-r-8'>1</div>
                </div>
                <div className='flex flex-row justify-end w-full h-24 -ml-2 '>
                    <div className='w-1/2 border-l-8'>1</div>
                </div>

            </div> */}

        </>
    )
}
export default Timeline;