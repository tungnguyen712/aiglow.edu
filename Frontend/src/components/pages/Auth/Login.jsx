import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import config from "@/config";
import { Button , Input, Image } from "@/components/commons";
import { Cuder } from "@/assets/images";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "@/assets/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { regexEmail } from "@/utils/regex";
import { setAccessToken } from "@/utils/auth";
// import { mainApi } from "@/services/api";
// import { URLS } from "@/services/url";
import { FSoft } from "@/assets/images";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
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

        setFormErrors(newErrors);
        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitting(true)
            setAccessToken("accessToken");
            navigate(config.routes.HOME);
            // try {
            //     const loginRequest = await mainApi.post(URLS.AUTH.LOGIN, formData);

            //     if (loginRequest.status === 200) {
            //         const token = loginRequest.data.accessToken;
            //         setAccessToken(token);
            //         navigate(config.routes.HOME);
            //     }
            // } catch (error) {
            //     console.error(error);
            //     setFormErrors({
            //         email: "Email or password incorrect.",
            //         password: "Email or password incorrect.",
            //     });
            // } finally {
            //     setSubmitting(false);
            // }
        }
    };

    // Google OAuth2 Login
    const handleLoginOAuth2 = useGoogleLogin({
        onSuccess: codeResponse => {
            console.log(codeResponse);
            navigate(config.routes.HOME);
        },
        flow: 'auth-code',
    });

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
                        <p className="block antialiased text-sm leading-relaxed mb-10 text-gray-600 text-[18px] dark:text-white">Enter
                            email and password to login your account.</p>

                        <form onSubmit={handleLogin} className="mx-auto text-left">
                            <div className="mb-4">
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
                            <div className="mb-4">
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

                            <div className="mb-4 flex justify-end">
                                <Link to={config.routes.FORGOT_PASSWORD}
                                      className="block antialiased text-sm leading-normal dark:text-white font-medium hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="mb-6">
                                <Button
                                    type="submit"
                                    content="Sign In"
                                    disabled={submitting}
                                    isSubmitting={submitting}
                                    className="align-middle select-none text-[15px] text-center transition-all py-2.5 rounded-lg bg-gray-900 text-white dark:bg-blue-600 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 block w-full gap-3"
                                />
                            </div>

                            <div className="flex items-center">
                                <hr className="border-solid border-gray-300 dark:border-gray-500 grow"/>
                                <p className="mx-4 text-sm text-grey-600 text-black dark:text-white">OR</p>
                                <hr className="border-solid border-gray-300 dark:border-gray-500 grow"/>
                            </div>

                            <Button
                                icon={<GoogleIcon/>}
                                iconPosition="left"
                                handleEvent={handleLoginOAuth2}
                                content="Sign in with Google"
                                className="align-middle select-none text-center transition-all text-[15px] p-2.5 rounded-lg border border-gray-900 text-gray-900 dark:text-white dark:border-gray-500 hover:opacity-75 w-full mt-6 flex h-12 items-center justify-center gap-2"
                            />

                            <p className="mt-5 text-sm text-gray-900 dark:text-gray-300 text-center">Don&#39;t have an account yet? <Link
                                to={config.routes.REGISTER} className="text-blue-600 dark:text-blue-500 hover:underline">Sign up now.</Link></p>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Login;
