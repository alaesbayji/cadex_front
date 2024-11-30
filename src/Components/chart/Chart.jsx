import { useEffect, useState } from "react";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from '../../Api'; // Import the Axios instance

const Chart = ({ aspect, title }) => {
  const [chartData, setChartData] = useState([]);
  const [timePeriod, setTimePeriod] = useState("month"); // "month", "week", or "day"

  // Fonction pour préparer les données en fonction de la période sélectionnée
  const processData = (plans, period) => {
    const formatter = {
      month: (date) => new Date(date).toLocaleString('default', { month: 'long' }),
      week: (date) => `Week ${Math.ceil(new Date(date).getDate() / 7)}`,
      day: (date) => new Date(date).toLocaleDateString(),
    };

    const groupedData = plans.reduce((acc, plan) => {
      const key = formatter[period](plan.dateCreation);
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += 1; // Increment total for the period
      return acc;
    }, {});

    return Object.entries(groupedData).map(([name, Total]) => ({ name, Total }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/cadex/plans/history/`);
        const plans = response.data;

        // Préparer les données en fonction de la période par défaut (mois)
        setChartData(processData(plans, timePeriod));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [timePeriod]); // Recharger les données lorsqu'on change de période

  return (
    <div className="chart">
      <div className="header">
        <div className="title">{title}</div>
        <div className="select">
          <label htmlFor="timePeriod">Afficher par :</label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="month">Mois</option>
            <option value="week">Semaine</option>
            <option value="day">Jour</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer height="300px" width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b69d3f" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#b69d3f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#b69d3f"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
