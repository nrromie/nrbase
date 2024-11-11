# [NrBase]

A comprehensive database management web application built with the MERN stack, designed to facilitate data collection, visualization, and analysis through customizable tables, real-time analytics, and easy-to-use forms.

## Features

### User Authentication
- **Signup/Login**: Users register with name, photo, email, and password. Google sign-in is also available.
- **Firebase Authentication**: Secure authentication and account management using Firebase Auth.

### Table Creation and Data Management
- **Customizable Tables**: Users can create tables with a variety of field types, including:
  - **Text** with optional `maxlength`.
  - **Number** for quantitative data.
  - **Select (Dropdown)** options specified in a comma-separated list.
  - **Calculation Fields** with formula support for real-time calculations based on other numeric fields.
- **CSV Import**: Populate tables by importing data from CSV files.
- **In-Line Table Editing**: An interactive, spreadsheet-like interface for entering and editing data.
- **Form-Based Data Input**: Data entry via shareable forms that allow others to submit data without needing to log in.

### Dynamic Analytics
- **Single Field Analytics**:
  - Choose a table and numeric field to generate summary metrics (Sum, Avg, Max, Min).
  - Visualized with pie or bar charts.
- **Multi-Field Analytics**:
  - Aggregate data from multiple fields across tables with a dynamic bar chart showing Sum, Avg, Max, Min metrics.
- **Live Updates**: Charts automatically reflect changes in table data, providing an up-to-date overview.

## Tech Stack

- **Frontend**: React and Tailwind CSS for a responsive, modern UI.
- **Backend**: Node.js and Express.js for API development.
- **Database**: MongoDB for flexible data storage.
- **Authentication**: Firebase Auth for secure login.
- **Data Fetching**: TanStack Query for efficient client-server data interaction.

## Project Setup

### Prerequisites
- Node.js and npm installed
- MongoDB set up and running

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root and client folders to configure Firebase, MongoDB, and any necessary API keys.
   ```plaintext
   MONGODB_URI=<Your MongoDB connection string>
   FIREBASE_API_KEY=<Your Firebase API Key>
   ```
   
4. **Run the project**:
   ```bash
   # In the root folder, start the backend server
   npm run server

   # In the client folder, start the frontend
   npm run start
   ```

5. **Access the App**:
   - Navigate to `http://localhost:3000` to access the frontend.
   - Backend server will run on `http://localhost:5000` by default.

## File Structure

```
- client/          # React frontend
  └── src/
      ├── components/  # Reusable components (Table, Form, Analytics)
      ├── pages/       # Page components (Signup, Login, Home, Table)
      ├── hooks/       # Custom hooks for data fetching and form handling
      └── utils/       # Utility functions

- server/          # Node.js backend
  ├── controllers/ # Controller functions for routes
  ├── models/      # MongoDB schemas
  ├── routes/      # Express routes for API endpoints
  └── config/      # Configuration files for database and authentication
```

## Challenges and Solutions

- **Real-Time Data Analytics**: Implemented TanStack Query for efficient data fetching and caching.
- **Dynamic Field Constraints**: Used custom validations to handle multiple field types and constraints.
- **User-Friendly Experience**: Tailwind CSS for rapid UI styling and responsive layouts.

## Future Enhancements

- **Expanded Analytics**: Additional chart types and options for custom configurations.
- **Enhanced Data Collaboration**: Role-based access and secure data-sharing options.
- **Advanced Calculations**: Support for complex formulas and derived fields.