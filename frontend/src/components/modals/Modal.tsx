import { useEffect } from "react";
import { X } from "lucide-react";

import "../../styles/modals/Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

function Modal({ isOpen, onClose, children, showCloseButton }: ModalProps) {
  // Prevent scroll if modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (!isOpen) return;

  return (
    <>
      <div className="modal__overlay" onClick={onClose}></div>

      <dialog open={isOpen}>
        <div className="modal__container">
          <header className="modal__header">
            {showCloseButton && (
              <button className="modal__close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            )}
          </header>

          <div className="modal__content">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
