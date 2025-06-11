import { Image } from "@/components/commons";
// import { ComingSoon } from "@/components/commons";
import { someProfiles } from "@/mock/data";
// import {useEffect, useState} from "react";
import {useEffect, useState} from "react";
// import { mainApi } from "@/services/api";
// import { URLS } from "@/services/url";
// import { getAccessToken } from "@/utils/auth";

const PersonalInformation = () => {
    // const [info, setInfo] = useState({});

    // const token = getAccessToken();

    const [selectedUserId, setSelectedUserId] = useState("u001");
    const userProfile = someProfiles.find(profile => profile.id === selectedUserId);

    const loadInfo = async () => {
        try {
            // const infoResponse =  await mainApi.post(URLS.AUTH.PROFILE, {token: token})
            // setInfo(infoResponse.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadInfo();
        setSelectedUserId("u001");
    }, [])

    return (
        <div className="bg-white dark:bg-slate-800 mt-5 p-4 lg:p-8 rounded-3xl lg:rounded-[35px]">
            <div className="flex items-center gap-5 pb-5 border-gray-200 dark:border-gray-600">
                <div
                    className="flex items-center justify-center size-32 border-4 border-gray dark:border-white border-opacity-20 dark:border-opacity-20 rounded-full text-gray-300 object-cover overflow-hidden">
                    <Image src="" alt="" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-black dark:text-white">DXTBidMasters</h2>
                    <span className="block mt-2.5 text-[12px] text-gray-600 dark:text-gray-400">Sale Team</span>
                    <span className="block mt-2.5 text-[12px] text-gray-600 dark:text-gray-400">2nd Floor - PVB</span>
                </div>
            </div>

            <div className="px-3">
                <div className="mb-10">
                    <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center">
                        Personal Information
                        <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">First Name</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">{userProfile.firstName}</span>
                        </div>

                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">{userProfile.lastName}</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">FHN.DXT</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">Email</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">{userProfile.email}</span>
                        </div>

                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">Date of Birth</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">N/A</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium text-gray-6x 00 dark:text-white flex items-center">
                        Certificates
                        <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        {userProfile?.certs.map((cert, idx) => (
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
                    </div>
                </div>

                {/* <div className="mb-10 relative">
                    <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center">
                        Personal Information
                        <span className="ml-2 flex-grow h-[1px] bg-gray-200"></span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">First Name</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">DXTBidMasters</span>
                        </div>

                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">Last Name</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">FHN.DXT</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">Email</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">DXTBidMasters@mail.com</span>
                        </div>

                        <div>
                            <span className="block text-sm text-gray-600 dark:text-gray-400">Date of Birth</span>
                            <span
                                className="block mt-2.5 font-medium text-black dark:text-white">N/A</span>
                        </div>

                        {/* <ComingSoon/> */}
                    {/* </div>
                </div> */}
            </div>

        </div>
    )
}

export default PersonalInformation;