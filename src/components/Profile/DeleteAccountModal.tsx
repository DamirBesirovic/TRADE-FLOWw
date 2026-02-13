import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Obriši nalog
        </h3>

        <p className="text-gray-600 mb-6">
          Jeste li sigurni da želite da obrišete svoj nalog? Ova akcija je
          nepovratna i svi vaši podaci će biti trajno obrisani.
        </p>

        <div className="flex space-x-3 justify-center">
          <Button onClick={onClose} variant="secondary" disabled={isDeleting}>
            Otkaži
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Brisanje...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Da, obriši
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
