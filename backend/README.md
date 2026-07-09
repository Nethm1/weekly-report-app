# Backend - Weekly Report System

Express.js REST API with MongoDB

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run Server
```bash
npm run dev
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
- `POST /api/projects` - Create (manager)
- `PUT /api/projects/:id` - Update (manager)
- `DELETE /api/projects/:id` - Delete (manager)

### Dashboard (Manager only)
- `GET /api/dashboard/stats` - Summary statistics
- `GET /api/dashboard/submission-status` - Team status
- `GET /api/dashboard/trends` - 8-week trends
- `GET /api/dashboard/recent` - Recent activity
- `GET /api/dashboard/workload` - Project workload

### AI Chat (Manager only)
- `POST /api/ai/chat` - Chat with team assistant

## ER Diagram
[View ER Diagram](https://drive.google.com/file/d/1fEjb82Nc8x4jfoEbD4JyCgDEWikw05QZ/view?usp=sharing)

## Demo Video
[Watch Demo](https://drive.google.com/file/d/1UsIK7P5JeduPSgQnphTVVIVBXkZw06LG/view?usp=sharing)

## Presentation
[View Presentation](https://drive.google.com/file/d/1TFtUfgrtwTu-6nDdWwWKIYnMtsA7pTMo/view?usp=sharing)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcryptjs, CORS
