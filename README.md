# TaskFlow (Task Management System)

A full-stack web application for managing tasks, teams, and projects. Features include Kanban board, team collaboration (invites/removals), task assignment, comments, priorities, and responsive design.

## Features

-   **User Authentication**: Register and Login securely.
-   **Team Management**: Create teams, Invite members by email, Remove members (Owner only), Delete Teams (Owner only).
-   **Task Management**: Create, Read, Update, Delete tasks.
-   **Kanban Board**: Drag-and-drop style workflow (To Do -> In Progress -> Done).
-   **Direct Assignment**: Assign tasks to specific team members.
-   **Comments**: Discuss tasks with team members.
-   **Responsive Design**: Works on Desktop, Tablet, and Mobile.

## Tech Stack

-   **Frontend**: React (Vite), CSS3
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local installation or Atlas URI)

## Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository_url>
    cd <project_folder>
    ```

2.  **Install Backend Dependencies**:
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd client
    npm install
    cd ..
    ```

## Configuration

1.  Create a `.env` file in the root directory (based on `.env.example` if available), or use the following default:
    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/taskmanager
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```
    *Note: Ensure your MongoDB service is running.*

## Running the Application

To run both Backend and Frontend concurrently (recommended):

```bash
# From the root directory
npm run dev
```

-   **Backend** runs on: `http://localhost:5001`
-   **Frontend** runs on: `http://localhost:5173` (or whatever port Vite selects)

Open your browser and navigate to the frontend URL to start using the app.

## Usage Guide

1.  **Register** a new account.
2.  **Create a Team** in the sidebar.
3.  **Add Tasks** to your team's board.
4.  **Invite Members** by clicking the `+` icon in the Members section (enter valid email of another registered user).
5.  **Assign Tasks** by clicking on a task and selecting an assignee.
6.  **Move Tasks** by clicking the arrow `→` on the card (or implementing drag-and-drop in future versions).
