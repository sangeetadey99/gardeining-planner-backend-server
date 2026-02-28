# Gardening Planner Backend Server

## Project Overview

The Gardening Planner Backend Server is a comprehensive REST API that powers the Gardening Planner application. It provides robust backend services for managing gardens, plants, tasks, journal entries, and community features. The server is built with Node.js and Express, using Supabase as the database backend for efficient data management and real-time capabilities.

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **Supabase** - Backend-as-a-Service providing PostgreSQL database and real-time features
- **JWT (JSON Web Tokens)** - For secure authentication and authorization
- **bcryptjs** - For password hashing and security
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management
- **UUID** - For generating unique identifiers
- **Axios** - HTTP client for external API calls

## API Documentation

### Base URL
```
https://gardeining-planner-backend-server.onrender.com/api
```

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Plant Management Endpoints
- `GET /api/plants` - Get all plants for authenticated user
- `POST /api/plants` - Add a new plant
- `GET /api/plants/:id` - Get specific plant details
- `PUT /api/plants/:id` - Update plant information
- `DELETE /api/plants/:id` - Delete a plant

### Task Management Endpoints
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task details
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

### Journal Endpoints
- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Create a new journal entry
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Garden Layout Endpoints
- `GET /api/garden` - Get garden layouts
- `POST /api/garden` - Create garden layout
- `PUT /api/garden/:id` - Update garden layout
- `DELETE /api/garden/:id` - Delete garden layout

### Pest Management Endpoints
- `GET /api/pest` - Get pest information
- `POST /api/pest` - Report pest issue
- `GET /api/pest/:id` - Get specific pest details

### Seasonal Information Endpoints
- `GET /api/seasonal` - Get seasonal gardening tips
- `GET /api/seasonal/:season` - Get tips for specific season

### Weather Endpoints
- `GET /api/weather` - Get weather information for gardening
- `GET /api/weather/location` - Get weather for specific location

### Harvest Management Endpoints
- `GET /api/harvest` - Get harvest records
- `POST /api/harvest` - Record new harvest
- `PUT /api/harvest/:id` - Update harvest record

### Tips Endpoints
- `GET /api/tips` - Get gardening tips
- `GET /api/tips/:category` - Get tips by category

### Community Features Endpoints
- `GET /api/community` - Get community posts
- `POST /api/community` - Create community post
- `GET /api/community/:id` - Get specific post
- `POST /api/community/:id/like` - Like a post
- `POST /api/community/:id/comment` - Comment on a post

## Database Schema Explanation

The application uses Supabase PostgreSQL database with the following main tables:

### Users Table
- `id` (UUID) - Primary key
- `email` (VARCHAR) - User email (unique)
- `name` (VARCHAR) - User display name
- `avatar_url` (TEXT) - Profile picture URL
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Plants Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `name` (VARCHAR) - Plant name
- `type` (VARCHAR) - Plant type/category
- `sunlight` (VARCHAR) - Sunlight requirements
- `watering_frequency` (VARCHAR) - Watering schedule
- `planted_date` (DATE) - When plant was added
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Journal Entries Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `plant_id` (UUID) - Foreign key to plants table (nullable)
- `note` (TEXT) - Journal entry content
- `created_at` (TIMESTAMP) - Entry creation timestamp

### Tasks Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `plant_id` (UUID) - Foreign key to plants table (nullable)
- `task_type` (VARCHAR) - Type of task (watering, pruning, etc.)
- `due_date` (DATE) - Task due date
- `status` (VARCHAR) - Task status (pending, in_progress, completed)
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Garden Layouts Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `name` (VARCHAR) - Garden layout name
- `layout_data` (JSON) - Garden layout configuration
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Additional Tables
- `pest_management` - For tracking pest issues and solutions
- `harvest_records` - For tracking harvest yields
- `community_posts` - For user community interactions
- `seasonal_tips` - For seasonal gardening advice

## Installation Steps

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sangeetadey99/gardeining-planner-backend-server.git
   cd gardeining-planner-backend-server/gardeining-backend-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://gardeining-planner-frontend.netlify.app/
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in the Supabase SQL Editor
   - Configure authentication settings in Supabase dashboard

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## Deployment Link

**Backend API**: https://gardeining-planner-backend-server.onrender.com

### Deployment Information
- **Platform**: Render
- **Environment**: Production
- **Database**: Supabase PostgreSQL
