import { EditWorkerAvailabilityFormData } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerAvailabilityModalProps {
  // profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (availabilityData: EditWorkerAvailabilityFormData) => Promise<void>;
}

function EditWorkerAvailabilityModal({
  // profile,
  onClose,
  onSave,
}: EditWorkerAvailabilityModalProps) {
  return <div>EditAvailabilityModal</div>;
}

export default EditWorkerAvailabilityModal;
