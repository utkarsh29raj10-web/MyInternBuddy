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
- NeonDB
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
- I had implemented Forgot Password using reset link. I have disabled that because of free tier services confusion.
- Hot Listings & Recently Viewed Sections are NOT built on student/explorer dashboard.
- Track Applications (for Students/Explorers) is limited to native applications only.

# AI is used for:
**This is detailed information but the overall amount for each case is not significant. Thus, total AI usage remain well under 15-20%**
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
- Some help with deployment errors. There were a lot of errors, one after another and I used AI for **some** of them

# Screenshots
<img width="1399" height="744" alt="Screenshot 2026-08-24 at 1 52 40 AM" src="https://github.com/user-attachments/assets/92c51e04-3518-408f-9b66-7092f6718e32" />
<img width="1399" height="744" alt="Screenshot 2026-08-24 at 1 53 21 AM" src="https://github.com/user-attachments/assets/2abcc94a-2cf5-47a9-9e3c-f6f80d9b9509" />
<img width="1399" height="744" alt="Screenshot 2026-08-24 at 1 53 49 AM" src="https://github.com/user-attachments/assets/5778b931-b1bd-48df-80bc-e58c91746b75" />
<img width="1399" height="744" alt="Screenshot 2026-08-24 at 1 53 56 AM" src="https://github.com/user-attachments/assets/bba1a481-ba1c-4c2b-9a06-bb90ac16daba" />
<img width="1399" height="744" alt="Screenshot 2026-08-24 at 1 53 28 AM" src="https://github.com/user-attachments/assets/bebd36ea-d942-49b0-98a7-ec1c21d13c44" />
