import { chromium } from 'playwright';

(async () => {
  console.log('🎬 Starting CollegeIntel Demo Recording...');
  const browser = await chromium.launch({
    headless: true, // Set to false if you want to watch it live on your screen
    slowMo: 800 // Smooth, human-like interaction for the video
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/', // Saves the output video to this directory
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 },
    // Enable color scheme if your app uses media queries for dark mode
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:5174/');

  // 1. Login Flow
  console.log('Logging in...');
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', 'student@university.edu');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:5174/');
  console.log('Landed on Dashboard!');
  await page.waitForTimeout(2000); // Let the animations settle

  // 2. Feed Exploration
  console.log('Exploring Feed...');
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(1000);

  // 3. Search functionality
  console.log('Searching...');
  await page.fill('.search-input', 'Google');
  await page.waitForTimeout(1500);
  await page.fill('.search-input', '');
  await page.waitForTimeout(1000);

  // 4. Sidebar Filters
  console.log('Testing Filters...');
  await page.click('li:has-text("Academics")');
  await page.waitForTimeout(1500);
  await page.click('li:has-text("High")');
  await page.waitForTimeout(1500);
  await page.click('li:has-text("All Categories")');
  await page.click('li:has-text("All Urgencies")');
  await page.waitForTimeout(1000);

  // 5. Post Engagement
  console.log('Engaging with post...');
  // Find the first post's interaction buttons
  const confirmBtn = page.locator('button:has-text("✅ Confirmed")').first();
  await confirmBtn.click();
  await page.waitForTimeout(1000);

  const saveBtn = page.locator('button:has-text("Save")').first();
  await saveBtn.click();
  await page.waitForTimeout(1000);

  const commentsBtn = page.locator('button:has-text("Comments")').first();
  await commentsBtn.click();
  await page.waitForTimeout(1500);

  // 6. Tip Submission Modal
  console.log('Submitting new Intel...');
  await page.click('button:has-text("+ Add Tip")');
  await page.waitForTimeout(1000);

  await page.fill('#top-post-title', 'SWE Interview Tips for Sophomores');
  await page.fill('#top-post-content', 'Make sure to study Trees, Graphs, BFS/DFS, and dynamic programming basics. Focus on standard LeetCode Mediums!');
  await page.selectOption('#top-post-category', 'internships');
  await page.selectOption('#top-post-urgency', { label: 'Medium (Next 30 days)' });
  await page.fill('#top-post-deadline', 'Nov 30, 2026');
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Submit to Network")');
  await page.waitForTimeout(2000);

  // 7. Site Navigation
  console.log('Navigating to Saved Pages...');
  await page.click('button[title="Saved Pages"]');
  await page.waitForTimeout(2000);

  console.log('Navigating to Notifications...');
  await page.click('button[title="Notifications"]');
  await page.waitForTimeout(2000);

  console.log('Navigating to Profile...');
  await page.click('button[title="View Profile"]');
  await page.waitForTimeout(2000);

  // 8. Logout
  console.log('Logging Out...');
  await page.click('button[title="Logout"]');
  await page.waitForTimeout(2000);

  await browser.close();
  console.log('✅ Demo recorded successfully to /videos folder!');
})();
