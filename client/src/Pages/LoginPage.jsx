import React, { useContext, useState } from "react";
import styles from '../styles/Auth.module.scss'
import Image1 from '../assets/Pro.png'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from "axios";
import { server } from "../main";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),

});

const LoginPage = () => {

    const navigate = useNavigate()
    const initialValues = {
        email: '',
        password: '',
    };

    const handleLogin = async (values) => {
        try {
            const { email, password } = values;
            const response = await axios.post(
                `${server}/users/login`, { email, password }
            );
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate("/dashboard");
            toast.success("Logged In successfully")
        } catch (error) {
            toast.error(error.response.data.message);
        }

    };

    return (
        <div className={styles.parent_cont}>
            <div className={styles.left_cont}>
                <div className={styles.circle}>
                    <img src={Image1} alt="" />
                </div>
                <div className={styles.para_div}>
                    <h1>Welcome aboard my friend</h1>
                    <p>just a couple of clicks and we start</p>

                </div>
            </div>
            <div className={styles.right_cont}>
                <h1>Register</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    <Form className={styles["input-cont"]}>


                        <div className={styles["input-fields"]}>
                            <div className={styles["label-cont"]}>

                            </div>
                            <Field type="email" id="email" name="email" placeholder="Email" />
                            <ErrorMessage name="email" component="div" className={styles["error-message"]} />
                        </div>

                        <div className={styles["input-fields"]}>
                            <div className={styles["label-cont"]}>

                            </div>
                            <Field type="password" id="password" name="password" placeholder="Password" />
                            <ErrorMessage name="password" component="div" className={styles["error-message"]} />
                        </div>


                        <button type="submit" className={styles["btn1"]}>
                            Sign up
                        </button>

                        <p>Have no Account yet ?</p>
                        <Link to='/'>Registration</Link>

                    </Form>
                </Formik>

            </div>
        </div>
    )
}

export default LoginPage