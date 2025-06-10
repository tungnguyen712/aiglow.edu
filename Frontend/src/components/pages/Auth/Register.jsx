import {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import config from "@/config";
import { Button , Input, Image, Modal } from "@/components/commons";
import { Cuder } from "@/assets/images";
import { EyeIcon, EyeOffIcon } from "@/assets/icons";
import { regexEmail } from "@/utils/regex";
// import { mainApi } from "@/services/api";
// import { URLS } from "@/services/url";
import { Flip, toast } from "react-toastify";
import { FSoft } from "@/assets/images";

const Register = () => {
    const navigate = useNavigate();
    const agreeCheckbox = useRef();

    const [formData, setFormData] = useState({
        // firstName: "",
        // lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState({
        // firstName: "",
        // lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [checkboxError, setCheckboxError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        // if (!formData.firstName) {
        //     newErrors.firstName = "Please enter your first name.";
        //     valid = false;
        // }
        //
        // if (!formData.lastName) {
        //     newErrors.lastName = "Please enter your last name.";
        //     valid = false;
        // }

        if (!formData.email) {
            newErrors.email = "Please enter your email.";
            valid = false;
        } else if (!regexEmail.test(formData.email)) {
            newErrors.email = "Invalid email format. Please try again.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Please enter your password.";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must contain at least 6 characters.";
            valid = false;
        } else if (formData.password.length > 50) {
            newErrors.password = "Password must not exceed 50 characters.";
            valid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
            valid = false;
        } else if (formData.confirmPassword != formData.password) {
            newErrors.confirmPassword = "Password and confirm password do not match.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleAgree = () => {
        if (!agreeCheckbox.current.checked) {
            agreeCheckbox.current.checked = true;
        }
        setCheckboxError("");
        setShowModal(false);
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        const isCheckboxChecked = agreeCheckbox.current.checked;
        const isFormValid = validateForm();

        if (!isCheckboxChecked) {
            setCheckboxError("You must agree to the terms and conditions.");
        } else {
            setCheckboxError("");
        }

        if (isFormValid && isCheckboxChecked) {
            setSubmitting(true)
            try {
                // await mainApi.put(URLS.AUTH.REGISTER, formData, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     withCredentials: true,
                // });
                toast.success("Register successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                    closeButton: false,
                    onClose: () => navigate(config.routes.LOGIN),
                });
            } catch (error) {
                console.error(error);
                toast.error("An error has occurred! Please try again later.", {
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
                setSubmitting(false);
            }
        }
    };


    return (
        <div className="flex items-center justify-center text-center h-screen px-3">
            <div className="container">
                <div
                    className="flex flex-col sm:grid sm:grid-cols-2 gap-x-3 max-w-4xl mx-auto bg-white dark:bg-slate-800 p-3 rounded-2xl">
                    <section className="flex-1 hidden sm:block">
                        <Image src={Cuder} alt="" className="w-full h-full object-cover rounded-l-xl" />
                    </section>

                    <section className="flex-1 p-5">
                        <Image src={FSoft} alt="FPT Software" className="w-36 mx-auto object-contain" />
                        <p className="block antialiased text-sm leading-relaxed mb-10 text-gray-600 text-[18px] dark:text-white">
                            Enter your email and password to create a new account.
                        </p>


                        <form onSubmit={handleRegister} className="mx-auto text-left">
                            {/*<div className="grid grid-cols-2 gap-5 mb-1">*/}
                            {/*    <div>*/}
                            {/*        <Input*/}
                            {/*            type="text"*/}
                            {/*            name="firstName"*/}
                            {/*            placeholder="..."*/}
                            {/*            value={formData.firstName}*/}
                            {/*            onChange={handleChange}*/}
                            {/*            error={formErrors.firstName}*/}
                            {/*            labelText="First Name"*/}
                            {/*            showLabel={true}*/}
                            {/*            className="w-full h-full bg-transparent font-light focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"*/}
                            {/*        />*/}
                            {/*    </div>*/}

                            {/*    <div>*/}
                            {/*        <Input*/}
                            {/*            type="text"*/}
                            {/*            name="lastName"*/}
                            {/*            placeholder="..."*/}
                            {/*            value={formData.lastName}*/}
                            {/*            onChange={handleChange}*/}
                            {/*            error={formErrors.lastName}*/}
                            {/*            labelText="Last Name"*/}
                            {/*            showLabel={true}*/}
                            {/*            className="w-full h-full bg-transparent font-light focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div className="mb-1">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={formErrors.email}
                                    labelText="Email"
                                    showLabel={true}
                                    className="w-full h-full bg-transparent font-light focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                                />
                            </div>

                            <div className="mb-1">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={formErrors.password}
                                    icon={showPassword ? <EyeOffIcon/> : <EyeIcon/>}
                                    iconClick={() => setShowPassword(!showPassword)}
                                    labelText="Password"
                                    showLabel={true}
                                    className="w-full h-full bg-transparent font-light focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                                />
                            </div>

                            <div className="mb-1">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="********"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={formErrors.confirmPassword}
                                    icon={showPassword ? <EyeOffIcon/> : <EyeIcon/>}
                                    iconClick={() => setShowPassword(!showPassword)}
                                    labelText="Confirm Password"
                                    showLabel={true}
                                    className="w-full h-full bg-transparent font-light focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                                />
                            </div>

                            <div className="mt-3 mb-5">
                                <div className="inline-flex items-center">
                                    <label className="flex items-center cursor-pointer relative">
                                        <input ref={agreeCheckbox}
                                               type="checkbox"
                                               className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 dark:border-gray-500 checked:bg-slate-800 checked:dark:bg-gray-600 checked:border-slate-800 checked:dark:border-slate-600"
                                               id="check"
                                               onChange={() => setCheckboxError("")}
                                        />

                                        <span
                                            className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5"
                                                 viewBox="0 0 20 20" fill="currentColor"
                                                 stroke="currentColor" strokeWidth="1">
                                                <path fillRule="evenodd"
                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                      clipRule="evenodd">
                                                </path>
                                            </svg>
                                        </span>
                                    </label>

                                    <div
                                        className="ms-2 text-sm text-gray-900 dark:text-gray-300 select-none cursor-pointer">
                                        <label htmlFor="check" className="cursor-pointer">I agree with the</label> <span
                                        className="text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={() => setShowModal(true)}>terms and conditions</span>.
                                    </div>
                                </div>
                                {checkboxError && (
                                    <p className="text-red-500 text-sm mt-1">{checkboxError ? checkboxError : ""}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <Button
                                    type="submit"
                                    content="Create Account"
                                    disabled={submitting}
                                    isSubmitting={submitting}
                                    className="align-middle select-none text-[15px] text-center transition-all py-2.5 rounded-lg bg-gray-900 text-white dark:bg-blue-600 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3"
                                />
                            </div>
                        </form>

                        <p className="text-sm text-gray-900 dark:text-gray-300">Already have an account? <Link
                            to={config.routes.LOGIN} className="text-blue-600 dark:text-blue-500 hover:underline">Sign
                            in</Link></p>
                    </section>

                    <Modal
                        isShow={showModal}
                        title="Terms and Conditions"
                        onClose={() => setShowModal(!showModal)}
                        buttonRightContent="Agree"
                        handleEvent={handleAgree}
                    >
                        <div className="p-4 space-y-4 text-gray-700 dark:text-white text-start">
                            <p className="text-sm">
                                Welcome to our service. By accessing or using this platform, you agree to comply with the terms outlined below.
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
                            <p className="text-sm">
                                By using our service, you confirm your acceptance of these terms. If you do not agree, please refrain from using the platform.
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">2. User Responsibilities</h2>
                            <p className="text-sm">
                                You are responsible for keeping your account information secure and for any activities conducted under your account.
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">3. Prohibited Activities</h2>
                            <ul className="list-disc list-inside text-sm">
                                <li>Using the service for any unlawful purposes.</li>
                                <li>Distributing spam, malware, or harmful content.</li>
                                <li>Violating intellectual property rights.</li>
                            </ul>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">4. Intellectual Property</h2>
                            <p className="text-sm">
                                All content on this platform is protected by intellectual property laws. Unauthorized use is prohibited.
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">5. Limitation of Liability</h2>
                            <p className="text-sm">
                                We are not liable for any damages resulting from your use of the platform. The service is provided &#34;as is.&#34;
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">6. Contact Us</h2>
                            <p className="text-sm">
                                If you have questions about these terms, please contact us at{' '}
                                <a href="#" className="text-blue-500 underline">
                                    DXTBidMasters.work@mail.com
                                </a>.
                            </p>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Register;
