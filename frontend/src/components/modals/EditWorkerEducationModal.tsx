import { EditWorkerEducationFormData } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerEducationModalProps {
  // profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (educationData: EditWorkerEducationFormData) => Promise<void>;
}

function EditWorkerEducationModal({
  // profile,
  onClose,
  onSave,
}: EditWorkerEducationModalProps) {
  return <div>EditWorkerEducationModal</div>;
}

export default EditWorkerEducationModal;
