import { Link, Outlet } from 'react-router-dom'

const HomePage = () => {
    return (
        <div >HomePage

            <div className='navbarContainer'>
                <li><Link to="/dashboard">Dashboard</Link> </li>
                <li><Link to="/home/tankstackQuery">Tanstak Query</Link> </li>
                <li><Link to="/home/withoutTanstack">Regular Fetch</Link></li>
                <li><Link to="/home/installation">Installation command</Link></li>
                <li><Link to="/home/createCustomer">Create Customer</Link></li>
                <li><Link to="/home/listCustomer">listCustomer</Link></li>
                <li><Link to="/home/tanstackTable">List Customer in Table</Link></li>
                <li><Link to="/home/chakraUi1">Chakra UI1</Link></li>
                <li><Link to="/home/chakraUi2Datatable">Chakra Ui2 Datatable</Link></li>
            </div>
            <div><Outlet></Outlet></div>
        </div>
    )
}

export default HomePage