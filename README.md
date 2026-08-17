# Emphasis Engineering Portal — Developer Guide & Architecture

Welcome to the **Emphasis Engineering Portal** repository. This portal is a modern, high-performance web application built on **Next.js 15 (App Router)** and **React 19**, designed to sell and deliver professional engineering training courses, timed practice tests, and consultation services.

This guide provides a comprehensive roadmap for future developers to understand, maintain, and extend this codebase.

---

## 🚀 Quick Start

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the configuration template to create your local environment file:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and supply your API credentials:
* **`MONGODB_URI`**: MongoDB connection string.
* **`NEXTAUTH_SECRET`**: Random secure string for NextAuth session encryption.
* **`RESEND_API_KEY`**: Resend API key for transaction and contact emails.
* **`STRIPE_SECRET_KEY`**: Stripe Secret Key (e.g., `sk_live_...` or `sk_test_...`).
* **`STRIPE_WEBHOOK_SECRET`**: Stripe webhook signing secret (retrieved from your Stripe Dashboard).
* **`DEV_PANEL_PASSWORD`**: Password to access the database CMS.

### 3. Development Server
Start the Next.js local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

The codebase is structured logically with absolute path aliasing using the `@/` prefix (configured in `tsconfig.json`).

```
src/
├── app/                    # Next.js App Router (Routes, Layouts, API endpoints)
│   ├── api/                # REST API Endpoints (stripe webhooks, auth, admin control)
│   ├── courses/            # Course listings and secure video viewer pages
│   ├── practice-tests/     # Practice exams and timed standardize simulator
│   ├── services/           # Technical consulting packages descriptions
│   └── dashboard/          # Student portal and intake scheduler
├── components/             # Reusable UI widgets and custom sections
│   ├── layout/             # Global layout elements (Navbar, Footer, Switchers)
│   ├── sections/           # Modular page layout blocks (Hero banners, Funnels)
│   ├── pages/              # Primary page rendering views
│   ├── dev/                # Database CMS panel subcomponents
│   └── forms/              # Structured modals (e.g. ServiceIntakeForm)
├── context/                # Global React State Providers (Cart, Currency context)
├── lib/                    # Shared backend connectors (MongoDB, Stripe, Resend)
├── models/                 # Strict Mongoose ODM schemas for MongoDB collections
└── data/                   # Copywriting definitions and static courses definitions
```

---

## 💳 Core Checkout & Stripe Webhook Pipeline

### 1. Stripe Checkout
When a user clicks purchase on a course, test, or service, a POST request is made to `/api/checkout` passing the cart items and the active currency code. This initiates a **Stripe Checkout Session** with purchase metadata:
```typescript
metadata: {
  userId: session.user.id,
  itemIds: JSON.stringify(itemIds),
  itemDetails: JSON.stringify(itemDetails),
}
```

### 2. Webhook Processing (`/api/webhook/stripe`)
Stripe triggers the webhook at `/api/webhook/stripe` upon payment completion (`checkout.session.completed`).
The route securely parses the event, connects to MongoDB, and performs these sequential actions:
1. **Access Grant**: Updates the user's `purchasedContent` list using `$addToSet` (prevents double entry).
2. **Order Registration**: Creates a permanent record in the `Order` collection for accounting.
3. **Service Activation**: If the purchase includes a service package, it automatically initializes a blank record in the `ServiceBooking` collection.
4. **Automated Onboarding Emails**: Calls the Resend service to dispatch emails to both the Student and the Instructor.

### 🛡️ Double Processing & Re-run Protection
To prevent duplicate webhook calls (which occur if Stripe retries a delivery), the `Order` model enforces a unique index on the `stripeSessionId` field:
```typescript
stripeSessionId: { type: String, unique: true, sparse: true }
```
When a duplicate hook fires:
* `Order.create()` fails due to a MongoDB Duplicate Key Error.
* The error is caught, and execution for that event gracefully stops.
* **This prevents artificial double-counting of revenue and stops duplicate welcome emails from being sent to the student.**

---

## 🔒 Content Security & Locking Mechanisms

### 1. Secure Vimeo Video Player
* **Frontend (`CourseDetail.tsx`)**:
  * For premium lessons, the client component checks `isPurchased(course.id)`.
  * If locked, a **Content Locked** card overlays the video player.
  * If unlocked, it calls the backend secure endpoint `/api/lessons/[lessonId]` to retrieve the video source.
