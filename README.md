# URL Shortener with Analytics

A full-stack web application where authenticated users can shorten URLs, manage their custom links, and view analytics such as total clicks and recent visit timestamps.

## 1. Project Overview
This project provides a complete URL shortening service. Users can register for an account, paste long URLs, and generate unique short links. They can optionally provide a custom alias for their short links. The application tracks every click on the generated links and presents comprehensive analytics in a dedicated dashboard and graphical charts.

## 2. Features List
- **Authentication**: User signup and login with JWT-based protection.
- **Protected Routes**: Users can only see and manage their own links.
- **URL Shortening**: Automatic generation of short links via `nanoid` or customizable aliases provided by the user.
- **Redirection**: Fast redirect from the short URL to the original long URL.
- **Analytics Tracking**: Total clicks, last visited timestamp, and history of all visits tracked in the database.
- **Dashboard UI**: Display of all the user's links, along with quick actions to copy to clipboard, delete links, or view analytics.
- **Analytics UI**: Detailed view including a chart to visualize clicks over the last 7 days.
- **Responsive Design**: Tailored experiences for both desktop and mobile using Tailwind CSS.

## 3. Tech Stack
**Frontend:**
- React (Vite setup)
- Functional Components & Hooks
- Axios (for API calls)
- Tailwind CSS
- React Router DOM
- Chart.js & react-chartjs-2 (for analytics graphs)
- Lucide React (for icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (for password hashing)
- nanoid (for short code generation)
- dotenv (for environment variables)

## 4. Setup Instructions

### Prerequisites
- Node.js installed (v16 or higher recommended)
- MongoDB instance (local or Atlas)

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
   *Create a `.env` file in the `backend/` directory referencing the sample below.*
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in the `frontend/` directory referencing the sample below.*
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 5. Environment Variables
**Backend (`backend/.env`):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=supersecretjwtkey
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:5000/api
```

## 6. API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate an existing user and return a token

### URLs
- `POST /api/url/shorten` - Create a new shortened URL
- `GET /api/url/user` - Get all URLs created by the authenticated user
- `GET /api/url/:code` - Redirect to the original URL and track the click (Public)
- `DELETE /api/url/:id` - Delete a URL
- `GET /api/url/:id/analytics` - Get detailed analytics for a URL

## 7. Folder Structure
```
root/
├── backend/
│   ├── controllers/      # Future separation of controller logic
│   ├── models/           # Mongoose schemas (User, Url)
│   ├── routes/           # Express routes (auth, url)
│   ├── middleware/       # Custom middleware (JWT auth check)
│   ├── utils/            # Shared database/helper code
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared UI (Navbar)
│   │   ├── pages/        # Route components (Login, Register, Dashboard, Analytics)
│   │   ├── services/     # Axios configs
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css     # Global styles & Tailwind injections
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 8. Assumptions Made
- Mongoose uses standard basic schema models with simple `Ref` for ownership. Database scaling (e.g., separating massive hit logs) isn't the primary goal, so `visitHistory` array is used but kept simple.
- Deletions are hard deletions.
- The UI handles errors gracefully provided by standard axios configurations intercepting network boundaries.

## 9. AI Planning Document
1. Initialize Mono-repo with frontend & backend workspaces.
2. Build backend APIs: Models (Users, URLs), routing, database connectivity, middleware.
3. Establish robust authentication flow utilizing bcrypt & JSON Web Tokens.
4. Integrate URL validation & random short-code generation (nanoid). Setup the logic to track IP/date on the redirect GET mechanism.
5. Create React frontend application utilizing Vite.
6. Install UI frameworks such as TailwindCSS.
7. Build pages: Clean login / register pages, comprehensive visual Dashboard for handling URLs, and dedicated Analytics components rendering metrics & Chart.js instances.

## 10. Architecture Explanation
The architecture relies on a standard REST API pattern. The Express app acts as a data provider, communicating with a MongoDB database hosted locally or in the cloud. We apply an object-mapping paradigm using Mongoose for easy validations. Protected Routes use a stateless mechanism via JWT attached by frontend Axios interceptors, guaranteeing the server can identify ownership quickly without session cache requirements. The React UI is completely uncoupled and fetches its data strictly utilizing asynchronous XHR calls. When users click a short link, they hit the Express `/:code` endpoint, which intercepts the request, increments analytics values within a transaction/write scale logic, and issues an immediate 302/301 Redirect to the browser.

## 11. Demo Instructions

### Recording your Loom/YouTube Demo
1. **Start Screen Recording:** Make sure to capture your full browser window showing both the URL and the application.
2. **Introduction (0s - 15s):** Briefly introduce yourself and what your application is (A Full-stack URL shortener).
3. **Authentication Showcase (15s - 45s):** Show creating a new account (Registration), and subsequently logging out and logging back in (Login).
4. **URL Shortening (45s - 1m 15s):** Navigate to the dashboard, input a long URL, and an optional custom alias. Click "Shorten" and show the newly created link in the dashboard view.
5. **Redirection (1m 15s - 1m 30s):** Copy the short link to your clipboard and open it in a new incognito window/tab. Show that it flawlessly redirects to the original page.
6. **Analytics Feature (1m 30s - 2m 00s):** Returning to your dashboard dashboard, either refresh or direct yourself to the unique Analytics section of that link. Demonstrate the captured click from the previous step on the UI and chart.
7. **Conclusion & Code Review (2m 00s - 3m 00s):** Briefly show the codebase outlining your MVC structure, API routing, database schema, and UI layouts to conclude. Upload your video!

---
This project is a part of a hackathon run by https://katomaran.com
