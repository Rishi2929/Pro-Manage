import React, { useEffect, useState } from 'react';
import styles from '../styles/Setting.module.scss';
import { useNavigate } from 'react-router-dom';
import { server } from '../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import CustomLoader from '../common-components/CustomLoader';
import userImg from '../assets/user.png';
import lockImg from '../assets/lock.png';
import eyeImg from '../assets/eye.png';

const Setting = () => {
  const [name, setName] = useState("");
  const [user, setUser] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setName(loggedInUser?.name);
      setUser(loggedInUser);
    }
  }, []);

  const updatePassword = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${server}/users/update-password`, { ...user, oldPassword: oldPassword, newPassword: newPassword });

      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        toast.success("Logged out!");
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPassword = (fieldName) => {
    if (fieldName === "old-password") {
      setShowPassword((prevShowPassword) => ({ ...prevShowPassword, oldPassword: !prevShowPassword.oldPassword }));
    } else if (fieldName === "new-password") {
      setShowPassword((prevShowPassword) => ({ ...prevShowPassword, newPassword: !prevShowPassword.newPassword }));
    }
  };

  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingWrapper}>
        <div className={styles.title}>Settings</div>

        <div className={styles.box}>
          <img src={userImg} alt="User Icon" className={styles.startImg} />
          <input type="text" value={name} placeholder="Name" className={styles.input}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.box}>
          <img src={lockImg} alt="Lock Icon" className={styles.startImg} />
          <input
            type={showPassword.oldPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.input}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <img src={eyeImg} alt="Eye" className={styles.eyeImg} onClick={() => handleShowPassword("old-password")} />
        </div>

        <div className={styles.box}>
          <img src={lockImg} alt="Lock Icon" className={styles.startImg} />
          <input
            type={showPassword.newPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <img src={eyeImg} alt="Eye" className={styles.eyeImg} onClick={() => handleShowPassword("new-password")} />
        </div>

        {isLoading ? <CustomLoader isLoading={isLoading} /> : <button className={styles.updateBtn} disabled={isLoading} onClick={updatePassword}>UPDATE</button>}
      </div>
    </div>
  );
};

export default Setting;