import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
  });

  const handleSubmit = () => {
    console.log("Lead:", form);
    alert("Submitted!");
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg">Request Info</h2>

      <input
        placeholder="Name"
        className="border p-2 w-full mt-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="border p-2 w-full mt-2"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        placeholder="Budget"
        className="border p-2 w-full mt-2"
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
      >
        Submit
      </button>
    </div>
  );
}