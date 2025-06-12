// import { useFormDBContext } from "@/context/DBFromContext";
import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/commons";
// import {useNavigate, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import {headers} from "@/utils/auth";
// import { URLS } from "@/services/url";
import config from "@/config";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { Progress } from "@/components/commons";
import { PencilEditIcon } from "@/assets/icons";
import Tooltip from "@/components/commons/Tooltip";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
// import { Modal } from "@/components/commons";
// import MultiStepsForm from "@/components/views/MultiStepsForm";
import { useMultiStepsFormContext } from "@/context/MultiStepsFormContext";
import { useSidebar } from "@/context/SidebarContext";
// import { mainApi } from "@/services/api";
// import { useState } from "react";

const ConnectedInfo =  () => {
    const { roomId } = useParams();
    const { resetForm } = useMultiStepsFormContext();
    const { statusContext, setStatusContext, progressContext, setProgressContext, newCourseList } = useSidebar();
    // const [showModal, setShowModal] = useState(false);
    // const [showToast, setShowToast] = useState(false);
    // const { formData, setFormData } = useFormDBContext();
    // const [isSubmitting, setIsSubmitting] = useState(false);
    const [roadmap, setRoadmap] = useState([]);
    const [nodeList, setNodeList] = useState([]);
    const navigate = useNavigate();

    const loadNodes = useCallback(async () => {
        try {
            const nodeListResponse = await mainApi.get(URLS.CHAT.SHOW_ROADMAP("u123"));
            if (nodeListResponse.data) {
                setRoadmap(nodeListResponse.data.filter(course => course.id === roomId)[0]);
                setNodeList(nodeListResponse.data.filter(course => course.id === roomId)[0].courseNodes)
            } else {
                console.error("Received empty or invalid response data.");
                // toast error
            }
        } catch (error) {
            console.error(error);
        }
    });

    useEffect(()=> {
        loadNodes();
    },[loadNodes])

    useEffect(() => {
        if (!roadmap || nodeList.length === 0) return;
        let courses = null;

        if (newCourseList != null) {
            courses = newCourseList;
        } else {
            courses = nodeList.filter(course => course.roadmapId === roomId);
        }

        const total = courses.length;
        const completed = courses.filter(node => node.status === "finished").length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

        const unfinishedCourses = courses.filter(node => node.status !== "finished");
        const remainingTime = unfinishedCourses.reduce((acc, node) => acc + node.avgTimeToFinish, 0);

        const today = dayjs();
        const dueDate = roadmap.due ? dayjs(roadmap.due) : null;
        const daysLeft = dueDate ? dueDate.diff(today, "day") : Infinity;

        const maxDailyWorkload = roadmap.hpw;
        const maxAvailableTime = daysLeft * (maxDailyWorkload / 7);

        let status = "on-track";
        if (progress === 100) {
            status = "finished";
        } else if (dueDate && remainingTime > maxAvailableTime) {
            status = "behind";
        }

        setStatusContext(status);
        setProgressContext(progress);
    }, [nodeList, roadmap, roomId]);


    if (!roadmap) {
        return (
            <div className="p-4 text-red-500">
                Roadmap not found.
            </div>
        );
    }

    // const handleEdit = () => {
    //     if (onShowToast) {
    //         onShowToast?.();
    //     };
    // }
    // const handlePrepareData = async (data) => {
    //     setIsSubmitting(true);
    //     try {
    //         let roadmapResponse;
    //         resetForm({ data });
    //         if (data.knowledgeSource === "profile") {
    //             roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ_AUTO, data, {headers: {
    //                     "Content-Type": "application/json"
    //             }});
    //         } else {
    //             roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ, data, {headers: {
    //                     "Content-Type": "application/json"
    //             }});
    //         }
    //         if (roadmapResponse.data) {
    //             console.log("Response data:", roadmapResponse.data);
    //             navigate(`/chat/${roadmapResponse.data.roadmap.roadmapId}`);
    //         } else {
    //             console.error("Received empty or invalid response data.");
    //         }
            
    //     } catch (e) {
    //         console.error("Error preparing data:", e);
    //     } finally {
    //         // setIsPendingNavigation(false);
    //         setIsSubmitting(false);
    //     }
    // };


    const handleDisconnect = async  () => {
        console.log("Disconnecting...")
        // await mainApi.post(URLS.CHAT.SAVE_AND_CLOSE, { roomId: Number(roomId) }, {
        //     headers,
        //     withCredentials: true,
        // });
        resetForm();
        navigate(config.routes.HOME)

        // setFormData({
        //     type: "",
        //     dbms: "",
        //     username: "",
        //     password: "",
        //     databaseName: "",
        //     host: "",
        //     port: "",
        //     status: "disconnected",
        // });
    }

    return (
        <div className="h-full p-2 mr-2.5">
            <div className="flex items-center gap-3 mb-5">
                 {/* <span className="relative flex h-3 w-3">
                     <span
                         className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </span> */}
                {/* <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                    Connected: <span
                    className="text-green-500">{`${formData.host}:${formData.port}`}</span>
                </span> */}
            </div>
            <div className="h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1.5 mb-4">
                        <p className="mb-2 text-lg text-gray-800 font-bold dark:text-gray-200">{roadmap?.name}</p>
                        <Tooltip text="In Dev">
                            <Button
                                disabled={true}
                                className="flex items-center justify-center mb-1 w-6 h-6 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full" 
                                content={<PencilEditIcon size={20} className="text-gray-700 dark:text-white"/>}
                            />
                        </Tooltip>

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
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <tbody>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="w-1/2 py-2 font-medium text-gray-800 dark:text-gray-200">Goal</th>
                                <td className="w-1/2 py-2">{roadmap?.goal}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="w-1/2 py-2 font-medium text-gray-800 dark:text-gray-200">Dealine</th>
                                <td className="w-1/2 py-2">{roadmap?.due}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="w-1/2 py-2 font-medium text-gray-800 dark:text-gray-200">Hours per Week</th>
                                <td className="w-1/2 py-2">{roadmap?.hpw}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="w-1/2 py-2 font-medium text-gray-800 dark:text-gray-200">Status</th>
                                <td className="w-1/2 py-2">{statusContext==="on-track"?"On Track":statusContext==="behind"?"Behind Schedule":"Finished"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mb-2">
                        <Progress value={progressContext} status={statusContext} />
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                            {progressContext}% complete
                        </p>
                    </div>
                </div>
                <Button content="Back to Main Menu" handleEvent={handleDisconnect}
                        className="border-2 border-red-600 align-middle select-none text-[15px] text-center transition delay-50 duration-200 ease-in-out py-2.5 rounded-lg bg-red-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3 mb-5 hover:text-red-600 hover:bg-transparent"/>
            </div>
        </div>
    )
}
// ConnectedInfo.propTypes = {
//     onShowToast: PropTypes.func,
// };

export default ConnectedInfo;