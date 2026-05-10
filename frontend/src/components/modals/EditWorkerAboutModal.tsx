import { EditWorkerAboutFormData } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerAboutModalProps {
  // profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (aboutData: EditWorkerAboutFormData) => Promise<void>;
}

function EditWorkerAboutModal({
  // profile,
  onClose,
  onSave,
}: EditWorkerAboutModalProps) {
  return <div>EditWorkerAboutModal</div>;
}

export default EditWorkerAboutModal;
