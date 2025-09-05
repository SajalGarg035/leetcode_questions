class PracticeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    // Try backend first, fallback to mock
    this.useMockData = false;
  }

  async getQuestions(filters, mode = 'practice') {
    // First try real backend
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        mode
      });

      const response = await fetch(`${this.baseURL}/questions?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend not available, using mock data:', error.message);
      // Fallback to mock data
      return this.getMockQuestions(filters, mode);
    }
  }

  async getQuestionById(id) {
    try {
      const response = await fetch(`${this.baseURL}/questions/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching question from backend, using mock:', error.message);
      return this.getMockQuestion(id);
    }
  }

  async submitSolution(questionId, code, language) {
    try {
      const response = await fetch(`${this.baseURL}/questions/${questionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting to backend, using mock execution:', error.message);
      // Fallback to mock execution
      return this.mockSubmitSolution(code, language);
    }
  }

  mockSubmitSolution(code, language) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock validation - check if code contains some keywords
        const hasReturn = code.includes('return');
        const hasLoop = code.includes('for') || code.includes('while');
        const hasLogic = code.length > 50;

        const testResults = [
          { 
            passed: hasReturn && hasLogic, 
            input: '[2,7,11,15], 9', 
            output: hasReturn ? '[0,1]' : 'undefined', 
            expected: '[0,1]' 
          },
          { 
            passed: hasReturn && hasLogic, 
            input: '[3,2,4], 6', 
            output: hasReturn ? '[1,2]' : 'undefined', 
            expected: '[1,2]' 
          },
          { 
            passed: hasReturn && hasLoop, 
            input: '[3,3], 6', 
            output: hasReturn && hasLoop ? '[0,1]' : 'undefined', 
            expected: '[0,1]' 
          }
        ];

        resolve({
          success: true,
          testResults,
          allPassed: testResults.every(r => r.passed)
        });
      }, 1000);
    });
  }

  // Mock data for development
  getMockQuestions(filters, mode) {
    const allMockQuestions = [
      {
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        platform: "leetcode",
        topic: "arrays",
        domain: "dsa",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/two-sum/",
        tags: ["Array", "Hash Table"]
      },
      {
        id: 2,
        title: "Longest Palindromic Substring",
        description: "Given a string s, return the longest palindromic substring in s.",
        difficulty: "medium",
        platform: "leetcode",
        topic: "strings",
        domain: "interview",
        sourceType: "ai",
        tags: ["String", "Dynamic Programming"]
      },
      {
        id: 3,
        title: "Maximum Subarray Sum",
        description: "Find the contiguous subarray within a one-dimensional array of numbers that has the largest sum.",
        difficulty: "medium",
        platform: "codeforces",
        topic: "arrays",
        domain: "cp",
        sourceType: "curated",
        externalUrl: "https://codeforces.com/problemset/problem/53/E",
        tags: ["Array", "Kadane's Algorithm"]
      },
      {
        id: 4,
        title: "Binary Tree Level Order Traversal",
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        difficulty: "medium",
        platform: "leetcode",
        topic: "trees",
        domain: "dsa",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        tags: ["Tree", "Breadth-First Search"]
      },
      {
        id: 5,
        title: "Graph Shortest Path",
        description: "Find the shortest path between two nodes in a weighted graph using Dijkstra's algorithm.",
        difficulty: "hard",
        platform: "codechef",
        topic: "graphs",
        domain: "cp",
        sourceType: "ai",
        tags: ["Graph", "Shortest Path", "Dijkstra"]
      },
      {
        id: 6,
        title: "Merge Intervals",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        difficulty: "medium",
        platform: "interviewbit",
        topic: "arrays",
        domain: "interview",
        sourceType: "curated",
        externalUrl: "https://www.interviewbit.com/problems/merge-intervals/",
        tags: ["Array", "Sorting"]
      },
      {
        id: 7,
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "easy",
        platform: "leetcode",
        topic: "strings",
        domain: "dsa",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/valid-parentheses/",
        tags: ["String", "Stack"]
      },
      {
        id: 8,
        title: "Coin Change",
        description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
        difficulty: "medium",
        platform: "leetcode",
        topic: "dp",
        domain: "dsa",
        sourceType: "ai",
        tags: ["Dynamic Programming", "Array"]
      },
      {
        id: 9,
        title: "Quick Sort Implementation",
        description: "Implement the quick sort algorithm to sort an array of integers in ascending order.",
        difficulty: "medium",
        platform: "gfg",
        topic: "sorting",
        domain: "dsa",
        sourceType: "curated",
        tags: ["Sorting", "Divide and Conquer"]
      },
      {
        id: 10,
        title: "Binary Search",
        description: "Given a sorted array of integers nums and an integer target, write a function to search target in nums.",
        difficulty: "easy",
        platform: "leetcode",
        topic: "searching",
        domain: "dsa",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/binary-search/",
        tags: ["Array", "Binary Search"]
      },
      {
        id: 11,
        title: "Network Flow Problem",
        description: "Find the maximum flow in a flow network using Ford-Fulkerson algorithm.",
        difficulty: "hard",
        platform: "codeforces",
        topic: "graphs",
        domain: "cp",
        sourceType: "ai",
        tags: ["Graph", "Max Flow", "Network"]
      },
      {
        id: 12,
        title: "Sliding Window Maximum",
        description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.",
        difficulty: "hard",
        platform: "leetcode",
        topic: "arrays",
        domain: "interview",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/sliding-window-maximum/",
        tags: ["Array", "Sliding Window", "Heap"]
      }
    ];

    // Filter questions based on filters
    let filteredQuestions = allMockQuestions.filter(q => {
      return (filters.domain === 'all' || q.domain === filters.domain) &&
             (filters.difficulty === 'all' || q.difficulty === filters.difficulty) &&
             (filters.platform === 'all' || q.platform === filters.platform) &&
             (filters.topic === 'all' || q.topic === filters.topic) &&
             (filters.sourceType === 'all' || q.sourceType === filters.sourceType);
    });

    // For contest mode, limit to 5 questions and add timer
    if (mode === 'contest') {
      filteredQuestions = filteredQuestions.slice(0, 5);
      filteredQuestions = filteredQuestions.map(q => ({
        ...q,
        timeLimit: 30, // 30 minutes per question in contest mode
        contestMode: true
      }));
    }

    return {
      data: filteredQuestions,
      total: filteredQuestions.length,
      mode
    };
  }

  getMockQuestion(id) {
    const mockQuestions = {
      1: {
        id: 1,
        title: "Two Sum",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: "easy",
        platform: "leetcode",
        topic: "arrays",
        domain: "dsa",
        sourceType: "scraped",
        externalUrl: "https://leetcode.com/problems/two-sum/",
        tags: ["Array", "Hash Table"],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ],
        testCases: [
          {
            input: { nums: [2, 7, 11, 15], target: 9 },
            output: [0, 1]
          },
          {
            input: { nums: [3, 2, 4], target: 6 },
            output: [1, 2]
          },
          {
            input: { nums: [3, 3], target: 6 },
            output: [0, 1]
          }
        ]
      },
      2: {
        id: 2,
        title: "Longest Palindromic Substring",
        description: `Given a string s, return the longest palindromic substring in s.

A string is palindromic if it reads the same forward and backward.`,
        difficulty: "medium",
        platform: "leetcode",
        topic: "strings",
        domain: "interview",
        sourceType: "ai",
        tags: ["String", "Dynamic Programming"],
        examples: [
          {
            input: 's = "babad"',
            output: '"bab"',
            explanation: 'Note: "aba" is also a valid answer.'
          },
          {
            input: 's = "cbbd"',
            output: '"bb"',
            explanation: 'The longest palindromic substring is "bb".'
          }
        ],
        constraints: [
          "1 <= s.length <= 1000",
          "s consist of only digits and English letters."
        ]
      }
    };

    // Default question if ID not found
    const question = mockQuestions[id] || mockQuestions[1];
    
    return { data: question };
  }
}

const practiceService = new PracticeService();
export default practiceService;
