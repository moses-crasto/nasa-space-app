// frontend/src/components/ApodViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from '../api';

function ApodViewer() {
  const [apod, setApod] = useState(null);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(300); // Default height

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const res = await axios.get('/api/nasa/apod');
        setApod(res.data);
      } catch (err) {
        console.error('Failed to fetch APOD:', err);
      }
    };

    fetchApod();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [apod]);

  if (!apod) {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Rocket */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 rocket-launch">
          <div className="w-20 h-40 bg-gray-300 rounded-t-full rounded-b-[50%] border-t-4 border-gray-100 relative animate-rocket-launch">
            {/* Window */}
            <div className="w-10 h-10 bg-red-700 border-4 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2 top-10"></div>
            {/* Fins */}
            <div className="absolute left-[-20px] bottom-0 w-10 h-14 bg-red-700 rounded-l-[80%] rounded-bl-[20%]"></div>
            <div className="absolute right-[-20px] bottom-0 w-10 h-14 bg-red-700 rounded-r-[80%] rounded-br-[20%]"></div>
          </div>

          {/* Exhaust */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-7 h-36 bg-gradient-to-b from-transparent to-white animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white animate-fade-in"
      style={{
        backgroundImage: apod.media_type === 'image' ? `url(${apod.url})` : 'none',
        backgroundColor: apod.media_type !== 'image' ? 'black' : 'transparent',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>

      {/* Spacer to push content down on mobile */}
      <div className="h-60 md:h-96"></div>

      {/* Gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent z-0 pointer-events-none"
        style={{ height: `${contentHeight + 10}px` }} // Add padding to fade nicely
      ></div>


        {/* Content Container */}
        <div 
          ref={contentRef} 
          className="relative z-10 w-full px-6 py-8 sm:max-w-xl sm:mx-auto md:max-w-none md:mx-0">
          <h1 className="text-2xl font-michroma md:text-4xl font-semibold mb-2">
            {apod.title}, <span className="text-base font-light text-gray-400">{apod.date}</span>
          </h1>

          {apod.media_type === 'image' ? null : (
            <div className="mb-4">
              <iframe
                src={apod.url}
                title="APOD Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-64 md:h-96 rounded-lg"
              ></iframe>
            </div>
          )}

          <p className="text-sm font-jetbrains md:text-base text-gray-300">{apod.explanation}</p>
        </div>
    </div>
  );
}

export default ApodViewer;
