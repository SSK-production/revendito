import React, { useState } from "react";
import axios from "axios";

interface ReportFormProps {
  offerId: number;
  offerType: string;
  vendorId: string | null;
  reporterType: string;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  offerId,
  offerType,
  vendorId,
  reporterType,
  onClose,
}) => {
  const [reportReason, setReportReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    

    try {
      const response = await axios.post("/api/report", {
        reporterType : reporterType === "user" ? "USER" : "COMPANY",
        status: "pending",
        vehicleOfferId: offerType === "vehicle" ? offerId : null,
        realEstateOfferId: offerType === "property" ? offerId : null,
        commercialOfferId: offerType === "commercial" ? offerId : null,    
        reason : reportReason,
        reporterUserId: reporterType === "user" ? vendorId : null,
        reporterCompanyId: reporterType === "company" ? vendorId : null,
        
      });

      if (response.status === 200) {
        setSuccessMessage("Votre signalement a été envoyé avec succès.");
        setReportReason("");
      } else {
        throw new Error("Une erreur s'est produite lors de l'envoi du signalement.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Une erreur est survenue.");
      } else {
        setErrorMessage("Une erreur est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Signaler une offre</h2>
        {successMessage && (
          <p className="text-green-600 mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reportReason"
              className="block text-sm font-medium text-gray-700"
            >
              Raison du signalement
            </label>
            <select
              id="reportReason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              required
            >
              <option value="">Sélectionnez une raison</option>
              <option value="spam">Spam</option>
              <option value="false_information">Information incorrecte</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
