import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA_3Xbm2LvYqcWoZr5n3-pQPp-wTBnACs8';
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

  buildPrompt(userRequest) {
    const platforms = ['LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'InterviewBit'];
    const importantTopics = [
      'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs', 
      'Binary Search', 'Two Pointers', 'Sliding Window', 'Hash Maps',
      'Stacks', 'Queues', 'Sorting', 'Greedy', 'Backtracking'
    ];

    let prompt = `Generate 6-10 coding questions based on the following request: "${userRequest}"\n\n`;
    
    // Analyze user request for specific requirements
    const lowerRequest = userRequest.toLowerCase();
    let specificTopic = null;
    let specificDifficulty = null;
    let specificPlatform = null;

    // Check for topic mentions
    for (const topic of importantTopics) {
      if (lowerRequest.includes(topic.toLowerCase())) {
        specificTopic = topic;
        this.lastChosenTopic = topic.toLowerCase();
        break;
      }
    }

    // Check for difficulty mentions
    if (lowerRequest.includes('easy')) {
      specificDifficulty = 'easy';
      this.lastDifficulty = 'easy';
    } else if (lowerRequest.includes('medium')) {
      specificDifficulty = 'medium';
      this.lastDifficulty = 'medium';
    } else if (lowerRequest.includes('hard')) {
      specificDifficulty = 'hard';
      this.lastDifficulty = 'hard';
    }

    // Check for platform mentions
    for (const platform of platforms) {
      if (lowerRequest.includes(platform.toLowerCase())) {
        specificPlatform = platform;
        break;
      }
    }

    // Build context for generation
    if (specificTopic) {
      prompt += `Focus on: ${specificTopic}\n`;
    } else if (userRequest.trim().length < 20) {
      // If request is vague, use important topics
      const randomTopics = importantTopics.sort(() => 0.5 - Math.random()).slice(0, 3);
      prompt += `Focus on these important topics: ${randomTopics.join(', ')}\n`;
    }

    if (specificDifficulty) {
      prompt += `Difficulty level: ${specificDifficulty}\n`;
    } else {
      prompt += `Mix of difficulty levels (easy, medium, hard)\n`;
    }

    if (specificPlatform) {
      prompt += `Prefer questions from: ${specificPlatform}\n`;
    } else {
      prompt += `Include questions from various platforms: ${platforms.join(', ')}\n`;
    }

    prompt += `
Guidelines:
- Each question should be realistic and similar to actual problems on these platforms
- Include variety in problem types and approaches
- Provide clear problem statements
- Include example test cases when relevant
- Specify appropriate tags/topics for each question

Format your response as a JSON array with this structure:
[
  {
    "title": "Question Title",
    "description": "Clear problem description",
    "difficulty": "easy|medium|hard",
    "platform": "platform name",
    "tags": ["tag1", "tag2"],
    "example": "Input: [1,2,3]\\nOutput: 6\\nExplanation: Sum of all elements"
  }
]

Make sure the JSON is valid and properly formatted.`;

    return prompt;
  }

  parseQuestions(text) {
    try {
      // Clean the text to extract JSON
      let jsonText = text.trim();
      
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
        example: q.example || null
      }));

    } catch (error) {
      console.error('Error parsing questions:', error);
      
      // Fallback: create sample questions if parsing fails
      return this.getFallbackQuestions();
    }
  }

  getFallbackQuestions() {
    return [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        platform: "LeetCode",
        tags: ["Array", "Hash Table"],
        example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        title: "Longest Common Subsequence",
        description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
        difficulty: "medium",
        platform: "LeetCode",
        tags: ["Dynamic Programming", "String"],
        example: "Input: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\" and its length is 3."
      },
      {
        title: "Binary Tree Maximum Path Sum",
        description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Find the maximum sum of any non-empty path.",
        difficulty: "hard",
        platform: "LeetCode",
        tags: ["Tree", "Depth-First Search", "Dynamic Programming"],
        example: "Input: root = [1,2,3]\nOutput: 6\nExplanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6."
      }
    ];
  }
}

const geminiService = new GeminiService();
export default geminiService;
