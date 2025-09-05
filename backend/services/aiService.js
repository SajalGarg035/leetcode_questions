// services/AIService.js

const { Configuration, OpenAIApi } = require("openai");

class AIService {
  constructor() {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "demo-key") {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.openai = new OpenAIApi(configuration);
    } else {
      this.openai = null;
    }
  }

  // Main function to generate questions
  async generateQuestions(options = {}) {
    if (!this.openai) {
      console.log("Generating mock questions (no OpenAI key configured)");
      return this.generateMockQuestions(options);
    }

    try {
      // Call OpenAI API here if real implementation is needed
      // For now, fallback to mock since prompt doesn’t include OpenAI prompt structure
      return this.generateMockQuestions(options);
    } catch (error) {
      console.error("Error generating questions:", error);
      return this.generateMockQuestions(options);
    }
  }

  // Mock question generator
  generateMockQuestions(options) {
    const {
      count = 5,
      difficulty = "medium",
      platform = "leetcode",
      topic = "arrays",
      domain = "dsa",
    } = options;

    const mockQuestions = [];

    for (let i = 0; i < count; i++) {
      mockQuestions.push({
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Problem ${i + 1}`,
        description: `This is a ${difficulty} level ${topic} problem for ${platform}. Solve this problem using efficient algorithms and data structures.`,
        difficulty,
        platform,
        topic,
        domain,
        sourceType: "ai",
        tags: [topic, difficulty, "algorithm"],
        examples: [
          {
            input: `Example input for ${topic}`,
            output: "Example output",
            explanation: `Explanation for solving ${topic} problem`,
          },
        ],
        constraints: [
          "1 <= n <= 10^5",
          "Time limit: 1 second",
          "Memory limit: 256 MB",
        ],
        testCases: [
          {
            input: { test: "data" },
            output: { result: "expected" },
            isPublic: true,
          },
        ],
        hints: [`Hint: consider ${topic} techniques`, "Think about time complexity"],
        isActive: true,
        createdAt: new Date(),
      });
    }

    return mockQuestions;
  }

  // Parse JSON response into consistent structure
  parseQuestionsFromResponse(response, options) {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const questions = JSON.parse(jsonMatch[0]);

      return questions.map((q, index) => ({
        title: q.title || `Generated Question ${index + 1}`,
        description: q.description || "Generated problem description",
        difficulty: q.difficulty || options.difficulty,
        platform: q.platform || options.platform,
        topic: q.topic || options.topic,
        domain: q.domain || options.domain,
        sourceType: "ai",
        tags: q.tags || [options.topic],
        examples: q.examples || [],
        constraints: q.constraints || [],
        testCases: q.testCases || [],
        hints: q.hints || [],
        isActive: true,
        createdAt: new Date(),
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return this.generateMockQuestions(options);
    }
  }

  // Classify question
  async classifyQuestion(questionText) {
    if (!this.openai) {
      return this.mockClassification();
    }

    try {
      const embedding = await this.openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: questionText,
      });

      return {
        embedding: embedding.data[0].embedding,
        classification: this.mockClassification(),
      };
    } catch (error) {
      console.error("Classification error:", error);
      return this.mockClassification();
    }
  }

  // Mock classifier
  mockClassification() {
    return {
      domain: "dsa",
      topic: "arrays",
      difficulty: "medium",
      tags: ["array", "sorting", "algorithm"],
    };
  }
}

module.exports = new AIService();
