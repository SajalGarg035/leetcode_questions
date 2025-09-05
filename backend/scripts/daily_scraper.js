const mongoose = require('mongoose');
const scraperService = require('../services/scraperService');
require('dotenv').config();

async function runDailyScrape() {
  try {
    console.log('🕐 Starting daily scrape job...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/practice-hub');
    console.log('📅 Connected to MongoDB');

    // Scrape all platforms
    const platforms = ['leetcode', 'codeforces', 'gfg'];
    
    for (const platform of platforms) {
      console.log(`🔍 Scraping ${platform}...`);
      const count = await scraperService.scrapePlatform(platform, false);
      console.log(`✅ Scraped ${count} questions from ${platform}`);
    }

    console.log('🎉 Daily scrape completed successfully');
    
  } catch (error) {
    console.error('❌ Daily scrape failed:', error);
  } finally {
    await mongoose.connection.close();
    await scraperService.closeBrowser();
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runDailyScrape();
}

module.exports = runDailyScrape;
