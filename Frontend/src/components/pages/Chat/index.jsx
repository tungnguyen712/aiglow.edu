// import { useCallback, useEffect, useState } from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
// import { getAccessToken, headers } from "@/utils/auth";
// import { getAccessToken } from "@/utils/auth";
// import { useFormDBContext } from "@/context/DBFromContext";
import { Modal } from "@/components/commons";

import Layout from "@/components/layouts";
import { Button, Skeleton } from "@/components/commons";
import { GreenCheckCircle } from "@/assets/icons";
import Message from "@/components/views/Message";
// import config from "@/config";
// import { Flip, toast } from "react-toastify";
// import { MockImage, ImageNotFound } from "@/assets/images";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
// import { courseNodes } from "@/mock/data";
import LearningPath from "@/components/views/LearningPath"
import ChatBotWidget from "@/components/views/ChatBotWidget"
// import { Modal } from "@/components/commons";
// import { useMultiStepsFormContext } from "@/context/MultiStepsFormContext";
import { useSidebar } from "@/context/SidebarContext";
import { useChatBot } from "@/context/ChatBotContext";
import { toast } from "react-toastify";


function Chat() {
    const { roomId } = useParams();
    // const navigate = useNavigate();
    // const { formData, setFormData } = useFormDBContext();
    const [loadingState, setLoadingState] = useState(false);
    const [reloadAfterStatusChange, setReloadAfterStatusChange] = useState(false);
    const { setNewCourseList, statusContext } = useSidebar();
    const { updateRequired, setUpdateRequired } = useChatBot();
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // const [chat, setChat] = useState([]);
    const chat = null;

    // const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    // const { formState } = useMultiStepsFormContext();
    // const [isSubmitting, setIsSubmitting] = useState(false);

    const [courseList, setCourseList] = useState([]);
    console.log("statusContext: ", statusContext);
    const [isLate, setIsLate] = useState(false);
    console.log("isLate: ", isLate);
    // const { link, setLink } = useState([]);

    // const [mockMessage, setMockMessage] = useState("Try Typing Something!");

    // const courses = courseNodes.filter(course => course.roadmapId === roomId);

    useEffect(() => {
        setIsLate(statusContext === "behind");
    }, [statusContext]);

    const loadNodes = useCallback(async () => {
        try {
            setLoadingState(true);
            const nodeListResponse = await mainApi.get(URLS.CHAT.SHOW_ROADMAP("u123"));
            if (nodeListResponse.data) {
                const courses = nodeListResponse.data.filter(course => course.id === roomId);
                console.log("Response data:", courses[0].courseNodes);
                setCourseList(courses[0].courseNodes);
                setNewCourseList(courses[0].courseNodes);
            } else {
                console.error("Received empty or invalid response data.");
                // toast error
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingState(false);
        }
    }, [roomId, setNewCourseList]);

    useEffect(()=> {
        loadNodes();
    },[loadNodes])

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const confirmUpdateRoadmap = async () => {
        try {
            setLoadingState(true);
            await mainApi.post(URLS.CHAT.SEND_CHATBOT_MESSAGE, {
                text: "This roadmap feels too difficult for me. I would like to adjust the courses to something more manageable and possibly extend the deadline.",
                roadmapId: roomId
            }, {
                headers: { "Content-Type": "application/json" }
            });

            toast.success("Your feedback has been submitted. Updating roadmap...");
            loadNodes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update roadmap. Please try again.");
        } finally {
            setLoadingState(false);
        }
    };

    // const handleUpdateFromToast = () => {
    //     setShowToast(false);
    //     setShowModal(true);
    // };

    const handleCheckboxChange = async (courseId) => {
        console.log("Checkbox clicked for course ID:", courseId);
        let newStatus = "";
        const updatedCourseList = courseList.map(course => {
            if (course.id === courseId) {
                newStatus = course.status === "finished" ? "unfinished" : "finished";
                
                return { ...course, status: newStatus };
            }
            return course;
        });
        try {
            setReloadAfterStatusChange(true);
            await mainApi.post(URLS.CHAT.UPDATE_COURSE_NODE_STATUS(courseId), 
                { status: newStatus }, 
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
        } catch (error) {
            toast.error(error);
        } finally {
            setReloadAfterStatusChange(false);
        }
        setCourseList(updatedCourseList);
        setNewCourseList(updatedCourseList);

        if(updatedCourseList.every(course => course.status === "finished")) {
            toast.success("🎉 Congratulations! You’ve completed the entire learning path!");
            setShowModal(true);
        }
    }

    const regenMap = () => {
        console.log("LinhTinh");
        setShowUpdateModal(true);
    }

    // const toggleListening = () => {
    //     if (!recognition) {
    //         alert("Speech Recognition API is not supported in this browser.");
    //         return;
    //     }

    //     if (listening) {
    //         recognition.stop();
    //     } else {
    //         recognition.start();
    //     }

    //     console.log("Data:", formState);
    // };

    return (
        <Layout 
            title="Overview" 
            fullBackground={false} 
            sidebarShow={true}
        > 
            <div className="relative flex flex-col w-full mx-auto">
                <div className="fixed top-4 right-4 z-50">
                    
                    {/* Toast to regenerate roadmap */}
                    {showToast && (
                        <div id="toast-interactive" className="align-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-400" role="alert">
                            <div className="flex">
                                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
                                    
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                                    </svg>
                                    <span className="sr-only">Refresh icon</span>
                                </div>
                                <div className="ms-3 text-sm font-normal">
                                    <span className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Edit Roadmap</span>
                                    <div className="mb-2 text-sm font-normal">Do you want to generate a new roadmap?</div> 
                                    <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <button
                                            onClick={handleCloseToast}
                                            className="inline-flex justify-center w-full px-2 py-1.5 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                        onClick={handleCloseToast}
                                        className="inline-flex justify-center w-full px-2 py-1.5 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                        >
                                            Not now
                                        </button>
                                    </div>
                                    </div>    
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowToast(false)}
                                    className="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    aria-label="Close"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        )}
                        {/* {showModal && (
                            <Modal 
                                isShow={showModal}
                                title="Edit Roadmap"
                                onClose={() => setShowModal(false)}
                            >
                                <MultiStepsForm
                                    onComplete={(data) => {
                                        console.log("Final Form Submission:", data);
                                        handlePrepareData(data);
                                    }}
                                    submitting={isSubmitting}
                                />
                            </Modal>
                        )} */}
                </div>

                <div className="min-h-[calc(100vh-181px)] lg:min-h-[calc(100vh-145px)]">
                    {isLate && (
                        <div className="flex items-start justify-between border border-red-500 bg-red-100 text-red-700 p-4 rounded-xl mb-4">
                            <div>
                            <p className="font-semibold">⚠️ You are behind schedule. You might want to train harder or update your roadmap.</p>
                            
                            <button 
                                className="mt-2 inline-block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => regenMap()}
                            >
                                Update Roadmap
                            </button>
                            </div>
                            <button
                                className="ml-4 text-red-500 hover:text-red-700 text-xl font-bold"
                                onClick={() => setIsLate(false)}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    {updateRequired && (
                        <div className="flex items-start justify-between border border-cyan-500 bg-cyan-100 text-cyan-700 p-4 rounded-xl mb-4">
                            <div>
                            <p className="font-semibold">🔄 Your roadmap has been updated. Would you like to reload the page to see the changes?</p>
                            
                            <button 
                                className="mt-2 inline-block bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                                onClick={() => {
                                    setUpdateRequired(false);
                                    window.location.reload();
                                }}
                            >
                                Reload Page
                            </button>
                            </div>
                            <button
                                className="ml-4 text-cyan-500 hover:text-cyan-700 text-xl font-bold"
                                onClick={() => setUpdateRequired(false)}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 items-center gap-5 h-full rounded-3xl">
                        <div className="col-span-2 p-5 rounded-2xl w-full h-full bg-white dark:bg-slate-800 relative">
                            {(loadingState || reloadAfterStatusChange) ? (
                                <Skeleton />
                            ) : (
                                <div className="mb-10">
                                    <h2 className="text-xl font-bold dark:text-white mb-4">Your Roadmap</h2>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    >
                                        <LearningPath courseList={courseList} />
                                    </motion.div>
                                </div>
                            )}

                            {/* {formData.status === "disconnected" && !loadingState && (
                                <p className="text-black dark:text-white text-center mt-5">No data displayed.</p>
                            )} */}

                            {/*<Button*/}
                            {/*    content="Save and Close"*/}
                            {/*    handleEvent={handleSaveAndClose}*/}
                            {/*    className="absolute left-6 bottom-6 align-middle select-none text-[15px] text-center transition-all py-2.5 px-3 rounded-lg bg-red-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block gap-3"*/}
                            {/*/>*/}
                        </div>

                        <div className="col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-800 w-full h-full">
                            {chat?.ChatHistory?.map((msg, index) => (
                                <Message key={index} message={msg.content} sender={msg.sender} avatar=""/>
                            ))}

                            {!loadingState && (<div className="font-bold text-xl mt-6 text-gray-600 dark:text-white">Learning Paths</div>)}
                            <div className="py-2">
                                <ol className="list-decimal ml-6 text-xl">
                                    {!loadingState && courseList?.map((course) => {
                                        const maxLength = 30;
                                        const truncatedLink = course.link.length > maxLength
                                            ? course.link.slice(0, maxLength) + "..."
                                            : course.link;

                                        return (
                                        <div key={course.link} className="mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex items-center">
                                                    <label className="flex items-center cursor-pointer relative">
                                                    <input
                                                        id={`checkbox-${course.id}`}
                                                        type="checkbox"
                                                        checked={course.status === "finished"}
                                                        onChange={() => handleCheckboxChange(course.id)}
                                                        className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                                    />
                                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                        </svg>
                                                    </span>
                                                    </label>
                                                </div>
                                                <a
                                                    href={course.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: "none" }}
                                                    className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300 hover:underline"
                                                >
                                                    <TypeAnimation
                                                        key={course.status}
                                                        sequence={[course.name]}
                                                        speed={50}
                                                        wrapper="span"
                                                        cursor={false}
                                                        style={{ display: "block" }}
                                                        className={`text-lg ${course.status === "finished" ? "text-gray-400 line-through" : "text-green-600"}`}
                                                    />
                                                </a>
                                            </div>
                                            <div className="ml-6">
                                                <a href={course.link}>
                                                    <TypeAnimation
                                                        key={course.status}
                                                        sequence={[truncatedLink]}
                                                        speed={50}
                                                        wrapper="span"
                                                        cursor={false}
                                                        style={{ display: "block" }}
                                                        className={`text-sm text-gray-400 ${course.status === "finished" ? "line-through" : ""}`}
                                                    />
                                                </a>
                                                <TypeAnimation
                                                    sequence={[`Average time to finish the course: ${course.avgTimeToFinish} hours`]}
                                                    speed={50}
                                                    wrapper="span"
                                                    cursor={false}
                                                    style={{ display: "inline-block" }}
                                                    className={`text-xs text-gray-600 dark:text-gray-400 ml-6`}
                                                />
                                            </div>  
                                        </div>
                                    );})}
                                </ol>
                            </div>


                            {loadingState && <Skeleton/>}
                        </div>
                    </div>
                </div>

                {/* <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px]">
                    <div className="shadow-lg dark:shadow-gray-600 backdrop-blur-sm rounded-3xl overflow-hidden">
                        <div className="flex flex-row items-center bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl">
                            <textarea
                                className="flex w-full focus:outline-none py-2 bg-transparent text-black dark:text-white resize-none scrollbar-transparent"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={handleInput}
                                rows={1}
                                style={{ maxHeight: "96px" }}
                                onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                    setMessage("");
                                }
                                }}
                            />

                            <div className="flex flex-row gap-x-2 pl-3 items-center">
                                <Button
                                    content={<MicrophoneIcon className={listening ? "animate-pulse text-red-500" : ""} />}
                                    handleEvent={toggleListening}
                                    className="text-dark dark:text-white hover:text-gray-600"
                                />

                                <Button
                                    content={loadingState ? <StopCircle /> : <SentIcon />}
                                    disabled={!message || listening || loadingState}
                                    handleEvent={() => {
                                        handleSendMessage();
                                        setMessage("");
                                    }}
                                    className="text-dark dark:text-white hover:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <Modal isShow={showModal} noBorder={true} onClose={() => {
                        setShowModal(!showModal);
                    }
                }>
                <div className="flex flex-col items-center text-center space-y-4">
                    <GreenCheckCircle/>
                    <h2 className="text-2xl font-bold text-green-600">Congratulations!</h2>
                    <p className="text-gray-700 dark:text-gray-200">
                        You’ve completed the entire learning path. Keep going and never stop growing!
                    </p>
                    <Button
                        type="button"
                        content="Dismiss"
                        handleEvent={() => setShowModal(!showModal)}
                        className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                    />
                </div>
            </Modal>
            <Modal isShow={showUpdateModal} noBorder={true} onClose={() => {
                        setShowUpdateModal(!showUpdateModal);
                    }
                }>
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-300/10">
                        <svg fill="#ca8a04" viewBox="0 -0.5 17 17" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" d="M15.35 8c0 3.377-2.945 6.25-6.75 6.25S1.85 11.377 1.85 8 4.795 1.75 8.6 1.75 15.35 4.623 15.35 8zm1.25 0c0 4.142-3.582 7.5-8 7.5S.6 12.142.6 8C.6 3.858 4.182.5 8.6.5s8 3.358 8 7.5zM9.229 3.101l-.014 7.3-1.25-.002.014-7.3 1.25.002zm.016 9.249a.65.65 0 1 0-1.3 0 .65.65 0 0 0 1.3 0z"></path></g></svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        Update to Easier Roadmap?
                    </h2>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                        This action will <strong>regenerate your current roadmap</strong> to an easier version and <span className="text-red-500 font-semibold">cannot be undone</span>.
                        <br /><br />
                        Please consider taking a screenshot or saving any course links before proceeding.
                    </p>

                    <div className="flex flex-col space-y-3 w-full">
                        <button
                            type="button"
                            onClick={() => {
                                confirmUpdateRoadmap();
                                setShowUpdateModal(false);
                            }}
                            className="py-2.5 w-full bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-150"
                        >
                            Yes, Update Roadmap
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowUpdateModal(false)}
                            className="py-2.5 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
            <ChatBotWidget />
        </Layout>
    );
}

export default Chat;