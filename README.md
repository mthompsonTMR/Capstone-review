This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
# Step 1: Initialize Git
git init

# Step 2: Create README.md with explanation
echo "# Auth Next.js Project

This archive contains the core project files for the Next.js + Amplify auth project.

**Note:** The \`node_modules\` directory has been excluded from the tar archive to reduce size.

To install dependencies after extracting:

\`\`\`bash
npm install
\`\`\`
" > README.md

# Step 3: Create a .gitignore
echo "node_modules
.git
*.log
" > .gitignore

# Step 4: Stage the files you want to commit
git add README.md auth-nextjs-y.tar.gz .gitignore

# Step 5: Commit them
git commit -m "Initial commit with tar archive and README"

# Step 6: Add GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/auth-nextjs-y-backup.git

# Step 7: Set branch name and push
git branch -M main
git push -u origin main






First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
