"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"; 
import { X } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";

const Home = ({ session }) => {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Analysis updated:", analysis);
  }, [analysis]);

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setFiles([...droppedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select an image before uploading.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch("/api/imagechecker", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);

        setAnalysis(data);

      } else {
        const text = await response.text();
        console.error("Unexpected response (Not JSON):", text);
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
    

    
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-16">
      <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div
            className="border-2 border-dashed border-[#86efac] rounded-lg p-8 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-12 h-12 bg-[#dcfce7] rounded-full flex items-center justify-center mb-4">
              <FiUploadCloud className="w-6 h-6 text-[#16a34a]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600 mb-4">Simply upload or drag & drop up to two images to get started</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#16a34a] text-white rounded-md hover:bg-[#15803d] cursor-pointer"
            >
              Choose Files
            </label>
          </div>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Selected Files</h3>
              <div className="grid grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative w-40 h-42 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    layout="responsive" 
                    width={128}
                    height={128} 
                    className="object-cover"
                  />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)} 
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || files.length === 0}
            >
              {loading ? "Analyzing..." : "Analyze Images"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Analysis Results</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your images...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div>
            <div className="flex items-center gap-2 mb-6">
  <span className="text-5xl font-extrabold text-[#16a34a] shadow-md p-2 rounded-full bg-[#d1fae5]">{analysis.rating}</span>
  <span className="text-xl font-semibold text-gray-600">/10</span>
</div>

              <p className="text-gray-700">{analysis.reasoning}</p>
            </div>

            {(analysis.recommendations || analysis.recommendation) && (
  <div>
    <h3 className="font-semibold text-lg mb-3">Eco-Friendly Alternatives</h3>
    <div className="space-y-3">
      {Array.isArray(analysis.recommendations || analysis.recommendation) ? (
        (analysis.recommendations || analysis.recommendation).map((item, index) => (
          <div key={index} className="p-4 bg-[#f0fdf4] rounded-lg border-l-4 border-[#16a34a]">
            <p className="text-gray-700">{typeof item === 'string' ? item : item.brand || item.product || item}</p>
          </div>
        ))
      ) : (
        <div className="p-4 bg-[#f0fdf4] rounded-lg border-l-4 border-[#16a34a]">
          <p className="text-gray-700 whitespace-pre-wrap">{analysis.recommendations || analysis.recommendation}</p>
        </div>
      )}
    </div>
  </div>
)}

          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Upload and analyze images to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
