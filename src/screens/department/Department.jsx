import './Department.css';
import { useState } from "react";
import ModalComponent from '../../components/modal/ModalComponent';
import { ToastContainer, toast } from "react-toastify";
import { useCreateDept } from '../../hooks/useCreateDept.jsx';

const Department = () => {
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState("");
  const { create, loading, error } = useCreateDept();

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
      const response = await create(form, "/api/v1/dept/add");

      if( response.ok ) {
        setShow(true);
        setDepartment("");
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
              <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button mr-2" onClick={handleSaveBtnClick}>
                SAVE
              </button>
              <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(false)}>
                CLOSE
              </button>
            </div>
          </ModalComponent>
        </div>
      </div>
    </div>
  )
}

export default Department