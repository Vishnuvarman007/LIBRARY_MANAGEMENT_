# Library Management System (LMS)

A role-based Library Management System built with Spring Boot and React.

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+

## Setup & Run

### 1. Database
Create a MySQL database named `lms_db`.
Ensure your MySQL server is running on `localhost:3306`.
Default credentials configured: `root` / `root`.
Update `backend/src/main/resources/application.properties` if your credentials differ.

### 2. Backend (Spring Boot)
1. Open a terminal in `d:\lms\backend`
2. Run `mvnw spring-boot:run` (or `./mvnw spring-boot:run` on Git Bash/PowerShell)
   - *Note: On first run, it will create necessary tables and seed the Admin user.*

### 3. Frontend (React + Vite)
1. Open a separate terminal in `d:\lms\frontend`
2. Run `npm install` (if not already done)
3. Run `npm run dev`
4. Access the application at `http://localhost:5173`

## Default Credentials
- **Admin**: `admin` / `admin123`
- **Member/Librarian**: Use the "Register" page to create accounts.

## Features
- **Member**: Search books, view borrow history, manage profile.
- **Librarian**: Issue/return books, manage book inventory.
- **Admin**: Manage users, books, and view all system records.
