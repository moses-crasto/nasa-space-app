import React, { useState, useEffect, useRef } from 'react';
import axios from '../api';
import { FaSearch } from 'react-icons/fa';

const rovers = ['curiosity', 'opportunity', 'spirit'];
const cameras = {
  curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
  spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
};

const roverDateRanges = {
  curiosity: { min: '2012-08-06', max: new Date().toISOString().split('T')[0] },
  opportunity: { min: '2004-01-26', max: '2018-06-11' },
  spirit: { min: '2004-01-05', max: '2010-03-21' },
};

const MarsGallery = () => {
  const [rover, setRover] = useState('curiosity');
  const [camera, setCamera] = useState('');
  const [date, setDate] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    if (!date) return alert('Please enter a date!');
    setLoading(true);
    try {
      const response = await axios.get('/api/nasa/mars-photos', {
        params: { rover, camera, earth_date: date },
      });
      setPhotos(response.data.photos);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch photos');
    }
    setLoading(false);
  };

  useEffect(() => {
    setDate('');
    setCamera('');
    setPhotos([]);
  }, [rover]);

  const StarCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      // Resize listener
      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      // Create stars
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
          // Twinkle effect
          star.alpha += star.twinkleDir * 0.005;
          if (star.alpha <= 0.1 || star.alpha >= 1) {
            star.twinkleDir *= -1;
          }

          // Vertical drift
          star.y -= star.speed;
          if (star.y < 0) star.y = height;

          // Draw star
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();
        }

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[-1] bg-gradient-to-b from-black via-blue-950 to-black"
      />
    );
  };


  return (
    <div className="pt-24 px-4 font-jetbrains">
      <StarCanvas />
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Rover:</label>
          <select
            value={rover}
            onChange={(e) => setRover(e.target.value)}
            className="px-2 py-1 rounded border text-gray-800"
          >
            {rovers.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Camera:</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="px-2 py-1 rounded border text-gray-800"
          >
            <option value="">All</option>
            {cameras[rover].map((cam) => (
              <option key={cam} value={cam}>
                {cam}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Earth Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-2 py-1 rounded border text-gray-800"
            min={roverDateRanges[rover].min}
            max={roverDateRanges[rover].max}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchPhotos}
            className="bg-blue-600/50 hover:bg-red-700/50 text-white font-semibold py-1 px-4 rounded flex items-center gap-2"
          >
            <FaSearch className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading photos...</p>}
      {!loading && photos.length === 0 && <p>No photos found for this query.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-black/50 p-2 rounded-xl shadow-sm">
            <img src={photo.img_src} alt={photo.camera.full_name} className="w-full h-auto rounded-xl" />
            <div className="mt-2 text-sm">
              <p className="font-semibold">{photo.camera.full_name}</p>
              <p>{photo.earth_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarsGallery;
