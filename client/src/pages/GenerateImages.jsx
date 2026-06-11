import React, { useState } from "react";
import { Image, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImages() {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic!");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      const prompt = `
        Generate an image of "${input}".
        in style ${selectedStyle}.
      `;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend response:", data);

      if (data.success) {
        setContent(data.secure_url); // FIXED
      } else {
        toast.error(data.message || "Failed to generate image.");
      }
    } catch (error) {
      toast.error("Network error! Check your backend URL.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50 text-slate-700">
      <nav className="w-full max-w-6xl flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <img
          src={assets.logo}
          alt="logo"
          className="cursor-pointer w-28 sm:w-36 md:w-44"
          onClick={() => navigate("/")}
        />
      </nav>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        <form
          onSubmit={onSubmitHandler}
          className="w-full lg:w-1/2 bg-white rounded-lg border border-gray-200 p-4 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-semibold">AI Image Generator</h1>
          </div>

          <p className="text-sm font-medium mb-2">Describe Your Image</p>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 text-sm rounded-md border outline-none resize-none mb-4"
            placeholder="Type something..."
          />

          <p className="text-sm font-medium mb-2">Style</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {imageStyle.map((item) => (
              <span
                key={item}
                onClick={() => setSelectedStyle(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                  selectedStyle === item
                    ? "bg-green-100 text-green-700 border-green-400"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="relative cursor-pointer flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition"></div>
              <div className="absolute w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              Publish
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !input}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-md transition text-sm"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
        </form>

        <div className="w-full lg:w-1/2 bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-green-600" />
            <h1 className="text-xl font-semibold">Generated Image</h1>
          </div>

          {loading ? (
            <div className="flex-1 flex justify-center items-center text-gray-400">
              Generating...
            </div>
          ) : content ? (
            <div className="mt-3 w-full">
              <img
                src={content}
                alt="Generated"
                className="w-full h-auto rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 gap-3 text-center px-2">
              <Image className="w-16 h-16" />
              <p>Enter a topic and click “Generate Image” to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateImages;
