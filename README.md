This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Getting Started
# Step 1: Initialize Git
git init

# Step 2: README.md with explanation
# Capstone Review: Medical Data ETL & Dashboard

This project is the final capstone for my software engineering training. It integrates a full-stack ETL dashboard and FHIR gateway to process, store, and visualize medical data.

---

## 🔧 Technologies Used

- **Next.js (App Router)** — Frontend & API Routes
- **MongoDB Atlas** — Cloud database for slide, tissue, and patient records
- **AWS S3** — Image and CSV storage integration
- **Tailwind CSS** — Styling
- **Mongoose** — Schema-based MongoDB modeling
- **CSV Upload / Parsing** — For whole slide image and tissue data ingestion
- **FHIR API Gateway** — Mock patient fetch and storage
- **Authentication** — JWT-based or Amplify (pending)

---

## 🚀 Features

- Upload CSV files via UI or URL
- Store parsed data in MongoDB Atlas
- Filter & search slides, tissues, and patients
- Export filtered records to CSV
- Replace or delete existing records via modal
- Fetch mock patients from FHIR server
- Built-in pagination and sorting
- Deployment-ready with `.env` setup

---

## 📁 Folder Structure
📁 Folder Structure
<pre> ├── public/ # Static assets (e.g. images, fonts) ├── src/ # Source code root │ ├── app/ # Next.js App Router pages & layout │ │ ├── (private)/ # Auth-protected routes │ │ ├── (public)/ # Public-facing pages (login, signup, etc.) │ │ ├── favicon.ico # Favicon for the app │ │ ├── globals.css # Global Tailwind + custom styles │ │ ├── layout.tsx # Root layout component for App Router │ │ └── page.tsx # Default landing or dashboard page │ ├── components/ # Reusable React components │ ├── dbConfig/ # MongoDB connection utilities │ ├── helpers/ # Utility functions or server helpers │ ├── lib/ # AWS S3, FHIR, and other service libraries │ ├── models/ # Mongoose schemas for MongoDB collections │ ├── types/ # TypeScript type definitions │ └── utils/ # Misc utilities (e.g. token parsing, formatters) ├── amplify-client.ts # Amplify frontend client configuration ├── amplifyconfiguration.json # Amplify backend environment setup ├── aws-exports.js # Auto-generated AWS config (e.g. S3, Auth) └── middleware.ts # Next.js middleware (e.g. route protection) </pre>

# Step 3: Create a .gitignore
echo "node_modules
.git
*.log
" > .gitignore

# Step 4: Stage the files you want to commit
git add README.md .gitignore

# Step 5: Commit them
git commit -m "Initial commit without tar archive and README"

# Step 6: Add GitHub repo as remote
Clone the repo:
   ```bash
   git clone git@github.com:mthompsonTMR/Capstone-review.git
   cd Capstone-review

   https://github.com/mthompsonTMR/Capstone-review
   

# Step 7: Set branch name and push
git branch -M main
git push -u origin main


✍️ Author
Michael Thompson
GitHub | LinkedIn



