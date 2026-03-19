# InvoiceFlow - Web Frontend 🖇️

A modern, responsive, and performance-oriented Invoice and Customer Management application built with **Next.js**, **TypeScript**, and **Tailwind CSS**. A key component of the InvoiceFlow ecosystem.

## ✨ Features

- **Dashboard Overview**: Data-rich statistics, revenue collection metrics, and recent activity monitoring.
- **Invoice Management**: 
  - Comprehensive CRUD operations (Create, View, Update, Delete).
  - Status tracking with intuitive visual indicators (Paid, Pending, Overdue).
  - Advanced search by reference, ID, and client name.
- **Customer Directory**: 
  - Centralized management of customer profiles and interactions.
  - Quick-view contact details and transactional history.
- **Modern Responsive Design**: 
  - Optimized for desktops, tablets, and small screens with a mobile-first approach.
  - Built with Tailwind CSS for pixel-perfect aesthetics.
- **Reliable Data Fetching**: Seamlessly integrated with the NestJS backend for real-time CRUD.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Integration**: RESTful Fetch API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A running instance of the [InvoiceFlow Backend](https://github.com/Success1050/invoice-backend).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Success1050/invoice-frontend.git
   cd invoice-app-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Project

```bash
# Development mode
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001).

## ⚙️ Environment Configuration

Ensure your `.env` file points to the running backend service:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔗 Related Repositories
- **Backend (NestJS)**: [invoice-backend](https://github.com/Success1050/invoice-backend)
- **Mobile App (Flutter)**: [invoice-mobile](https://github.com/Success1050/invoice-mobile)

---
*Developed by Emmanuel Success as part of the Full-Stack Developer Assessment.*
