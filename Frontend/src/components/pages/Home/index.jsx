import {Fragment, useCallback, useEffect, useState} from "react";
import Layout from "@/components/layouts";
// import ConversationCard from "@/components/views/ConversationCard";
import RoadmapCard from "@/components/views/RoadmapCard";
import { Button, Loading } from "@/components/commons";
import { PlusIcon, NotFound, GearIcon } from "@/assets/icons";

import Pagination from "@/components/commons/Pagination";
import SearchForm from "@/components/views/SearchForm";
// import DBForm from "@/components/views/DBForm";
import MultiStepsForm from "@/components/views/MultiStepsForm";
import { Modal } from "@/components/commons";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
// import { getDecodedToken, headers } from "@/utils/auth";
// import { getDecodedToken } from "@/utils/auth";
// import { getAccessToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useFormDBContext } from "@/context/DBFromContext";
import { useMultiStepsFormContext } from "@/context/MultiStepsFormContext";
import { roadmaps } from "@/mock/data";
import dayjs from "dayjs";
import { getAccessToken, setAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";

function Dashboard() {
    const userProfile = JSON.parse(getAccessToken());
    const navigate = useNavigate();
    const { setFormData } = useFormDBContext();
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPrefModal, setShowPrefModal] = useState(false);
    // const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setFormState } = useMultiStepsFormContext();
    // const [isPendingNavigation, setIsPendingNavigation] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState("u123");
    const [deleteId, setDeleteId] = useState(null);
    const [preferenceText, setPreferenceText] = useState(userProfile?.preference?userProfile.preference:"");
    const [userRoadmaps, setUserRoadmaps] = useState([]);
    
    // const decodeToken = getDecodedToken();
    

    // const userId = decodeToken?.userId;

    // const loadRooms = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const roomsResponse = await mainApi.get(URLS.CHAT.LIST_ROOM(userId), {headers});
    //         setRooms(roomsResponse.data);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // },[userId]);

    const handleSetNewCookie = async () => {
        try {
            const loginRequest = await mainApi.get(URLS.CHAT.PERSONAL_INFORMATION("u123"));

            if (loginRequest.status === 200) {
                const token = loginRequest.data;
                setAccessToken(token);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    const deleteRoadmaps = async (roadmapId) => {
        try {
            setLoading(true);
            await mainApi.delete(URLS.CHAT.DELETE_ROADMAP(roadmapId));
            toast.success("Roadmap deleted successfully");
            await loadRoadmaps(); // Refresh roadmap list
        } catch (error) {
            console.error("Failed to delete roadmap:", error);
            toast.error("Failed to delete roadmap");
        } finally {
            setLoading(false);
        }
    };

    const loadRoadmaps = useCallback(async () => {
        try {
            setLoading(true);
            const rmListResponse = await mainApi.get(URLS.CHAT.SHOW_ROADMAP(selectedUserId));
            if (rmListResponse.data) {
                console.log("Response data:", rmListResponse.data);
                setUserRoadmaps(rmListResponse.data);
            } else {
                console.error("Received empty or invalid response data.");
                // toast error
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedUserId]);

    useEffect(()=> {
        // loadRooms();
        loadRoadmaps();
    },[loadRoadmaps])

    // useEffect(() => {
    //     if (isPendingNavigation && formState.data) {
    //         setIsSubmitting(true);
    //         // navigate(`/chat/${newRoadmapId}`);
    //     }
    // }, [formState, isPendingNavigation, navigate, newRoadmapId]);

    useEffect(()=> {
        setSelectedUserId("u123")
    },[])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // const filteredChats = rooms.filter(item =>
    //     item.databaseName.toLowerCase().includes(query.toLowerCase())
    // );

    const filteredRoadmaps = userRoadmaps.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const paginatedChats = filteredRoadmaps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // const handleCardClick = async (item) => {
    //     const room = item;

    //     if (room.status === null || room.status === "disconnected") {
    //         try {
    //             await reconnectDatabase(room);
    //         } catch (error) {
    //             console.error("Error while reconnecting or preparing data", error);
    //         }
    //     } else {
    //         setShowModal(!showModal);
    //     }
    // };

    // const reconnectDatabase = async (room) => {
    //     try {
    //         const reconnectResponse = await mainApi.post(URLS.CHAT.CREATE_DATA, room, {headers});

    //         if (reconnectResponse.data) {
    //             await handlePrepareData(reconnectResponse.data);
    //         } else {
    //             console.error("Received empty or invalid response data.");
    //         }
    //     } catch (error) {
    //         console.error("Error reconnecting the database:", error);
    //     }
    // };

    const handlePrepareData = async (data) => {
        setIsSubmitting(true);
        try {
            let roadmapResponse;
            setFormState({ data });
            if (data.knowledgeSource === "profile") {
                let existingRoadmapArr = [];
                userRoadmaps.forEach((roadmap) => {
                    const courses = roadmap.courseNodes;
                    const total = courses.length;
                
                    const completed = courses.filter(node => node.status === "finished").length;
                    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
                
                    const unfinishedCourses = courses.filter(node => node.status !== "finished");
                    const remainingTime = unfinishedCourses.reduce((acc, node) => acc + node.avgTimeToFinish, 0);
                
                    const today = dayjs();
                    const dueDate = roadmap.due ? dayjs(roadmap.due) : null;
                    const daysLeft = dueDate ? dueDate.diff(today, "day") : Infinity;
                
                    const maxDailyWorkload = roadmap.hpw;
                    const maxAvailableTime = daysLeft * (maxDailyWorkload/7);
                
                    let status = "on-track";
                    if (progress === 100) {
                        status = "finished";
                    } else if (dueDate && remainingTime > maxAvailableTime) {
                        status = "behind";
                    }

                    existingRoadmapArr.push({ name: roadmap.name, progress: progress, status: status });
                });
                let certNameArr = userProfile?.certs?.map(cert => cert.name) || [];
                const payload = {
                    userId: selectedUserId,
                    goal: data.goal?.trim(),
                    deadline: data.deadline,
                    rmName: data.rmName,
                    studyHourPerWeek: data.studyHourPerWeek,
                    existingRoadmap: existingRoadmapArr,
                    certName: certNameArr,
                };
                roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ_AUTO, payload, {headers: {
                        "Content-Type": "application/json"
                }});
            } else {
                roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ, data, {headers: {
                        "Content-Type": "application/json"
                }});
            }
            if (roadmapResponse.data) {
                navigate(`/chat/${roadmapResponse.data.roadmap.roadmapId}`);
            } else {
                console.error("Received empty or invalid response data.");
                // toast error
            }
            
        } catch (e) {
            console.error("Error preparing data:", e);
        } finally {
            // setIsPendingNavigation(false);
            setIsSubmitting(false);
        }
    };

    const handleRoadmapEvent = (event, id) => {
        if (event === "edit") {
            console.log(`Edit roadmap with ID: ${id}`);
        }
        else if (event === "delete") {
            console.log(`Delete roadmap with ID: ${id}`);
            setShowDeleteModal(true);
            setDeleteId(id);
        }
        else if (event === "duplicate") {
            console.log(`Duplicate roadmap with ID: ${id}`);
        } else {
            handlePrepareData((roadmaps.find(r => r.id === id)));
        }
    }

    const handleNewChat = () => {
        setFormData({
            type: "",
            dbms: "",
            username: "",
            password: "",
            databaseName: "",
            host: "",
            port: "",
        })
        setShowModal(!showModal)
    }

    const handlePreference = async () => {
        try {
            setIsSubmitting(true);
            await mainApi.post(URLS.CHAT.UPDATE_CUSTOM_PREFERENCE, 
                { userId: "u123", preference: preferenceText }, 
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            await handleSetNewCookie();
            toast.success("Preference Updated Successfully!");
        } catch (error) {
            console.error("Error preparing data:", error);
            toast.error("Something went wrong.");
        } finally {
            setShowPrefModal(false);
            setIsSubmitting(false);
        }
    }

    return (
        <Layout title="Overview">
            <Fragment>
                <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between mb-5">
                    <SearchForm query={query} setQuery={setQuery}/>

                    <div>
                        <Button
                            content="Edit Custom Preferences"
                            icon={<GearIcon />}
                            iconPosition="left"
                            handleEvent={() => setShowPrefModal(true)}
                            className="mr-3 px-3 py-2.5 w-fit text-gray-500 dark:hover:text-white hover:text-black text-sm rounded-xl border border-dashed border-gray-500 dark:border-gray-500 transition duration-300"
                        />

                        <Button
                            content="New Roadmap"
                            icon={<PlusIcon />}
                            iconPosition="left"
                            handleEvent={handleNewChat}
                            className="px-3 py-2.5 w-fit text-gray-500 dark:hover:text-white hover:text-black text-sm rounded-xl border border-dashed border-gray-500 dark:border-gray-500 transition duration-300"
                        />
                    </div>                    
                </div>
                {loading ? (
                    <Loading/>
                ) : (
                    <Fragment>
                        <div className="grid lg:grid-cols-3 gap-5">
                            {paginatedChats.length > 0 ? (
                                paginatedChats.map((item) => (
                                    // <ConversationCard
                                        //     key={item.roomId}
                                    //     item={item}
                                    //     handleEvent={() => handleCardClick(item)}
                                    // />
                                    <RoadmapCard
                                        key={item.id}
                                        item={item}
                                        handleEvent={handleRoadmapEvent}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 flex flex-col items-center justify-center">
                                    <NotFound/>
                                    <p className="mt-5 font-light text-gray-500 dark:text-white text-center">
                                        There is no data to display at the moment. Please try again later or add new
                                        roadmap.
                                    </p>
                                </div>
                            )}
                        </div>
                        <Pagination
                            totalItems={filteredRoadmaps.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />

                        <Modal isShow={showModal} title="New Roadmap" onClose={() => {
                                    setShowModal(!showModal);
                                }
                            }>
                            {/* <DBForm setShowModal={setShowModal}/> */}
                            <MultiStepsForm
                                onComplete={(data) => {
                                    console.log("Final Form Submission:", data);
                                    handlePrepareData(data);
                                }}
                                submitting={isSubmitting}
                            />
                            {/* <div>Modal is working</div> */}
                        </Modal>
                        <Modal isShow={showDeleteModal} noBorder={true} onClose={() => {
                                    setShowDeleteModal(!showDeleteModal);
                                    setDeleteId(null);
                                }
                            }>
                            <div className="flex flex-col items-center space-y-6 text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-300/10">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    Are you sure you want to delete this roadmap?
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    This action cannot be undone. You will lose all related progress.
                                </p>
                                <div className="flex space-x-4 w-full">
                                    <button
                                        onClick={() => {
                                            deleteRoadmaps(deleteId);
                                            setShowDeleteModal(!showDeleteModal);
                                        }}
                                        className="flex-1 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-150"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(!showDeleteModal);
                                            setDeleteId(null);
                                        }}
                                        className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Modal>
                        <Modal isShow={showPrefModal} noBorder={true} onClose={() => setShowPrefModal(false)}>
                            <div className="flex flex-col items-center space-y-6 text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-300/10">
                                <svg
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20h9M12 4h9M4 12h16M4 4h4v4H4V4zm0 12h4v4H4v-4z"
                                    />
                                </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    Update Your Preference
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Share what your current career goal or company policy is. This will help tailor your learning path.
                                </p>

                                <textarea
                                    value={preferenceText}
                                    onChange={(e) => setPreferenceText(e.target.value)}
                                    rows="4"
                                    placeholder="e.g. I want to become a DevOps Engineer"
                                    className="w-full px-4 py-2 border rounded-lg resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                />

                                <div className="flex space-x-4 w-full">
                                    <Button
                                        type="button"
                                        content="Save Preference"
                                        handleEvent={() => handlePreference(preferenceText)}
                                        isSubmitting={isSubmitting}
                                        disabled={isSubmitting}
                                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-150"
                                    />
                                    <Button
                                        type="button"
                                        content="Cancel"
                                        handleEvent={() => setShowPrefModal(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
                                    />
                                </div>
                            </div>
                            </Modal>
                    </Fragment>
                )}
            </Fragment>
        </Layout>
    );
}

export default Dashboard;
