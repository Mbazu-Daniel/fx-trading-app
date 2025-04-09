
# FX Trading Application

A robust FX trading platform built using **NestJS**, **TypeORM**, and **MySQL**. This application provides a solid foundation for handling currency exchange operations, user management, wallets, and trade transactions.

----------

## 🚀 Getting Started

### 📦 Installation

This project uses **pnpm** for dependency management. To get started:

```
pnpm install
```

### 🛠️ Running the Application

```
pnpm run start:dev
```

After starting the server, navigate to:

```
http://localhost:9000/docs
```

This opens the **Swagger API documentation**.

----------

## 🌍 Environment Configuration

Create a `.env` file in the root directory and populate it with the following:

```
PORT=9000
NODE_ENV=development

DB_HOST=localhost
DB_NAME=trading
DB_USERNAME=root
DB_PASSWORD=password

ACCESS_SECRET="your_jwt_secret_here"
ACCESS_EXPIRES_IN="10d" # In production, use "15m"

SMTP_EMAIL="info@your-domain-name.com"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-password"

EXCHANGE_RATE_API_KEY="your_api_key_here"
EXCHANGE_RATE_BASE_URL="https://v6.exchangerate-api.com/v6"
```

> 🔐 **Gmail SMTP App Password:**
>
> Your normal Gmail password **will not work**. Go to [Google App Passwords](https://myaccount.google.com/apppasswords), generate a password by selecting an app name, and use it as your `SMTP_PASSWORD`.

----------

## ✉️ Email Verification

When you call the `/auth/register` endpoint, a verification email is sent.

> 📬 **Note:** Check your spam folder if it's not in your inbox.

----------

## Testing with Swagger UI

1. When you click the **"Authorize"** button in Swagger, **only paste the token**, without including the "Bearer" prefix.

    ✅ **Correct:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

    ❌ **Wrong:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...`

----------

## ⚙️ Automatic Setup on Server Start

Upon application initialization:

1. **Database connection is initialized** to support transactions.

2. **Base currencies (USD & NGN)** are created if they don’t exist.

3. **Exchange rates** are fetched and cached from the external API.

----------

## 🔐 Key Assumptions

- Authentication is handled via **JWT tokens**

- User roles include **regular users** and **admins**

- The system supports **multiple currencies**

- Users can have **multiple wallets** (one per currency)

- **Exchange rates** can change over time

- All **transactions and trades** are tracked and have statuses: `pending`, `completed`, `failed`

----------

## 🏗️ Architectural Summary

The application follows a layered, maintainable NestJS architecture:

### 📂 Controllers

- Handle HTTP requests/responses

- Organized by domain: **Currency**, **Wallet**, **Transaction**, **Exchange Rate**

### ⚙️ Services

- Contain domain-specific **business logic**

- Rely on repositories and other services as needed

### 🗄️ Repositories

- Handle **database operations**

- Extend a common `BaseRepository` for shared CRUD logic

- Add domain-specific queries

### 🧱 Entities

- Represent the core **data models** using TypeORM

- Includes: `User`, `Currency`, `Wallet`, `Transaction`, `Trade`

### 📤 DTOs

- Used to **validate and shape incoming data**

- Separate DTOs for **creation** and **updates**

----------

## 🔑 Key Architectural Decisions

- Clear **separation of concerns** using a service-repository pattern

- Domain-driven design with **well-defined entity boundaries**

- Fully **RESTful API** structure

- **JWT-based authentication** with **role-based guards**

- **Transactional processes** for critical operations like currency trades

----------

## 📈 Scalability & Maintainability

This architecture is designed to support future enhancements such as:

- Admin panels

- Audit logs

- Notifications

- External API integrations

- Performance optimizations

----------

Made with ❤️ by Daniel Mbazu
