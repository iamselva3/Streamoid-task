# Streamoid-task

# Product Mapping Tool

A full workflow tool for uploading marketplace templates, uploading seller product files, mapping seller columns to marketplace attributes, and saving/viewing mappings.  
This project implements the exact requirements outlined in the assignment PDF.

---

## 🚀 Features

### 1. Marketplace Template Upload
- Upload a marketplace template CSV.
- Automatically extracts attribute keys + labels.
- Saves template to MongoDB.

### 2. Seller File Upload
- Upload CSV or Excel file from the seller.
- Backend parses:
  - Column headers
  - Sample rows
- Columns are used for mapping.

### 3. Mapping UI
- Select a marketplace template.
- Map each marketplace attribute → seller column.
- Preview mapping.
- Save mapping with metadata.

### 4. Saved Mappings
- View all mappings saved in the system.
- Inspect mapping details in JSON format.

### 5. Authentication (Optional)
- JWT login system.
- Seeded users:
  - super@local / SuperPass123!
  - admin@local / AdminPass123!
  - seller@local / SellerPass123!
- Role-based navigation & route protection.

---

## 🧩 Tech Stack

### Frontend
- React (Vite)
- React Router
- React Query
- Axios
- Tailwind CSS

### Backend
- Node.js + Express
- Mongoose (MongoDB)
- Multer (file upload)
- bcryptjs + JWT (Auth)

---