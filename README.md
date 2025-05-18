# Anime Mart - Anime Merchandise Store

## 📌 Project Overview

Anime Mart is a full-stack Anime Merchandise Store application with user authentication, product management, category management, and inventory management. It features a secure authentication system using JWT and a responsive front-end built with React Native.

## 🚀 Features

* User Authentication (Signup, Login) using JWT.
* Manage Products, Categories, and Inventory.
* Secure password hashing with bcrypt.
* Interactive user interface in React Native.
* RESTful API with Node.js and Express.
* MySQL database with migrations using Knex.

---

## 🛠️ Setup Instructions

### 📌 Backend Setup

1. **Clone Repository:**

   ```bash
   git clone <repository_url>
   cd backend
   run install express sql sql2 cors knex dotenv
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**

   * Create a `.env` file in the root directory.
   * Add the following variables:

     ```env
     PORT=3000
     JWT_SECRET=your_jwt_secret
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=anime_app
     ```

4. **Run Migrations:**

   ```bash
   npx knex migrate:latest
   ```

5. **Start Server:**

   ```bash
   npm start
   ```

### 📌 Frontend Setup

1. **Navigate to Frontend Directory:**

   ```bash
   cd anime-mart
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Application:**

   ```bash
   npx react-native run-android
   ```

---

## 📋 Sample User Credentials

* **Email:** [testuser@example.com](mailto:testuser@example.com)
* **Password:** password123

---

## ⚡ Database Migration Instructions

1. **Ensure Knex is installed:**

   ```bash
   npm install knex -g
   ```

2. **Run Migrations:**

   ```bash
   npx knex migrate:latest
   ```

3. **Rollback Migrations (if needed):**

   ```bash
   npx knex migrate:rollback
   ```

---

## 🌐 Postman Collection Import Steps

1. **Open Postman.**
2. **Click on Import.**
3. **Select Import File.**
4. **Choose the Postman Collection file .**
5. **Access all predefined API requests.**
