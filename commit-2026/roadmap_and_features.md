# 🎓 College Intelligence Platform for First-Generation Students

## 🌟 Vision
To bridge the institutional knowledge gap for first-generation college students by providing a peer-verified, time-sensitive intelligence platform.

## 🚀 Key Features

### 1. User Authentication & Verification
*   **Role-Based Access:** Distinct roles for Freshers/Underclassmen (Consumers) and Seniors/Alumni (Contributors).
*   **.edu Email Integration:** Ensure users are tied to real academic institutions.
*   **Senior Verification:** Mechanism to verify senior status (e.g., student ID upload, transcript check, or peer-vouching) to maintain platform integrity.

### 2. Structured Tip-Submission System (The "Intel Engine")
*   **Smart Form:** Seniors submit intelligence with structured fields:
    *   *Category* (e.g., Scholarships, Internships, Course Registration, Professor Quirks).
    *   *Context & Advice* (The actual "insider tip").
    *   *Urgency & Deadlines* (Hard dates or general timeframes like "Week 2 of Semester").
    *   *Tags* (College, Branch/Major, Department).
*   **Anonymity Toggle:** Allow seniors to post sensitive but helpful intel (e.g., "Avoid this professor if you struggle with theoretical math") without fear of backlash.

### 3. Peer-Verification & Credibility Scoring
*   **Upvote/Verify Button:** Underclassmen can "verify" a tip if they found it accurate or "flag" it if outdated.
*   **Credibility Score (Karma):** Seniors build a reputation score based on the upvotes and verified outcomes of their tips.
*   **Trust Badges:** Highly verified intel gets a "Highly Trusted" or "Verified by Peers" badge to stand out.

### 4. College-Specific Intelligence Feeds
*   **Personalized Dashboard:** A customized feed based on the user's selected College, Branch, and Graduation Year.
*   **Advanced Filtering:** Ability to filter the feed by "Upcoming Deadlines", "Highest Rated", or specific tags (e.g., #CS_Internship).

### 5. Proactive Notification Engine
*   **Smart Nudges:** Automated push notifications or emails sent *before* a window closes (e.g., "Reminder: The Grace Hopper Scholarship portal closes in 48 hours. Here are 3 tips from seniors who won it.").
*   **Academic Calendar Sync:** Integration with the university's academic calendar to trigger seasonal tips (e.g., mid-term prep strategies, housing selection hacks).

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation & MVP (Minimum Viable Product)
**Goal:** Build the core submission and viewing experience.
*   [ ] Set up Database (PostgreSQL/MongoDB) and Backend (Node.js/Python).
*   [ ] Implement `.edu` email authentication and basic user profiles.
*   [ ] Create the "Tip Submission" form with basic tags and deadline fields.
*   [ ] Build a chronological feed to display tips.
*   [ ] Implement basic Upvote/Downvote functionality.

### Phase 2: Credibility & Personalization
**Goal:** Ensure the intelligence is reliable and tailored to the user.
*   [ ] Develop the Credibility Scoring algorithm for seniors.
*   [ ] Implement robust Tagging System (College -> Branch -> Course).
*   [ ] Create personalized feeds based on user profiles.
*   [ ] Add "Save/Bookmark" functionality for underclassmen.

### Phase 3: The Proactive Engine (Notifications)
**Goal:** Shift from a passive feed to an active nudge system.
*   [ ] Build background job schedulers (e.g., Cron, Celery, BullMQ) for time-sensitive tips.
*   [ ] Integrate Email (SendGrid/AWS SES) and/or Push Notifications.
*   [ ] Implement "Academic Calendar" logic to trigger event-based nudges.

### Phase 4: Gamification & Scale
**Goal:** Increase engagement and expand.
*   [ ] Add Leaderboards for top contributing seniors.
*   [ ] Implement "Anonymity" features with moderation tools.
*   [ ] Admin dashboard to handle flags, disputes, and manage tags.
*   [ ] Explore Mobile App (React Native/Flutter) for better push notification delivery.

## 🛠️ Recommended Tech Stack
*   **Frontend:** React.js or Next.js (Web), TailwindCSS (Styling)
*   **Backend:** Node.js (Express) or Python (Django/FastAPI)
*   **Database:** PostgreSQL (Relational data is great for structured tags and users)
*   **Authentication:** Supabase, Firebase Auth, or Auth0
*   **Background Jobs:** Redis + BullMQ (for handling the notification engine)
