import './listplans.scss'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Navbar from '../../Components/Navbar/Navbar'
import Plans from '../../Components/plans/Plans'

const ListPlans = () => {
  return (
    <div className='list'>
      <Sidebar></Sidebar>
      <div className="listContainer">
        <Navbar></Navbar>
        <Plans></Plans>
        
      </div>
    </div>
  )
}

export default ListPlans
