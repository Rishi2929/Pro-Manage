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
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const RegisterPage = () => {

    const navigate = useNavigate()

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values) => {
        try {
            const { name, email, password } = values;
            const response = await axios.post(
                `${server}/users/new`, { name, email, password }
            );
            navigate('/login')
            toast.success("User Registered Successfully");
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
                    onSubmit={handleSubmit}
                >
                    <Form className={styles["input-cont"]}>
                        <div className={styles["input-fields"]}>
                            <div className={styles["label-cont"]}>

                            </div>
                            <Field type="text" id="name" name="name" placeholder="Name" />
                            <ErrorMessage name="name" component="div" className={styles["error-message"]} />
                        </div>

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

                        <div className={styles["input-fields"]}>
                            <div className={styles["label-cont"]}>

                            </div>
                            <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
                            <ErrorMessage name="confirmPassword" component="div" className={styles["error-message"]} />
                        </div>

                        <button type="submit" className={styles["btn1"]}>
                            Sign up
                        </button>

                        <p>Have an Account?</p>
                        <Link to='/login'>Log In</Link>

                    </Form>
                </Formik>

            </div>
        </div>
    )
}

export default RegisterPage