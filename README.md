# Logistics Optimizer
## Problem Statement

Efficient logistics management is a critical challenge for transportation companies. Assigning the right loads to trucks while minimizing costs and maximizing resource utilization requires careful optimization. Traditional manual assignment can be error-prone and time-consuming.

**Problem:**  
- Multiple trucks with different capacities per company.  
- Various shipments with assigned loads.  
- Goal: **Optimize load distribution** to minimize cost and efficiently utilize resources.

## Approach / Solution Overview

This project provides a **web-based logistics optimization system** that allows users to:  

1. Upload shipment data in CSV/XLSX format.  
2. Automatically optimize truck-load assignments using a backend optimization algorithm.  
3. View optimized results on a dashboard with insights like:  
   - Trucks used per company  
   - Cost per company  
   - Resource utilization status  
4. Download optimization reports in CSV or JSON formats.  

**Key Features of the Approach:**  
- **File Upload & Validation:** Only allows CSV/XLSX files.  
- **Optimization Algorithm:** Efficiently assigns loads to trucks while minimizing total cost.  
- **Dashboard Visualization:** Dynamic display of results with company-specific cards.  
- **Download Reports:** Export optimized data for offline analysis.

## Usage / Features

**Features:**

- **Upload Shipment Data:** Users can upload CSV or XLSX files containing truck and load information.  
- **Load Optimization:** The system optimizes load assignments across trucks and companies to reduce overall cost.  
- **Dashboard Visualization:**  
  - View each company's trucks and load utilization.  
  - See which resources are fully utilized or available.  
  - Random motivational quotes for better UX.  
- **Download Reports:** Export the optimized data in CSV or JSON formats.  
- **Responsive UI:** Works on both desktop and mobile devices.  
- **File Validation:** Ensures only CSV/XLSX files are uploaded and displays errors for invalid files.

## Prerequisites

Before running the Logistics Optimizer application, make sure you have the following installed:

- **Node.js** (v16 or above)
- **npm**
- **MongoDB** (local installation or cloud via MongoDB Atlas)
- **React** (for frontend)
- **Postman / any API testing tool** (optional, for testing endpoints)
- A modern browser (Chrome, Firefox, Edge) for frontend usage

## Setup Instructions

Follow these steps to set up the Logistics Optimizer project locally:

1. **Clone the repository**
```bash
git clone <repository_url>
cd FRND Assignment
```

2. **Install backend dependencies**
```bash
cd server
npm install
```
3. **Install frontend dependencies**
```bash
cd client
npm install
```
4. **Configure environment variables**
   create a .env file in server dir
```bash
MONGO_URI=<your_mongo_connection_string>
PORT=5000
JWT_SECRET=<your_jwt_secret>
```

## Steps to Run the Project

1. **Start the Backend Server**
```bash
cd server
npm run dev
```

2. **Start the frontend Server**
```bash
cd client
npm run dev
```

## Database Models / Schemas

### 1. **Company**
- **Fields:**
  - `name` (String, required): Company name
  - `cost` (Number): Cost owe by company
  - `createdAt` (Date, default: now)

### 2. **Truck**
- **Fields:**
  - `truckId` (String, required): Unique truck identifier
  - `capacity` (Number, required): Maximum load capacity
  - `assignedLoad` (Number, default: 0): Current assigned load
  - `company` (ObjectId, ref: Company): Owner company
  - `createdAt` (Date, default: now)

### 3. **Optimization**
- **Fields:**
  - `totalCost` (Number, required): Total cost calculated after optimization
  - `companies` (Array of Objects):
    - `company` (ObjectId, ref: Company): Reference to the company
    - `cost` (Number): Cost earned by the company
    - `originalTruckCount` (Number): Total trucks available in the company
    - `trucksUsed` (Number): Number of trucks used after optimization
    - `stats` (Object):
      - `assigned` (Number): Total assigned load
      - `capacity` (Number): Total truck capacity
      - `utilization` (String): e.g., "75%" utilization
    - `unassignedLoads` (Array of Numbers): Loads not assigned to any truck
    - `optimized` (Array of Objects):
      - `truck` (ObjectId, ref: Truck): Reference to the truck
      - `assigned` (Array of Numbers): Loads assigned to this truck
      - `remaining` (Number): Remaining capacity of the truck
      - `fullyUtilized` (Boolean): Whether the truck is fully utilized
  - `createdAt` (Date, default: now)

