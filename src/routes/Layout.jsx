import { Outlet } from "react-router-dom"
import Sidebar from "../Components/Sidebar"
import "./Layout.css"

function Layout(){
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
