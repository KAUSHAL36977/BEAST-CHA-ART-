import { FiHome, FiCheckSquare, FiBarChart2, FiList } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <NavLink to="/dashboard" className="nav-link"><FiHome /> Home</NavLink>
    <NavLink to="/checkin" className="nav-link"><FiCheckSquare /> Daily Check-In</NavLink>
    <NavLink to="/progress" className="nav-link"><FiBarChart2 /> Progress</NavLink>
    <NavLink to="/history" className="nav-link"><FiList /> Task History</NavLink>
  </aside>
);

export default Sidebar; 