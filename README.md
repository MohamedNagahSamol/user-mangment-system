# user-mangment-system
api user  mangment system by nodejs and express and mongoose
User Management System API

A secure and scalable RESTful API for managing users, authentication, and authorization.
Built with Node.js, Express, and MongoDB following best backend practices.

---

🚀 Features

- User registration
- Secure login (JWT Authentication)
- Password hashing using bcrypt
- Role-based authorization (Admin / User)
- User profile management
- Update user data
- Delete account
- Reset password via email
- Protected routes middleware
- Error handling system

---

🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- Nodemailer (Email service)
- Dotenv (Environment variables)

---

📁 Project Structure

project/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── app.js

---

⚙️ Installation

git clone https://github.com/your-username/user-management-system.git
cd user-management-system
npm install

---

🔑 Environment Variables

Create a ".env" file in root:

PORT=3000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password

---

▶️ Run Project

npm start

For development:

npm run dev

---

📬 API Endpoints

Auth

- "POST /api/auth/register"
- "POST /api/auth/login"
- "POST /api/auth/forgot-password"
- "POST /api/auth/reset-password/:token"

Users

- "GET /api/users"
- "GET /api/users/:id"
- "PUT /api/users/:id"

---

🔐 Security Practices

- Password hashing
- Token expiration
- Protected routes
- Input validation
- Error handling middleware

---

📌 Future Improvements

- Email verification
- Rate limiting
- Refresh tokens
- API documentation (Swagger)
- Account lock after failed attempts

---

👨‍💻 Author

Developed by Your Name

---

⭐ Contribute

Pull requests are welcome. For major changes, please open an issue first.

---

📄 License

This project is licensed under the MIT License.
