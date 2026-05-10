import { EditWorkerContactFormData } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerContactModalProps {
  // profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (contactData: EditWorkerContactFormData) => Promise<void>;
}

function EditWorkerContactModal({
  // profile,
  onClose,
  onSave,
}: EditWorkerContactModalProps) {
  return <div>EditWorkerContactModal</div>;
}

export default EditWorkerContactModal;
