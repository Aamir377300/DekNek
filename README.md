# TaskFlow Pro

A production-ready full-stack productivity app built with Next.js, Node.js/Express, MongoDB, and JWT authentication.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14, React 18, Tailwind CSS |
| Backend    | Node.js, Express                  |
| Database   | MongoDB Atlas (Mongoose)          |
| Auth       | JWT + bcrypt                      |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
taskflow-pro/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe
│   │   └── taskController.js   # CRUD operations
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Task.js             # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── components/
    │   ├── AddTaskForm.js
    │   ├── Layout.js
    │   ├── Navbar.js
    │   ├── Spinner.js
    │   ├── StatsBar.js
    │   └── TaskCard.js
    ├── context/
    │   └── AuthContext.js      # Global auth state
    ├── hooks/
    │   └── useTasks.js         # Task CRUD hook
    ├── lib/
    │   └── axios.js            # Axios instance + interceptors
    ├── pages/
    │   ├── _app.js
    │   ├── index.js            # Redirects to /dashboard or /login
    │   ├── login.js
    │   ├── signup.js
    │   └── dashboard.js
    ├── styles/
    │   └── globals.css
    ├── .env.local.example
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint              | Access  | Description        |
|--------|-----------------------|---------|--------------------|
| POST   | /api/auth/register    | Public  | Register new user  |
| POST   | /api/auth/login       | Public  | Login user         |
| GET    | /api/auth/me          | Private | Get current user   |

### Tasks
| Method | Endpoint          | Access  | Description        |
|--------|-------------------|---------|--------------------|
| GET    | /api/tasks        | Private | Get all user tasks |
| POST   | /api/tasks        | Private | Create a task      |
| PUT    | /api/tasks/:id    | Private | Update a task      |
| DELETE | /api/tasks/:id    | Private | Delete a task      |

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskflow-pro.git
cd taskflow-pro
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:5003/api
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5003
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5003/api
```

---

## Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist `0.0.0.0/0` (or your server IP)
3. Copy the connection string into `MONGO_URI`

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `backend/.env`
7. Copy the deployed URL (e.g. `https://taskflow-api.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your repo, set root directory to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://taskflow-api.onrender.com/api`
4. Deploy

---

## Features

- JWT authentication with bcrypt password hashing
- Protected routes (frontend + backend)
- Optimistic UI updates for task toggling and deletion
- Filter tasks by status (all / pending / completed)
- Inline task editing
- Progress stats bar
- Responsive mobile-first design
- Toast notifications
- Global error handling

---

## License

MIT
