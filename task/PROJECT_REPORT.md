# Task Manager System - Project Report

## Project Description

The **Task Manager System** is a secure and user-friendly web application developed to facilitate personal task management digitally. The system provides users with the ability to manage their tasks online, offering a comprehensive solution for personal productivity and organization.

This application includes the following key features:

### 1. User Registration & Authentication:
- New users can register for an account with username, email, first name, last name, and password
- Existing users can securely log in using their credentials
- The system ensures secure authentication with BCrypt password encryption before allowing access to task management functions
- Session management with automatic logout functionality

### 2. User Dashboard:
- After logging in, users are greeted with a personalized dashboard displaying their name and task statistics
- Task statistics include total tasks, completed tasks, in-progress tasks, and pending tasks
- Primary task operations such as Create, Edit, Delete, and Search are accessible from this dashboard
- Visual task cards with color-coded priority and status indicators

### 3. Task Creation & Management:
- Users can create new tasks with title, description, priority level, and due date
- Tasks can be assigned one of three statuses: TODO, IN_PROGRESS, or DONE
- Priority levels include LOW, MEDIUM, and HIGH with visual color coding
- Each task displays creation and update timestamps for tracking purposes

### 4. Task Operations:
- **Create**: Add new tasks with all relevant details
- **Read**: View all tasks in an organized card-based layout
- **Update**: Edit existing tasks including status changes and priority updates
- **Delete**: Remove tasks with confirmation prompts

### 5. Search & Filter Functionality:
- Search tasks by keywords in title or description
- Filter tasks by status (TODO, IN_PROGRESS, DONE)
- Filter tasks by priority level (LOW, MEDIUM, HIGH)
- Clear all filters to view all tasks

### 6. User Profile Management:
- View and update personal profile information
- Change password functionality with current password verification
- Profile update includes first name, last name, and email modification

### 7. Navigation & User Interface:
- The interface is clean, intuitive, and responsive using Bootstrap 5
- Essential links such as "Dashboard", "Profile", and "Logout" are always visible in the navigation bar
- Mobile-friendly design that works across all device sizes

## Technology Stack

- **Backend Framework**: Spring Boot 3.1.0
- **Frontend**: Thymeleaf Template Engine + Bootstrap 5.1.3
- **Database**: MySQL 8.0+ (Production-ready persistent storage)
- **Security**: Spring Security 6 with BCrypt password encryption
- **Build Tool**: Maven 3.6+
- **Java Version**: 17
- **ORM**: Hibernate/JPA for database operations

## Step-by-Step Instructions:

### 1. Create Project Using Spring Initialization:
• Open https://start.spring.io
Choose:
- Project: Maven
- Language: Java
- Spring Boot: 3.1.0 (Latest Stable)
- Group: com.example
- Artifact: taskmanager
- Java: 17

• Click Add Dependencies:
✅ Spring Web
✅ Spring Boot DevTools
✅ Thymeleaf
✅ Spring Data JPA
✅ Spring Security
✅ MySQL Driver
✅ Spring Boot Starter Validation
✅ Spring Boot Starter Test

• Click Generate
• Extract the ZIP and Import into IDE:
• Go to File > Import > Maven > Existing Maven Projects
• Select the folder where you extracted the ZIP.

### 2. Project Structure in IDE

```
taskmanager/
├── src/
│   ├── main/
│   │   ├── java/com/example/taskmanager/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   └── ProfileController.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Task.java
│   │   │   │   ├── TaskStatus.java
│   │   │   │   └── TaskPriority.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── TaskRepository.java
│   │   │   ├── service/
│   │   │   │   ├── UserService.java
│   │   │   │   ├── TaskService.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   └── TaskManagerApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       ├── templates/
│   │       │   ├── login.html
│   │       │   ├── register.html
│   │       │   ├── dashboard.html
│   │       │   ├── profile.html
│   │       │   └── edit-task.html
│   │       └── application.properties
│   └── test/java/com/example/taskmanager/
├── database/
│   └── setup.sql
├── target/
│   └── taskmanager-0.0.1-SNAPSHOT.jar
├── pom.xml
├── README.md
├── MYSQL_SETUP.md
├── mvnw
└── mvnw.cmd
```