### 6. **Explanation of Complex Logic / Algorithms**

The core of the application is the **load optimization algorithm**, which assigns truck loads for multiple logistics companies to minimize unused capacity and calculate costs efficiently.  
This algorithm employs a **Greedy approach** by always assigning the largest available load to the truck with the most remaining capacity at each step.

#### **Algorithm Overview**

1. **Input Data:**
   - `trucks`: List of all trucks with their capacity, assigned load, and company.
   - `totalCost`: Total cost to be distributed among companies.

2. **Per-Company Optimization (`optimizeCompanyLoads`):**
   - Sort the `loads` in descending order to assign larger loads first (greedy selection).
   - Initialize each truck's `assigned` loads array and `remaining` capacity.
   - Use a **Max Priority Queue (Heap)** keyed by remaining capacity to always pick the truck with the most available capacity.
   - For each load:
     - Dequeue the truck with the maximum remaining capacity.
     - If the load fits, assign it and update the remaining capacity.
     - Reinsert the truck into the heap.
     - If the load doesn't fit, it is added to `unassignedLoads`.
   - This ensures **efficient load packing** per company.

3. **Global Optimization (`optimizeLoads`):**
   - Group trucks by `companyId`.
   - Call `optimizeCompanyLoads` for each company.
   - Compute statistics:
     - `assigned`: Total assigned load per company.
     - `utilization`: Percentage of total capacity used.
     - `trucksUsed`: Number of trucks with at least one load.
   - Distribute `totalCost` proportionally based on assigned loads.

4. **Database Update & Population:**
   - Save the optimization result in the `Optimization` collection.
   - Update each truck’s `assignedLoad` and each company’s `cost`.
   - Populate necessary fields for API responses.

#### **Data Structures Used**
- **Arrays:** For trucks, loads, and optimized assignments.
- **Max Priority Queue:** Efficiently finds the truck with the maximum remaining capacity (`O(log n)` insertion and deletion), ensuring better load distribution.

#### **Flow**
1. Client uploads CSV/XLSX with truck and load data.
2. API receives `totalCost` parameter and fetches trucks from DB.
3. Algorithm optimizes each company's truck loads using a **greedy strategy**.
4. Results are saved to `Optimization` collection.
5. Trucks and company documents are updated with assigned loads and costs.
6. Populated optimization data is returned to the client.

#### **Time Complexity**
- Sorting loads: `O(L log L)` where `L` is the number of loads.
- Max heap operations: Each load insertion/deletion is `O(log T)` for `T` trucks per company.
- Total complexity per company: `O(L log L + L log T) ≈ O(L log L)` (since `T` is usually much smaller than `L`).
- Overall complexity for `C` companies: `O(C * (L log L + L log T))`.

This **greedy approach** ensures **efficient assignment of truck loads**, minimizes unassigned loads, and fairly distributes total costs among companies.

### API Endpoints 
[[API DOCUMENTATION](https://documenter.getpostman.com/view/30406371/2sB3HkqLg6)]

### 7. **Tech Stack**

This project is built using modern technologies for scalability, maintainability, and real-time operations:

- **Frontend:**
  - React.js (with Vite for fast bundling)
  - Tailwind CSS for responsive and modern UI
  - React Router for client-side routing
  - Lucide Icons for clean, lightweight icons

- **Backend:**
  - Node.js with Express.js
  - RESTful APIs for CRUD and optimization operations
  - JWT (JSON Web Tokens) for authentication (if required)
  - Winston (or any logger) for structured logging

- **Database:**
  - MongoDB (NoSQL) for trucks, companies, and optimization data
  - Mongoose ORM for schema modeling and validation

- **Algorithms / Utilities:**
  - Greedy load optimization algorithm
  - `@datastructures-js/priority-queue` for Max Priority Queue implementation

- **Other Tools:**
  - Nodemon for live backend development
  - Postman (or similar) for API testing
  - Git for version control

## DEMO 
**Video Demonstration:**  
Note : i have recorded the video via screen recorder and uploaded via drive.
[[Demo Link](https://drive.google.com/file/d/1WKPwzjfN_V1Ot86g1mnoXDKgRto7ocwY/view?usp=sharing)]


