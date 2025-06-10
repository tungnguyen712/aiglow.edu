import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import { TypeAnimation } from "react-type-animation";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { Skeleton } from "@/components/commons";
import Message from "@/components/views/Message";
import { Cuder } from "@/assets/images";

import { barData, pieData, sqlCode } from "@/mock/data";

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneLight, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from "@/context/ThemeContext";

const ChatMock = ({ messages, loading, isShow }) => {
    const { darkMode } = useTheme();
    const [showChart, setShowChart] = useState(false);
    const [loadingChart, setLoadingChart] = useState(false);


    useEffect(() => {
        setLoadingChart(true);
        setTimeout(() => {
            setShowChart(true);
            setLoadingChart(false);
        }, 4000);
    },[])

    return (
        <div
            className="flex flex-col-reverse lg:grid lg:grid-cols-3 items-center gap-5 h-full rounded-3xl">
                <div className="col-span-2 p-5 rounded-2xl w-full h-full bg-white dark:bg-slate-800">
                    {loadingChart && <Skeleton/>}
                    {showChart && (
                        <div>
                            <div className="mb-10">
                                <h2 className="text-xl font-bold dark:text-white mb-4">SQL Query</h2>
                                <SyntaxHighlighter language="sql" style={darkMode ? atomOneDark : atomOneLight}
                                                   className="rounded-xl text-sm" customStyle={{padding: "20px 30px"}}>
                                    {sqlCode}
                                </SyntaxHighlighter>
                            </div>
                            <div className="mb-10">
                                <h2 className="text-xl font-bold dark:text-white mb-4">Sales and Expenses Over
                                    Time</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="Sales" fill="#8884d8"/>
                                        <Bar dataKey="Expenses" fill="#82ca9d"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-xl font-bold mb-4 dark:text-white">Revenue Sources</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                             outerRadius={100} fill="#8884d8" label>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`}
                                                      fill={['#8884d8', '#82ca9d', '#ffc658', '#d0ed57'][index % 4]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-xl font-bold dark:text-white mb-4">Sales Trend Analysis</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="Sales" stroke="#8884d8"
                                              activeDot={{r: 8}}/>
                                        <Line type="monotone" dataKey="Expenses" stroke="#82ca9d"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            <div className="col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-800 w-full h-full">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} avatar={Cuder}/>
                ))}

                {loading && <Skeleton/>}

                {isShow && (
                    <div className="flex flex-row gap-x-3 mb-5">
                        <div
                            className="flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0 border-2 border-gray-200 dark:border-white overflow-hidden text-white">🌷
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-xl lg:max-w-2xl">
                            <TypeAnimation
                                splitter={(str) => str.split(/(?= )/)}
                                sequence={[
                                    'Business Intelligence (BI) statistical reports provide a comprehensive view of business performance.',
                                    3000,
                                ]}
                                speed={{type: 'keyStrokeDelayInMs', value: 30}}
                                className="text-black dark:text-white"
                                repeat={0}
                                cursor={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

ChatMock.propTypes = {
    messages: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    isShow: PropTypes.bool.isRequired,
}

export default ChatMock;