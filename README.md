# Weather Clothing App

This project is a fullstack application that provides clothing recommendations based on the current weather. The application is built using Node.js and Express for the backend API, and it uses MongoDB as the database. The frontend domain is accessible at https://www.weather2023.mooo.com/#/, and the backend API can be accessed at https://api.weather2023.mooo.com/items.

## Features

- User authentication (login and signup)
- CRUD operations on clothing items
- Clothing items displayed based on the current weather
- Users can like and dislike clothing items
- Rate limiting and logging of requests and errors

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RandyPol/se_project_express.git
```

2. Install the required packages:

```bash
cd se_project_express
npm install
```

3. Create a `.env` file in the root directory and set the required environment variables:

```bash
JWT_SECRET=Add your JWT secret here
MONGODB_URI=mongodb://localhost:27017/weather_clothing_db
```

4. Start the server:

```bash
npm start
```

Or start the server in development mode with hot-reloading:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `/signin`: Login an existing user (post)
- `/signup`: Create a new user account (post)

### User

- `/users/me`: Get the current user's information (get)
- `/users/me`: Update the current user's information (put)

### Clothing Items

- `/items`: Get all clothing items (get)
- `/items`: Create a new clothing item (post)
- `/items/:itemId`: Delete a clothing item (delete)
- `/items/:itemId/likes`: Like a clothing item (put)
- `/items/:itemId/likes`: Dislike a clothing item (delete)

## Accessing the Deployed Application

You can access the deployed frontend application at https://www.weather2023.mooo.com/#/.

To access the backend API, you can send requests to https://api.weather2023.mooo.com/items.

For example, to get all clothing items:

```bash
curl https://api.weather2023.mooo.com/items
```

*Note that some endpoints may require authentication. In that case, you will need to include the `Bearer` token in the `Authorization` header.