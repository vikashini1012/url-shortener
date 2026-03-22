# URL Shortener

A premium, full-stack web application where authenticated users can forge magic tracking links with enterprise-level settings. Features include custom aliases, deep-dive graphical analytics, password-protection, self-destructing expiration dates, and automatically generated high-res QR codes.

## 1. Project Overview
This project takes traditional URL shortening to the next level. Beyond simple redirects, users can generate encrypted short links that are protected by vault passwords, establish strict timeframe expirations, and instantly bridge physical to digital with a click-to-download SVG/PNG Quick Response (QR) code. Designed natively with a modern, glassmorphic dark-theme using Tailwind CSS v4 to look beautifully crisp on all devices.

## 2. Elite Features List
- **Advanced Link Settings**: 
  - **Vault Passwords**: Encrypt your links with bcrypt secure passwords before redirecting. 
  - **Self-Destruct Dates**: Select an exact timestamp for your link to permanently 404.
  - **QR Code Generation**: Instantly scan short links with mobile devices or download high-resolution PNG copies directly from the dashboard.
  - **Bulk URL Processing (`New`)**: Forget doing things one at a time. The powerful "Bulk Mode" allows users to paste multiple CSV/Newline delimited URLs and generate tracking links concurrently.
  - **Dynamic Link Editing (`New`)**: Quickly re-route the destination URL dynamically without losing your hard-earned clicks/metrics.
- **Deep Telemetry Analytics (`New`)**: 
  - Tracks raw timestamps, click totals, and **Geolocation/Device Architecture Analytics (Mobile vs Desktop)** logic parsed directly from request headers.
  - Interactive Daily Pulse charts (last 7-days).
  - Dedicated **Public Transparency Stats** pages for non-authenticated link monitoring.
- **Glassmorphism UI**: Fully revamped UI utilizing premium dark-mode radial gradients, CSS blur properties, Google Fonts ("Outfit" & "Plus Jakarta Sans"), and subtle micro-animations. 
- **Authentication**: User signup and login with secure JWT-based stateless protection.

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

---
This project is a proudly built submission for a hackathon run by https://katomaran.com
