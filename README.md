# Portfolio Website

This project is a modern, responsive portfolio website built with a static frontend and a Node.js + Express backend. Contact form messages are stored in MongoDB.

Features
- Responsive design (mobile/tablet/desktop)
- Dark / Light theme toggle
- Smooth scroll, reveal animations, sticky navbar
- Dynamic project rendering
- Contact form with client-side & server-side validation
- REST API: `POST /contact`, `GET /contacts` (admin)

Project structure
```
portfolio/
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
├── server/
│   ├── server.js
│   ├── routes/contactRoutes.js
│   └── models/Contact.js
├── .env.example
├── package.json
└── README.md
```

Setup (local)
1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `ADMIN_TOKEN`.

```powershell
cd portfolio
npm install
npm run dev
```

2. Open `http://localhost:3000` in your browser.

API Usage
- Send a POST request to `/contact` with JSON `{name,email,message}`.
- Retrieve messages with GET `/contacts` including header `x-admin-token: <ADMIN_TOKEN>`.

Deployment
- Works with services like Render, Railway, or Heroku. Ensure environment variables are set and the `start` script is used.

Notes
- Keep your `MONGO_URI` and `ADMIN_TOKEN` secret. Use a strong token for admin access.
- This is a starter template; extend projects, styles, and server-side auth as needed.
