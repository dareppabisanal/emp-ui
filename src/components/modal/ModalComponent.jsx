import './ModalComponent.css'

function ModalComponent({ show, children, modalWidth }) {
  return (
    <div className="modal" id="modal" style={{display: show ? 'block' : 'none'}}>
      <div className="modal-content" style={{width: modalWidth}}>
        {children}
      </div>
    </div>
  );
}

export default ModalComponent;