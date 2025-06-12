import {Fragment, useCallback, useEffect, useState} from "react";
import Layout from "@/components/layouts";
// import ConversationCard from "@/components/views/ConversationCard";
import RoadmapCard from "@/components/views/RoadmapCard";
import { Button, Loading } from "@/components/commons";
import { PlusIcon, NotFound } from "@/assets/icons";

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
import { getAccessToken } from "@/utils/auth";

function Dashboard() {
    const userProfile = JSON.parse(getAccessToken());
    const navigate = useNavigate();
    const { setFormData } = useFormDBContext();
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    // const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setFormState } = useMultiStepsFormContext();
    // const [isPendingNavigation, setIsPendingNavigation] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState("u123");
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

    const loadRoadmaps = useCallback(async () => {
        try {
            setLoading(true);
            const rmListResponse = await mainApi.get(URLS.CHAT.SHOW_ROADMAP(selectedUserId));
            console.log(rmListResponse);
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
            console.log("Integrating: ", data);
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
                console.log("Final Payload Profile: ", payload);
                roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ_AUTO, payload, {headers: {
                        "Content-Type": "application/json"
                }});
            } else {
                roadmapResponse = await mainApi.post(URLS.CHAT.SEND_ROADMAP_REQ, data, {headers: {
                        "Content-Type": "application/json"
                }});
            }
            if (roadmapResponse.data) {
                console.log("Response data:", roadmapResponse.data);
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

    return (
        <Layout title="Overview">
            <Fragment>
                <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between mb-5">
                    <SearchForm query={query} setQuery={setQuery}/>

                    <Button
                        content="New Roadmap"
                        icon={<PlusIcon/>}
                        iconPosition="left"
                        handleEvent={handleNewChat}
                        className="px-3 py-2.5 w-fit text-gray-500 dark:hover:text-white text-sm rounded-xl border border-dashed border-gray-500 dark:border-gray-500 transition duration-300"
                    />
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
                    </Fragment>
                )}
            </Fragment>
        </Layout>
    );
}

export default Dashboard;
