# Herizon

Herizon is a full-stack web application designed to provide a collaborative support network for users, guardians, and mentors. The platform enables users to manage daily tasks, request assistance, track wellbeing, and connect with mentors and guardians in real-time.

## Features

- **Role-Based Dashboards:**
  - User, Guardian, and Mentor dashboards with tailored functionality.
- **Task Management:**
  - Users can create, view, and remove tasks; guardians and mentors can manage and respond to requests.
- **Real-Time Notifications:**
  - Socket.io-powered alerts for task updates, help requests, and video call links.
- **Circle Management:**
  - Invite and manage members in a support circle.
- **Wellbeing Tracker:**
  - Track and visualize wellbeing metrics.
- **Emergency SOS:**
  - Instantly alert guardians and mentors for urgent help.
- **Video Call Integration:**
  - Secure Google Meet links for live support sessions.
- **Modern UI:**
  - Responsive, accessible, and visually appealing interface using React and Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Database:** (Add your DB, e.g., MongoDB)
- **Authentication:** JWT-based authentication

## Project Structure

```
herizon/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── ...
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (e.g., `.env` for DB connection, JWT secret).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

### Accessing the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Environment Variables
- Configure your backend `.env` file for database connection, JWT secret, etc.
- Example:
  ```env
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  ```

## Scripts
- **Backend**
  - `npm start` — Start backend server
- **Frontend**
  - `npm run dev` — Start frontend dev server
  - `npm run build` — Build frontend for production

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

## Acknowledgements
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/)
- [Express](https://expressjs.com/)

---
*Empowering support networks for every user.*
