import './Department.css';
import { useState, useEffect } from "react";
import ModalComponent from '../../components/modal/ModalComponent';
import { ToastContainer, toast } from "react-toastify";
import { useCreateDept } from '../../hooks/useCreateDept.jsx';
import { DataGrid } from "@mui/x-data-grid";
import api from "../../api/api.jsx";
import { Button } from "@mui/material";
import Loader from "../../components/loader/Loader.jsx"

const Department = () => {
  const [show, setShow] = useState(false);
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const [showUpdateConf, setShowUpdateConf] = useState(false);
  const [selDeptId, setSelDeptId] = useState(null);
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
          <Button onClick={() => handleUpdate(params.row)} variant="contained" sx={{ marginRight: "5px" }}>
            Update
          </Button>

          <Button onClick={() => handleDelete(params.row.id)} variant="contained">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleUpdate = (row) => {
    setSelDeptId(row.deptId);
    setDepartment(row.deptName)
    setShowUpdateConf(true);
  };

  const updateDepartment = async () => {
    setShow(false);

    try {
      const form = {
        "deptId": selDeptId,
        "deptName": department
      }
      const response = await crudDept(form, "/api/v1/dept/update");

      if (response.ok) {
        setSelDeptId(null);
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

  const deleteDepartment = async () => {
    setShowDeleteConf(false);
    try {
      const form = {
        "deptId": selDeptId
      }
      const response = await crudDept(form, "/api/v1/dept/delete");

      if (response.ok) {
        setSelDeptId(null);
        fetchDepartments();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err.message);
    }

  }

  const handleDelete = async (deptId) => {
    setSelDeptId(deptId);
    setShowDeleteConf(true);
  };

  const handleSaveBtnClick = async (e) => {
    e.preventDefault();

    if (!department) {
      toast.error("Please enter department name to add!")
      return;
    }

    if( selDeptId ) {
      updateDepartment();
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
      toast.error(err.message);
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
        "deptId": dept._id,
        "deptName": dept.deptName
      })
    })

    setDepartments(depts);
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  const closeDeleteConfirmModal = () => {
    setSelDeptId(null);
    setShowDeleteConf(false);
  }

  const closeUpdateConfirmModal = () => {
    setSelDeptId(null);
    setDepartment("");
    setShowUpdateConf(false);
  }

  return (
    <div className="container w-full">
      <ToastContainer />
      {loading && <Loader />}
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
            show={showDeleteConf}
            modalWidth="50%"
          >
            <div className="modal-header">
              <span className="close" onClick={() => setShowDeleteConf(false)}>&times;</span>
              <h2>Delete Confirmation</h2>
            </div>
            <div className="modal-body">
              <h2>Are you sure you want to delete this department? This action cannot be undone.</h2>
            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded add-button mr-2" onClick={deleteDepartment} disabled={loading}>
                YES
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={closeDeleteConfirmModal}>
                NO
              </button>
            </div>
          </ModalComponent>

          <ModalComponent
            show={showUpdateConf}
            modalWidth="50%"
          >
            <div className="modal-header">
              <span className="close" onClick={closeUpdateConfirmModal}>&times;</span>
              <h2>Update Confirmation</h2>
            </div>
            <div className="modal-body">
              <h2>Are you sure you want to update this department? This action cannot be undone.</h2>
            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded add-button mr-2" onClick={() => { setShowUpdateConf(false); setShow(true); }} disabled={loading}>
                YES
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={closeUpdateConfirmModal}>
                NO
              </button>
            </div>
          </ModalComponent>

          <ModalComponent
            show={show}
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
              <button className="float-right flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded add-button mr-2" onClick={handleSaveBtnClick} disabled={loading}>
                SAVE
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={() => {setDepartment(""); setSelDeptId(null); setShow(false)}}>
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
              border: "1px solid #ccc",
              "& .MuiDataGrid-columnHeader": {
                borderRight: "1px solid #e0e0e0", // vertical lines
              },
              "& .MuiDataGrid-cell:not(:last-child)": {
                borderRight: "1px solid #e0e0e0", // vertical lines for cells
              }
            }}
            showToolbar
            getRowId={(row) => row.deptId}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  )
}

export default Department