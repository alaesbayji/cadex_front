import Chart from '../../Components/chart/Chart';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Plans from '../../Components/plans/Plans';
import Widget from '../../Components/widget/Widget';
import './home.scss' 
const Homes = () => {
  return (
    <div className='home'>
    <Sidebar />
    <div className='homeContainer'>
      <Navbar></Navbar>
        <div className="widgets">
          <Widget type="users"/>
          <Widget type="plans" />
          
          </div>
          <div className="charts">
          <Chart title="Plans des 6 derniers mois" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <Plans></Plans>
        </div>
          </div>
   </div>
  )
}

export default Homes;
