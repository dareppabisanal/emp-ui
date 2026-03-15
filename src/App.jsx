import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Department from "./screens/department/Department";
import Employee from "./screens/employee/Employee";
import Role from "./screens/role/Role";
import OnBoard from "./screens/onbard/OnBoard";
import PageTitle from "./components/PageTitle";

function App() {
  return (
    <>
      <NavBar />
      <PageTitle />
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/roles" element={<Role />} />
        <Route path="/onboard" element={<OnBoard />} />
      </Routes>
    </>
  )
}

export default App
