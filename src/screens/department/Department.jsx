import './Department.css';
import { useState, useEffect } from "react";
import ModalComponent from '../../components/modal/ModalComponent';
import { ToastContainer, toast } from "react-toastify";
import { useCreateDept } from '../../hooks/useCreateDept.jsx';
import { DataGrid } from "@mui/x-data-grid";
import api from "../../api/api.jsx";
import { Button } from "@mui/material";

const Department = () => {
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const { crudDept, loading } = useCreateDept();
  const columns = [
    { field: "srNum", headerName: "Sr. No.", width: 130, headerAlign: "center", headerClassName: "custom-header", align: "center" },
    { field: "deptName", headerName: "Name", flex: 1, headerClassName: "custom-header" },
    {
      field: "action", headerName: "Update/Delete", width: 200, headerClassName: "custom-header", align: "center", headerAlign: "center",
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row.id)} variant="contained" sx={{ marginRight: "5px" }}>
            Edit
          </Button>

          <Button onClick={() => handleDelete(params.row.id)} variant="contained">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (deptId) => {

  };

  const handleDelete = async (deptId) => {
    try {
      const form = {
        "deptId": deptId
      }
      const response = await crudDept(form, "/api/v1/dept/delete");

      if (response.ok) {
        fetchDepartments();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSaveBtnClick = async (e) => {
    e.preventDefault();

    if (!department) {
      toast.error("Please enter department name to add!")
      return;
    }

    try {
      const form = {
        "deptName": department
      }
      const response = await crudDept(form, "/api/v1/dept/add");

      if (response.ok) {
        setShow(false);
        setDepartment("");
        fetchDepartments();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleChange = (e) => {
    setDepartment(e.target.value);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/api/v1/dept/departments");
    const depts = [];
    res.data.data.map((dept, index) => {
      depts.push({
        "srNum": (index + 1),
        "id": dept._id,
        "deptName": dept.deptName
      })
    })

    setDepartments(depts);
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="container w-full">
      <ToastContainer />
      <div className="action-container">
        <div className="box">
          <h2><b>Departments</b></h2>
        </div>
        <div className="box">
          <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(true)}>
            <span className="text-lg font-bold">+</span>
            Add Deparment
          </button>
          <ModalComponent
            show={show}
            onSave={() => alert("Saved")}
            modalWidth="35%"
          >
            <div className="modal-header">
              <span className="close" onClick={() => setShow(false)}>&times;</span>
              <h2>Add New Department</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="username">Name</label>
                <input type="text" id="username" name="username" autoComplete="off" onChange={handleChange} value={department} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button mr-2" onClick={handleSaveBtnClick} disabled={loading}>
                SAVE
              </button>
              <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(false)}>
                CLOSE
              </button>
            </div>
          </ModalComponent>
        </div>
      </div>
      <div className="grid-container">
        <div style={{ height: 400 }}>
          <DataGrid
            rows={departments}
            columns={columns}
            sx={{
              width: "98vw",
              minHeight: "70vh",
            }}
            showToolbar
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  )
}

export default Department