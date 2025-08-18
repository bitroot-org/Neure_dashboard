import React, { useState } from 'react';

const DeactivateAccountModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    "Company restructuring",
    "No longer required",
    "Business closure",
    "Duplicate account",
    "Cost reduction efforts",
    "Other"
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare payload with the deactivation reason and additional details
    const payload = {
      reason: selectedReason,
      details: details,
    };

    onSubmit(payload);

    // Reset the form fields after submission
    setSelectedReason('');
    setDetails('');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-[#1a1a1a] rounded-xl w-full max-w-md mx-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-semibold m-0">Deactivate Account</h2>
          <button className="bg-none border-none text-white text-2xl cursor-pointer hover:text-white/70 transition-colors" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="reason" className="block text-white text-sm font-medium mb-2">Deactivation Reason</label>
            <select
              id="reason"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 bg-[#2a2a2a] border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none [&>option]:bg-[#2a2a2a] [&>option]:text-white"
            >
              <option value="" disabled>Select a reason</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="details" className="block text-white text-sm font-medium mb-2">Tell us more</label>
            <textarea
              id="details"
              placeholder="Please provide additional details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows="4"
              className="w-full p-3 bg-[#2a2a2a] border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                !selectedReason
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5'
              }`}
              disabled={!selectedReason}
            >
              Send request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;