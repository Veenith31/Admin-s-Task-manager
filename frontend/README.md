# Task Distribution System - MERN Stack Application

A comprehensive task distribution system built with the MERN stack that allows administrators to manage agents and efficiently distribute tasks among them through CSV file uploads.

## 🚀 Features

### Admin User Management
- **Secure Login**: JWT-based authentication system
- **User Dashboard**: Real-time statistics and quick actions
- **Admin-only Access**: Role-based access control

### Agent Management
- **Create Agents**: Add agents with name, email, mobile number, and password
- **Agent Listing**: View all agents with their status and task assignments
- **Agent Details**: Individual agent profiles with task history
- **Agent Status**: Active/Inactive status management

### Task Distribution System
- **CSV Upload**: Support for CSV, XLSX, and XLS file formats
- **Automatic Distribution**: Equal distribution of tasks among active agents
- **File Validation**: Comprehensive validation for file format and content
- **Drag & Drop**: Modern file upload interface with drag-and-drop support

### Task Management
- **Task Tracking**: Monitor all tasks with filtering and search capabilities
- **Status Updates**: Update task status (Pending, In Progress, Completed)
- **Agent Assignment**: View which agent is assigned to each task
- **Task Analytics**: Real-time statistics and progress tracking

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Next.js** framework
- **React Hooks** for state management
- **Axios** for API communication
- **React Toastify** for notifications
- **CSS Modules** and styled-jsx for styling

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Multer** for file uploads
- **CSV Parser** and **XLSX** for file processing
- **bcryptjs** for password hashing

### Security & Performance
- **Helmet** for security headers
- **CORS** configuration
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **Error Handling** middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/task-distribution-system.git
cd task-distribution-system
2. Backend Setup
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
Backend Environment Variables (.env):

NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mern_task_distribution

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Admin User Configuration (for initial setup)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
3. Frontend Setup
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit the .env.local file
nano .env.local
Frontend Environment Variables (.env.local):

BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
4. Database Setup
Option A: Local MongoDB
Install MongoDB Community Edition
Start MongoDB service:
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
Option B: MongoDB Atlas (Cloud)
Create account at MongoDB Atlas
Create a new cluster
Get connection string and update MONGODB_URI in .env
5. Initialize Admin User
# From backend directory
cd backend
node createAdmin.js
This will create an admin user with the credentials specified in your .env file.

🏃‍♂️ Running the Application
Development Mode
Terminal 1 - Backend Server
cd backend
npm run dev
The backend server will start on http://localhost:5000

Terminal 2 - Frontend Server
cd frontend
npm run dev
The frontend application will start on http://localhost:3000

Production Mode
Backend
cd backend
npm start
Frontend
cd frontend
npm run build
npm start
📱 Usage Instructions
1. Admin Login
Navigate to http://localhost:3000
Click "Get Started" or go directly to /login
Use the default admin credentials:
Email: admin@example.com
Password: admin123
2. Agent Management
Go to "Manage Agents" from the dashboard
Click "Add New Agent" to create agents
Fill in: Name, Email, Mobile Number (with country code), Password
View, edit, or delete agents as needed
3. Upload CSV Files
Go to "Upload CSV File" from the dashboard
Prepare your CSV file with these exact headers:
FirstName (Required)
Phone (Required)
Notes (Optional)
Drag and drop the file or click to browse
Click "Upload and Distribute Tasks"
4. Task Management
Go to "View All Tasks" to see distributed tasks
Filter by status, agent, or search by name/phone
Update task status using the dropdown
View task distribution statistics
📊 CSV File Format
Your CSV file must have the following structure:

FirstName,Phone,Notes
John Doe,+1234567890,Contact about product inquiry
Jane Smith,+1987654321,Follow up on previous discussion
Mike Johnson,+1122334455,New customer onboarding
Requirements:

FirstName: Text field (Required)
Phone: Phone number (Required)
Notes: Additional information (Optional)
File types: CSV, XLSX, XLS
Maximum file size: 10MB
Tasks are automatically distributed equally among active agents
🔧 API Endpoints
Authentication
POST /api/auth/login - User login
GET /api/auth/me - Get current user
GET /api/auth/logout - User logout
Agents
GET /api/agents - Get all agents
POST /api/agents - Create new agent
GET /api/agents/:id - Get agent by ID
PUT /api/agents/:id - Update agent
DELETE /api/agents/:id - Delete agent
Tasks
GET /api/tasks - Get all tasks (with filtering)
GET /api/tasks/:id - Get task by ID
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task
POST /api/tasks/upload - Upload CSV and distribute tasks
🔒 Security Features
JWT Authentication: Secure token-based authentication
Password Hashing: bcrypt for secure password storage
Rate Limiting: Prevents API abuse
CORS Configuration: Controlled cross-origin requests
Input Validation: Comprehensive validation for all inputs
File Upload Security: Validates file types and sizes
Role-based Access: Admin-only access to sensitive operations
🐛 Troubleshooting
Common Issues
1. MongoDB Connection Error
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Make sure MongoDB is running on your system.

2. JWT Secret Error
Error: JWT_SECRET is not defined
Solution: Make sure you have created the .env file with the JWT_SECRET variable.

3. File Upload Not Working
Check:

File format is CSV, XLSX, or XLS
File size is under 10MB
CSV has the correct headers (FirstName, Phone, Notes)
4. Frontend Can't Connect to Backend
Check:

Backend server is running on port 5000
Frontend .env.local has correct NEXT_PUBLIC_API_URL
No firewall blocking the ports
Reset Application
# Stop all servers
# Delete uploads folder (backend)
rm -rf backend/uploads

# Reset database (if using local MongoDB)
mongo
use mern_task_distribution
db.dropDatabase()

# Recreate admin user
cd backend
node createAdmin.js
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request