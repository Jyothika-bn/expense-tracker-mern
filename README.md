# Personal Expense Tracker

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for tracking personal expenses with analytics and visualizations.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Management**: Add, edit, delete, and view expenses
- **Categories**: Organize expenses into predefined categories (Food, Transportation, Entertainment, etc.)
- **Filtering & Search**: Filter expenses by category, date range, and pagination
- **Analytics Dashboard**: Visual charts and statistics showing spending patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback with toast notifications

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js & React-Chartjs-2** - Data visualization
- **React DatePicker** - Date selection
- **React Toastify** - Notifications

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**Important**: 
- Replace `your_super_secret_jwt_key_here` with a strong, unique secret key
- If using MongoDB Atlas, replace the MONGODB_URI with your Atlas connection string

### 5. Start MongoDB

If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, ensure your cluster is running and accessible.

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
npm run dev
```
This starts the Express server on `http://localhost:5000`

2. **Start the frontend development server:**
```bash
npm run client
```
This starts the React app on `http://localhost:3000`

3. **Run both concurrently (recommended):**
```bash
npm run dev & npm run client
```

### Production Mode

1. **Build the React app:**
```bash
npm run build
```

2. **Start the production server:**
```bash
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (with filtering & pagination)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

## Project Structure

```
expense-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Dashboard/  # Dashboard components
│   │   │   ├── Expenses/   # Expense management
│   │   │   ├── Analytics/  # Charts and analytics
│   │   │   └── Layout/     # Layout components
│   │   ├── context/        # React context (Auth)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                 # Mongoose models
│   ├── User.js
│   └── Expense.js
├── routes/                 # Express routes
│   ├── auth.js
│   └── expenses.js
├── middleware/             # Custom middleware
│   └── auth.js
├── server.js              # Express server
├── package.json
├── .env
└── README.md
```

## Usage Guide

### 1. Registration/Login
- Create a new account or login with existing credentials
- JWT token is stored in localStorage for persistent sessions

### 2. Adding Expenses
- Click "Add Expense" from the navigation or dashboard
- Fill in the expense details (title, amount, category, date, description)
- Choose from predefined categories for better organization

### 3. Managing Expenses
- View all expenses in the "Expenses" section
- Filter by category, date range, or search
- Edit or delete expenses using the action buttons
- Pagination for large expense lists

### 4. Analytics
- View spending patterns in the "Analytics" section
- Filter by year or specific month
- See category-wise breakdowns with charts
- Track spending trends over time

## Features in Detail

### Dashboard
- Quick overview of total expenses
- Recent expenses list
- Top spending categories
- Quick action buttons

### Expense Categories
- Food & Dining
- Transportation
- Entertainment
- Shopping
- Bills & Utilities
- Healthcare
- Education
- Travel
- Other

### Analytics & Charts
- Bar charts showing spending by category
- Pie charts for expense distribution
- Category breakdown with percentages
- Time-based filtering (monthly/yearly)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env file
   - Verify network connectivity for Atlas

2. **JWT Secret Error**
   - Make sure JWT_SECRET is set in .env file
   - Use a strong, unique secret key

3. **Port Already in Use**
   - Change the PORT in .env file
   - Kill any processes using the default ports

4. **Dependencies Issues**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository.
