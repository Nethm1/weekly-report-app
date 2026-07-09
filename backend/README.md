# Backend - Weekly Report System

Express.js REST API with MongoDB

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string

### 3. Configure Environment
Edit `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_string
```

### 4. Run Server
```bash
npm run dev   # Development
npm start     # Production
```
Server runs on **http://localhost:5000**

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Reports
- `GET /api/reports` - All reports (manager)
- `GET /api/reports/my` - My reports
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report
- `PATCH /api/reports/:id/submit` - Submit report
- `DELETE /api/reports/:id` - Delete report

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (manager)
- `PUT /api/projects/:id` - Update project (manager)
- `DELETE /api/projects/:id` - Delete project (manager)

### Dashboard (Manager only)
- `GET /api/dashboard/stats` - Summary statistics
- `GET /api/dashboard/submission-status` - Team submission status
- `GET /api/dashboard/trends` - Report trends (8 weeks)
- `GET /api/dashboard/recent` - Recent activity
- `GET /api/dashboard/workload` - Project workload

### AI Chat (Manager only)
- `POST /api/ai/chat` - Chat with team assistant

## ER Diagram
[View ER Diagram](https://drive.google.com/file/d/1fEjb82Nc8x4jfoEbD4JyCgDEWikw05QZ/view?usp=sharing)

## Demo Video
[Watch Demo](#) ← Add link after recording

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcryptjs, CORS
