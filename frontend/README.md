# 🚀 NASA Space Data Explorer

A full-stack web application that fetches and visualizes space-related data from NASA's Open APIs. Built with **React** for the frontend and **Node.js + Express** for the backend, this app allows users to interact with data such as Near Earth Objects (NEOs) and explore it through rich visualizations and responsive design.

## 🌐 Live Demo

🔗 [Deployed App Link](https://your-deployment-url.com)

## 📂 Project Structure

├── frontend/ # React frontend
└── backend/ # Node.js + Express backend

## 🧑‍💻 Features

- 📊 Interactive dashboard with charts and filters
- 🌌 Data fetched from NASA's public APIs via a secure backend
- 📱 Fully responsive for mobile and desktop
- 🔍 User interactivity: filters by date, visualization tooltips, truncation on mobile
- ⚠️ Handles loading states and errors gracefully

## 📈 NASA APIs Used

- [Near Earth Object Web Service (NeoWs)](https://api.nasa.gov/)
- [Astronomy Picture of the Day (APOD)]
- Earth Polychromatic Imaging Camera (EPIC)

## ⚙️ Tech Stack

### Frontend:
- React
- Recharts (for charts)
- Tailwind CSS
- Axios / Fetch API

### Backend:
- Node.js
- Express
- dotenv (for environment variables)

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/moses-crasto/nasa-space-explorer.git
cd nasa-space-explorer

2. Setup Environment Variables
Create a .env file in the backend folder:

NASA_API_KEY=your_nasa_api_key_here
PORT=5000

You can get a free NASA API key here: https://api.nasa.gov/

3. Install Dependencies
Backend:
cd backend
npm install
npm run dev

Frontend:
cd frontend
npm install
npm run dev

The frontend will typically run on http://localhost:3000, and the backend on http://localhost:5000.

