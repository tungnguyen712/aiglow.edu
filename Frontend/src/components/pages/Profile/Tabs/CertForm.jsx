import PropTypes from "prop-types";
import { useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Input, Button } from "@/components/commons";
// import { javaSkillsData } from "@/mock/data";
// import Tooltip from "@/components/commons/Tooltip";
// import { TypeAnimation } from "react-type-animation";

const CertForm = ({ onComplete, submitting }) => {
    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [issuer, setIssuer] = useState("");
    const [nameError, setNameError] = useState("");

    const [issueDate, setIssueDate] = useState("");
    const [credentialID, setCredentialID] = useState("");
    const [credentialURL, setCredentialURL] = useState("");
    const [category, setCategory] = useState("");
    const [detailErrors, setDetailErrors] = useState({});
    const [certificateFile, setCertificateFile] = useState([]);
    const [certificateFileError, setCertificateFileError] = useState("");

    const fileInputRef = useRef();
    const handleUpload = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCertificateFile(null);
        }
    }

    const validateStep1 = () => {
        if (!name.trim()) {
            setNameError("Please enter your Certificate Name.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const errors = {};

        if (!issuer.trim()) {
            errors.issuer = "Please enter the Issuer Name.";
        }
        if (!issueDate) errors.issueDate = "Please select an Issue Date.";

        // if (!credentialURL.trim()) {
        //     try {
        //         new URL(credentialURL);
        //     } catch {
        //         errors.credentialURL = "Please enter a valid URL.";
        //     }
        // }
        if (!category) {
            errors.category = "Please select a category.";
        }

        setDetailErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = () => {
        if (certificateFile?.length === 0) {
            setCertificateFileError("Please upload at least one certificate file.");
            return false;
        }
        setCertificateFileError("");
        return true;
    }

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

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        if (validateStep3()) {
            onComplete({
                name: name.trim(),
                issuer: issuer.trim(),
                issueDate,
                credentialID: credentialID.trim(),
                credentialURL: credentialURL.trim(),
                category,
                certificateFile
            });
        }
    }

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
        <form 
            onSubmit={
                step === 1 ? nextStep :
                step === 2 ? handleSubmit :
                step === 3 ? handleFinalSubmit :
                (e) => e.preventDefault()
            }   
            className="space-y-6 relative"
        >

            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : step === 3 ? "100%" : "100%" }}
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
                        <label htmlFor="cert-name" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Certificate Name*
                        </label>
                        <Input
                            name="cert-name"
                            type="text"
                            id="cert-name"
                            placeholder="e.g., Certified Java Developer"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameError("");
                            }}
                            error={nameError}
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
                        <div className="mb-2">
                            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Issuer Name*
                            </label>
                            <Input
                                name="issuer"
                                type="text"
                                id="issuer"
                                placeholder="e.g., Coursera, Udemy"
                                value={issuer}
                                onChange={(e) => {
                                    setIssuer(e.target.value);
                                    // setDetailErrors((prev) => ({...prev, issuer: ""}));
                                }}
                                error={detailErrors.issuer}
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="issue-date" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Issue Date*
                            </label>
                            <Input
                                name="issue-date"
                                type="date"
                                id="issue-date"
                                value={issueDate}
                                onChange={(e) => {
                                    setIssueDate(e.target.value);
                                    // setDetailErrors((prev) => ({ ...prev, issueDate: "" }));
                                }}
                                error={detailErrors.issueDate}
                                className="mt-1 block w-full"
                            />
                        </div>
                            
                        
                        <div className="mb-2">
                            <label htmlFor="issue-date" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Category*
                            </label>
                            <select
                                name="category"
                                id="category"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    // setDetailErrors((prev) => ({ ...prev, category: "" }));
                                }}
                                // error={detailErrors.category}
                                className="mt-2 mb-2 py-3 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring-0 base:text-base dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Category</option>
                                <option value="technical">Technical</option>
                                <option value="non-technical">Non-Technical</option>
                            </select>
                        </div>
                        

                        
                        <div className="mb-2">
                            <label htmlFor="credentialID" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Credential ID
                            </label>
                            <Input
                                name="credentialID"
                                type="text"
                                id="credentialID"
                                placeholder="e.g., XJHSKD2JK34H"
                                value={credentialID}
                                onChange={(e) => {
                                    setCredentialID(e.target.value);
                                    // setDetailErrors((prev) => ({ ...prev, credentialID: "" }));
                                }}
                                // error={detailErrors.credentialID}
                                className="mt-1 block w-full"
                            />
                        </div>
                        
                        
                        <div className="mb-2">
                            <label htmlFor="credentialURL" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Credential URL
                            </label>
                            <Input
                                name="credentialURL"
                                type="url"
                                id="credentialURL"
                                placeholder="e.g., https://www.credly.com/badges/12345678"
                                value={credentialURL}
                                onChange={(e) => {
                                    setCredentialURL(e.target.value);
                                    // setDetailErrors((prev) => ({ ...prev, credentialURL: "" }));
                                }}
                                error={detailErrors.credentialURL}
                                className="mt-1 block w-full"
                            />
                        </div>
                        

                        <div className="flex justify-between gap-4">
                            <Button
                                type="button"
                                content="Back"
                                handleEvent={prevStep}
                                className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                            />
                            <Button
                                type="submit"
                                content="Next"
                                isSubmitting={submitting}
                                disabled={submitting}
                                className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
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
                        <label className="block text-base font-medium text-gray-700 dark:text-white">
                            Upload your certificates
                        </label>
                        <div className="flex justify-center">
                            <Button
                                content="Upload certificate"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" x2="12" y1="3" y2="15"></line>
                                    </svg>
                                }
                                iconPosition="left"
                                handleEvent={handleUpload}
                                className="mb-5 content-center text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-base px-6 py-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                            />
                        </div>
                        {/* <span className="block mt-2.5 text-[12px] text-gray-600">Pick certificates up to 1MB.</span> */}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            name="avatar"
                            multiple
                            hidden 
                            onChange={handleFileChange}
                        />
                        {certificateFileError && (
                            <span className="text-red-500 text-sm">{certificateFileError}</span>
                        )}

                        {certificateFile && certificateFile.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {certificateFile.map((file, idx) => {
                                    const extension = file.name.split('.').pop().toLowerCase();
                                    const fileType =
                                    extension === "pdf"
                                        ? "PDF"
                                        : ["doc", "docx"].includes(extension)
                                        ? "Document"
                                        : "File";

                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center space-x-4 bg-white border rounded-xl shadow-sm px-4 py-2 w-fit max-w-full"
                                        >
                                            <div className="text-pink-500 bg-pink-100 p-2 rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <span className="text-sm font-medium text-gray-800 truncate">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500">{fileType}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCertificateFile(null)
                                                }
                                                className="ml-auto text-black hover:text-red-600"
                                                >  
                                            </button>
                                        </div>
                                    );  
                                })}
                            </div>
                        )}

                        <div className="flex justify-between gap-4">
                            <Button
                                type="button"
                                content="Back"
                                handleEvent={() => setStep(2)}
                                disabled={submitting}
                                className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-gray-900 text-gray-300 rounded-lg shadow-md hover:bg-black"
                            />
                            <Button
                                type="submit"
                                content="Submit"
                                handleEvent={handleFinalSubmit}
                                isSubmitting={submitting}
                                disabled={submitting}
                                // isSubmitting={submitting}
                                // disabled={submitting || !validateStep3()}
                                className="transition delay-50 duration-200 ease-in-out w-full py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                            />
                        </div>
                        
                    </motion.div>
                )}
                
            </AnimatePresence>
        </form>
    );
}

CertForm.propTypes = {
    onComplete: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
};

export default CertForm;
