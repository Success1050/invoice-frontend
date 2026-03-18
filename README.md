# InvoiceFlow - Web Frontend

A modern, responsive Invoice and Customer Management application built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Objective
Develop a web application that allows users to view, search, and manage a list of invoices and customers through a robust integration with a NestJS backend API.

## 🛠 Technology Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) / Vanilla Global CSS
- **API Integration:** RESTful Fetch API

## ✨ Key Features
- **Dashboard Overview:** Real-time business statistics and quick access to recent activities.
- **Invoice Management:** Full CRUD (Create, Read, Update, Delete) with status tracking (Paid, Pending, Overdue).
- **Customer Database:** Centralized management of customer profiles and contact information.
- **Advanced Search & Filtering:** Instant filtering of lists by name, ID, status, or description.
- **Responsive Detail Views:** Deep-dive into specific records with mobile-optimized layouts.
- **Error Handling:** Graceful API failure handling with user-friendly error messages and loading skeletons.

## 📥 Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js 18.x](https://nodejs.org/) or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Setup & Installation

Follow these steps to get the project running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Success1050/invoice-frontend.git
cd invoice-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The application requires a connection to the [InvoiceFlow Backend](https://github.com/Success1050/invoice-backend).

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and ensure the `NEXT_PUBLIC_API_URL` matches your running backend URL (default is `http://localhost:3000`).

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001) (or your configured port).

## 🔗 Repository Links
- **Backend (NestJS):** [Repository Link](https://github.com/Success1050/invoice-backend)
- **Frontend (Web):** [Repository Link](https://github.com/Success1050/invoice-frontend)
- **Mobile (Flutter):** [Repository Link](https://github.com/Success1050/invoice-mobile)

---
*Created by Emmanuel Success for the Applicant Exercise.*
