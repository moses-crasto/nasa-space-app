import React, { useEffect, useState, useRef} from 'react';
import axios from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

function NeoDashboard() {
  const [startDate, setStartDate] = useState(new Date('2025-06-01'));
  const [endDate, setEndDate] = useState(new Date('2025-06-07'));
  const [minDiameter, setMinDiameter] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [neoPerDay, setNeoPerDay] = useState([]);
  const [topByDiameter, setTopByDiameter] = useState([]);
  const [closestApproaches, setClosestApproaches] = useState([]);
  const [neoNames, setNeoNames] = useState([]);
  const isMobile = useIsMobile();

  const fetchNeoData = async () => {
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);
    const cacheKey = `neoData_${startStr}_${endStr}_diam${minDiameter}_name${searchName}`;
    const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

    // Try loading from localStorage
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);

      // Check if cache is still valid
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
        console.log("✅ Loaded NEO data from cache.");
        setNeoPerDay(parsed.neoPerDay);
        setTopByDiameter(parsed.topByDiameter);
        setClosestApproaches(parsed.closestApproaches);
        return;
      } else {
        console.log("⚠️ Cache expired. Fetching new data...");
        localStorage.removeItem(cacheKey); // Optional: clean up expired cache
      }
    }

    try {
      const response = await axios.get('/api/nasa/neo-feed', {
        params: { start_date: startStr, end_date: endStr },
      });

      const raw = response.data.near_earth_objects;
      const dailyCount = [];
      const allNeos = [];

      for (const date in raw) {
        const neos = raw[date];
        const filteredNeos = neos.filter(neo => {
          const avgDiameter = (
            neo.estimated_diameter.kilometers.estimated_diameter_min +
            neo.estimated_diameter.kilometers.estimated_diameter_max
          ) / 2;

          return (
            avgDiameter >= minDiameter &&
            (!searchName || neo.name.toLowerCase().includes(searchName.toLowerCase()))
          );
        });

        dailyCount.push({ date, count: filteredNeos.length });
        allNeos.push(...filteredNeos);
      }

      // Collect all unique NEO names
      const namesSet = new Set();
      for (const date in raw) {
        raw[date].forEach(neo => namesSet.add(neo.name));
      }
      setNeoNames(Array.from(namesSet).sort());

      const topFive = allNeos
        .map(neo => ({
          name: neo.name,
          diameter: (
            neo.estimated_diameter.kilometers.estimated_diameter_min +
            neo.estimated_diameter.kilometers.estimated_diameter_max
          ) / 2,
        }))
        .sort((a, b) => b.diameter - a.diameter)
        .slice(0, 5);

      const closestPerDay = Object.keys(raw).map(date => {
        const minDist = Math.min(...raw[date].map(neo =>
          parseFloat(neo.close_approach_data?.[0]?.miss_distance.kilometers || "0")
        ));
        return { date, distance: minDist };
      });

      setNeoPerDay(dailyCount);
      setTopByDiameter(topFive);
      setClosestApproaches(closestPerDay);

      // Save to cache with timestamp
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          neoPerDay: dailyCount,
          topByDiameter: topFive,
          closestApproaches: closestPerDay,
        })
      );
      console.log("💾 Saved NEO data to cache.");
    } catch (error) {
      console.error("❌ Error fetching NEO data:", error);
    }
  };

  useEffect(() => {
    fetchNeoData();
  }, [startDate, endDate, minDiameter, searchName]);

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
    <div style={{ paddingTop: '100px', paddingInline: '1rem' }}>
      <StarCanvas />
      <div className="font-jetbrains flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Start Date:</label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-32 px-2 py-1 rounded border text-gray-800"/>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">End Date:</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="w-32 px-2 py-1 rounded border text-gray-800"/>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Min Diameter (km):</label>
          <input
            type="number"
            value={minDiameter}
            onChange={e => setMinDiameter(Number(e.target.value))}
            className="w-32 px-2 py-1 rounded border text-gray-800"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Search by Name:</label>
          <input
            type="text"
            list="neo-name-list"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="w-48 px-2 py-1 rounded border text-gray-800"
          />
          <datalist id="neo-name-list">
            {neoNames.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchNeoData}
            className="bg-blue-600/50 hover:bg-red-700/50 text-white font-semibold py-1 px-4 rounded flex items-center gap-2">
            <FaSearch className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      <TabGroup>
        <TabList className="flex font-jetbrains space-x-2 rounded-xl bg-blue-900/20 p-1 mb-4">
          {['NEOs Per Day', 'Top by Diameter', 'Closest Approaches'].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tabName}
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-2 font-jetbrains">
          {/* Panel 1: Line Chart */}
          <TabPanel className="bg-gray-900/60 rounded-xl p-4 shadow-md">
            {neoPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={neoPerDay} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={isMobile ? -45 : 0}
                    dy={10}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    interval={isMobile ? 0 : 'preserveStartEnd'}
                    tickFormatter={isMobile ? (date) => format(parseISO(date), 'MM/dd') : (date) => date}
                  />
                  <YAxis label={{ value: 'NEOs', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} NEOs`, 'Number']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#38bdf8' }}
                    labelStyle={{ color: '#38bdf8' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    filter="url(#glow)"
                    dot={{ stroke: '#38bdf8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No NEOs detected in this range.</p>
            )}
          </TabPanel>

          {/* Panel 2: Bar Chart */}
          <TabPanel className="bg-gray-900/60 rounded-xl p-4 shadow-md">
            {topByDiameter.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topByDiameter} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={isMobile ? -45 : 0}
                    dy={10}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    interval={isMobile ? 0 : 'preserveStartEnd'}
                    tickFormatter={(name) =>
                      isMobile && name.length > 10 ? `${name.slice(0, 10)}…` : name
                    }
                  />
                  <YAxis label={{ value: 'Diameter (km)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} km`, 'Diameter']}
                    labelFormatter={(label) => `Name: ${label}`}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#38bdf8' }}
                    labelStyle={{ color: '#38bdf8' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="diameter" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No NEOs match the diameter filter.</p>
            )}
          </TabPanel>

          {/* Panel 3: Area Chart */}
          <TabPanel className="bg-gray-900/60 rounded-xl p-4 shadow-md">
            {closestApproaches.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={closestApproaches} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    angle={isMobile ? -45 : 0}
                    dy={10}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    interval={isMobile ? 0 : 'preserveStartEnd'}
                    tickFormatter={isMobile ? (date) => format(parseISO(date), 'MM/dd') : (date) => date}
                  />
                  <YAxis label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} km`, 'Distance']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#f97316' }}
                    labelStyle={{ color: '#f97316' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="distance"
                    stroke="#ff7300"
                    fillOpacity={1}
                    fill="url(#colorDist)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No close approaches found for this range.</p>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

    </div>
  );
}

export default NeoDashboard;
