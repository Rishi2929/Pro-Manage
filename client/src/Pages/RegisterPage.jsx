import React, { useContext, useState } from "react";
import styles from '../styles/Auth.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from "axios";
import { server } from "../main";
import { Link, useNavigate } from "react-router-dom";
import IntroMessage from "../components/IntroMessage";

import lockImg from '../assets/lock.png';
import mailImg from '../assets/mailLogo.png';
import userImg from '../assets/user.png';
import eyeImg from '../assets/eye.png';
import CustomLoader from "../common-components/CustomLoader";

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShowing, setIsPasswordShowing] = useState({
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const { name, email, password } = values;
        const response = await axios.post(
          `${server}/users/new`, { name, email, password }
        );
        console.log("registerPage response: ", response);
        navigate('/login');
        toast.success("You are Registered Successfully");
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      }
      finally {
        setIsLoading(false);
      }
    },
  });

  const passwordShowOrNot = (fieldName) => {
    if (fieldName === "password") {
      setIsPasswordShowing((prevShowPassword) => ({ ...prevShowPassword, password: !prevShowPassword.password }));
    } else if (fieldName === "confirmPassword") {
      setIsPasswordShowing((prevShowPassword) => ({ ...prevShowPassword, confirmPassword: !prevShowPassword.confirmPassword }));
    }
  };

  return (
    <div className={styles.parent_cont}>
      <IntroMessage />
      <div className={styles.right_cont}>
        <h1>Register</h1>

        <form onSubmit={formik.handleSubmit} className={styles["input-cont"]}>
          <div className={styles["input-fields"]}>
            <div className={styles.allCont}>
              <img src={userImg} alt="user img" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.name && <div className={styles["error-message"]}>{formik.errors.name}</div>}
          </div>

          <div className={styles["input-fields"]}>
            <div className={styles.allCont}>
              <img src={mailImg} alt="mail img" />
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
              <img src={lockImg} alt="lock img" />
              <input
                type={isPasswordShowing.password ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <img src={eyeImg} onClick={() => passwordShowOrNot("password")} className={styles.eyeImg} alt="eye img" />
            </div>

            {formik.errors.password && <div className={styles["error-message"]}>{formik.errors.password}</div>}
          </div>

          <div className={styles["input-fields"]}>
            <div className={styles.allCont}>
              <img src={lockImg} alt="lock img" />
              <input
                type={isPasswordShowing.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
              <img src={eyeImg} onClick={() => passwordShowOrNot("confirmPassword")} className={styles.eyeImg} alt="eye img" />
            </div>

            {formik.errors.confirmPassword && <div className={styles["error-message"]}>{formik.errors.confirmPassword}</div>}
          </div>
          <div className={styles.bottomContainer}>

            <button type="submit" className={styles["btn1"]} disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </button>


            <p>Have an Account?</p>
            <Link to='/login'>Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
