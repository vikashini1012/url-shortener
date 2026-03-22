# URL Shortener with Advanced Analytics

A premium, full-stack web application where authenticated users can forge magic tracking links with enterprise-level settings. Features include custom aliases, deep-dive graphical analytics, password-protection, self-destructing expiration dates, and automatically generated high-res QR codes.

## 1. Project Overview
This project takes traditional URL shortening to the next level. Beyond simple redirects, users can generate encrypted short links that are protected by vault passwords, establish strict timeframe expirations, and instantly bridge physical to digital with a click-to-download SVG/PNG Quick Response (QR) code. Designed natively with a modern, glassmorphic dark-theme using Tailwind CSS v4 to look beautifully crisp on all devices.

## 2. Elite Features List
- **Advanced Link Settings (`New`)**: 
  - **Vault Passwords**: Encrypt your links with bcrypt secure passwords before redirecting. 
  - **Self-Destruct Dates**: Select an exact timestamp for your link to permanently 404.
  - **QR Code Generation**: Instantly scan short links with mobile devices or download high-resolution PNG copies directly from the dashboard.
- **Glassmorphism UI (`New`)**: Fully revamped UI utilizing premium dark-mode radial gradients, CSS blur properties, Google Fonts ("Outfit" & "Plus Jakarta Sans"), and subtle micro-animations. 
- **Authentication**: User signup and login with secure JWT-based stateless protection.
- **Redirection Logic**: Secure HTTP routing to ensure redirects leave the host gracefully.
- **Deep Analytics**: Click-counters, 'last visited' timestamps, and chronological timeline logs of all interaction data.
- **Interactive Charting**: Line-graph activity over the previous rolling 7 days leveraging Chart.js parameters with neon stylistic custom overrides.

## 3. Tech Stack
**Frontend:**
- React (Vite environment)
- Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- lucide-react (Premium iconography)
- Chart.js & react-chartjs-2 
- qrcode.react (On-the-fly QR generation)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (Encryption hashes for Users *and* URL Passwords)
- nanoid (Cryptographically secure short strings)

## 4. Setup Instructions

### Prerequisites
- Node.js installed (v16 or higher recommended)
- MongoDB instance (local server running on default `27017` or MongoDB Atlas map)

### Step-by-Step
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd url-shortener
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file referencing the sample below. Optionally, seed your database using `npm run seed` for immediate mock-data interaction.*
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file referencing the sample below to bind Vite to your network IP.*
   ```bash
   npm run dev
   ```

4. **Access the Application (For QR Scanning Capability):**
   Open your Network IPv4 Address provided by Vite (e.g., `http://192.168.X.X:5173`) in your browser. This ensures that when you generate a QR code on your monitor and scan it with your phone, it correctly tunnels to your computer's hosted backend.

## 5. Environment Variables
**Backend (`backend/.env`):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=supersecretjwtkey
FRONTEND_URL=http://<YOUR_IPV4>:5173
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://<YOUR_IPV4>:5000/api
```

## 6. API Endpoints

### Auth
- `POST /api/auth/register` - Create account logic.
- `POST /api/auth/login` - Authenticate existing users and disburse token.

### URLs
- `POST /api/url/shorten` - Forge new URLs (**Accepts: `originalUrl`, `alias`, `password`, `expiresAt`**).
- `GET /api/url/user` - Retrieves the authenticated user's private vault collection context.
- `GET /api/url/:code` - Intercepts clicks. Tracks analytics natively, checks for timeouts/passwords, and fires 301 redirects recursively.
- `POST /api/url/unlock/:code` - Intermediary endpoint allowing React to process password prompts against hashed credentials. 
- `DELETE /api/url/:id` - Obliterates shortlinks.
- `GET /api/url/:id/analytics` - Gathers deep telemetry payloads for visualizations.

## 7. Folder Structure
```
root/
├── backend/
│   ├── models/           # Mongoose schemas (User, Url overrides with expiry)
│   ├── routes/           # Express routes (auth, url)
│   ├── middleware/       # Custom middleware (JWT pipeline verifications)
│   ├── seed.js           # Automated Mock-Data generator
│   └── server.js         # Entry node map
├── frontend/
│   ├── src/
│   │   ├── components/   # Modular glassmorphism Navbar
│   │   ├── pages/        # Dashboard, Analytics, Login, Register, Expired, Unlock
│   │   ├── services/     # Axios configs intercepting JSON
│   │   ├── App.jsx       # Browser routing and wrappers
│   │   ├── main.jsx
│   │   └── index.css     # Global aesthetics injected with Tailwind
│   ├── vite.config.js    # Customized plugin arrays for V4 tooling
│   └── package.json
└── README.md
```

## 8. Demo Instructions

### Recording your Loom/YouTube Hackathon Pitch
1. **The Hook (0s - 15s):** Start strong. Introduce yourself and explain your project stands above traditional URL shorteners because of enterprise features (Encryption, Expiry dates, physical QR bridges).
2. **Dashboard & Auth (15s - 45s):** Briefly show the beautiful glassmorphism UI login system. Load the vault dashboard showing existing populated links to show scalable state logic. 
3. **Advanced Forging (45s - 1m 30s):** Create a long URL. Specifically, toggle **"Advanced Settings"**. Assign it a custom alias along with a definitive Password and an Expiration Date. Create the link.
4. **The Security Demo (1m 30s - 2m 15s):** Click the new link itself! Prove that you are seamlessly rerouted to your frontend `Unlock` page shield. Type the password in real-time, click submit, and smoothly watch the React transition fade out into the true original destination!
5. **Analytics & QR (2m 15s - 3m 00s):** Jump to your Analytics deep-dive to show the Neon Chart.js telemetry logging. Lastly, return to the dashboard, hit the QR code button, pull out your physical mobile phone, and scan it directly off your Loom presentation screen to prove your API connects across Local Area Networks!

---
This project is a proudly built submission for a hackathon run by https://katomaran.com
