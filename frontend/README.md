# 🚀 NASA Explorer Web App

This is a full-stack web application that displays data from NASA’s public APIs, including the Astronomy Picture of the Day (APOD) and Near Earth Object (NEO) data. Built with **React (Next.js)** for the frontend and **Express.js** for the backend.

---

## 🔗 Live Demo

- 🌍 Frontend (Vercel): [https://nasa-space-app.vercel.app](https://nasa-space-app.vercel.app)
- ⚙️ Backend (Render): [https://nasa-space-app-backend.onrender.com](https://nasa-space-app-backend.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

### Backend
- **Runtime:** Node.js with Express
- **Routing:** `/api/nasa` handles NASA API requests (APOD & NEO)
- **Hosting:** Render
- **CORS-enabled** to allow frontend-backend communication

---

## 📁 Folder Structure

nasa-explorer/
├── backend/
│ ├── index.js
│ ├── routes/
│ │ └── nasaRoutes.js
├── frontend/
│ └── (Next.js app)
├── .env
├── README.md

---

## 🚦 How It Works

- Users can view:
  - The **Astronomy Picture of the Day (APOD)**.
  - A **NEO Dashboard** displaying objects approaching Earth within a date range.
- The frontend calls the backend, which acts as a proxy to the actual NASA APIs.

---

## 🌐 API Routes

| Route                       | Description                            |
|-----------------------------|----------------------------------------|
| `/api/nasa/apod`            | Returns the Astronomy Picture of the Day |
| `/api/nasa/neo-dashboard`   | Returns NEO data from a date range       |
| `/api/nasa/mars-gallery`    | Returns Mars photos from a date range    |
| `/api/nasa/neo-dashboard`   | Returns Earth Photos from a date         |

---

## 🧪 Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/nasa-explorer.git
   cd nasa-explorer

2. **Install dependencies**
cd backend
npm install

cd ../frontend
npm install

3. **Set up your .env file (in /backend)**
NASA_API_KEY=your_nasa_api_key
PORT=8080

4. **Run locally**
Backend:
cd backend
node index.js
Frontend:
cd frontend
npm run dev

Deployment
Frontend: Deployed on Vercel. Auto-deploys on push to main branch.
Backend: Deployed on Render. Uses app.listen(PORT) for port binding.