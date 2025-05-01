import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from '../api/apiConfig';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(API.CONTACT.CREATE, formData);
      setSuccessMsg("Message submitted successfully!");

      // Reset the form
      setFormData({ name: "", email: "", phone_number: "", message: "" });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit message.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-5 mt-10 bg-gray-200" >
      <h1 className="text-3xl font-semibold text-center mb-6">Contact Us</h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-gray-100 shadow-md p-5 rounded-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Your Phone Number with country code"
          value={formData.phone_number}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="bg-gray-50 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded transition duration-300"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
