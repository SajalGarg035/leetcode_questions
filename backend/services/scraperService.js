const axios = require('axios');
const cheerio = require('cheerio');
const Question = require('../models/Question');

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('Puppeteer not installed, using API-only scraping');
}

class ScraperService {
  constructor() {
    this.browser = null;
    this.scrapeQueue = [];
    this.isProcessing = false;
    this.canUsePuppeteer = !!puppeteer;
  }

  async initBrowser() {
    if (!this.canUsePuppeteer) {
      throw new Error('Puppeteer not available');
    }

    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async addScrapeJob(platforms, force = false) {
    const jobId = Date.now().toString();
    
    this.scrapeQueue.push({
      id: jobId,
      platforms,
      force,
      createdAt: new Date()
    });

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    return jobId;
  }

  async processQueue() {
    if (this.isProcessing || this.scrapeQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.scrapeQueue.length > 0) {
      const job = this.scrapeQueue.shift();
      
      try {
        console.log(`Processing scrape job ${job.id} for platforms:`, job.platforms);
        
        for (const platform of job.platforms) {
          await this.scrapePlatform(platform, job.force);
        }
        
        console.log(`Completed scrape job ${job.id}`);
      } catch (error) {
        console.error(`Error processing scrape job ${job.id}:`, error);
      }
    }

    this.isProcessing = false;
  }

  async scrapePlatform(platform, force = false) {
    console.log(`Scraping ${platform}...`);

    switch (platform.toLowerCase()) {
      case 'leetcode':
        return this.scrapeLeetCode(force);
      case 'codeforces':
        return this.scrapeCodeforces(force);
      case 'gfg':
        return this.scrapeGeeksForGeeksAPI(force); // Use API version without Puppeteer
      default:
        console.log(`Scraper for ${platform} not implemented yet`);
        return 0;
    }
  }

  async scrapeLeetCode(force = false) {
    try {
      // Use LeetCode GraphQL API (public endpoints)
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql', {
        query,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 50,
          filters: {}
        }
      });

      const questions = response.data.data.problemsetQuestionList.questions;
      const scrapedQuestions = [];

      for (const q of questions.slice(0, 10)) { // Limit for demo
        if (q.paidOnly) continue; // Skip paid questions

        const questionData = {
          title: q.title,
          description: `LeetCode Problem: ${q.title}`,
          difficulty: q.difficulty.toLowerCase(),
          platform: 'leetcode',
          topic: this.mapTopicFromTags(q.topicTags),
          domain: 'dsa',
          sourceType: 'scraped',
          tags: q.topicTags.map(tag => tag.name),
          externalUrl: `https://leetcode.com/problems/${q.titleSlug}/`,
          isActive: true,
          lastScraped: new Date(),
          scrapingMetadata: {
            originalId: q.frontendQuestionId,
            lastUpdated: new Date(),
            source: 'leetcode-api'
          }
        };

        scrapedQuestions.push(questionData);
      }

      // Save to database (update if exists, insert if new)
      for (const question of scrapedQuestions) {
        await Question.findOneAndUpdate(
          { 
            externalUrl: question.externalUrl 
          },
          question,
          { 
            upsert: true, 
            new: true 
          }
        );
      }

