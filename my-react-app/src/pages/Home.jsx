import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const imageUrlRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const cameraModal = document.getElementById('cameraModal');
      const video = document.getElementById('cameraPreview');
      
      cameraModal.classList.remove('hidden');
      
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          alert('Error accessing camera. Please try uploading an image instead.');
          cameraModal.classList.add('hidden');
        });
    } else {
      alert('Camera access is not supported in your browser. Please try uploading an image instead.');
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('cameraPreview');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setImagePreview(imageDataUrl);
    
    closeCamera();
  };

  const closeCamera = () => {
    const cameraModal = document.getElementById('cameraModal');
    const video = document.getElementById('cameraPreview');
    
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    
    cameraModal.classList.add('hidden');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if an image was provided
    if (!imagePreview) {
      alert('Please upload or capture an image first.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare form data
      const formData = new FormData();
      
      // Convert data URL to Blob
      if (imagePreview.startsWith('data:image')) {
        const fetchResponse = await fetch(imagePreview);
        const blob = await fetchResponse.blob();
        formData.append('image', blob, 'image.jpg');
      }
      
      // API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Send request
      const response = await fetch(`${apiUrl}/scan/food`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store results in sessionStorage
      sessionStorage.setItem('scanResult', JSON.stringify(data));
      sessionStorage.setItem('uploadedImage', imagePreview);
      
      // Navigate to results page
      navigate('/food-results');
      
    } catch (error) {
      console.error('Error scanning image:', error);
      alert('Error processing your image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="antialiased">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">InstaScan</div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2481/2481929.png"
                alt="Logo"
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-bg pt-32 pb-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Scan Smart,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Live Healthy
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Instantly scan food products to reveal their ingredients, allergens, and nutritional information.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Upload Button with hidden file input */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition w-full"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    ref={imageUrlRef}
                    placeholder="Enter image URL"
                    className="hidden md:block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={openCamera}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition w-full"
                >
                  📷 Open Camera
                </button>

                {imagePreview && (
                  <div className="mt-4">
                    <div className="text-center text-sm text-gray-600 mb-2">Preview:</div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-h-60 object-contain rounded-lg border border-gray-300" 
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
                  } text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 w-full`}
                >
                  {isLoading ? 'Scanning...' : 'Scan Now'}
                </button>

                {/* Loader */}
                {isLoading && (
                  <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        className="animate-ping"
                      ></svg>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3481/3481076.png"
              alt="Scanner"
              className="w-3/4 mx-auto bounce"
            />
          </div>
        </div>
      </section>

      {/* Camera Modal */}
      <div id="cameraModal" className="fixed inset-0 z-50 hidden camera-modal">
        <div className="relative h-full w-full flex items-center justify-center">
          <video
            id="cameraPreview"
            className="h-[80vh] w-auto rounded-lg"
            autoPlay
            playsInline
          ></video>
          <div className="camera-actions flex gap-4">
            <button
              onClick={capturePhoto}
              className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              ⚪ Capture
            </button>
            <button
              onClick={closeCamera}
              className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
            >
              ❌ Close
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">InstaScan</div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2481/2481929.png"
                alt="Logo"
                className="w-8 h-8"
              />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center md:text-right">
            <p className="text-gray-400">
              &copy; 2025 InstaScan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
