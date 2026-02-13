# Hand2Hand - A Scribe Support System for Inclusive Examinations

A comprehensive MERN stack web application connecting students with disabilities to volunteer scribes/writers for examinations.

## Project Structure

```
hand2hand/
├── backend/          # Node.js + Express REST API
├── frontend/         # React.js Application (Students & Volunteers)
└── admin/           # React.js Admin Panel
```

## Features

### Student Features
- Register/Login with role selection
- Create and manage profile (disability type, location, education)
- Create exam requests with detailed requirements
- Search and filter volunteers by location, subject, and qualification
- Track request status in real-time
- View assigned volunteer details

### Volunteer Features
- Register/Login as volunteer
- Create comprehensive profile (education, subjects, languages, availability)
- View incoming requests from students
- Accept or reject exam requests
- View assigned exams with student details
- Track completed exams

### Admin Features
- Secure admin login
- Dashboard with statistics and charts
- User management (view, filter, delete users)
- Volunteer verification system
- View all requests with filters
- Generate reports and monitor activity

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Nodemailer for email notifications
- CORS enabled

### Frontend (Students & Volunteers)
- React 18
- React Router v6
- Context API for state management
- Axios for API calls

### Admin Panel
- React 18
- React Router v6
- Chart.js with react-chartjs-2 for analytics
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/hand2hand
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Admin Panel Setup

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the admin panel:
```bash
npm start
```

The admin panel will be available at `http://localhost:3000` (or another port if 3000 is already in use)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user

### Student Routes (`/api/students`)
- `POST /profile` - Create student profile
- `GET /profile` - Get student profile
- `PUT /profile` - Update student profile
- `GET /volunteers` - Get volunteers with filters
- `POST /requests` - Create exam request

### Volunteer Routes (`/api/volunteers`)
- `POST /profile` - Create volunteer profile
- `GET /profile` - Get volunteer profile
- `PUT /profile` - Update volunteer profile
- `GET /requests` - Get pending requests
- `PUT /requests/:id/respond` - Accept/reject request
- `GET /assigned-exams` - Get assigned exams

### Request Routes (`/api/requests`)
- `GET /` - Get user's requests
- `GET /:id` - Get single request
- `PUT /:id/cancel` - Cancel request

### Admin Routes (`/api/admin`)
- `GET /users` - Get all users
- `PUT /volunteers/:id/verify` - Verify volunteer
- `GET /requests` - Get all requests
- `GET /statistics` - Get dashboard stats
- `DELETE /users/:id` - Delete user

## Database Models

### User
- name, email, password (hashed), role (student/volunteer/admin)
- phone, isVerified, timestamps

### Student
- userId reference
- disabilityType, disabilityDetails
- location (city, state, pincode)
- educationLevel, institution, rollNumber

### Volunteer
- userId reference
- education (degree, institution, year)
- subjects array, languages array
- location, availability array
- experience, rating, completedExams
- isVerified, documents array

### Request
- studentId reference, volunteerId reference
- examDetails (subject, date, time, duration, type, venue)
- requiredQualification, specialRequirements
- status (pending/accepted/rejected/completed/cancelled)
- timestamps

## Security Features

- JWT-based authentication with secure tokens
- Password hashing using bcrypt (10 salt rounds)
- Protected routes with authentication middleware
- Role-based access control
- CORS configuration for secure cross-origin requests
- Input validation on both client and server

## Email Notifications

The system sends email notifications when:
- A volunteer accepts a request
- A volunteer rejects a request

Configure your email service in the backend `.env` file.

## Default Admin Account

To create an admin account, register a new user with role "admin":

```javascript
// Using the API directly or create manually in MongoDB
{
  "name": "Admin User",
  "email": "admin@hand2hand.com",
  "password": "your_secure_password",
  "role": "admin",
  "phone": "1234567890"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please email support@hand2hand.com or create an issue in the repository.