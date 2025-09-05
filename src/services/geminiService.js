import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA_3Xbm2LvYqcWoZr5n3-pQPp-wTBnACs8';
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.lastChosenTopic = 'arrays'; // Default topic
    this.lastDifficulty = 'medium'; // Default difficulty
  }

  async generateQuestions(userRequest) {
    try {
      const prompt = this.buildPrompt(userRequest);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseQuestions(text);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  async generateChatResponse(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  buildPrompt(userRequest) {
    const platforms = ['LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'InterviewBit'];
    const importantTopics = [
      'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs', 
      'Binary Search', 'Two Pointers', 'Sliding Window', 'Hash Maps',
      'Stacks', 'Queues', 'Sorting', 'Greedy', 'Backtracking'
    ];

    // Add randomness elements
    const randomSeed = Date.now() + Math.random();
    const randomPromptVariations = [
      "Create unique and diverse coding problems",
      "Generate fresh coding challenges",
      "Design novel programming questions",
      "Develop varied algorithmic problems"
    ];
    const randomStyleModifiers = [
      "with creative twists",
      "featuring unique constraints",
      "with interesting problem scenarios",
      "incorporating real-world applications",
      "with innovative approaches"
    ];

    // Select random elements for variety
    const randomVariation = randomPromptVariations[Math.floor(Math.random() * randomPromptVariations.length)];
    const randomModifier = randomStyleModifiers[Math.floor(Math.random() * randomStyleModifiers.length)];

    // Start with structured prompt with randomness
    let prompt = `You are an expert coding question generator. ${randomVariation} ${randomModifier}.\n\n`;
    prompt += `Session ID: ${randomSeed} (Use this for generating unique content)\n\n`;
    
    // Parse the user request to extract structured filters
    const lowerRequest = userRequest.toLowerCase();
    let extractedPlatform = null;
    let extractedDifficulty = null;
    let extractedTopic = null;
    let extractedCompany = null;
    let extractedNumQuestions = 5;
    let extractedRatingRange = null;

    // Extract platform
    for (const platform of platforms) {
      if (lowerRequest.includes(`platform: ${platform.toLowerCase()}`)) {
        extractedPlatform = platform;
        break;
      }
    }

    // Extract difficulty
    if (lowerRequest.includes('difficulty: easy')) extractedDifficulty = 'Easy';
    else if (lowerRequest.includes('difficulty: medium')) extractedDifficulty = 'Medium';
    else if (lowerRequest.includes('difficulty: hard')) extractedDifficulty = 'Hard';

    // Extract topic
    for (const topic of importantTopics) {
      if (lowerRequest.includes(`topic: ${topic.toLowerCase()}`)) {
        extractedTopic = topic;
        break;
      }
    }

    // Extract number of questions
    const numMatch = lowerRequest.match(/number of questions: (\d+)/);
    if (numMatch) {
      extractedNumQuestions = parseInt(numMatch[1]);
    }

    // Extract company
    const companyMatch = lowerRequest.match(/company focus: ([^\\n]+)/);
    if (companyMatch) {
      extractedCompany = companyMatch[1].trim();
    }

    // Extract rating range
    const ratingMatch = lowerRequest.match(/rating range: (\d+) - (\d+)/);
    if (ratingMatch) {
      extractedRatingRange = [parseInt(ratingMatch[1]), parseInt(ratingMatch[2])];
    }

    // Build specifications with randomness
    prompt += `SPECIFICATIONS:\n`;
    
    if (extractedPlatform) {
      prompt += `- Platform: ${extractedPlatform} (STRICTLY generate questions that would appear on ${extractedPlatform})\n`;
      
      // Add platform-specific guidance with variety
      if (extractedPlatform === 'LeetCode') {
        prompt += `- Style: LeetCode-style problems with clear input/output format and constraints\n`;
        prompt += `- Focus on: Interview-style algorithmic challenges with practical applications\n`;
      } else if (extractedPlatform === 'Codeforces') {
        prompt += `- Style: Competitive programming problems with mathematical/algorithmic focus\n`;
        prompt += `- Focus on: Contest-style problems with creative problem-solving elements\n`;
      } else if (extractedPlatform === 'CodeChef') {
        prompt += `- Style: CodeChef-style competitive programming problems\n`;
        prompt += `- Focus on: Algorithmic challenges with clear mathematical foundations\n`;
      } else if (extractedPlatform === 'AtCoder') {
        prompt += `- Style: AtCoder-style problems with clear problem statements\n`;
        prompt += `- Focus on: Well-structured competitive programming challenges\n`;
      } else if (extractedPlatform === 'InterviewBit') {
        prompt += `- Style: Interview-focused problems suitable for technical interviews\n`;
        prompt += `- Focus on: Industry-relevant coding challenges\n`;
      }
    } else {
      prompt += `- Platform: Mix of platforms (${platforms.join(', ')})\n`;
    }

    // Add randomness to topic selection if not specified
    if (extractedTopic) {
      prompt += `- Topic: Focus specifically on ${extractedTopic} problems\n`;
    } else {
      // Suggest random mix of topics for variety
      const shuffledTopics = [...importantTopics].sort(() => 0.5 - Math.random()).slice(0, 3);
      prompt += `- Topics: Include variety from these areas: ${shuffledTopics.join(', ')}\n`;
    }

    if (extractedDifficulty) {
      prompt += `- Difficulty: ${extractedDifficulty} level problems only\n`;
    } else {
      prompt += `- Difficulty: Mixed difficulty levels for balanced practice\n`;
    }

    if (extractedCompany && extractedPlatform === 'InterviewBit') {
      prompt += `- Company Focus: Problems suitable for ${extractedCompany} interviews\n`;
    }

    if (extractedRatingRange && (extractedPlatform === 'Codeforces' || extractedPlatform === 'CodeChef')) {
      prompt += `- Rating Range: Problems with difficulty rating between ${extractedRatingRange[0]} and ${extractedRatingRange[1]}\n`;
    }

    prompt += `- Quantity: Generate exactly ${extractedNumQuestions} UNIQUE and DIVERSE questions\n\n`;

    // Add variety-focused requirements
    prompt += `VARIETY REQUIREMENTS:\n`;
    prompt += `- Each question MUST be completely different from the others\n`;
    prompt += `- Use different problem scenarios, data structures, and algorithms\n`;
    prompt += `- Vary the problem contexts (e.g., real-world scenarios, abstract problems, games, etc.)\n`;
    prompt += `- Include different types of input/output formats\n`;
    prompt += `- Ensure no two problems solve the same underlying algorithmic challenge\n\n`;

    // Add any additional user requirements
    if (lowerRequest.includes('user request:')) {
      const userReqMatch = lowerRequest.match(/user request: "([^"]+)"/);
      if (userReqMatch) {
        prompt += `ADDITIONAL REQUIREMENTS:\n${userReqMatch[1]}\n\n`;
      }
    }

    // Add randomness to problem generation instructions
    const problemContexts = [
      "social media applications", "e-commerce platforms", "gaming systems", 
      "financial applications", "transportation networks", "data analysis", 
      "scientific computing", "web applications", "mobile apps", "IoT systems"
    ];
    const randomContexts = problemContexts.sort(() => 0.5 - Math.random()).slice(0, 3);

    prompt += `CREATIVE INSPIRATION:\n`;
    prompt += `- Consider real-world scenarios from: ${randomContexts.join(', ')}\n`;
    prompt += `- Think about modern software development challenges\n`;
    prompt += `- Include problems that test different aspects of programming skills\n\n`;

    prompt += `IMPORTANT GUIDELINES:
- Each question should be realistic and similar to actual problems found on the specified platform
- NEVER repeat or create similar problems - ensure maximum diversity
- Provide clear, detailed problem statements with unique scenarios
- Include realistic example test cases with varied input patterns
- Specify appropriate tags/topics for each question
- If a specific platform is mentioned, the questions MUST be in the style of that platform
- For URLs, use the following format based on platform:
  * LeetCode: https://leetcode.com/problems/problem-slug/ (convert title to lowercase, replace spaces with hyphens)
  * Codeforces: https://codeforces.com/problemset/problem/XXXX/A (use contest number and problem letter)
  * CodeChef: https://www.codechef.com/problems/PROBLEMCODE
  * AtCoder: https://atcoder.jp/contests/abc123/tasks/abc123_a
  * InterviewBit: https://www.interviewbit.com/problems/problem-name/
- Make each problem title and description completely unique
- Use different algorithmic approaches for each question

OUTPUT FORMAT:
Provide your response as a valid JSON array with this exact structure:
[
  {
    "title": "Unique Problem Title",
    "description": "Clear and detailed problem description with constraints and unique scenario",
    "difficulty": "Easy|Medium|Hard", 
    "platform": "${extractedPlatform || 'LeetCode'}",
    "tags": ["tag1", "tag2", "tag3"],
    "example": "Input: example_input\\nOutput: example_output\\nExplanation: detailed explanation",
    "url": "https://platform.com/actual-problem-link"
  }
]

Generate ${extractedNumQuestions} completely unique and diverse questions following these specifications exactly.
Remember: NO REPETITION OR SIMILARITY between questions!
IMPORTANT: Generate realistic URLs that follow each platform's URL structure!`;

    return prompt;
  }

  parseQuestions(text) {
    try {
      // Clean the text to extract JSON
      let jsonText = text.trim();
      
      // Remove any markdown code block markers
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      
      // Find JSON array in the response
      const jsonStart = jsonText.indexOf('[');
      const jsonEnd = jsonText.lastIndexOf(']') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonText = jsonText.substring(jsonStart, jsonEnd);
      }

      // Parse the JSON
      const questions = JSON.parse(jsonText);
      
      // Validate and format questions
      return questions.map((q, index) => ({
        title: q.title || `Question ${index + 1}`,
        description: q.description || 'No description provided',
        difficulty: q.difficulty || this.lastDifficulty,
        platform: q.platform || 'LeetCode',
        tags: Array.isArray(q.tags) ? q.tags : [],
        example: q.example || null,
        url: this.validateAndFixUrl(q.url, q.platform, q.title)
      }));

    } catch (error) {
      console.error('Error parsing questions:', error);
      
      // Fallback: create sample questions if parsing fails
      return this.getFallbackQuestions();
    }
  }

  validateAndFixUrl(providedUrl, platform, title) {
    // If a valid URL is provided, use it
    if (providedUrl && this.isValidUrl(providedUrl)) {
      return providedUrl;
    }
    
    // Otherwise, generate a proper URL based on platform
    return this.generatePlatformUrl(platform, title);
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  generatePlatformUrl(platform, title) {
    const platformLower = platform?.toLowerCase() || 'leetcode';
    
    switch (platformLower) {
      case 'leetcode':
        const slug = title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        return `https://leetcode.com/problems/${slug}/`;
        
      case 'codeforces':
        // Generate a realistic contest number and problem letter
        const contestNum = Math.floor(Math.random() * 1000) + 1000;
        const problemLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
        return `https://codeforces.com/problemset/problem/${contestNum}/${problemLetter}`;
        
      case 'codechef':
        const problemCode = title.toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .substring(0, 8) + Math.floor(Math.random() * 100);
        return `https://www.codechef.com/problems/${problemCode}`;
        
      case 'atcoder':
        const contestId = `abc${Math.floor(Math.random() * 300) + 100}`;
        const taskId = title.toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 8);
        return `https://atcoder.jp/contests/${contestId}/tasks/${contestId}_${taskId}`;
        
      case 'interviewbit':
        const problemSlug = title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        return `https://www.interviewbit.com/problems/${problemSlug}/`;
        
      default:
        return `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, '-')}/`;
    }
  }

  getFallbackQuestions() {
    // Add randomness to fallback questions too
    const allFallbackQuestions = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        platform: "LeetCode",
        tags: ["Array", "Hash Table"],
        example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
        url: "https://leetcode.com/problems/two-sum/"
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "easy",
        platform: "LeetCode",
        tags: ["String", "Stack"],
        example: "Input: s = '()'\nOutput: true\nExplanation: The parentheses are properly matched.",
        url: "https://leetcode.com/problems/valid-parentheses/"
      },
      {
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists and return it as a sorted list.",
        difficulty: "easy",
        platform: "LeetCode",
        tags: ["Linked List", "Recursion"],
        example: "Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/"
      },
      {
        title: "Longest Common Subsequence",
        description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
        difficulty: "medium",
        platform: "LeetCode",
        tags: ["Dynamic Programming", "String"],
        example: "Input: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\" and its length is 3.",
        url: "https://leetcode.com/problems/longest-common-subsequence/"
      },
      {
        title: "Course Schedule",
        description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Given prerequisites, return true if you can finish all courses.",
        difficulty: "medium",
        platform: "LeetCode",
        tags: ["Graph", "Topological Sort", "DFS"],
        example: "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: Take course 0, then course 1.",
        url: "https://leetcode.com/problems/course-schedule/"
      },
      {
        title: "Binary Tree Maximum Path Sum",
        description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Find the maximum sum of any non-empty path.",
        difficulty: "hard",
        platform: "LeetCode",
        tags: ["Tree", "Depth-First Search", "Dynamic Programming"],
        example: "Input: root = [1,2,3]\nOutput: 6\nExplanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
      }
    ];

    // Return random subset of fallback questions
    return allFallbackQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
}

const geminiService = new GeminiService();
export default geminiService;
