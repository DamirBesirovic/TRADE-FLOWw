import React, { useEffect, useState } from "react";
import { dataService } from "../../services/dataService";
import { adminService } from "../../services/adminService";
import { Kategorija } from "../../types";
import { toast } from "react-toastify";
import { Tag, Plus, Edit, Trash2, Save, X } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";

const KategorijeManagement: React.FC = () => {
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKategorijeName, setNewKategorijeName] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchKategorije();
  }, []);

  const fetchKategorije = async () => {
    try {
      const data = await dataService.getKategorije();
      setKategorije(data);
    } catch (error) {
      console.error("Error fetching kategorije:", error);
      toast.error("Greška pri učitavanju kategorija");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newKategorijeName.trim()) {
      toast.error("Naziv kategorije je obavezan");
      return;
    }

    setActionLoading("add");
    try {
      await adminService.createKategorija(newKategorijeName);
      toast.success("Kategorija uspešno dodana");
      setNewKategorijeName("");
      setShowAddModal(false);
      fetchKategorije();
    } catch (error) {
      console.error("Error adding kategorija:", error);
      toast.error("Greška pri dodavanju kategorije");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (kategorija: Kategorija) => {
    setEditingId(kategorija.id);
    setEditValue(kategorija.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) {
      toast.error("Naziv kategorije je obavezan");
      return;
    }

    setActionLoading(id);
    try {
      await adminService.updateKategorija(id, editValue);
      toast.success("Kategorija uspešno ažurirana");
      setEditingId(null);
      setEditValue("");
      fetchKategorije();
    } catch (error) {
      console.error("Error updating kategorija:", error);
      toast.error("Greška pri ažuriranju kategorije");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`Da li ste sigurni da želite obrisati kategoriju "${name}"?`)
    ) {
      return;
    }

    setActionLoading(id);
    try {
      await adminService.deleteKategorija(id);
      toast.success("Kategorija uspešno obrisana");
      fetchKategorije();
    } catch (error) {
      console.error("Error deleting kategorija:", error);
      toast.error("Greška pri brisanju kategorije");
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
          <Tag className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Upravljanje kategorijama
          </h2>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Dodaj kategoriju</span>
        </Button>
      </div>

      {/* Kategorije List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {kategorije.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nema kategorija
            </h3>
            <p className="text-gray-600">Dodajte prvu kategoriju u sistem</p>
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
                {kategorije.map((kategorija) => (
                  <tr key={kategorija.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kategorija.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === kategorija.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {kategorija.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {editingId === kategorija.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(kategorija.id)}
                              loading={actionLoading === kategorija.id}
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
                              onClick={() => handleEdit(kategorija)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Uredi</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleDelete(kategorija.id, kategorija.name)
                              }
                              loading={actionLoading === kategorija.id}
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
        title="Dodaj novu kategoriju"
      >
        <div className="space-y-4">
          <Input
            label="Naziv kategorije"
            value={newKategorijeName}
            onChange={(e) => setNewKategorijeName(e.target.value)}
            placeholder="Unesite naziv kategorije"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Otkaži
            </Button>
            <Button onClick={handleAdd} loading={actionLoading === "add"}>
              Dodaj kategoriju
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KategorijeManagement;
