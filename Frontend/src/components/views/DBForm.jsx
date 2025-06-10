import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { dbms, dbType } from "@/mock/data";
import { regexNumber } from "@/utils/regex";
import { Input, Select, Button } from "@/components/commons";
import { useFormDBContext } from "@/context/DBFromContext";
import { EyeIcon, EyeOffIcon } from "@/assets/icons";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
import { headers } from "@/utils/auth";
import { Flip, toast } from "react-toastify";
import config from "@/config";

const DBForm = ({ formType = "dk", setShowModal = () => {} }) => {
    const navigate = useNavigate();
    const {roomId} = useParams();
    const { formData, setFormData, formErrors, setFormErrors } = useFormDBContext();
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData({ ...formData, [name]: selectedOption.value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.type) {
            newErrors.type = "Please choose database type.";
            valid = false;
        }

        if (!formData.dbms) {
            newErrors.dbms = "Please choose DBMS.";
            valid = false;
        }

        if (!formData.username) {
            newErrors.username = "Please enter your username.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Please enter your password.";
            valid = false;
        }

        if (!formData.databaseName) {
            newErrors.databaseName = "Please enter your database name.";
            valid = false;
        }

        if (!formData.host) {
            newErrors.host = "Please enter your host.";
            valid = false;
        }

        if (!formData.port) {
            newErrors.port = "Please enter your port.";
            valid = false;
        } else if (!regexNumber.test(formData.port)) {
            newErrors.port = "Port must be a number.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitting(true)
            try {
                const dataToSubmit = {
                    type: formData.type,
                    dbms: formData.dbms,
                    username: formData.username,
                    password: formData.password,
                    databaseName: formData.databaseName,
                    host: formData.host,
                    port: formData.port,
                    status: "conected",
                    chatHistoryDtos: [
                        {
                            sender: "AI",
                            content: "How can can i help you",
                            time: "2023-10-10T10:00:00"
                        }
                    ]
                };

                const createRequest = await mainApi.post(URLS.CHAT.CREATE_ROOM, dataToSubmit, { headers, withCredentials: true, });
                setShowModal(false);
                navigate(`/chat/${createRequest.data.roomId}`);
            } catch (e) {
                console.log(e.error);
                toast.error("An error has occurred. Please check your information or try again later.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                    closeButton: false,
                });
            } finally {
                setSubmitting(false)
            }
        }
    }

    const handleReConnect = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const showRoomRequest = await mainApi.get(URLS.CHAT.SHOW_ROOM(roomId), { headers, withCredentials: true, });

                if (showRoomRequest.status === 200) {
                    await connectDB()
                }

            } catch (e) {
                console.log(e.error);
            }
        }
    }

    const reCallShowRoom = async () => {
        try {
            const showResponse = await mainApi.get(URLS.CHAT.SHOW_ROOM(roomId), {
                headers,
                withCredentials: true,
            });
            if (JSON.stringify(showResponse.data)) {
                setFormData({
                    type: showResponse.data.type,
                    dbms: showResponse.data.dbms,
                    username: showResponse.data.user,
                    password: showResponse.data.password,
                    databaseName: showResponse.data.database,
                    host: showResponse.data.host,
                    port: showResponse.data.port,
                    status: showResponse.data.status,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const connectDB = async () => {
        try {
            const data = {
                "room_id": Number(roomId),
                "password": Number(formData.password),
            }
            await mainApi.post(URLS.CHAT.CONNECT, data, { headers, withCredentials: true, });
            await reCallShowRoom();
        } catch (e) {
            console.log(e);
        }
    }

    const handleDisconnect = async  () => {
        console.log("Disconnecting...")
        await mainApi.post(URLS.CHAT.SAVE_AND_CLOSE, { roomId: Number(roomId) }, {
            headers,
            withCredentials: true,
        });

        navigate(config.routes.HOME)

        setFormData({
            type: "",
            dbms: "",
            username: "",
            password: "",
            databaseName: "",
            host: "",
            port: "",
            status: "disconnected",
        });
    }

    return (
        <div className="overflow-y-scroll max-h-fit scrollbar pr-2.5">
            <div className="mb-2">
                <Select
                    value={dbms.find((type) => type.name === formData.dbms) || null}
                    labelText="DBMS"
                    options={dbms.map((type) => ({label: type.label, value: type.name}))}
                    onChange={(option) => handleSelectChange(option, "dbms")}
                    error={formErrors.dbms}
                />
            </div>

            <div className="mb-2">
                <Select
                    value={dbType.find((type) => type.name === formData.type) || null}
                    labelText="DB Type"
                    options={dbType.map((type) => ({label: type.label, value: type.name}))}
                    onChange={(option) => handleSelectChange(option, "type")}
                    error={formErrors.type}
                />
            </div>

            <div className="mb-2">
                <Input
                    type="text"
                    id={`username-${formType}`}
                    name="username"
                    placeholder="..."
                    value={formData.username}
                    onChange={handleChange}
                    labelText="Username"
                    showLabel={true}
                    className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-500 duration-300"
                    error={formErrors.username}
                />
            </div>

            <div className="mb-2">
                <Input
                    type={showPassword ? "text" : "password"}
                    id={`password-${formType}`}
                    name="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={handleChange}
                    icon={showPassword ? <EyeOffIcon/> : <EyeIcon/>}
                    iconClick={() => setShowPassword(!showPassword)}
                    labelText="Password"
                    showLabel={true}
                    className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-500 duration-300"
                    error={formErrors.password}
                />
            </div>

            <div className="mb-2">
                <Input
                    type="text"
                    id={`databaseName-${formType}`}
                    name="databaseName"
                    placeholder="..."
                    value={formData.databaseName}
                    onChange={handleChange}
                    labelText="DB Name"
                    showLabel={true}
                    className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-500 duration-300"
                    error={formErrors.databaseName}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="mb-2">
                    <Input
                        type="text"
                        id={`host-${formType}`}
                        name="host"
                        placeholder="..."
                        value={formData.host}
                        onChange={handleChange}
                        labelText="Host"
                        showLabel={true}
                        className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-500 duration-300"
                        error={formErrors.host}
                    />
                </div>

                <div className="mb-3">
                    <Input
                        type="number"
                        id={`port-${formType}`}
                        name="port"
                        placeholder="..."
                        value={formData.port}
                        onChange={handleChange}
                        labelText="Port"
                        showLabel={true}
                        className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:p-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-500 duration-300"
                        error={formErrors.port}
                    />
                </div>
            </div>

            {formData.status === "connected" ? (
                <Button
                    content="Disconnect"
                    isSubmitting={submitting}
                    disabled={submitting}
                    handleEvent={handleDisconnect}
                    className="align-middle select-none text-[15px] text-center transition-all py-2.5 rounded-lg bg-red-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3 mb-5"
                />
            ) : formData.status === "disconnected" ? (
                <Button
                    type="submit"
                    content="Re-Connect"
                    isSubmitting={submitting}
                    disabled={submitting}
                    handleEvent={handleReConnect}
                    className="align-middle select-none text-[15px] text-center transition-all py-2.5 rounded-lg bg-gray-900 text-white dark:bg-blue-600 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3 mb-5"
                />
            ) : (
                <Button
                    type="submit"
                    content="Connect"
                    isSubmitting={submitting}
                    disabled={submitting}
                    handleEvent={handleSubmit}
                    className="align-middle select-none text-[15px] text-center transition-all py-2.5 rounded-lg bg-gray-900 text-white dark:bg-blue-600 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3 mb-5"
                />
            )}
        </div>
    )
}

DBForm.propTypes = {
    formType: PropTypes.string,
    connected: PropTypes.bool,
    setConnected: PropTypes.func,
    setShowModal: PropTypes.func,
}

export default DBForm;