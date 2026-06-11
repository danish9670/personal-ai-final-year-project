import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

// --------------------------------------------
// FIX: use the correct environment variable
// --------------------------------------------
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const navigate = useNavigate();

  // Article length options
  const articleLength = [
    { length: 800, text: "Short (Around 800 words)" },
    { length: 1500, text: "Medium (Around 1500 words)" },
    { length: 2500, text: "Long (Around 2500 words)" },
    { length: 4000, text: "Very Long (Around 4000 words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
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
      Write a detailed, well-structured and engaging article about "${input}". 
      The article should be around ${selectedLength.length} words.
      Include proper headings, subheadings, examples and explanations.
      Make sure the content is original and plagiarism-free.
      `;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to generate article.");
      }
    } catch (error) {
      toast.error("Network error! Check your backend URL.");
    }

    setLoading(false);
  };

  return (  
    <div className="h-full p-6 flex justify-center items-start flex-wrap gap-4 text-slate-700">
      {/* Navbar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          className="cursor-pointer w-32 sm:w-44"
          src={assets.logo}
          alt=""
          onClick={() => navigate("/")}
        />
      </nav>

      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g. Impact of AI on healthcare"
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>

        <div className="mt-3 flex gap-3 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition 
              ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700 border-blue-500"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 mt-10">
            <div className="text-sm flex flex-col items-center gap-4">
              <Edit className="w-8 h-8" />
              <p>Enter a topic and click “Generate Article” to get started.</p>
            </div>
          </div> 
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
