import React, { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function ReviewResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a resume!");

    try {
      setLoading(true);
      setReview("");

      const token = await getToken();

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Backend response:", data);

      if (data.success) {
        setReview(data.review); // FIXED
      } else {
        toast.error(data.message || "Failed to analyze resume.");
      }
    } catch (error) {
      toast.error("Network error! Check backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-green-100 text-slate-700 flex flex-col items-center">
      <nav className="w-full max-w-5xl flex items-center justify-between border-b border-green-200 pb-4 mb-6">
        <img
          src={assets.logo}
          alt="logo"
          className="cursor-pointer w-32 sm:w-40 md:w-48"
          onClick={() => navigate("/")}
        />
      </nav>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white/80 rounded-2xl shadow-lg border border-green-200 p-6 flex flex-col items-center"
        >
          <UploadCloud className="w-12 h-12 text-green-600 mb-4" />
          <h1 className="text-2xl font-semibold text-green-700 mb-6">
            Upload Your Resume
          </h1>

          <label className="w-full flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed border-green-300 rounded-xl p-6 hover:bg-green-50 transition">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-green-700 font-medium">
              {file ? file.name : "Select Resume"}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !file}
            className="mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg transition"
          >
            {loading ? "Analyzing..." : "Review Resume"}
          </button>
        </form>

        <div className="flex-1 bg-white/80 rounded-2xl shadow-lg border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-7 h-7 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Feedback</h2>
          </div>

          {loading ? (
            <p className="text-center text-green-600 mt-10">Analyzing...</p>
          ) : review ? (
            <p className="text-lg leading-relaxed whitespace-pre-line">{review}</p>
          ) : (
            <p className="text-center text-green-500 mt-10">
              Upload your resume to receive AI-powered feedback.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewResume;
