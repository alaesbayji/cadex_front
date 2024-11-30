import './widget.scss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BackupTableOutlinedIcon from '@mui/icons-material/BackupTableOutlined';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../Api'; // Import the Axios instance

const Widget = ({ type }) => {
  const [data, setData] = useState({ title: '', icon: null, link: '', isMoney: false });
  const [count, setCount] = useState(0); // State for the count (number of users or plans)

  useEffect(() => {
    // Fetch data from db.json depending on the type of widget
    const fetchData = async () => {
      try {
        if (type === "users") {
          const response = await api.get('http://127.0.0.1:8000/cadex/users/');   
                 setCount(response.data.length); // Set the count to the number of users
        } else if (type === "plans") {
          
          const response = await api.get('http://127.0.0.1:8000/cadex/plans/history/'); // Get all plans
          setCount(response.data.length); // Set the count to the number of plans
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    // Setup widget data based on type
    switch (type) {
      case 'users':
        setData({
          title: 'USERS',
          isMoney: false,
          link: 'see all users',
          icon: <PersonOutlineOutlinedIcon className='icon' style={{
            color: 'crimson',
            backgroundColor: 'rgba(255,0,0,0.2)',
          }} />,
        });
        break;
      case 'plans':
        setData({
          title: 'Plans',
          isMoney: false,
          link: 'view all plans',
          icon: <BackupTableOutlinedIcon className='icon' style={{
            color: 'goldenrod',
            backgroundColor: 'rgba(218,165,32,0.2)',
          }} />,
        });
        break;
      default:
        break;
    }
  }, [type]);

  const diff = 20; // Static percentage change (could be dynamic if needed)

  return (
    <div className='widget'>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.isMoney && "$"}{count}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
       
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
