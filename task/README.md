# Task Manager - Spring Boot Application

A simple and intuitive task management web application built with Spring Boot, Thymeleaf, and Bootstrap.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, and Delete tasks
- 🏷️ **Task Properties**: Title, description, status, priority, and due date
- 🔍 **Search & Filter**: Search by keywords and filter by status or priority
- 📱 **Responsive Design**: Modern Bootstrap UI that works on all devices
- 🎨 **Visual Indicators**: Color-coded priority levels and status badges
- ⏰ **Date Tracking**: Creation and update timestamps

## Task Properties

- **Title**: Required field for task identification
- **Description**: Optional detailed description
- **Status**: TODO, IN_PROGRESS, DONE
- **Priority**: LOW, MEDIUM, HIGH (with color coding)
- **Due Date**: Optional deadline
- **Timestamps**: Automatic creation and update tracking

## Technology Stack

- **Backend**: Spring Boot 3.1.0
- **Frontend**: Thymeleaf + Bootstrap 5.1.3
- **Database**: MySQL 8.0+ (Production-ready persistent storage)
- **Security**: Spring Security 6 with BCrypt encryption
- **Build Tool**: Maven
- **Java Version**: 17

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL Server 8.0 or higher

### Running the Application

1. **Set up MySQL Database**
   - Install MySQL Server 8.0+
   - Create database: `CREATE DATABASE taskmanager;`
   - Update credentials in `application.properties` if needed
   - See `MYSQL_SETUP.md` for detailed instructions

2. **Clone or navigate to the project directory**
   ```bash
   cd task-manager
   ```

3. **Run the application using Maven**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - Main Application: http://localhost:8080
   - Login/Register to start using the task manager
   - All data is now persistently stored in MySQL

## Usage

### Adding Tasks
1. Fill out the "Add New Task" form on the left sidebar
2. Enter a title (required) and optional description
3. Select priority level and due date
4. Click "Add Task"

### Managing Tasks
- **Edit**: Click the dropdown menu (⋮) on any task card and select "Edit"
- **Delete**: Click the dropdown menu and select "Delete" (with confirmation)
- **View**: All tasks are displayed as cards with visual status indicators

### Filtering and Searching
- **Search**: Use the search bar to find tasks by title or description
- **Filter by Status**: Use the status dropdown to filter tasks
- **Filter by Priority**: Use the priority dropdown to filter tasks
- **Clear Filters**: Click "Clear Filters" to reset all filters

## Project Structure

```
src/
├── main/
│   ├── java/com/example/taskmanager/
│   │   ├── TaskManagerApplication.java     # Main application class
│   │   ├── controller/
│   │   │   └── TaskController.java         # Web controller
│   │   ├── model/
│   │   │   └── Task.java                   # Task entity
│   │   ├── repository/
│   │   │   └── TaskRepository.java         # Data access layer
│   │   └── service/
│   │       └── TaskService.java            # Business logic
│   └── resources/
│       ├── application.properties          # Configuration
│       └── templates/
│           ├── index.html                  # Main page
│           └── edit-task.html             # Edit task page
└── pom.xml                                # Maven configuration
```

## API Endpoints

- `GET /` - Main task list page
- `POST /tasks` - Create a new task
- `GET /tasks/{id}/edit` - Edit task form
- `POST /tasks/{id}` - Update task
- `POST /tasks/{id}/delete` - Delete task
- `GET /tasks/search?keyword=` - Search tasks
- `GET /tasks/filter?status=&priority=` - Filter tasks

## Development Notes

- The application uses H2 in-memory database, so data is reset on restart
- For production, configure a persistent database in `application.properties`
- The application includes Bootstrap and Font Awesome via CDN
- All timestamps are automatically managed by the application

## Future Enhancements

- User authentication and authorization
- Task categories/tags
- File attachments
- Email notifications
- Task assignment to users
- Dashboard with analytics
- Export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
