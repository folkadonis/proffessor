# MCQ Test Platform

A comprehensive Multiple Choice Question test platform with admin controls, user management, and test-taking features.

## Features

### Admin Features
- **Question Management**: Create, edit, and delete MCQ questions with multiple options
- **Test Module Creation**: Build test modules by selecting questions, setting duration and passing scores
- **User Admission System**: Approve or reject new user registrations
- **Dashboard Statistics**: View overall platform statistics including users, tests, and attempts

### User Features
- **User Registration**: Sign up with approval system
- **Test Taking**: Take available tests with timer and progress tracking
- **Navigation Lock**: Prevents users from navigating away during tests
- **Score Calculation**: Automatic scoring with detailed results
- **Test History**: View all past test attempts and scores

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- Context API for state management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd mcq-test-platform/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Edit `.env` file with your MongoDB URI and JWT secret

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd mcq-test-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### First Time Setup

1. Register the first user - they will automatically become admin
2. Login as admin to access the admin dashboard
3. Create questions in the Questions section
4. Create test modules in the Test Modules section
5. Approve new user registrations in Pending Users section

### For Users

1. Register for an account
2. Wait for admin approval
3. Once approved, login to access available tests
4. Take tests with timer and navigation lock enabled
5. View results and test history

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/User)
- User approval system
- Navigation lock during tests to prevent cheating
- Session management

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/pending-users` - Get pending user approvals
- `PUT /api/admin/approve-user/:userId` - Approve user
- `DELETE /api/admin/reject-user/:userId` - Reject user
- `POST /api/admin/questions` - Create question
- `GET /api/admin/questions` - Get all questions
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `POST /api/admin/test-modules` - Create test module
- `GET /api/admin/test-modules` - Get all test modules
- `PUT /api/admin/test-modules/:id` - Update test module
- `DELETE /api/admin/test-modules/:id` - Delete test module

### Test Routes
- `GET /api/test/available` - Get available tests
- `POST /api/test/start/:testId` - Start a test
- `GET /api/test/attempt/:attemptId` - Get test attempt details
- `POST /api/test/answer/:attemptId` - Save answer
- `POST /api/test/submit/:attemptId` - Submit test
- `GET /api/test/result/:attemptId` - Get test result

### User Routes
- `GET /api/user/history` - Get test history
- `GET /api/user/stats` - Get user statistics

## License

MIT