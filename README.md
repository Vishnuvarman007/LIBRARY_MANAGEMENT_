# 📚 Librario – Smart Library Management System

## 📖 Project Overview
**Librario** is a full-stack, role-based **Library Management System** designed to modernize and automate library operations for institutions, colleges, and organizations. The platform provides secure and efficient management of books, members, subscriptions, requests, and library analytics through a modern web interface.

The system follows a **decoupled architecture** using a **React frontend** and a **Spring Boot backend**, communicating through secure REST APIs.

---

# 🚀 Features

## 🔐 Role-Based Access Control (RBAC)

### 👨‍💼 Admin
- Manage librarians and members
- Approve or reject registrations
- Monitor system-wide records
- Manage complete book inventory
- View analytics and reports

### 📚 Librarian
- Issue and return books
- Handle renewal and reservation requests
- Manage physical inventory
- Process book requests
- Monitor active borrowings

### 👨‍🎓 Member / Student
- Search books instantly
- View borrowing history
- Manage memberships
- Request unavailable books
- Track issued books and due dates

---

# ✨ Advanced Features

## 🔔 Real-Time Notification System
- Admin notifications for registrations and approvals
- Librarian alerts for returns, renewals, and requests
- Interactive notification tray integrated into dashboards

## 💳 Membership Payment Integration
- Secure subscription payments using Razorpay
- Backend payment verification
- Membership upgrade and cancellation support

## 🤖 Smart Support Chatbot
- User-aware chatbot accessible globally
- Functional assistance without interrupting workflow

## 📊 Analytics Dashboard
- Borrowing trends
- Active users overview
- Book usage statistics
- Monthly activity reports

## 🔍 Smart Search
- Advanced filtering by:
  - Title
  - Author
  - Category
  - ISBN

## 📱 QR / RFID Ready
- Designed for future QR and RFID integration
- Faster check-in/check-out support

---
<img width="1862" height="882" alt="image" src="https://github.com/user-attachments/assets/d92f46ac-abbc-4805-878e-28e3963aae4e" />
<img width="1858" height="901" alt="image" src="https://github.com/user-attachments/assets/2a73d353-4e8b-43ec-8ece-b1092030f552" />


# 🛠️ Technology Stack

## Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Development |
| Vite | Fast build tool |
| React Router DOM | Client-side routing |
| Recharts | Analytics charts |
| React Icons | Icons/UI |
| JavaScript ES6+ | Programming language |

---

## Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.2.3 | Backend framework |
| Java 17 | Core programming language |
| Spring Data JPA | ORM layer |
| Hibernate | Entity management |
| MySQL | Database |
| Lombok | Boilerplate reduction |
| Spring Validation | Request validation |
| Spring Mail | Email notifications |

---

# 🏗️ System Architecture

```text
React Frontend
       ↓
REST APIs
       ↓
Spring Boot Backend
       ↓
MySQL Database
```

---

# 🔑 Authentication Features
- Secure Login & Registration
- Forgot Password
- Change Password
- Protected Routes
- Role-Based Authorization

---

# 📂 Major Modules

## 📚 Book Management
- Add / Update / Delete books
- ISBN tracking
- Inventory management
- Category organization

## 👥 Member Management
- Registration handling
- Membership approval
- Profile management

## 🔄 Issue & Return
- Book issue tracking
- Return processing
- Auto fine calculation
- Due date reminders

## 📨 Book Requests
- Missing book requests
- Approval workflow
- Reservation handling

---

# ⚙️ Installation & Setup

## 🔹 Clone Repository
```bash
git clone <repository-url>
cd librario
```

---

# 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

## Configure Database
Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/librario
spring.datasource.username=root
spring.datasource.password=your_password
```

## Run Backend
```bash
cd backend
mvn spring-boot:run
```

Backend runs on:
```text
http://localhost:8080
```

---

# 📡 REST API Features
- Authentication APIs
- Book Management APIs
- User Management APIs
- Membership APIs
- Payment APIs
- Notification APIs

---

# 🔮 Future Enhancements
- AI-based book recommendation system
- RFID integration
- Mobile application
- Multi-library support
- Cloud deployment
- RAG-based smart library assistant

---

# 📸 Screenshots
- Landing Page
- Features Dashboard
- Analytics Panel
- Membership Portal
- Admin Dashboard

---

# 👨‍💻 Developed By
**Vishnu Varman P**  
B.Tech Computer Science Engineering  
R.M.K. Engineering College

---

# 📜 License
This project is developed for educational and portfolio purposes.
