import React, { useState } from "react";
import { MapPin, Star, Eye, Trash2 } from "lucide-react";
import { Oglas } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import OglasDetails from "./OglasDetails";
import ConfirmDialog from "../UI/ConfirmDialog";

interface OglasCardProps {
  oglas: Oglas;
  onRate?: (oglasId: string, rating: number) => void;
  onDelete?: (oglasId: string) => void;
  showDeleteButton?: boolean;
  deletingId?: string;
}

const OglasCard: React.FC<OglasCardProps> = ({
  oglas,
  onRate,
  onDelete,
  showDeleteButton = false,
  deletingId,
}) => {
  const { isAuthenticated } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStarClick = (rating: number) => {
    if (isAuthenticated && onRate) {
      setUserRating(rating);
      onRate(oglas.id, rating);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(oglas.id);
    }
    setShowDeleteDialog(false);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const isDeleting = deletingId === oglas.id;

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Image */}
        {oglas.imageUrls.length > 0 && (
          <div className="h-48 bg-gray-200 overflow-hidden relative">
            <img
              src={oglas.imageUrls[0]}
              alt={oglas.naslov}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400";
              }}
            />
            {/* Delete button overlay */}
            {showDeleteButton && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                aria-label="Obriši oglas"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
              {oglas.kategorija}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {oglas.grad}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {truncateText(oglas.naslov, 50)}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {truncateText(oglas.opis, 100)}
          </p>

          {/* Material */}
          <div className="text-sm text-gray-500 mb-3">
            <strong>Materijal:</strong> {oglas.materijal}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-lg font-bold text-green-600">
              {oglas.cena.toLocaleString()} RSD
            </div>
            <div className="text-sm text-gray-500">{oglas.prodavac}</div>
          </div>

          {/* Rating and Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            {/* Star Rating */}
            {isAuthenticated && !showDeleteButton && (
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        star <= (hoveredStar || userRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Delete Button for mobile/small screens */}
              {showDeleteButton && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="sm:hidden flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              {/* View Details Button */}
              <Button
                size="sm"
                onClick={() => setShowDetails(true)}
                disabled={isDeleting}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Detaljnije</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={oglas.naslov}
        size="xl"
      >
        <OglasDetails oglas={oglas} onClose={() => setShowDetails(false)} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Potvrdi brisanje"
        message={`Da li ste sigurni da želite da obrišete oglas "${oglas.naslov}"? Ova akcija se ne može poništiti.`}
        confirmText="Obriši oglas"
        cancelText="Otkaži"
        confirmVariant="danger"
        loading={isDeleting}
      />
    </>
  );
};

export default OglasCard;
