import './featured.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../Api'; // Import the Axios instance

const Featured = () => {
  const [totalPlans, setTotalPlans] = useState(0);
  const [plansToday, setPlansToday] = useState(0);
  const [target, setTarget] = useState(100); // Objectif à 100 plans
  const [lastDay, setLastDay] = useState(0);
  const [lastWeek, setLastWeek] = useState(0);
  const [lastMonth, setLastMonth] = useState(0);

  useEffect(() => {
    // Fonction pour calculer le nombre de plans générés aujourd'hui, cette semaine et ce mois-ci
    const fetchPlansData = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/cadex/plans/history/'); // Changer l'URL si nécessaire
        const plans = response.data;

        // Nombre total de plans
        setTotalPlans(plans.length);

        // Plans générés aujourd'hui
        const today = new Date().toDateString();
        setPlansToday(plans.filter(plan => new Date(plan.dateCreation).toDateString() === today).length);

        const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0); // Début de la journée d'hier
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0); // Début de la journée d'aujourd'hui

setLastDay(plans.filter(plan => {
  const planDate = new Date(plan.dateCreation);
  return planDate >= yesterday && planDate < todayStart;
}).length);


        // Plans générés la semaine dernière
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        setLastWeek(plans.filter(plan => new Date(plan.dateCreation) >= lastWeekDate).length);

        // Plans générés le mois dernier
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        setLastMonth(plans.filter(plan => new Date(plan.dateCreation) >= lastMonthDate).length);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des plans:', error);
      }
    };

    fetchPlansData();
  }, []);

  return (
    <div className='featured'>
      <div className="top">
        <h1 className='title'>Total Plans</h1>
        <MoreVertIcon fontSize='small'></MoreVertIcon>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            styles={{ strokeColor: '#b69d3f' }}
            value={parseInt((plansToday / target) * 100, 10)}
            text={`${parseInt((plansToday / target) * 100, 10)}%`}
            
            strokeWidth={5}
          />
        </div>
        <p className="title">Total Plans Generated Today</p>
        <p className="amount">{plansToday}</p>
        <div className="summary">
        <div className="item">
            <div className="itemTitle">Last Day</div>
            <div >
              <div className="resultAmount">{lastDay}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div >
              <div className="resultAmount">{lastWeek}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div >
              <div className="resultAmount">{lastMonth}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
