# 🚀 CodeSnippet App

**CodeSnippet** is a community-driven platform that provides thousands of curated code snippets across multiple programming languages.
It allows developers to **discover, share, and manage code snippets efficiently** with features like user authentication, role-based access, and an admin dashboard.

## ✨ Features

- 🔐 **Authentication & Security**

  - JWT-based login & registration
  - Google OAuth integration
  - Role-based access (User & Admin)

- 📚 **Code Snippets**

  - Browse snippets by **language** or **category**
  - View snippet details (code, description, demo links, preview images)
  - Syntax highlighting with **PrismJS**
  - Snippet **views tracking**

- ⚡ **Admin Panel**

  - Manage programming languages
  - Manage categories
  - Add / Edit / Delete snippets
  - Manage users (admin only)

- 🎨 **UI & UX**

  - Responsive modern design with **Tailwind CSS**
  - Reusable React components
  - Real-time notifications via **React Hot Toast**

---

## 🛠️ Tech Stack

### Backend

- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables
- **CORS** for cross-origin requests
- **Appwrite SDK** (additional backend services)

### Frontend

- **React 18+** with **Vite**
- **React Router DOM** (client-side routing)
- **Tailwind CSS** (styling)
- **React Icons** & **Lucide React** (icons)
- **PrismJS** (syntax highlighting)
- **React Hot Toast** (notifications)
- **Google OAuth** (login)

---

## 📂 Project Structure

### Backend

```
Backend/
│── server.js          # Main Express server
│── models/            # Mongoose schemas (User, Snippet, Category, Language)
│── routes/            # API route handlers
│── middleware/        # Authentication & role-based access
│── seed.js            # Initial database seeding
│── seedAdmin.js
│── seedCategories.js
```

### Frontend

```
Frontend/
│── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # Global state management (React Context API)
│   ├── pages/         # Client & Admin pages
│   ├── utils/         # Utility functions (auth, Appwrite)
│── public/            # Static assets
│── vite.config.js     # Vite configuration
```

---

## ⚙️ Installation & Setup

### Backend

1. Navigate to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Create a `.env` file:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start server:

   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `Frontend` directory:

   ```bash
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open browser → [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints

| Method | Endpoint             | Description                           | Access |
| ------ | -------------------- | ------------------------------------- | ------ |
| POST   | `/api/auth/register` | Register new user                     | Public |
| POST   | `/api/auth/login`    | User login                            | Public |
| GET    | `/api/languages`     | Get all programming languages         | Public |
| GET    | `/api/categories`    | Get all categories                    | Public |
| GET    | `/api/snippets`      | Get all snippets                      | Public |
| GET    | `/api/snippets/:id`  | Get snippet details + increment views | Public |
| GET    | `/api/users`         | List all users                        | Admin  |
| POST   | `/api/snippets`      | Create a new snippet                  | Admin  |
| PUT    | `/api/snippets/:id`  | Update snippet                        | Admin  |
| DELETE | `/api/snippets/:id`  | Delete snippet                        | Admin  |

---

## 💻 Usage

- Browse and explore snippets without logging in.
- Register/Login to save favorites and access user-specific features.
- Admins can access the **Admin Dashboard** to manage snippets, categories, languages, and users.

---

## 🔮 Future Improvements

- 🔎 Advanced search & filtering for snippets
- ⭐ Favorite & bookmark snippets
- 💬 Commenting & discussion on snippets
- 📈 Analytics dashboard for snippet insights
- 🌍 Multi-language support (i18n)
- 📤 Export/import snippets as JSON/YAML

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**(Kartik_Developer)**
💌 Feel free to contribute, open issues, or suggest features!