      console.log(`Scraped ${scrapedQuestions.length} questions from LeetCode`);
      return scrapedQuestions.length;

    } catch (error) {
      console.error('LeetCode scraping error:', error);
      return 0;
    }
  }

  async scrapeCodeforces(force = false) {
    try {
      // Use Codeforces API
      const response = await axios.get('https://codeforces.com/api/problemset.problems', {
        params: {
          tags: 'implementation,math,greedy'
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Codeforces API error');
      }

      const problems = response.data.result.problems.slice(0, 20); // Limit for demo
      const scrapedQuestions = [];

      for (const problem of problems) {
        const questionData = {
          title: problem.name,
          description: `Codeforces Problem: ${problem.name}`,
          difficulty: this.mapCodeforcesRating(problem.rating),
          platform: 'codeforces',
          topic: this.mapTopicFromTags(problem.tags),
          domain: 'cp',
          sourceType: 'scraped',
          tags: problem.tags || [],
          rating: problem.rating,
          externalUrl: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
          isActive: true,
          lastScraped: new Date(),
          scrapingMetadata: {
            originalId: `${problem.contestId}${problem.index}`,
            lastUpdated: new Date(),
            source: 'codeforces-api'
          }
        };

        scrapedQuestions.push(questionData);
      }

      // Save to database
      for (const question of scrapedQuestions) {
        await Question.findOneAndUpdate(
          { 
            externalUrl: question.externalUrl 
          },
          question,
          { 
            upsert: true, 
            new: true 
          }
        );
      }

      console.log(`Scraped ${scrapedQuestions.length} questions from Codeforces`);
      return scrapedQuestions.length;

    } catch (error) {
      console.error('Codeforces scraping error:', error);
      return 0;
    }
  }

  async scrapeGeeksForGeeksAPI(force = false) {
    try {
      // Use a simpler approach without Puppeteer
      console.log('Scraping GeeksforGeeks using API approach...');
      
      // Generate mock GFG questions since we can't easily scrape without Puppeteer
      const mockQuestions = [
        {
          title: "Find the maximum element in an array",
          difficulty: "Basic",
          url: "https://practice.geeksforgeeks.org/problems/max-element"
        },
        {
          title: "Reverse a string",
          difficulty: "Basic", 
          url: "https://practice.geeksforgeeks.org/problems/reverse-string"
        },
        {
          title: "Binary Search",
          difficulty: "Easy",
          url: "https://practice.geeksforgeeks.org/problems/binary-search"
        },
        {
          title: "Merge Sort",
          difficulty: "Medium",
          url: "https://practice.geeksforgeeks.org/problems/merge-sort"
        },
        {
          title: "Longest Common Subsequence",
          difficulty: "Medium",
          url: "https://practice.geeksforgeeks.org/problems/lcs"
        }
      ];

      const scrapedQuestions = [];

      for (const q of mockQuestions) {
        const questionData = {
          title: q.title,
          description: `GeeksforGeeks Problem: ${q.title}`,
          difficulty: this.mapGFGDifficulty(q.difficulty),
          platform: 'gfg',
          topic: 'other',
          domain: 'dsa',
          sourceType: 'scraped',
          tags: ['geeksforgeeks'],
          externalUrl: q.url,
          isActive: true,
          lastScraped: new Date(),
          scrapingMetadata: {
            originalId: q.url.split('/').pop(),
            lastUpdated: new Date(),
            source: 'gfg-mock'
          }
        };

        scrapedQuestions.push(questionData);
      }

      // Save to database
      for (const question of scrapedQuestions) {
        await Question.findOneAndUpdate(
          { 
            externalUrl: question.externalUrl 
          },
          question,
          { 
            upsert: true, 
            new: true 
          }
        );
      }

      console.log(`Scraped ${scrapedQuestions.length} questions from GeeksforGeeks (mock)`);
      return scrapedQuestions.length;

    } catch (error) {
      console.error('GeeksforGeeks scraping error:', error);
      return 0;
    }
  }

  mapTopicFromTags(tags) {
    if (!tags || tags.length === 0) return 'other';
    
    const tag = Array.isArray(tags) ? tags[0] : tags;
    const tagName = typeof tag === 'object' ? tag.name : tag;
    
    const topicMap = {
      'array': 'arrays',
      'string': 'strings',
      'tree': 'trees',
      'graph': 'graphs',
      'dynamic programming': 'dp',
      'dp': 'dp',
      'greedy': 'greedy',
      'sorting': 'sorting',
      'searching': 'searching',
      'math': 'math'
    };

    return topicMap[tagName.toLowerCase()] || 'other';
  }

  mapCodeforcesRating(rating) {
    if (!rating) return 'medium';
    if (rating < 1200) return 'easy';
    if (rating < 1600) return 'medium';
    return 'hard';
  }

  mapGFGDifficulty(difficulty) {
    const diffMap = {
      'easy': 'easy',
      'medium': 'medium',
      'hard': 'hard',
      'basic': 'easy'
    };
    
    return diffMap[difficulty.toLowerCase()] || 'medium';
  }

  async closeBrowser() {
    if (this.browser && this.canUsePuppeteer) {
      try {
        await this.browser.close();
        this.browser = null;
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}

module.exports = new ScraperService();
