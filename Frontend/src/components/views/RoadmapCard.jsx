import React from "react";
// import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { randomColor } from "@/utils/colors";
import { AbstractLine, DeleteIcon, PencilEditIcon, DuplicateIcon } from "@/assets/icons";
// import Duplicate from "@/assets/images/duplicate.png";
import { Progress } from "@/components/commons";
// import { courseNodes } from "@/mock/data";
import dayjs from "dayjs";
import { Button } from "@/components/commons";


const RoadmapCard = React.memo(({ item, handleEvent = () => {} }) => {

    const courses = item.courseNodes;
    const total = courses.length;

    const completed = courses.filter(node => node.status === "finished").length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    const unfinishedCourses = courses.filter(node => node.status !== "finished");
    const remainingTime = unfinishedCourses.reduce((acc, node) => acc + node.avgTimeToFinish, 0);

    const today = dayjs();
    const dueDate = item.due ? dayjs(item.due) : null;
    const daysLeft = dueDate ? dueDate.diff(today, "day") : Infinity;

    const maxDailyWorkload = item.hpw;
    const maxAvailableTime = daysLeft * (maxDailyWorkload/7);

    let status = "on-track";
    if (progress === 100) {
        status = "finished";
    } else if (dueDate && remainingTime > maxAvailableTime) {
        status = "behind";
    }

    return (
        <>
            <Link
                onClick={() => {handleEvent("card", item.id)}}
                to={status === null ? "#" : `/chat/${item.id}`}
                className="h-full p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl relative overflow-hidden border border-dashed hover:border-gray-500 dark:border-gray-500 dark:hover:border-white transition duration-300"
            >
                <span
                    className={`size-24 rounded-full absolute -top-8 -right-8 ring-[20px] ${
                                    status === "on-track"
                                    ? "ring-green-500/20"
                                    : status === "behind"
                                    ? "ring-red-500/20"
                                    : "ring-blue-500/20"
                                }`}
                ></span>
                <div className="flex flex-col h-full justify-between">
                    <div className="mb-3">

                        <div className="flex items-center justify-between">
                            <p className="tracking-wide font-light text-gray-700 dark:text-white">Goal: {item.goal}</p>

                            {/* action buttons on roadmap cards*/}
                            <div className="flex items-center space-x-2">
                                <Button 
                                    handleEvent={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEvent("edit", item.id)}
                                    }
                                    className="transform transition-all duration-200 hover:scale-110"
                                    content={<PencilEditIcon 
                                        size={24} 
                                        className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    />}
                                />

                                <Button 
                                    handleEvent={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEvent("duplicate", item.id)}
                                    }
                                    className="transform transition-all duration-200 hover:scale-110"
                                    content={<DuplicateIcon
                                        size={24} 
                                        className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    />}
                                />

                                <Button 
                                    handleEvent={(e) =>  {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEvent("delete", item.id)}
                                    }
                                    className="transform transition-all duration-200 hover:scale-110"
                                    content={<DeleteIcon 
                                        size={23} 
                                        className="text-gray-700 dark:text-white hover:text-red-400 transition-colors"
                                    />}
                                />
                            </div>

                        </div>
                        <h3 className="text-2xl font-semibold dark:text-white pb-3">{item.name}</h3>
                    </div>
                    <div className="mb-2">
                        <Progress value={progress} status={status} />
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                            {progress}% complete
                        </p>
                    </div>
                    <div className="flex justify-between items-center text-sm font-light text-gray-500 dark:text-gray-300 mt-1">
                        <p>Due: {item.due || "N/A"}</p>
                        <p>
                            Status:{" "}
                            <span
                                className={`${status === "on-track"
                                        ? "text-green-500"
                                        : status === "behind"
                                        ? "text-red-500"
                                        : "text-blue-500"} font-bold`
                                }
                            >
                                {status === "on-track"
                                    ? "On Track"
                                    : status === "behind"
                                    ? "Behind Schedule"
                                    : "Finished"}
                            </span>
                        </p>
                    </div>
                </div>
                <span className="rounded-full absolute -bottom-16 left-1/2 -translate-x-1/2 z-[1]">
                    <AbstractLine color={status === "on-track"
                                        ? "#22C55E"
                                        : status === "behind"
                                        ? "#EF4444"
                                        : "#3B82F6"}/>
                </span>
            </Link>
        </>
    );
});

RoadmapCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        goal: PropTypes.string,
        due: PropTypes.string,
        hpw: PropTypes.number,
        courseNodes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                link: PropTypes.string,
                status: PropTypes.string,
                avgTimeToFinish: PropTypes.number,
                childIds: PropTypes.string,
            })
        )
    }).isRequired,
    handleEvent: PropTypes.func
};

RoadmapCard.displayName = "RoadmapCard";

export default RoadmapCard;
