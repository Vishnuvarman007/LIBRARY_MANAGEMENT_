# LMS Setup Guide - Issues Fixed

## Problems Resolved

### 1. Compilation Errors (58 errors)
**Issue**: Lombok annotations (@Data) were not generating getters/setters
**Solution**: Added maven-compiler-plugin with Lombok annotation processor configuration in pom.xml

### 2. Port Conflict
**Issue**: Port 8080 was already in use
**Solution**: Changed backend server port from 8080 to 8081 in application.properties

### 3. Frontend Connection Error
**Issue**: Frontend was trying to connect to port 8080
**Solution**: 
- Created centralized config file (src/config.js) with API_BASE_URL
- Updated Login.jsx and Register.jsx to use the new configuration

### 4. Form Validation Error
**Issue**: Hidden required file input couldn't be focused for validation
**Solution**: Removed 'required' attribute from hidden file input, validation now handled in JavaScript

## How to Run

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend will run on: http://localhost:8081

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## Configuration Files Modified

1. **backend/pom.xml** - Added Lombok annotation processor
2. **backend/src/main/resources/application.properties** - Changed port to 8081
3. **frontend/src/config.js** - Created centralized API URL configuration
4. **frontend/src/pages/Login.jsx** - Updated to use config
5. **frontend/src/pages/Register.jsx** - Updated to use config and fixed file input validation

## Next Steps

To update remaining API calls in other components:
1. Import `{ API_BASE_URL }` from '../config'
2. Replace `http://localhost:8080` with `${API_BASE_URL}`

Files that still need updating:
- AllBorrowRecords.jsx
- BookSearch.jsx
- IssueBook.jsx
- ManageBooks.jsx
- MyHistory.jsx
- ReturnBook.jsx
- UserDetailModal.jsx
- UserList.jsx
- ChangePassword.jsx
- DashboardHome.jsx
- UserDashboard.jsx
- UserHistory.jsx
- UserLoans.jsx
