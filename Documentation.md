# Stamp2Fly Documentation

## 1. Project Overview

Stamp2Fly is a visa application and travel services platform built as a full-stack web application. The project is organized as a monorepo with two main parts:

- Frontend: user-facing website and dashboard
- Backend: REST API, authentication, application processing, and data management

The platform is designed to support:

- visa requirement information and destination-based search
- user application submission workflow
- uploaded travel documents and financial supporting files
- admin management for visa-related content and applications
- FAQ, blog, and contact modules
- secure authentication with Firebase/phone login and JWT-based session flow

---

## 2. High-Level Architecture

The app follows a standard client-server architecture:

- Frontend (React + Vite) renders the public website and admin screens
- Backend (Express + MongoDB) provides API endpoints and business logic
- MongoDB stores users, applications, countries, FAQs, blogs, and checklist data
- Cloudinary stores uploaded document and image files
- Firebase handles authentication identity and user login verification
- Nodemailer sends contact form emails

---

## 3. Tech Stack

### 3.1 Frontend Stack

- React 18
  - main UI framework for all pages and components
- Vite
  - fast frontend build and local dev server
- React Router DOM
  - routing for public pages, dashboard, and admin sections
- Tailwind CSS
  - utility-first styling system for layout and components
- Framer Motion
  - page and component animations
- Axios
  - API communication with backend
- React Helmet / React Helmet Async
  - page title and metadata management
- Lucide React
  - icon system
- Radix UI primitives
  - accessible dialog, dropdown, select, tabs, checkbox, etc.
- Recharts
  - analytics/dashboard charts
- Leaflet + React Leaflet
  - map display integration
- React Quill
  - rich text editor for blog content management
- Firebase SDK
  - frontend authentication and login support
- jsPDF
  - document generation support
- DOMPurify
  - sanitizing rich text / HTML content

### 3.2 Backend Stack

- Node.js
  - JavaScript runtime for the server
- Express 5
  - API framework and middleware layer
- MongoDB
  - primary database
- Mongoose
  - ODM for schema definitions and MongoDB queries
- JWT (jsonwebtoken)
  - stateless authentication for app sessions
- Firebase Admin SDK
  - server-side token verification for Firebase-authenticated users
- Cloudinary
  - media upload and storage
- Multer
  - multipart form upload handling
- Nodemailer
  - email sending for contact form notifications
- CORS
  - cross-origin API access configuration
- dotenv
  - environment variable loading
- bcrypt / bcryptjs
  - password hashing support and auth utilities

### 3.3 Development Tools

- Nodemon
  - automatic server restart during backend development
- ESLint
  - code quality checks in frontend
- PostCSS
  - CSS processing
- Autoprefixer
  - vendor prefix handling
- Prettier
  - formatting support

---

## 4. Project Structure

### Root

- frontend/
  - React application
- backend/
  - Express API and MongoDB logic
- Documentation.md
  - this project documentation file

### Frontend Structure

- src/App.jsx
  - main router and protected route logic
- src/pages/
  - landing page, application page, legal/FAQ pages, admin dashboard, blog pages, contact page, etc.
- src/components/
  - reusable UI, sections, and admin views
- src/contexts/
  - VisaContext, ApplicationContext, FaqContext, AuthContext-style state management
- src/api/
  - backend API wrappers (axios clients and domain-specific endpoints)
- src/services/
  - payment abstraction service
- src/constants/
  - static country, FAQ, and app configuration data
- src/assets/
  - images and static assets

### Backend Structure

- src/app.js
  - Express app setup and route registration
- src/index.js
  - server startup and DB connection
- src/db/index.js
  - MongoDB connection helper
- src/controllers/
  - application, auth, blog, FAQ, contact, admin logic
- src/routes/
  - API route definitions by feature
- src/models/
  - Mongoose schemas for User, Application, FAQ, Blog, Checklist, Country, etc.
- src/middlewares/
  - file upload and auth middleware
- src/utils/
  - Cloudinary, mailer, upload pipelines, Firebase admin config, OTP generation

---

## 5. Main Features Implemented

### 5.1 Public Website

The frontend includes a user-facing website with sections like:

- Hero section and landing page
- About page
- Services page
- Pricing page
- Contact page
- FAQ page
- Blog listing and blog detail pages
- consultation flow
- WhatsApp CTA and contact support patterns
- visa requirement search UI

### 5.2 Visa Application Flow

The application module handles:

- creating a visa application draft
- storing traveler data and travel dates
- country selection and occupation details
- sponsorship and financial information
- payment status and payment tracking metadata
- dynamic/custom fields for application forms
- message threads between user and admin joined to each application
- document upload workflow for passports and financial documents
- application submission validation against checklist requirements

