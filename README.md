# QuizEase ~ A Quiz Application

## Summary of Features
- **User Authentication**: Register and log in securely.
- **Quiz Functionality**: Users can take quizzes (currently supports one but scalable for more).
- **Leaderboard**: Displays user rankings.
- **Attempt History**: Users can view past scores.
- **Backend APIs**: Additional functionalities like adding questions and quizzes are present, requiring RBAC setup and frontend integration for the admin panel.

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Run Locally
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
    cd quizease
   ```
3. Install dependencies:
   ```
    npm install
    ```
4. Create a .env file in the root directory and add:
   ```
    REACT_APP_API_URL=<your_backend_api_url>
   ```
5. Start the backend:
   ```
    cd backend
    npm run src/server.js

   ```
6. Start the frontend:
   ```
    cd quizease
    npm start
   ```

Additional Functionalities:
  Admin Panel (Pending Integration): API endpoints exist for adding quizzes and questions. Requires RBAC setup and frontend integration.
