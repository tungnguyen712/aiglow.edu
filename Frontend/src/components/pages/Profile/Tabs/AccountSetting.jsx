import { useRef, useState } from "react";

import { Button, Input, Image, ComingSoon } from "@/components/commons";
import { ImageIcon } from "@/assets/icons";
import { Modal } from "@/components/commons";
import CertForm from "./CertForm";
import { useCertificateContext } from "@/context/CertificateContext";
import { certificate } from "@/mock/data";
import edx from "@/assets/images/edx.svg";
import coursera from "@/assets/images/coursera.svg";
import udemy from "@/assets/images/udemy.svg";
import { useNavigate } from "react-router-dom";
import linkedin from "@/assets/images/linkedin.svg";
import { getAccessToken } from "@/utils/auth";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
import { toast } from "react-toastify";
import { setAccessToken } from "@/utils/auth";

function AccountSetting() {
    const navigate = useNavigate();
    const inputRef = useRef();
    const [avatarFile, setAvatarFile] = useState(null);

    // const [selectedUserId, setSelectedUserId] = useState("u123");
    // const userProfile = someProfiles.find(profile => profile.id === selectedUserId);
    const userProfile = JSON.parse(getAccessToken());

    const development = false;

    const handleUpload = () => {
        inputRef.current.click();
    }

    const handleAvatarChange = () => {
        const file = inputRef.current.files[0];
        if (file) {
            setAvatarFile(URL.createObjectURL(file));
        }
    }

    const handleSetNewCookie = async () => {
        try {
            const loginRequest = await mainApi.get(URLS.CHAT.PERSONAL_INFORMATION("u123"));

            if (loginRequest.status === 200) {
                const token = loginRequest.data;
                setAccessToken(token);
            }
        } catch (error) {
            console.error(error);
            toast.error("Somethings went wrong.");
        }
    };

    const handleNewCert = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                name: data.name?.trim(),
                issuer: data.issuer?.trim(),
                issueDate: data.issueDate,
                credentialId: data.credentialID,
                category: data.category,
                url: "https://google.com",
                fileUrl: "https://google.com",
            };

            setFormState({ data: payload });
            console.log("New Cert Payload: ", payload);

            const certResponse = await mainApi.post(URLS.CHAT.SEND_NEW_CERT, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (certResponse.data) {
                console.log("Response data:", certResponse.data);
                await handleSetNewCookie();
                window.location.reload();
            } else {
                console.error("Received empty or invalid response data.");
                toast.error("Somethings went wrong.");
            }
            
        } catch (e) {
            console.error("Error preparing data:", e);
        } finally {
            setIsSubmitting(false);
            setShowModal(false);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setFormState } = useCertificateContext();
    const [connectedCerts, setConnectedCerts] = useState([]);

    const handleConnect = (platform) => {
        const filtered = certificate.filter(c => c.issuer === platform);
        const newCerts = filtered.filter(c => !connectedCerts.some(existing => existing.credentialID === c.credentialID));
        setConnectedCerts(prev => [...prev, ...newCerts]);
    };

    // useEffect(()=> {
    //     setSelectedUserId("u123")
    // },[])

    return (
        <div
            className="bg-white dark:bg-slate-800 mt-10 p-4 lg:p-8 rounded-3xl lg:rounded-[35px] overflow-hidden relative">
            <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center">
                    Avatar
                    <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                </h2>

                <div className="flex items-center gap-5 py-5 mb-3">
                    <div
                        className="flex items-center justify-center size-32 border-2 border-dashed border-gray-300 rounded-full text-gray-300 object-cover overflow-hidden">
                        {avatarFile ? <Image src={avatarFile} alt=""/> : <ImageIcon/>}
                    </div>

                    <div>
                        <Button
                            content="Upload photo"
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
                            className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                        />
                        <span className="block mt-2.5 text-[12px] text-gray-600">Pick a photo up to 1MB.</span>
                    </div>
                    <Input ref={inputRef} type="file" name="avatar" hidden onChange={handleAvatarChange}/>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center mb-5">
                    Personal Information
                    <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                </h2>

                <div className="lg:grid grid-cols-2 items-center justify-between gap-5 mb-8">
                    <div>
                        <Input
                            type="text"
                            name="first_name"
                            placeholder=""
                            value={userProfile.firstName}
                            onChange={() => {
                            }}
                            labelText="First Name"
                            showLabel={true}
                            className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                            error={""}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            name="last_name"
                            placeholder=""
                            value={userProfile.lastName}
                            onChange={() => {
                            }}
                            labelText="Last Name"
                            showLabel={true}
                            className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                            error={""}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-500 dark:text-white flex items-center">
                    Password
                    <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                </h2>
                <p className="text-sm text-gray-400 mb-5">Modify your current password.</p>

                <div className="lg:grid grid-cols-2 items-center justify-between gap-5 mb-3">
                    <div>
                        <Input
                            type="text"
                            name="current_password"
                            placeholder="********"
                            value={"********"}
                            onChange={() => {
                            }}
                            labelText="Current Password"
                            showLabel={true}
                            className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                            error={""}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            name="new_password"
                            placeholder="********"
                            value={"********"}
                            onChange={() => {
                            }}
                            labelText="New Password"
                            showLabel={true}
                            className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                            error={""}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center">
                    Certificates
                    <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                </h2>
                <Button
                    content="Add Certificate"
                    className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-3 py-2 mt-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                    handleEvent={() => setShowModal(true)}
                />
                <Modal isShow={showModal} title="Add Certificate" onClose={() => {
                    setShowModal(false);
                        }
                    }>
                    <CertForm
                        key={showModal ? "open" : "close"}
                        onComplete={(data) => {
                            console.log("New Cert Data: ", data);
                            setFormState(data);                            
                            handleNewCert(data);
                            navigate(`/profile`);
                        }}
                        submitting={isSubmitting}
                    />
                </Modal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {userProfile?.certs?.map((cert, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-5 flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-semibold text-gray-900 dark:text-gray-300">{cert.name}</span>
                                <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{cert.category}</span>
                            </div>
                            
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Issuer: </span> {cert.issuer}
                            </div>
                    
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Issue Date:</span> {cert.issueDate}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Credential ID:</span> {cert.credentialId}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center">
                    Connect LMS
                    <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    Link your learning platform accounts to import your learning background.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                    { name: "Coursera", color: "bg-[#2a73cc]", icon: coursera },
                    { name: "Udemy", color: "bg-purple-500", icon: udemy },
                    { name: "edX", color: "bg-[#c02f91]", icon: edx },
                    { name: "LinkedIn Learning", color: "bg-sky-500", icon: linkedin }
                    ].map((platform) => (
                    <button
                        key={platform.name}
                        onClick={() => handleConnect(platform.name)}
                        className={`${platform.color} text-white flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:opacity-90 transition`}
                    >
                        <img src={platform.icon} alt={platform.name} className="w-12 h-12" />
                        <span className="text-sm font-medium">Connect {platform.name}</span>
                    </button>
                    ))}
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 mt-8">
                    {certificate.map((cert, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-5 flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-semibold text-gray-900 dark:text-gray-300">{cert.name}</span>
                                <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{cert.category}</span>
                            </div>
                            
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Issuer: </span> {cert.issuer}
                            </div>
                    
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Issue Date:</span> {cert.issueDate}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Credential ID:</span> {cert.credentialID}
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button content="Cancel"
                        className="text-red-500 border border-red-600 font-medium rounded-lg text-sm px-5 py-3 text-center"/>
                <Button content="Save Change"
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700"/>
            </div>

            {development && (
                <ComingSoon/>
            )}
        </div>
    )
}

export default AccountSetting;