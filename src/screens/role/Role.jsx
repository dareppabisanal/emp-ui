import { useState, useEffect } from "react";
import api from "../../api/api.jsx";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader.jsx";
import { useCreateRole } from "../../hooks/useCreateRole.jsx";
import { Autocomplete, TextField, Button } from "@mui/material";
import ModalComponent from '../../components/modal/ModalComponent';
import { DataGrid } from "@mui/x-data-grid";
import { TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/outline";

const Role = () => {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const { crudRole, loading } = useCreateRole();
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState(null);
  const [selRoleId, setSelRoleId] = useState(null);
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const [showUpdateConf, setShowUpdateConf] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const columns = [
    { field: "srNum", headerName: "Sr. No.", width: 130, headerAlign: "center", headerClassName: "custom-header", align: "center" },
    { field: "deptName", headerName: "Department", flex: 1, headerClassName: "custom-header" },
    { field: "roleName", headerName: "Role", flex: 1, headerClassName: "custom-header" },
    {
      field: "action", headerName: "Update/Delete", width: 250, headerClassName: "custom-header", align: "center", headerAlign: "center",
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleUpdate(params.row)} variant="contained" sx={{ marginRight: "5px" }}>
            <PencilIcon className="h-5 w-5 mr-2" />
            Update
          </Button>

          <Button onClick={() => handleDelete(params.row.roleId)} variant="contained" color="error">
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchDepartments = async () => {
    const res = await api.get("/api/v1/dept/departments");
    const depts = [];
    res.data.data.map((dept, index) => {
      depts.push({
        "deptId": dept._id,
        "deptName": dept.deptName
      })
    })

    setDepartments(depts);
  }

  const fetchRoles = async () => {
    const res = await api.get("/api/v1/role/roles");
    const roles = [];
    res.data.data.map((role, index) => {
      roles.push({
        "srNum": (index + 1),
        "roleId": role._id,
        "deptId": role.departmentId ? role.departmentId._id : 0,
        "deptName": role.departmentId ? role.departmentId.deptName : "",
        "roleName": role.roleName
      })
    })

    setRoles(roles);
  }

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSaveBtnClick = async (e) => {
    e.preventDefault();

    if (!department) {
      toast.error("Please select department!")
      return;
    }

    if (!role) {
      toast.error("Please enter role name to add!")
      return;
    }

    if (selRoleId) {
      updateRole();
      return;
    }

    try {
      const form = {
        "roleName": role,
        "deptId": department.deptId
      }
      const response = await crudRole(form, "/api/v1/role/add");

      if (response.ok) {
        setShow(false);
        setRole("");
        setDepartment(null);
        setInputValue("");
        fetchRoles();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleDelete = async (roleId) => {
    setSelRoleId(roleId);
    setShowDeleteConf(true);
  };

  const deleteRole = async () => {
    setShowDeleteConf(false);
    try {

      const form = {
        "roleId": selRoleId
      }
      const response = await crudRole(form, "/api/v1/role/delete");

      if (response.ok) {
        setSelRoleId(null);
        fetchRoles();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  const closeDeleteConfirmModal = () => {
    setSelRoleId(null);
    setShowDeleteConf(false);
  }

  const closeUpdateConfirmModal = () => {
    setSelRoleId(null);
    setRole("");
    setShowUpdateConf(false);
  }

  const handleUpdate = (row) => {
    console.log("Role", row);
    setSelRoleId(row.roleId);
    setRole(row.roleName);
    setDepartment({
      "deptId": row.deptId,
      "deptName": row.deptName
    })
    setShowUpdateConf(true);
  };

  const updateRole = async () => {
    setShow(false);

    try {
      const form = {
        "deptId": department.deptId,
        "roleName": role,
        "roleId": selRoleId
      }
      console.log("Payload: ", form);
      const response = await crudRole(form, "/api/v1/role/update");

      if (response.ok) {
        setSelRoleId(null);
        setDepartment(null);
        setRole("");
        fetchRoles();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container w-full">
      <ToastContainer />
      {loading && <Loader />}
      <div className="action-container">
        <div className="box">
          <h2><b>Roles</b></h2>
        </div>
        <div className="box">
          <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(true)}>
            <span className="text-lg font-bold">+</span>
            Add Role
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
              <h2>Are you sure you want to delete this role? This action cannot be undone.</h2>
            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded add-button mr-2" onClick={deleteRole} disabled={loading}>
                <CheckIcon className="h-5 w-5 mr-1" />
                YES
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={closeDeleteConfirmModal}>
                <XMarkIcon className="h-5 w-5 mr-1" />
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
                <CheckIcon className="h-5 w-5 mr-1" />
                YES
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={closeUpdateConfirmModal}>
                <XMarkIcon className="h-5 w-5 mr-1" />
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
              <h2>Add New Role</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="username">Department</label>
                <Autocomplete
                  className="autocomplete-input"
                  freeSolo
                  options={departments}
                  getOptionLabel={(option) => option.deptName || ""}
                  value={department}
                  inputValue={inputValue}
                  onChange={(event, newValue) => setDepartment(newValue)}
                  onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="" className="w-full" />
                  )}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Role</label>
                <input type="text" id="username" name="username" className="text-input" autoComplete="off" onChange={handleChange} value={role} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded add-button mr-2" onClick={handleSaveBtnClick} disabled={loading}>
                SAVE
              </button>
              <button className="float-right flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded add-button" onClick={() => { setRole(""); setSelRoleId(null); setShow(false); setDepartment(null); setDeptName(""); }}>
                CLOSE
              </button>
            </div>
          </ModalComponent>
        </div>
      </div>
      <div className="grid-container">
        <div style={{ height: 400 }}>
          <DataGrid
            rows={roles}
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
            getRowId={(row) => row.roleId}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  )
}

export default Role