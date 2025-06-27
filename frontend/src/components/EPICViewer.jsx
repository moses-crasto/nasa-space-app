import React, { useEffect, useState, useRef } from 'react';
import axios from '../api';

const EPICViewer = () => {
  const [images, setImages] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEPIC = async () => {
    if (!date) return alert('Please select a date!');
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=DEMO_KEY`
      );
      setImages(res.data);
    } catch (err) {
      console.error('EPIC fetch error:', err);
      alert('No images found for this date or an error occurred.');
    }
    setLoading(false);
  };

  const getImageUrl = (img) => {
    const datePath = date.replaceAll('-', '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${img.image}.png`;
  };

  const StarCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      const stars = Array.from({ length: 150 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random(),
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      }));

      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for (let star of stars) {
          star.alpha += star.twinkleDir * 0.005;
          if (star.alpha <= 0.1 || star.alpha >= 1) star.twinkleDir *= -1;
          star.y -= star.speed;
          if (star.y < 0) star.y = height;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();
        }
        requestAnimationFrame(animate);
      };

      animate();
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[-1] bg-gradient-to-b from-black via-blue-950 to-black"
      />
    );
  };

  return (
    <div className="pt-24 px-4 text-white font-jetbrains min-h-screen">
      <StarCanvas />
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded border text-black"
        />
        <button
          onClick={fetchEPIC}
          className="bg-blue-600/60 hover:bg-blue-700/80 text-white px-4 py-2 rounded"
        >
          Fetch EPIC Images
        </button>
      </div>

      {loading && <p>Loading EPIC images...</p>}
      {!loading && images.length === 0 && <p>No images for this date.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.identifier} className="bg-black/50 p-2 rounded-xl shadow-sm">
            <img src={getImageUrl(img)} alt={img.caption} className="w-full h-auto rounded-xl" />
            <div className="p-2 text-sm">
              <p>{img.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EPICViewer;
