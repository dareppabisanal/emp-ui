import './Employee.css';
import { useState } from "react";
import ModalComponent from '../../components/modal/ModalComponent';

const Employee = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="container w-full">
      <div className="action-container">
        <div className="box">
          <h2><b>Employees</b></h2>
        </div>
        <div className="box">
          <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(true)}>
            <span className="text-lg font-bold">+</span>
            Add Employee
          </button>
          <ModalComponent
            show={show}
            onSave={() => alert("Saved")}
            modalWidth="80%"
          >
            <div className="modal-header">
              <span className="close" onClick={() => setShow(false)}>&times;</span>
              <h2>Add New Employee</h2>
            </div>
            <div className="modal-body">

            </div>
            <div className="modal-footer">
              <button className="float-right flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-button" onClick={() => setShow(true)}>
                SAVE
              </button>
            </div>
          </ModalComponent>
        </div>
      </div>
    </div>
  )
}

export default Employee