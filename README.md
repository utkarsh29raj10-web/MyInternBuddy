# Description

This is a platform for students & recruiters to connect & grow with a very polished and premium UI.
Students and alike can find opportunites: internships, competitions, jobs and more to come (like hackathons & competitions). This happens using serpapi, live from the web.
Recruiters can create listings for their internships, jobs - part & full time, apprenticeships.

And I hope to make this project big, into a real website for people to use. 

# Features
- Live Opportunity Aggregation
- Infinite Scrolling of opportunities on the find (search) page
- Filters for location & job type (internship, apprenticeship, part-time job & full-time job) in search bar
- Bookmarking - Users can save an opportunity to come back to later
- Application Tracking - Users can track their application status
- Recruiters can create listings and manage applicants efficiently

# Tech Stack
- Next.js
- Typescript
- Tailwind CSS
- PrismaDB
- PostgreSQL
- NextAuth
- SerpAPI
- Supabase
- Vercel

# How to run locally
1. Clone Repo
2. Run npm install
3. Create .env file
   a. DATABASE_URL="postgresql://user:password@localhost:5432/myinternbuddy"NEXTAUTH_URL="http://localhost:3000"
   b. NEXTAUTH_SECRET="your_super_secret_random_string"
   c. GOOGLE_CLIENT_ID="your_google_oauth_client_id"
   d. GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
   e. SERPAPI_KEY="your_serpapi_private_key"
4. npx prisma db push
5. npm run dev
6. Go to http://localhost:3000 in your browser

# Problems
- Some UI stuff does not render exactly as intended in Safari (WebKit). I'm not sure why. If someone can, please tell me. It is not exactly problematic by the way
- The opportunities feed is rather limited and doesn't actually fetch all data from across the web. I've used SerpApi. I will switch to or add more later to make it truly global.

# AI is used for:
This is detailed information but the overall amount for each case is not significant. Thus, total AI usage remain well under 15-20%
- Project Development Plan & Folder-File Structure
- Setting up variables
- Help with new version of Prisma
- Design SVG for auth-modal background and google icon in globasl.css (**which we didn't use btw**)
- Deisgn Google icon svg for auth modal
- Logo inspiration
- Help with Google Signup debugging
- Help with Safari imperfect rendering (AI wasn't useful at all here)
- Help with fixing shallow routing
- Help with building drag and drop application board
  - Fixing the drag and drop lag
- Understand how serpapi works
- Help with fixing infinite scroll in opportunities feed. First time -- didn't work
  - Fixed it a second time and this time got the actual code, not just help.
- Structure for how to run locally part in this readme

# Screenshots