* **Backend (`/api/lessons/[lessonId]/route.ts`)**:
  * Resolves the lesson in the DB and checks the active user's session (`getServerSession(authOptions)`).
  * Validates if `purchasedContent` contains the parent `courseId`.
  * Returns the Vimeo ID **only if authorized**, rendering it impossible to scrape video identifiers by inspecting the frontend HTML source.

### 2. Practice Test Lockouts
* **Frontend (`PractiseTestPage.tsx`)**:
  * Checks if the test is free (`test.isFree`) or purchased.
  * Premium tests block starting states and render a purchase modal redirection.
  * Timed attempts are strictly stored in local storage to prevent users from bypassing timer guidelines via page refresh.

---

## 🗺️ Global Dynamic Pricing & Geolocation

* **Auto Geolocation (`CurrencyContext.tsx`)**:
  * On a user's first visit, the client queries `ipapi.co/json` to determine their country and auto-assigns their local currency: **CAD (Base)**, **USD**, **GBP**, or **AED**.
* **Exchange Rates Caching**:
  * Queries real-time currency conversion rates via `open.er-api.com/v6/latest/CAD`.
  * Rates are cached in `sessionStorage` (valid for 24 hours) to eliminate redundant external API queries and keep page loading extremely fast.
* **Pricing Formatting**:
  * Global functions `formatPrice(priceInCAD)` and `convertPrice(priceInCAD)` instantly output properly formatted localized currencies on the frontend and send correct currencies during checkout.

---

## 👑 The Admin Control Panel

The admin dashboard (`/admin`) is a premium interface for managing business transactions. Access is strictly guarded at the server level via NextAuth check: `role === 'admin'`.

### 1. Sales & Revenue Monitoring
* **Global Market Analytics**: Displays live totals in **CAD** and automatically aggregates sales metrics dynamically by geographic region (Canada, United Kingdom, United States, and Other Regions) for clean financial tracking.

### 2. Service Bookings & Intake Review
* When a student buys a service, they fill out their scheduling form via their Student Dashboard.
* The Admin Dashboard displays these details under **Service Bookings**, showcasing timeline requirements, timezone, city, WhatsApp, and phone details so the instructor can instantly initiate the consultation.

### 3. Vouchers & Coupons Engine
* Generate single-use or multi-use discount codes directly from the admin panel.
* Select the **percentage off** and specify the **category scope** (Services Only, Courses Only, or Practice Tests Only).
* Vouchers are validated at `/api/vouchers/validate` during checkout and automatically marked as `isUsed: true` on successful purchase.

### 4. Direct Product Access Granting
* A robust utility enabling the admin to manually grant or revoke product access to any student.
* In **Registered Users**, locate the student, click **Grant Access**, select the Course, Service Package, or Practice Test, and click add. Access is instantly active on the student's dashboard.

### 5. Enquiry Center
* Live inbox that pulls contact form submissions directly from the website database, allowing admins to read, sort, and directly reply to customer queries.

---

## ⚡ The Developer CMS Panel (`/dev-panel`)

The developer panel is a custom built administrative portal used to manage course lists, upload videos, edit blogs, and manage testimonials in real-time.

* **Credentials Guard**: Logins check `DEV_PANEL_USERNAME` and `DEV_PANEL_PASSWORD` from `.env.local` to issue a dynamic, secure cookie header (`x-dev-token`).
* **Request Validation**: All API routes in `/api/dev/*` import the `verifyDevAuth` validator. Requests without a valid base64 encrypted session token are instantly rejected as `401 Unauthorized`.
* **Integrated Media Uploads**: Integrated with Cloudinary to handle drag-and-drop course thumbnails and image uploads cleanly.

---

## ✉️ Automated Email Communications

Emails are dispatched through Resend using clean HTML templates defined in `src/lib/email-service.ts`.

1. **Student Purchase Welcome**:
   * Custom templates dynamically render instructions depending on what was bought:
     * *Courses:* Links directly to "Access Video Modules".
     * *Practice Tests:* Explains the timed rules and links to the simulator.
     * *Services:* Urgently requests the student to complete their intake details.
2. **Instructor Alert**:
   * Instantly alerts the team at `engineeringemphasis@gmail.com` with a detailed order invoice containing student contact info, purchased items list, and payment totals.
