import './NavBar.css'
import { useState } from 'react';

const NavBar = () => {
    const [active, setActive] = useState("Employee");
    const menuItems = ["Employee", "Department", "Roles", "Onboard"];

    return (
        <nav className="navbar">
            <div className="logo">Employee Management</div>
            <input type="checkbox" id="menu-toggle" />
            <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
            <ul className="nav-links">
                {menuItems.map((item) => (
                    <li key={item}>
                        <a
                            className={active === item ? "active" : ""}
                            onClick={() => setActive(item)}
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