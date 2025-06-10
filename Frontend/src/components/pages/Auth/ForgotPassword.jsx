import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import config from "@/config";
import { Button , Input, Image } from "@/components/commons";
import { Flip, toast } from "react-toastify";
import { regexEmail } from "@/utils/regex";
import { ComingSoon } from "@/components/commons";
import { FSoft } from "@/assets/images";

function ForgotPassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
    });

    const development = true;

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Please enter your email.";
            valid = false;
        } else if (!regexEmail.test(formData.email)) {
            newErrors.email = "Invalid email format. Please try again.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitting(true);
            setTimeout(() => {
                setSubmitting(false)
                setFormData({ email: "" });
                toast.success("Check your email for password reset instructions!", {
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
            },2000)
        }
    };

    return (
        <section className="flex items-center justify-center text-center h-screen px-3">
            <div className="max-w-[30rem] w-full bg-white dark:bg-slate-800 p-8 rounded-3xl">
                <Image src={FSoft} alt="FPT Software" className="w-36 object-contain" />

                <div className="flex items-center justify-between mb-5">
                    <h5 className="block antialiased tracking-normal text-md font-semibold leading-snug text-blue-gray-900 dark:text-white mb-2">Forgot Password</h5>

                    <Link to={config.routes.LOGIN} className="block antialiased text-sm leading-normal dark:text-white font-medium hover:underline">
                        Back to Login
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto text-left relative">
                    <div className="mb-6">
                        <Input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={formErrors.email}
                            labelText="Email"
                            showLabel={true}
                            className="w-full h-full bg-transparent font-light outline outline-0 focus:outline-0 transition-all placeholder-shown:border border focus:placeholder:opacity-100 mb-3 px-3 py-3 rounded-md focus:border-gray-900 dark:focus:border-gray-200 placeholder:opacity-100 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                        />
                        {!formErrors.email &&
                            <p className="text-sm font-light text-black dark:text-white">Do not forgot to check SPAM
                                box.</p>}
                    </div>

                    <Button
                        type="submit"
                        content="Send Password Reset Email"
                        disabled={submitting}
                        isSubmitting={submitting}
                        className="align-middle select-none text-center transition-all text-[15px] py-2.5 rounded-lg bg-gray-900 text-white dark:bg-blue-600 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3"
                    />

                    {development && <ComingSoon />}
                </form>
            </div>
        </section>
    )
}

export default ForgotPassword;