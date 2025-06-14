import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Button, Skeleton } from "@/components/commons";
// import { javaSkillsData } from "@/mock/data";
// import Tooltip from "@/components/commons/Tooltip";
import { TypeAnimation } from "react-type-animation";
import { UserBigIcon, EditIcon, CheckCircle, SadFace } from "@/assets/icons";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
import { toast } from "react-toastify";
// import { headers } from "@/utils/auth";

const MultiStepsForm = ({ onComplete, submitting }) => {
    const [step, setStep] = useState(1);

    const [goal, setGoal] = useState("");
    const [goalError, setGoalError] = useState("");

    const [deadline, setDeadline] = useState("");
    const [hoursPerWeek, setHoursPerWeek] = useState("");

    const [hoursWarning, setHoursWarning] = useState("");
    const [timeErrors, setTimeErrors] = useState({});

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [generatedSkills, setGeneratedSkills] = useState([]);

    const [assessMode, setAssessMode] = useState("");

    const [customName, setCustomName] = useState("Untitled Roadmap");
    const [customNameErrors, setCustomNameErrors] = useState("");

    const [sending, setSending] = useState(false);
    const [backendConnection, setBackendConnection] = useState(true);

    const handleSkillSelection = (skillName, isSelected) => {
        setSelectedSkills((prev) =>
            isSelected
                ? [...prev, skillName]
                : prev.filter((name) => name !== skillName)
        );
    };

    const sendGoalGenSkills = async (goal) => {
        setSending(true);
        setBackendConnection(false);
        try {
            const goalResponse = await mainApi.post(
                URLS.CHAT.SEND_GOAL,
                goal,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            if (goalResponse.data) {
                // await handlePrepareData(reconnectResponse.data);
                console.log("Response data:", goalResponse.data);
                setBackendConnection(true);
                // console.log("Goal Id:", goalResponse.data.goalId);
                await getRelatedSkillsList(goalResponse.data.goalId);
            } else {
                console.error("Received empty or invalid response data.");
            }
        } catch (error) {
            console.error("Error reconnecting the database:", error);
            toast.error("Error reconnecting the database.");
            setSending(false);
        }
    };

    const getRelatedSkillsList = async (goalId) => {
        try {
            const generatedSkils = await mainApi.get(
                URLS.CHAT.SHOW_SKILLS(goalId)
            );
            const transformedSkills = generatedSkils.data.map((skill, index) => ({
                name: skill,
                value: index + 1
            }));
            setGeneratedSkills(transformedSkills);
            if (JSON.stringify(generatedSkils.data)) {
                console.log(transformedSkills);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    }

    const validateStep1 = () => {
        if (!goal.trim()) {
            setGoalError("Please enter your target role or skill goal.");
            return false;
        }
        if (!customName.trim()) {
            setCustomName("Untitled Roadmap");
        }
        return true;
    };

    const validateStep2 = () => {
        const errors = {};

        const hours = Number(hoursPerWeek);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekFromToday = new Date(today);
        oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
        const inputDeadline = new Date(deadline);

        if (!deadline || inputDeadline < oneWeekFromToday) errors.deadline = "Please choose a deadline at least one week from today.";
        if (!hoursPerWeek) {
            errors.hoursPerWeek = "Please enter hours per week.";
        } else if (isNaN(hours) || hours <= 0 || hours > 98) {
            errors.hoursPerWeek = "Please enter a valid number.";
        } 

        setTimeErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            setStep(3);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleKnowledgeSelection = (source) => {
        console.log("Selected Skills: ", selectedSkills);
        console.log("Generate from: ", source);

        onComplete({
            userId: "u123",
            goal: goal.trim(),
            deadline,
            rmName: customName,
            studyHourPerWeek: Number(hoursPerWeek),
            selectedSkills,
            previousRoadmapIds: [
                "r000"
            ],
            knowledgeSource: assessMode,
        });
    };

    const fadeVariants = {
        initial: { 
            opacity: 0 
        },
        animate: { 
            opacity: 1 
        },
        exit: { 
            opacity: 0 
        }
    };

    return (
        <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6 relative">
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: step === 1 ? "0%" : step === 2 ? "33%" : step === 3 ? "67%" : "100%" }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-4"
                    >
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-white">
                            What Do You Want to Become?
                        </label>
                        <Input
                            name="goal"
                            type="text"
                            id="goal"
                            placeholder="e.g., DevOps Engineer, Data Scientist"
                            value={goal}
                            onChange={(e) => {
                                setGoal(e.target.value);
                                setGoalError("");
                            }}
                            error={goalError}
                            className="mt-1 block w-full"
                        />
                        <label htmlFor="roadmapName" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Give Your Roadmap a Name
                        </label>
                        <Input
                            name="roadmapName"
                            type="text"
                            id="roadmapName"
                            placeholder="e.g., My DevOps Journey"
                            value={customName}
                            onChange={(e) => {
                                setCustomName(e.target.value);
                                setCustomNameErrors("");
                            }}
                            error={customNameErrors}
                            className="mt-1 block w-full"
                        />
                        <Button
                            type="submit"
                            content="Next"
                            isSubmitting={submitting}
                            disabled={submitting}
                            className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                        />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-4"
                    >
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-white">
                            By When Do You Want to Reach Your Goal?
                        </label>
                        <Input
                            name="deadline"
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => {
                                setDeadline(e.target.value);
                                setTimeErrors((prev) => ({ ...prev, deadline: "" }));
                            }}
                            error={timeErrors.deadline}
                            className="mt-1 block w-full"
                        />

                        <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 dark:text-white">
                            How Many Hours Per Week Can You Learn?
                        </label>

                        <div>
                            <Input
                                name="commitTime"
                                type="number"
                                id="hoursPerWeek"
                                placeholder="e.g., 10"
                                value={hoursPerWeek}
                                onChange={(e) => {
                                    setHoursPerWeek(e.target.value);
                                    setTimeErrors((prev) => ({ ...prev, hoursPerWeek: "" }));
                                    const val = Number(e.target.value);
                                    if (val > 40) {
                                        setHoursWarning("More than 40 hours a week can be overwhelming. Are you sure you'd like to proceed?");
                                    } else {
                                        setHoursWarning("");
                                    }
                                }}
                                error={timeErrors.hoursPerWeek}
                                className="mt-1 block w-full"
                            />
                            {hoursWarning && (
                                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                                    {hoursWarning}
                                </div>
                            )}
                        </div>
                        

                        <div className="flex justify-between gap-4"> 
                            <Button
                                type="button"
                                content="Back"
                                handleEvent={prevStep}
                                className="mt-2 transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                            />
                            <Button
                                type="submit"
                                content="Next"
                                isSubmitting={submitting}
                                disabled={submitting}
                                className="mt-2 transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                            />
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            What best describes your current knowledge?
                        </label>

                        <div className="flex justify-between px-10">
                            {/* <Tooltip text="This feature is currently unavailable" position="options" className="flex justify-center">
                                <button
                                    type="button"
                                    disabled={true}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-600 rounded-lg p-4 dark:text-gray-300"
                                >
                                    Use my profile to assess skills
                                </button>
                            </Tooltip> */}

                            <button
                                type="button"
                                onClick={() =>{
                                    setAssessMode("profile");
                                    sendGoalGenSkills({
                                        userId: "u123",
                                        goal: goal
                                    });
                                    setStep(4);
                                }}
                                className="w-[235px] flex flex-col items-center justify-center gap-3 border-2 border-indigo-800 rounded-lg p-4 hover:bg-indigo-800 hover:text-white dark:text-white transition delay-50 duration-200 ease-in-out"
                            >
                                <UserBigIcon /> Use my profile to assess skills
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setAssessMode("manual");
                                    setStep(4);
                                    sendGoalGenSkills({
                                        userId: "u123",
                                        goal: goal
                                    });
                                }
                                }
                                className="w-[235px] flex flex-col items-center justify-center gap-3 border-2 border-indigo-800 rounded-lg p-4 hover:bg-indigo-800 hover:text-white dark:text-white transition delay-50 duration-200 ease-in-out"
                            >
                                <EditIcon /> I’ll enter my skills manually
                            </button>
                        </div>

                        <Button
                            type="button"
                            content="Back"
                            handleEvent={() => setStep(2)}
                            className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                        />
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        {sending && <Skeleton/>}
                        {assessMode === "profile" && !sending && generatedSkills.length > 1 ? (
                            <div className="text-center flex items-center justify-center text-lg font-medium text-gray-800 dark:text-white">
                                <CheckCircle />&nbsp;You’re all set! Ready to generate your personalized roadmap.
                            </div>
                        ) : (!sending && generatedSkills.length > 1) ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Select the skills you currently have:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                                    {generatedSkills.map((skill) => (
                                        <label
                                            key={skill.value}
                                            className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
                                        >
                                            <input
                                                type="checkbox"
                                                value={skill.value}
                                                onChange={(e) => {
                                                    handleSkillSelection(skill.name, e.target.checked);
                                                }}
                                                className="accent-indigo-600"
                                            />
                                            <TypeAnimation
                                                sequence={[skill.name]}
                                                speed={50}
                                                wrapper="span"
                                                cursor={false}
                                                style={{ display: "inline-block" }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </>
                        ) : !sending && backendConnection && (
                            <div className="text-center flex items-center justify-center text-lg font-medium text-gray-800 dark:text-white">
                                <SadFace />&nbsp;To continue, please provide a more meaningful goal.
                            </div>
                        )}
                        {!sending && !backendConnection && (
                            <div className="text-center flex items-center justify-center text-lg font-medium text-gray-800 dark:text-white">
                                <SadFace />&nbsp;Our server ran into a problem. Please try again later.
                            </div>
                        )}
                        {!sending && (generatedSkills?.length <= 1 || !backendConnection ) ? (
                            <div className="flex justify-between gap-4">
                                <Button
                                    type="button"
                                    content="Back To Step 1"
                                    handleEvent={() => {
                                        setStep(1);
                                        setGoal("");
                                    }}
                                    className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                                />

                                <Button
                                    type="button"
                                    content="Generate Skill Tree"
                                    disabled={true}
                                    handleEvent={() => handleKnowledgeSelection("Manual")}
                                    className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                                />
                            </div>
                        ) : !sending && (
                            <div className="flex justify-between gap-4">
                                <Button
                                    type="button"
                                    content="Back"
                                    handleEvent={() => setStep(3)}
                                    disabled={submitting}
                                    className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                                />

                                <Button
                                    type="button"
                                    content="Generate Skill Tree"
                                    handleEvent={() => handleKnowledgeSelection(assessMode)}
                                    isSubmitting={submitting}
                                    disabled={submitting}
                                    className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                                />
                            </div>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>
        </form>
    );
};

MultiStepsForm.propTypes = {
    onComplete: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
};

export default MultiStepsForm;
