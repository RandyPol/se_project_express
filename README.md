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
