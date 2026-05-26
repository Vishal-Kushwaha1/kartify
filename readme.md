# Kartify 🛒

Kartify is a modern, full-stack E-Commerce platform built with cutting-edge technologies. It features robust user authentication, product management (seller and buyer roles), shopping cart, secure payment gateways, and order management.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Shadcn UI
- **State Management:** Redux Toolkit
- **Forms & Validation:** React Hook Form, Zod
- **Routing:** React Router v7
- **Payments:** Razorpay, Stripe

### Backend
- **Runtime:** Node.js, Express
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** Better-Auth (Email/Password & Google OAuth)
- **Image Storage:** Cloudinary
- **Emails:** Resend
- **File Uploads:** Multer

---

## 🛠️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A PostgreSQL database (Neon recommended)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/kartify.git
cd kartify
```

### 2. Backend Setup
Navigate to the `Server` directory:
```bash
cd Server
npm install
```

Create a `.env` file in the `Server` directory and configure the following variables:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_postgres_connection_string

# Authentication (Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

# Image Upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_PUBLISH_KEY=your_stripe_publish_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Run the backend server:
```bash
npm run dev
```
*(The backend runs on `http://localhost:3000`)*

### 3. Frontend Setup
Open a new terminal and navigate to the `Frontend` directory:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory with required environment variables (like your backend URL and Stripe public key):
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

Run the frontend app:
```bash
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

---

## 🏗️ Project Structure
- **/Frontend:** Contains all React components, pages, Redux slices, and UI assets.
- **/Server:** Contains the Express server, Drizzle schemas, Better-Auth config, API routes, and database logic.
- **ER-Diagrame.svg:** The Entity Relationship diagram of the database schema.

---

## 🛡️ Authentication
Kartify uses **Better-Auth** for comprehensive authentication, supporting both traditional Email/Password login and Google OAuth out-of-the-box. Roles (`user`, `seller`, `admin`) are natively supported.

## 💳 Payments
Integrated with **Razorpay** and **Stripe** for processing secure checkout experiences.

## 📸 Media Storage
Product images are uploaded through the backend using **Multer** and directly stored in **Cloudinary**.

---

## 🌐 Deployment
The project is configured for deployment on **Vercel** with provided `vercel.json` configurations in both frontend and backend directories.
- Frontend deployed as a standard Vite SPA.
- Backend deployed as Vercel Serverless Functions (`@vercel/node`).
