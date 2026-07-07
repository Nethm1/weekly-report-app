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

Edit `.env` file and update:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

Replace `<username>`, `<password>`, and cluster URL with your Atlas credentials.

### 4. Run Server

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server runs on **http://localhost:5000**

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Reports
- `GET /api/reports` - Get all reports (manager only)
- `GET /api/reports/my` - Get my reports
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report (member)
- `PUT /api/reports/:id` - Update report (member)
- `PATCH /api/reports/:id/submit` - Submit report (member)
- `DELETE /api/reports/:id` - Delete report (member)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (manager)
- `PUT /api/projects/:id` - Update project (manager)
- `DELETE /api/projects/:id` - Delete project (manager)

### Dashboard (Manager)
- `GET /api/dashboard/stats` - Summary statistics
- `GET /api/dashboard/submission-status` - Team submission status
- `GET /api/dashboard/trends` - Report trends (8 weeks)
- `GET /api/dashboard/recent` - Recent activity

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** bcryptjs, CORS