### 5.3 Document Upload and Storage

- uploaded files are accepted through Multer middleware
- files are transferred to Cloudinary
- returned URLs are stored in the MongoDB application document
- supported document categories include:
  - passport front image
  - passport back image
  - passport photo
  - financial support documents

### 5.4 Authentication and Authorization

The system supports:

- Firebase-based user login verification
- JWT token issuance after successful auth
- user role tracking: user, team, super_admin
- protected routes for authenticated users and admin-only access
- admin dashboard gated by authentication and role rules

### 5.5 Admin Dashboard

The admin area provides management for:

- dashboard overview
- application viewing and updates
- visa management
- form field management
- checklists
- FAQs
- blogs
- user management
- roles and permissions

This dashboard is a central content and operations management portal for the business.

### 5.6 Blog System

The project includes a complete blog module:

- create blog posts
- update and delete blog posts
- optional publish/draft status
- SEO-friendly URL slug generation
- cover image upload via Cloudinary
- excerpt and rich content support
- public blog listing and detail pages

### 5.7 FAQ System

FAQ management includes:

- global FAQs and country-specific FAQs
- query filtering by country or global scope
- replacement of FAQ collections for admin editing
- FAQ tags
- ordering support

### 5.8 Contact and Communication

- contact form submission from frontend
- backend validation of email and message content
- mail sending through SMTP via Nodemailer
- support for configured receiver email and reply-to handling

### 5.9 Country and Checklist Management

The backend and admin tools support:

- country record CRUD
- checklist creation per country
- category-based requirements such as base and occupation-specific checklist items
- validation before application submission to ensure required documents exist

---

## 6. Data Models

### User Model

Stores:

- name
- email
- phone number
- role
- auth provider
- Google ID
- OTP and expiry fields
- verification state

### Application Model

Stores complete visa application details including:

- userId
- status
- personal and travel information
- marital status, occupation, sponsorship
- country and travel date range
- payment status and payment metadata
- document URLs
- financial details and uploaded docs
- dynamic form fields
- user/admin message threads
- timestamps

### Blog Model

Stores:

- title
- slug
- excerpt
- content
- cover image
- tags
- author data
- publish status
- publication date

### FAQ Model

Stores:

- question
- answer
- tags
- countryId
- global flag
- display order

### Country and Checklist Data

These modules support country-specific visa content and requirement validation logic.

---

## 7. Authentication and Security Design

The project combines modern frontend and server-side security patterns:

- Firebase token validation on server for authentication
- JWT tokens issued after user login
- role-based route protection on the frontend
- data access restrictions implemented in application logic
- input validation for contact form and application actions
- Cloudinary upload handling for document storage
- CORS enabled for frontend API access

---

## 8. External Services Used

- Firebase Authentication
- Cloudinary media storage
- MongoDB Atlas or self-hosted MongoDB instance
- SMTP email server for contact mail

---

## 9. Environment and Configuration

The app depends on environment variables for configuration, including:

- MongoDB connection string
- JWT secret
- Firebase project config / admin credentials
- Cloudinary credentials
- SMTP host, port, user, password, and sender details
- contact receiver email
- server port

This is typically stored in a .env file in the backend and any related frontend config files.

---

## 10. Typical Development Flow

### Backend

Run the server from the backend folder:

```bash
cd backend
npm install
npm run dev
```

### Frontend

Run the client from the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Vite and runs on port 3000 by default, while the backend typically runs on port 5000 (or process.env.PORT).

---

## 11. What Has Already Been Done

At this stage, the project already includes a substantial working foundation:

- full project skeleton for a visa platform
- public website with multiple pages
- protected admin dashboard
- database models and business logic
- application workflow with document uploads
- user login/authentication integration
- file storage integration
- blog and FAQ editing workflows
- country/checklist infrastructure
- contact email functionality
- modular architecture for future growth

---

## 12. Future Expansion Opportunities

The system is already a strong base for extending into:

- real payment gateway integration (Stripe, Razorpay, etc.)
- stronger admin analytics and reporting
- notification and email workflows for application progress
- multi-language support
- CRM integrations
- automated document review and verification
- SEO content expansion and marketing pages

---

## 13. Summary

Stamp2Fly is a modern visa service platform built with React on the frontend and Express + MongoDB on the backend. The project combines user-facing marketing pages, visa application management, admin operations, media uploads, content management, and authentication into a single workflow designed for visa processing and travel support.

It is a complete MVP-style solution with the core business logic and architecture already in place and ready for extension.
