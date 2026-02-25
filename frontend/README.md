# Learning Management System (LMS)

A full-stack Learning Management System built with React + Vite frontend and Spring Boot backend.

## Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **ESLint** - Code quality and consistency

### Backend
- **Spring Boot** - Java-based framework for building production-ready applications
- **Spring MVC** - Web framework for RESTful APIs
- **Spring Data JPA** - Database access and ORM
- **Spring Security** - Authentication and authorization
- **Maven/Gradle** - Dependency management and build automation

## Spring Boot Features

Spring Boot simplifies Java application development by providing:

- **Auto-configuration** - Automatically configures your application based on dependencies
- **Embedded Server** - Runs on embedded Tomcat, no external server needed
- **Production-ready** - Built-in health checks, metrics, and monitoring
- **Dependency Management** - Starter dependencies for quick setup
- **RESTful APIs** - Easy creation of REST endpoints with annotations
- **Database Integration** - Seamless connection to SQL/NoSQL databases
- **Security** - Built-in authentication and authorization mechanisms

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
# or with Gradle: ./gradlew bootRun
```

## Vite Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Uses Babel for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Uses SWC for Fast Refresh
