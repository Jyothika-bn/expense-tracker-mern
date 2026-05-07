# Task Manager - Project Structure Documentation

## Complete Project Directory Structure

```
taskmanager/
├── src/
│   ├── main/
│   │   ├── java/com/example/taskmanager/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java                 # Spring Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java                 # Authentication (login/register)
│   │   │   │   ├── DashboardController.java            # Main dashboard and task operations
│   │   │   │   └── ProfileController.java              # User profile management
│   │   │   ├── model/
│   │   │   │   ├── User.java                          # User entity with JPA annotations
│   │   │   │   ├── Task.java                          # Task entity with relationships
│   │   │   │   ├── TaskStatus.java                    # Enum: TODO, IN_PROGRESS, DONE
│   │   │   │   └── TaskPriority.java                  # Enum: LOW, MEDIUM, HIGH
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java                # User data access layer
│   │   │   │   └── TaskRepository.java                # Task data access with custom queries
│   │   │   ├── service/
│   │   │   │   ├── UserService.java                   # User business logic
│   │   │   │   ├── TaskService.java                   # Task business logic
│   │   │   │   └── CustomUserDetailsService.java     # Spring Security integration
│   │   │   └── TaskManagerApplication.java            # Main Spring Boot application class
│   │   └── resources/
│   │       ├── static/                                # Static web assets (CSS, JS, images)
│   │       ├── templates/                             # Thymeleaf HTML templates
│   │       │   ├── login.html                         # User login page
│   │       │   ├── register.html                      # User registration page
│   │       │   ├── dashboard.html                     # Main task dashboard
│   │       │   ├── profile.html                       # User profile management
│   │       │   └── edit-task.html                     # Task editing form
│   │       └── application.properties                 # Application configuration
│   └── test/
│       └── java/com/example/taskmanager/             # Unit and integration tests
├── database/
│   └── setup.sql                                     # MySQL database setup script
├── target/                                           # Maven build output
│   └── taskmanager-0.0.1-SNAPSHOT.jar              # Executable JAR file
├── pom.xml                                          # Maven project configuration
├── README.md                                        # Project documentation
├── PROJECT_REPORT.md                               # Detailed project report
├── PROJECT_STRUCTURE.md                            # This file - project structure
├── MYSQL_SETUP.md                                  # MySQL installation guide
├── mvnw                                            # Maven wrapper (Unix)
└── mvnw.cmd                                        # Maven wrapper (Windows)
```

## File Descriptions

### Configuration Files

**SecurityConfig.java**
- Configures Spring Security authentication
- Sets up login/logout endpoints
- Defines password encoding (BCrypt)
- Manages session security

### Controllers

**AuthController.java**
- Handles user registration and login
- Manages authentication flows
- Redirects authenticated users to dashboard

**DashboardController.java**
- Main application controller
- Handles task CRUD operations
- Manages search and filter functionality
- Provides task statistics

**ProfileController.java**
- User profile viewing and editing
- Password change functionality
- Profile update validation

### Models/Entities

**User.java**
- JPA entity for user data
- Validation annotations for form inputs
- One-to-many relationship with tasks
- BCrypt password storage

**Task.java**
- JPA entity for task data
- Many-to-one relationship with user
- Status and priority enums
- Automatic timestamp tracking

**TaskStatus.java & TaskPriority.java**
- Enum classes for task properties
- Used in forms and database storage

### Repository Layer

**UserRepository.java**
- JPA repository interface
- Custom queries for user lookup
- Username and email uniqueness checks

**TaskRepository.java**
- JPA repository interface
- User-specific task queries
- Search and filter methods

### Service Layer

**UserService.java**
- User registration and management
- Profile update operations
- Password change logic

**TaskService.java**
- Task CRUD operations
- User-specific task filtering
- Search functionality

**CustomUserDetailsService.java**
- Spring Security integration
- User authentication details
- Database user lookup

### Templates

**login.html**
- Bootstrap-styled login form
- Error message display
- Registration link

**register.html**
- User registration form
- Form validation
- Password confirmation

**dashboard.html**
- Main application interface
- Task statistics display
- Task cards with actions
- Search and filter forms

**profile.html**
- User profile display
- Profile edit form
- Password change form

**edit-task.html**
- Task editing interface
- Form pre-population
- Status and priority selection

### Configuration Files

**application.properties**
- Database connection settings
- JPA/Hibernate configuration
- Server port and Thymeleaf settings

**pom.xml**
- Maven project dependencies
- Spring Boot parent configuration
- Build plugins and properties

## Architecture Overview

### Layered Architecture
1. **Presentation Layer**: Controllers and Thymeleaf templates
2. **Service Layer**: Business logic and validation
3. **Repository Layer**: Data access and persistence
4. **Model Layer**: Entity classes and data structures

### Security Architecture
- Spring Security for authentication
- BCrypt password encryption
- Session-based security
- User-specific data isolation

### Database Architecture
- MySQL relational database
- JPA/Hibernate ORM mapping
- Foreign key relationships
- Automatic schema generation

## Key Features Implementation

### Authentication System
- Form-based login/logout
- User registration with validation
- Password encryption and verification
- Session management

### Task Management
- CRUD operations with user isolation
- Status and priority management
- Search and filter capabilities
- Real-time statistics

### User Interface
- Responsive Bootstrap design
- Interactive task cards
- Form validation feedback
- Mobile-friendly layout

## Development Workflow

1. **Entity Design**: Define data models and relationships
2. **Repository Layer**: Create data access interfaces
3. **Service Layer**: Implement business logic
4. **Controller Layer**: Handle HTTP requests and responses
5. **Template Design**: Create user interface with Thymeleaf
6. **Security Configuration**: Set up authentication and authorization
7. **Testing**: Verify functionality and security
8. **Deployment**: Package and deploy application

This structure follows Spring Boot best practices and provides a scalable, maintainable codebase for the Task Manager application.
