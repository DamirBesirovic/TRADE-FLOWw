import React, { useEffect, useState } from "react";
import { dataService } from "../../services/dataService";
import { adminService } from "../../services/adminService";
import { Grad } from "../../types";
import { toast } from "react-toastify";
import { MapPin, Plus, Edit, Trash2, Save, X } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";

const GradoviManagement: React.FC = () => {
  const [gradovi, setGradovi] = useState<Grad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGradName, setNewGradName] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchGradovi();
  }, []);

  const fetchGradovi = async () => {
    try {
      const data = await dataService.getGradovi();
      setGradovi(data);
    } catch (error) {
      console.error("Error fetching gradovi:", error);
      toast.error("Greška pri učitavanju gradova");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newGradName.trim()) {
      toast.error("Naziv grada je obavezan");
      return;
    }

    setActionLoading("add");
    try {
      await adminService.createGrad(newGradName);
      toast.success("Grad uspešno dodat");
      setNewGradName("");
      setShowAddModal(false);
      fetchGradovi();
    } catch (error) {
      console.error("Error adding grad:", error);
      toast.error("Greška pri dodavanju grada");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (grad: Grad) => {
    setEditingId(grad.id);
    setEditValue(grad.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) {
      toast.error("Naziv grada je obavezan");
      return;
    }

    setActionLoading(id);
    try {
      await adminService.updateGrad(id, editValue);
      toast.success("Grad uspešno ažuriran");
      setEditingId(null);
      setEditValue("");
      fetchGradovi();
    } catch (error) {
      console.error("Error updating grad:", error);
      toast.error("Greška pri ažuriranju grada");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Da li ste sigurni da želite obrisati grad "${name}"?`)) {
      return;
    }

    setActionLoading(id);
    try {
      await adminService.deleteGrad(id);
      toast.success("Grad uspešno obrisan");
      fetchGradovi();
    } catch (error) {
      console.error("Error deleting grad:", error);
      toast.error("Greška pri brisanju grada");
    } finally {
      setActionLoading(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-12" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Upravljanje gradovima
          </h2>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Dodaj grad</span>
        </Button>
      </div>

      {/* Gradovi List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {gradovi.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nema gradova
            </h3>
            <p className="text-gray-600">Dodajte prvi grad u sistem</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Naziv
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradovi.map((grad) => (
                  <tr key={grad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grad.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grad.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {grad.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {editingId === grad.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(grad.id)}
                              loading={actionLoading === grad.id}
                              className="flex items-center space-x-1"
                            >
                              <Save className="h-3 w-3" />
                              <span>Sačuvaj</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="flex items-center space-x-1"
                            >
                              <X className="h-3 w-3" />
                              <span>Otkaži</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(grad)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Uredi</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(grad.id, grad.name)}
                              loading={actionLoading === grad.id}
                              className="flex items-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Obriši</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Dodaj novi grad"
      >
        <div className="space-y-4">
          <Input
            label="Naziv grada"
            value={newGradName}
            onChange={(e) => setNewGradName(e.target.value)}
            placeholder="Unesite naziv grada"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Otkaži
            </Button>
            <Button onClick={handleAdd} loading={actionLoading === "add"}>
              Dodaj grad
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GradoviManagement;
