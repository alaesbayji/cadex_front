import Chart from '../../Components/chart/Chart';
import Featured from '../../Components/featured/Featured';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Plans from '../../Components/plans/Plans';
import Widget from '../../Components/widget/Widget';
import './generate.scss' 
import Stepper from '../../Components/Stepper/Stepper';
const Generate = () => {
  return (
    <div className='home'>
    <Sidebar />
    <div className='homeContainer'>
      <Navbar></Navbar>
        
        <div className="listContainer">
          <Stepper></Stepper>
        </div>
          </div>
   </div>
  )
}

export default Generate;
