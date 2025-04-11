import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CosmeticsResults() {
  const [result, setResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('scanResult');
    const storedImage = sessionStorage.getItem('uploadedImage');

    if (!storedResult || !storedImage) {
      // navigate('/');
      console.log("Redirecting: No data found");
      return;
    }

    setResult(JSON.parse(storedResult));
    setUploadedImage(storedImage);
  }, [navigate]);

  // TODO: Implement card creation and rendering logic from scripts/cosmetics.js

  if (!result) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="antialiased">
      {/* TODO: Add Navbar Component */}
      <section id="results" className="pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Image Card */}
          <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Image</h2>
              <img
                id="productImage"
                src={uploadedImage}
                alt="Scanned Product"
                className="w-full h-96 object-contain rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Dynamic Cards Container - Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cardsContainer">
             <p>Results will be displayed here.</p>
          </div>

          {/* Note Card */}
          <Link to="/" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Note ⚠️</h3>
              <p className="text-gray-600">
                If the results are not satisfactory or incorrect, please click here to try with a different photo or angle. 👆
              </p>
            </div>
          </Link>
        </div>
      </section>
      {/* TODO: Add Footer Component */}
    </div>
  );
}

export default CosmeticsResults;
