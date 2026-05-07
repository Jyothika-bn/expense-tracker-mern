# MySQL Database Setup Guide

This guide will help you set up MySQL as the backend database for the Task Manager application.

## Prerequisites

1. **MySQL Server** - Install MySQL Server 8.0 or later
2. **MySQL Workbench** (optional) - For database management GUI

## Installation Steps

### 1. Install MySQL Server

**Windows:**
- Download MySQL Installer from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Run the installer and choose "Server only" or "Full" installation
- Set root password during installation (use `password` or update `application.properties`)

**macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database

Connect to MySQL and run the setup script:

```bash
# Connect to MySQL as root
mysql -u root -p

# Run the setup commands
source database/setup.sql
```

Or manually create the database:

```sql
CREATE DATABASE IF NOT EXISTS taskmanager 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE taskmanager;
```

### 3. Configure Application

The application is already configured to use MySQL with these settings in `application.properties`:

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=password

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 4. Update Database Credentials

If your MySQL setup uses different credentials, update `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

## Database Schema

The application will automatically create these tables:

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    due_date DATETIME,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure MySQL server is running
   - Check if port 3306 is available

2. **Access denied**
   - Verify username and password in `application.properties`
   - Ensure user has proper privileges

3. **Database doesn't exist**
   - Run the setup.sql script
   - Or manually create the database

4. **Timezone issues**
   - The connection string includes `serverTimezone=UTC`
   - Adjust if needed for your timezone

### Useful Commands

```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL service
sudo systemctl start mysql

# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use taskmanager database
USE taskmanager;

# Show tables
SHOW TABLES;

# View table structure
DESCRIBE users;
DESCRIBE tasks;
```

## Security Recommendations

For production environments:

1. **Create dedicated database user:**
```sql
CREATE USER 'taskmanager_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON taskmanager.* TO 'taskmanager_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update application.properties:**
```properties
spring.datasource.username=taskmanager_user
spring.datasource.password=secure_password
```

3. **Enable SSL:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager?useSSL=true&serverTimezone=UTC
```

## Data Persistence

Unlike H2 (in-memory database), MySQL provides:
- **Persistent data storage** - Data survives application restarts
- **Production readiness** - Suitable for production environments
- **Better performance** - Optimized for concurrent access
- **Backup capabilities** - Easy to backup and restore data

Your task manager application is now ready for production use with MySQL backend!
