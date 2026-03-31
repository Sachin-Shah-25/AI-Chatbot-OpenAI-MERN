# 🤖 AI Chatbot — Powered by OpenAI & MERN Stack

A full-stack AI-powered chatbot application built with the MERN Stack and OpenAI API. Users can sign up, log in, and have real-time conversations with an AI assistant.

🌐 **Live Demo:** [Click Here](#) <!-- Vercel link yahan daalna -->

---

## ✨ Features

- 🔐 User Authentication (Signup / Login) with JWT
- 🤖 Real-time AI conversation powered by OpenAI API
- 💬 Chat history stored in MongoDB
- 📱 Fully Responsive UI
- 🔒 Secure API key handling via Environment Variables

---

## 📸 Screenshots

### 🔑 Login Page
![Login Page](./assets/login.jpg)

### 📝 Signup Page
![Signup Page](./assets/signup.jpg)

### 💬 Chatbot Interface
![Chatbot](./assets/chatbot.jpg)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | OpenAI API |
| Auth | JWT (JSON Web Token) |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Sachin-Shah-25/AI-Chatbot-OpenAI-MERN.git
cd AI-Chatbot-OpenAI-MERN
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📁 Project Structure

```
AI-Chatbot-OpenAI-MERN/
├── frontend/
│   ├── src/
│   └── public/
├── backend/
│   ├── routes/
│   ├── models/
│   └── index.js
├── assets/
│   ├── login.jpg
│   ├── signup.jpg
│   └── chatbot.jpg
└── README.md
```

---

## 🔒 Environment Variables

Never push your `.env` file to GitHub!
Make sure your `.gitignore` includes:
```
node_modules/
.env
```

---

## 👨‍💻 About the Developer

**Sachin Shah** — Self-taught Full Stack Developer
- No college degree. No formal training. Just code & consistency. 💪
- GitHub: [Sachin-Shah-25](https://github.com/Sachin-Shah-25)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).