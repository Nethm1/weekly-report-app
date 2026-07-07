# Weekly Report Generator & Team Dashboard

A full-stack web application for team members to submit structured weekly work reports and managers to view team analytics through a consolidated dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (Role-based) |
| Charts | Recharts |
| Icons | Lucide React |

## Features

### Team Member
- ✅ Register / Login with JWT authentication
- ✅ Create weekly report (fixed fields for consistency)
- ✅ Save as draft or submit report
- ✅ Edit and manage own reports
- ✅ View report history organized by week

### Manager / Admin
- ✅ Team dashboard with analytics
- ✅ Submission trend chart (area chart)
- ✅ This week status (donut chart)
- ✅ Workload by project (bar chart)
- ✅ Team submission status tracking (submitted / pending / late)
- ✅ Filter reports by member, project, date range, status
- ✅ Recent activity feed
- ✅ AI Chat Assistant for team insights

### Projects / Categories
- ✅ Add / Edit / Delete projects
- ✅ Color-coded project tags
- ✅ Attach projects to reports

## Project Structure

```
weekly-report-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── projectController.js
│   │   ├── userController.js
│   │   ├── dashboardController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── userRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── common/
│   │   │   └── ai/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── member/
│   │   │   └── manager/
│   │   └── utils/
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd weekly-report-app
```

### 2. Database Setup (MongoDB Atlas)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Go to **Database Access** → Add user with password
4. Go to **Network Access** → Allow from anywhere (0.0.0.0/0)
5. Click **Connect** → **Drivers** → Copy connection string

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_string
```

Run backend:
```bash
npm run dev
```
Backend runs on **http://localhost:5000**

### 4. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:3000**

### 5. First Time Setup
1. Open http://localhost:3000/register
2. Create a **Manager** account first
3. Go to **Projects** → Create some projects (Engineering, Design, etc.)
4. Create a **Team Member** account
5. Submit reports as member → View dashboard as manager

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |

### Reports
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/reports | Manager |
| GET | /api/reports/my | Member |
| POST | /api/reports | Member |
| PUT | /api/reports/:id | Member |
| PATCH | /api/reports/:id/submit | Member |
| DELETE | /api/reports/:id | Member |

### Dashboard (Manager only)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard/stats | Summary metrics |
| GET | /api/dashboard/submission-status | Team status |
| GET | /api/dashboard/trends | 8-week trend |
| GET | /api/dashboard/recent | Activity feed |
| GET | /api/dashboard/workload | Project workload |

### AI Chat (Manager only)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/ai/chat | Chat with team assistant |

## ER Diagram
[View ER Diagram](https://dbdiagram.io) ← Add link here

## Demo Video
[Watch Demo](https://drive.google.com) ← Add link here
