import './userplans.scss'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Navbar from '../../Components/Navbar/Navbar'
import Datatable from '../../Components/datatable/Datatable'
import Plans from '../../Components/plans/Plans'
import Myplans from '../../Components/plans/Myplans'

const UserPlans = () => {
  return (
    <div className='list'>
      <Sidebar></Sidebar>
      <div className="listContainer">
        <Navbar></Navbar>
        <Myplans></Myplans>
        
      </div>
    </div>
  )
}

export default UserPlans
