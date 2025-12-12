# BinAlert - Intelligent Garbage Overflow Detection

BinAlert is a smart waste management platform connecting citizens and municipalities using AI-powered image analysis.

## 🚀 Quick Start (Local Machine)

### 1. Prerequisites
- **Node.js** (v18+) installed.
- **Git** installed.

### 2. Installation
Clone the project and install dependencies:

```bash
npm install
```

### 3. Environment Setup
Create a file named `.env` in the root folder. You must use the `VITE_` prefix for the key to work in the browser:

```env
VITE_API_KEY=your_actual_google_gemini_api_key_here
```
*Get your key from [Google AI Studio](https://aistudio.google.com/).*

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚢 Deployment Guide

### Option A: Static Hosting (Vercel/Netlify) - *Easiest*
Since this is a Single Page Application (SPA), you can deploy it for free.

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import the project.
3. In the "Environment Variables" section of Vercel, add:
   - Name: `VITE_API_KEY`
   - Value: `your_google_api_key`
4. Click **Deploy**.

### Option B: Docker (Containerized)
If you want to deploy to a cloud provider like AWS, Azure, or DigitalOcean using containers:

1. **Build the Image:**
   You need to pass the API key during the build process because Vite embeds it into the HTML/JS.
   ```bash
   docker build --build-arg VITE_API_KEY=your_key_here -t binalert-web .
   ```

2. **Run the Container:**
   ```bash
   docker run -p 8080:80 binalert-web
   ```
   Access at `http://localhost:8080`.

## 📱 Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 2.5 Flash
- **Maps:** Leaflet / OpenStreetMap

## ⚠️ Database Note
Currently, this application uses **local state** (mock data) for demonstration purposes. To connect to the Python/PostgreSQL backend mentioned in the architecture design:
1. Ensure the FastAPI backend is running.
2. Update `services/api_service.ts` (to be created) to fetch from your backend URL instead of using mock arrays.
