
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';

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
