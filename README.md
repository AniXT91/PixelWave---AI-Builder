✨ Project Overview
==================

Type a few words, and—like magic—a complete landing page appears. Built with Next.js, TypeScript, Tailwind CSS, ShadcnUI, and secured by NextAuth.js, this chatbot saves your work to PostgreSQL via Prisma (or Drizzle). In one chat window, you prompt, watch HTML/CSS render live, and grab your page in a single click—no fuss.

## 🚀 Features

- ✨ Chat-based interface to generate landing page HTML & CSS
- 🔍 Live preview of generated code
- 📥 Optional: Download generated HTML & CSS files 
- 🔐 Auth with NextAuth.js (Email/Password + Google Login)
- 📦 Uses PostgreSQL (via Supabase)+ Prisma
- ⚙️ Powered by any GenAI API(Gemini) via Vercel’s AI SDK


## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadcnUI
- **Auth**: NextAuth.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 
- **AI SDK**: Vercel AI SDK + any Gemini


Installation & Setup
====================

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-landing-page-generator.git
cd ai-landing-page-generator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a .env.local file in the root and add the following:

```bash
DATABASE_URL=your_postgresql_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GENAI_API_KEY=your_ai_api_key
```

4. Set up Prisma (or Drizzle)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Run the development server

```bash
npm run dev
# or
yarn dev
```

