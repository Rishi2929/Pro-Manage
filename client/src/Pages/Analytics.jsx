import React, { useEffect, useState } from 'react';
import { server } from '../main';
import axios from 'axios';
import styles from '../styles/Analytic.module.scss'; 
import CustomLoader from '../common-components/CustomLoader';


const AnalyticRow = ({ title, value }) => {
  return (
    <div className={styles.rowLineWrapper}>
      <div className={styles.circle}>
        <div className={styles.smallCircle}></div>
        <div className={styles.circleText}>{title}</div>
      </div>
      <span>{value}</span>
    </div>
  );
};

const Analytics = () => {
  const [analytic, setAnalytic] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${server}/todo/get-analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      let data;
      if (response?.data?.data)
        data = getAnalyticsData(response?.data?.data);

      setAnalytic(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalyticsData = (todos) => {
    try {
      const obj = { backlog: 0, todo: 0, progress: 0, completed: 0, low: 0, moderate: 0, high: 0, dueDate: 0 };

      todos.forEach(todo => {
        switch (todo?.status) {
          case "BACKLOG":
            obj.backlog++;
            break;
          case "TODO":
            obj.todo++;
            break;
          case "PROGRESS":
            obj.progress++;
            break;
          case "DONE":
            obj.completed++;
            break;
          default:
            break;
        }

        switch (todo?.priority) {
          case 'low':
            obj.low++;
            break;
          case 'moderate':
            obj.moderate++;
            break;
          case 'high':
            obj.high++;
            break;
          default:
            break;
        }

        if (todo?.dueDate) {
          obj.dueDate++;
        }
      });

      Object.keys(obj)?.forEach(key => {
        if (obj[key] < 10) {
          obj[key] = `0${obj[key]}`;
        } else {
          obj[key] = `${obj[key]}`;
        }
      });

      return obj;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.analyticsContainer}>
      {isLoading ? <CustomLoader isLoading={isLoading} /> :
        <div className={styles.right}>
          <div className={styles.title}>Analytics</div>
          <div className={styles.dataWrapper}>
            <div className={styles.box}>
              <div className={styles.box2}>
                <AnalyticRow title="Backlog Tasks" value={analytic?.backlog} />
                <AnalyticRow title="To-do Tasks" value={analytic?.todo} />
                <AnalyticRow title="In-Progress Tasks" value={analytic?.progress} />
                <AnalyticRow title="Completed Tasks" value={analytic?.completed} />
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.box2}>
                <AnalyticRow title="Low Priority" value={analytic?.low} />
                <AnalyticRow title="Moderate Priority" value={analytic?.moderate} />
                <AnalyticRow title="High Priority" value={analytic?.high} />
                <AnalyticRow title="Due Date Tasks" value={analytic?.dueDate} />
              </div>
            </div>

          </div>
        </div>
      }
    </div>
  );
};

export default Analytics;