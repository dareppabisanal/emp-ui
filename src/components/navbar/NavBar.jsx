import './NavBar.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const [active, setActive] = useState("Employees");
    const menuItems = ["Employees", "Departments", "Roles", "Onboard"];
    const navigate = useNavigate();

    const navigateToScreen = (item) => {
        setActive(item);
        navigate(`/${item.toLowerCase()}`);
    }

    return (
        <nav className="navbar">
            <button className="logo" onClick={() => navigateToScreen('Employees')} type="button">Employee Management</button>
            <input type="checkbox" id="menu-toggle" />
            <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
            <ul className="nav-links">
                {menuItems.map((item) => (
                    <li key={item}>
                        <a
                            className={active === item ? "active" : ""}
                            onClick={() => navigateToScreen(item)}
                        >
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default NavBar