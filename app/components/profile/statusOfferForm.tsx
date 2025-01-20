import React from "react";

interface ConfirmationPromptProps {
    selectedOffer : number | null;
    offerType : string;
    active : boolean | null;
    onConfirm: () => void;
    onCancel: () => void;
}

const StatusOfferForm: React.FC<ConfirmationPromptProps> = ({ active, onConfirm, onCancel }) => {
    
    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {active ? (
                <h3 className="text-xl font-semibold text-gray-800">Do you want to desactivate this offer ?</h3>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800">Do you want to activate this offer ?</h3>
            )}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 ${
                        active ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                    }`}
                >
                    {active ? 'desactivate' : 'activate'}
                </button>
            </div>
        </form>
    );
};

export default StatusOfferForm;
