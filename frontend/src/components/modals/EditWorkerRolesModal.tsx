import { EditWorkerRolesFormData } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerRolesModalProps {
  // profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (rolesData: EditWorkerRolesFormData) => Promise<void>;
}

function EditWorkerRolesModal({
  // profile,
  onClose,
  onSave,
}: EditWorkerRolesModalProps) {
  return <div>EditWorkerRolesModal</div>;
}

export default EditWorkerRolesModal;
