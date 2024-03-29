import React, { useContext, useState } from "react";
import styles from '../styles/Auth.module.scss';
import { useFormik } from 'formik'; // Importing useFormik hook
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from "axios";
import { server } from "../main";
import { Link, useNavigate } from "react-router-dom";
import IntroMessage from "../components/IntroMessage";
import useUserLocalStorage from "../hooks/useUserLocalStorage";

import lockImg from '../assets/lock.png';
import mailImg from '../assets/mailLogo.png';
import userImg from '../assets/user.png';
import eyeImg from '../assets/eye.png';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    const [userInStorage, setUserInStorage] = useUserLocalStorage();
    const navigate = useNavigate();
    const [isPasswordShowing, setIsPasswordShowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        email: '',
        password: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const { email, password } = values;
                const response = await axios.post(
                    `${server}/users/login`, { email, password }
                );
                console.log("login response: ", response);
                const { token } = response.data;
                localStorage.setItem('token', JSON.stringify(token));
                if (response?.data?.user) {
                    localStorage.setItem('user', JSON.stringify(response?.data?.user));
                }
                navigate("/home/dashboard");
                toast.success(response?.data?.message);
            } catch (error) {
                toast.error(error?.response?.data?.message);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className={styles.parent_cont}>
            <IntroMessage />
            <div className={styles.right_cont}>
                <h1>Login</h1>

                <form onSubmit={formik.handleSubmit} className={styles["input-cont"]}>

                    <div className={styles["input-fields"]}>
                        <div className={styles.allCont}>
                            <img src={userImg} alt="user img" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.email && <div className={styles["error-message"]}>{formik.errors.email}</div>}
                    </div>

                    <div className={styles["input-fields"]}>
                        <div className={styles.allCont}>
                            <img src={mailImg} alt="mail img" />
                            <input
                                type={isPasswordShowing ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            <img src={eyeImg} onClick={() => setIsPasswordShowing(!isPasswordShowing)} className={styles.eyeImg} alt="eye img" />
                        </div>
                        {formik.errors.password && <div className={styles["error-message"]}>{formik.errors.password}</div>}
                    </div>


                    <button type="submit" className={styles["btn1"]} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Login"}
                    </button>

                    <p>Don't have an account yet?</p>
                    <Link to='/'>Register</Link>

                </form>

            </div>
        </div>
    );
};

export default LoginPage;
