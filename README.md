# LogiSmart - Enterprise Logistics & Fleet Management System

LogiSmart is a modern, comprehensive logistics and fleet management solution designed to streamline operations, track shipments, manage vehicle maintenance, and handle financial transactions. The system is built using a robust .NET 9 backend following Clean Architecture principles and a responsive React frontend.

## 🏗️ Architecture

The project is divided into two main parts: a **Backend API** and a **Frontend SPA**.

### Backend (.NET 9)
Built using **Clean Architecture** to ensure separation of concerns, maintainability, and testability:
- **LogiSmart.Core**: Contains domain entities (`User`, `Vehicle`, `Trip`, `MaintenanceLog`, `Invoice`), enums, and core interfaces.
- **LogiSmart.Application**: Contains business logic, service implementations (`AuthService`, `TripService`, `VehicleService`), and Data Transfer Objects (DTOs).
- **LogiSmart.Infrastructure**: Handles data access using **Entity Framework Core** with **SQL Server**, repositories, and database migrations.
- **LogiSmart.API**: The entry point of the backend, exposing RESTful endpoints, handling JWT Authentication, and providing Swagger documentation.

### Frontend (React + Vite)
A modern single-page application (`logismart-ui`) built with:
- **React 19** & **Vite** for fast development and optimized builds.
- **React Router** for navigation.
- **Axios** for API communication.

---

## 🚀 Key Features by Role

LogiSmart implements strict **Role-Based Access Control (RBAC)** with dedicated dashboards for different stakeholders:

### 👑 Administrator
- Full user management (Create, Update, Delete users).
- System monitoring and configuration.

### 🛠️ Operations Manager
- Fleet management (Add/Update vehicles).
- Trip scheduling and driver assignments.
- Operational performance tracking.

### 🚛 Driver
- View assigned trips.
- Update trip status (Pending, InTransit, Completed, Cancelled).
- Log mileage and route progress.

### 🔧 Maintenance Technician
- Monitor vehicle health.
- Log maintenance activities (Oil changes, repairs, etc.).
- Schedule preventative maintenance.

### 💰 Finance Specialist
- Generate and manage invoices for trips.
- Track payments and financial reporting.

### 👥 Customer
- Track shipments and trip status.
- View invoices and billing history.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** .NET 9.0
- **Database:** Microsoft SQL Server
- **ORM:** Entity Framework Core
- **Security:** JWT (JSON Web Tokens) for secure API access
- **Documentation:** Swagger (Swashbuckle)

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Routing:** React Router

---

## 📁 Project Structure

```
LogiSmart/
├── LogiSmart.API/            # ASP.NET Core Web API
├── LogiSmart.Application/    # Business Logic & Services
├── LogiSmart.Core/           # Domain Entities & Interfaces
├── LogiSmart.Infrastructure/ # EF Core & Data Access
├── logismart-ui/             # React Frontend Application
└── LogiSmart.sln             # Visual Studio / Rider Solution
```

---

## 🏁 Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/) (LocalDB or full instance)

### 1. Backend Setup
1. Navigate to the API directory or open the solution in your IDE (Rider/Visual Studio).
2. Update the connection string in `LogiSmart.API/appsettings.json` to point to your SQL Server instance.
3. Apply database migrations:
   ```bash
   dotnet ef database update --project LogiSmart.Infrastructure --startup-project LogiSmart.API
   ```
4. Run the backend:
   ```bash
   dotnet run --project LogiSmart.API
   ```
5. Access the Swagger UI at `http://localhost:{port}/swagger` (check console for port).

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd logismart-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the API base URL in `.env` if necessary.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License
This project is private and intended for internal use.