### 3. Database Configuration

**MySQL Database Setup:**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS taskmanager 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use database
USE taskmanager;
```

**Application Properties Configuration:**
```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080

# Thymeleaf Configuration
spring.thymeleaf.cache=false
```

### 4. Key Components Implementation

**Security Configuration:**
- Spring Security with form-based authentication
- BCrypt password encoding
- Session management
- CSRF protection disabled for development

**Entity Models:**
- User entity with validation annotations
- Task entity with enum types for status and priority
- JPA relationships between User and Task entities

**Repository Layer:**
- JPA repositories with custom query methods
- User-specific task filtering
- Search functionality implementation

**Service Layer:**
- Business logic separation
- User management services
- Task CRUD operations
- Authentication services

**Controller Layer:**
- MVC pattern implementation
- Request mapping for all endpoints
- Form handling and validation
- Session management

### 5. Features Implementation

**Authentication System:**
- User registration with validation
- Secure login/logout
- Password encryption
- Session management

**Task Management:**
- CRUD operations for tasks
- Status and priority management
- Due date tracking
- User-specific task isolation

**Dashboard Features:**
- Task statistics display
- Visual task cards
- Search and filter functionality
- Responsive design

**Profile Management:**
- User profile viewing
- Profile information updates
- Password change functionality

## Installation and Setup

### Prerequisites:
- Java 17 or higher
- Maven 3.6 or higher
- MySQL Server 8.0 or higher
- IDE (Eclipse, IntelliJ IDEA, or VS Code)

### Setup Steps:

1. **Database Setup:**
   ```bash
   # Start MySQL service
   # Create database using MySQL Workbench or command line
   CREATE DATABASE taskmanager;
   ```

2. **Application Configuration:**
   ```bash
   # Update application.properties with your MySQL credentials
   # Default configuration uses root/root
   ```

3. **Build and Run:**
   ```bash
   # Navigate to project directory
   cd taskmanager
   
   # Build the project
   mvn clean compile
   
   # Run the application
   mvn spring-boot:run
   ```

4. **Access Application:**
   ```
   URL: http://localhost:8080
   - Register new user account
   - Login with credentials
   - Start managing tasks
   ```

## Application Flow

1. **User Registration/Login** → Authentication verification
2. **Dashboard Access** → Display user-specific tasks and statistics
3. **Task Operations** → Create, read, update, delete tasks
4. **Profile Management** → Update user information
5. **Data Persistence** → All data stored in MySQL database

## Security Features

- **Password Encryption**: BCrypt hashing algorithm
- **Session Management**: Spring Security session handling
- **User Isolation**: Users can only access their own tasks
- **Input Validation**: Server-side validation for all forms
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries

## Database Schema

**Users Table:**
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (BCrypt encrypted)
- first_name, last_name
- created_at, updated_at, last_login
- is_active (Boolean)

**Tasks Table:**
- id (Primary Key)
- title, description
- status (ENUM: TODO, IN_PROGRESS, DONE)
- priority (ENUM: LOW, MEDIUM, HIGH)
- created_at, updated_at, due_date
- user_id (Foreign Key to Users)

## Testing

The application can be tested by:
1. Registering multiple user accounts
2. Creating tasks with different priorities and statuses
3. Testing search and filter functionality
4. Verifying user isolation (users see only their tasks)
5. Testing profile update and password change features

## Deployment

The application is production-ready and can be deployed to:
- Local servers
- Cloud platforms (AWS, Azure, Google Cloud)
- Container platforms (Docker, Kubernetes)

## Conclusion

The Task Manager System provides a comprehensive solution for personal task management with modern web technologies, secure authentication, and persistent data storage. The application demonstrates best practices in Spring Boot development, including proper layered architecture, security implementation, and responsive web design.