3. **Contact Enquiry Form**:
   * Forwards user comments instantly to `engineeringemphasis@gmail.com` so enquiries can be handled promptly.

---

## 🛠️ Code Maintenance & Extension Guide

This section outlines how future developers can safely introduce new features, add products, or modify key settings.

### 1. How to Add a New Course
To list and sell a new course on the platform, complete these two steps:
1. **Define static data**: Add the new course details in [`src/data/courses.ts`](./src/data/courses.ts). Follow the existing object structure, supplying unique values for `id` (e.g., `'course-id-slug'`), `title`, `price`, `curriculum`, and `lessons` arrays.
2. **Setup Videos in DB**: Lessons are loaded securely from MongoDB. Create a document in your database's `lessons` collection for each premium lesson matching the course schema, mapping the `lessonId` exactly to the ID in the static `courses.ts` file, and supplying its secure `vimeoId`.

### 2. How to Add a New Practice Test
Tests can be added directly via the **Developer Panel UI** or database seeders:
1. **Schema Check**: All practice tests correspond to the Mongoose schema inside [`src/models/PracticeTest.ts`](./src/models/PracticeTest.ts).
2. **Creation Options**:
   * *Via UI (Recommended):* Navigate to `/dev-panel` -> **Practice Tests**, click **New Test**, fill in title, duration, and price, then use the bulk CSV/JSON question importer to upload questions instantly.
   * *Via Seeder:* Insert documents matching the schema (`testId`, `title`, `questions` containing `question`, `options`, `correctAnswer`, and `explanation`) directly into MongoDB.

### 3. How to Add a New Premium Service
To launch a new engineering consultation or coaching service:
1. **Define Metadata**: Open [`src/data/services.ts`](./src/data/services.ts) and add your service package to the list. Make sure to define its unique package `id` values.
2. **Configure Checkout Rules**: Ensure that your product's checkout item maps its type property exactly to `'service'`. The Stripe webhook (`/api/webhook/stripe`) reads this property, and if it is `'service'`, it automatically schedules the service, registers booking entries, and notifies the instructor.

### 4. How to Alter Email Templates
To update the visual appearance, copywriting, or structure of transactional emails (e.g., student welcomes, purchase receipts, or instructor alert summaries):
* Open [`src/lib/email-service.ts`](./src/lib/email-service.ts).
* Modify the inline HTML blocks inside `studentMessage` or `instructorMessage` in the `sendPurchaseEmails` function.
* Use inline CSS styles only, as email clients do not support standard headers or external Tailwind sheets.

### 5. How to Support a New Currency
To expand checkout and dynamic pricing to a new currency (e.g., Euro `EUR` or Indian Rupee `INR`):
1. **Add Currency Config**: Open [`src/context/CurrencyContext.tsx`](./src/context/CurrencyContext.tsx).
2. **Update Code Type**: Add the new currency code to the `CurrencyCode` union type:
   ```typescript
   export type CurrencyCode = 'CAD' | 'USD' | 'GBP' | 'AED' | 'EUR';
   ```
3. **Register Details**: Add the currency details, display symbol, country flag SVG URL, and a default exchange rate fallback into the static `CURRENCIES` configuration map.
   ```typescript
   EUR: { code: 'EUR', symbol: '€', label: 'EUR', flag: 'https://flagcdn.com/eu.svg', rate: 0.68 }
   ```
   *The dynamic rates module will automatically request daily exchange rates for your newly registered currency from the live API during runtime!*

### 6. How to Expand the Dev Panel CMS (`/dev-panel`)
If you need to introduce management features for a new content type (e.g., adding an "Events" or "Vouchers" tab to the Developer CMS):
1. **Create the Manager UI**: Write a new management panel inside `src/components/dev/` (e.g. `EventsManager.tsx`).
2. **Register Tab**: Open [`src/components/pages/DevPanel.tsx`](./src/components/pages/DevPanel.tsx) and add a new item to the `TABS` array with an ID, icon, and display name.
3. **Mount Component**: Render the manager in the main `<main>` container of `DevPanel.tsx`:
   ```tsx
   {activeTab === "events" && <EventsManager headers={headers} uploadFile={uploadFile} />}
   ```
4. **Build Secure Endpoint**: Create the corresponding endpoint folder at `src/app/api/dev/events/route.ts` and protect it using `verifyDevAuth(request)` to ensure only verified developer sessions can trigger DB writes.
