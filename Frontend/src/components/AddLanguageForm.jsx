// ======================================================================================================
// File: src/components/AddLanguageForm.jsx
// A simple form component.
// ======================================================================================================
import React from "react";

const AddLanguageForm = ({ onClose }) => {
  return (
    <form className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Language Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="icon"
          className="block text-sm font-medium text-gray-300"
        >
          Icon (e.g., ⚛️)
        </label>
        <input
          type="text"
          id="icon"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddLanguageForm;
