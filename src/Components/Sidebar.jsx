import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Weatherly⛅️</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link 
              to="/" 
              className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">🏠</span>
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
          
          <li className="sidebar-item">
            <Link 
              to="/search" 
              className={`sidebar-link ${location.pathname === '/search' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">🔍</span>
              <span className="sidebar-text">Search</span>
            </Link>
          </li>
          
          <li className="sidebar-item">
            <Link 
              to="/about" 
              className={`sidebar-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">ℹ️</span>
              <span className="sidebar-text">About</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar; 