# 📂 Personal Cloud Storage

A full-stack project for uploading, storing, and highlighting PDFs.

##  Features
- Upload & manage PDF files (UUID-based storage in local file system).
- JWT-based authentication (secure login & register).
- MongoDB with Mongoose for data persistence.
- Highlight & annotate PDFs in browser.
- Dark/Light theme support on frontend.
- User dashboard to view and manage uploaded files.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + react-pdf-highlighter
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Auth**: JWT
- **File Storage**: Local file system, each file uniquely identified via UUID

## Screenshots

- ![Home Page](https://github.com/user-attachments/assets/85c12fe1-3f38-47d5-8704-2820ee265ae4)
- ![Login with Forgot Password](https://github.com/user-attachments/assets/89a2588b-fef6-4758-8b12-f55d037dce6c)
- ![Settings with Functionality](https://github.com/user-attachments/assets/709e8eac-40c0-4807-97ab-130d921f79bc)


## 📂 Project Structure
personal_cloud_storage/
│── frontend/ # React + Vite frontend
│── backend/ # Express + MongoDB backend
│── README.md # Root overview

##  Run Locally
```bash
git clone https://github.com/sakshikedari/personal_cloud_storage

### `backend/README.md`
```markdown
# 🖥Backend - PDF Cloud Storage

## ⚙️ Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for file uploads
- UUID for unique file IDs

## 📦 Features
- User registration & login with JWT.
- Upload, fetch, and delete PDFs.
- Store PDF metadata in MongoDB.
- PDFs saved locally in `/uploads` folder with UUID file names.

## Run Backend
```bash
cd backend
npm install
npm start


Runs on: http://localhost:5000


---

### `frontend/README.md`
```markdown
# Frontend - PDF Cloud Storage

## ⚙️ Tech Stack
- React + Vite
- Tailwind CSS
- Axios
- react-pdf-highlighter

## 📦 Features
- Login & Signup (JWT authentication).
- Upload PDFs and view stored files.
- Highlight selected text in PDFs.
- Dark/Light theme toggle.
- Responsive dashboard with file management.

## Run Frontend
```bash
cd frontend
npm install
npm run dev

Runs on: http://localhost:3000

## Key Packages Used

### Backend
- **express** – Web server  
- **mongoose** – MongoDB integration  
- **multer** – File uploads  
- **uuid** – Unique file IDs  
- **jsonwebtoken** – JWT authentication  

### Frontend
- **react** – UI library  
- **react-router-dom** – Routing  
- **tailwindcss** – Styling (dark/light theme support)  
- **react-pdf** – PDF rendering  
- **react-pdf-highlighter** – PDF highlighting  
- **axios** – API requests  
- **lucide-react** – Icons  

