import React, { useState } from "react";
import { Image, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

function RemoveBackground() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setResult(URL.createObjectURL(file));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 text-slate-700 flex flex-col items-center">
      <nav className="w-full max-w-5xl flex items-center justify-between border-b border-cyan-200 pb-4 mb-6">
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
          className="flex-1 bg-white/80 rounded-2xl shadow-lg border border-cyan-200 p-6 flex flex-col items-center"
        >
          <UploadCloud className="w-12 h-12 text-cyan-600 mb-4" />
          <h1 className="text-2xl font-semibold text-cyan-700 mb-6">
            Upload Image
          </h1>

          <label className="w-full flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed border-cyan-300 rounded-xl p-6 hover:bg-cyan-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-cyan-700 font-medium">
              {file ? file.name : "Choose Image"}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !file}
            className="mt-6 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg transition"
          >
            {loading ? "Processing..." : "Remove Background"}
          </button>
        </form>

        <div className="flex-1 bg-white/80 rounded-2xl shadow-lg border border-cyan-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-7 h-7 text-cyan-600" />
            <h2 className="text-xl font-semibold text-cyan-700">Result</h2>
          </div>

          {loading ? (
            <p className="text-center text-cyan-600 mt-10">
              Removing background...
            </p>
          ) : result ? (
            <img
              src={result}
              alt="Processed"
              className="w-full h-auto rounded-xl mt-4 object-contain"
            />
          ) : (
            <p className="text-center text-cyan-500 mt-10">
              Upload an image to remove the background.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RemoveBackground;
