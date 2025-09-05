class CorePracticeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.useMock = true; // keep true so it works without backend
  }

  async getCoreQuestions(filters = {}) {
    if (!this.useMock) {
      try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${this.baseURL}/core-questions?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock core questions', err.message);
      }
    }

    const mock = this._mockCoreQuestions(filters);
    return { data: mock, total: mock.length };
  }

  _mockCoreQuestions(filters) {
    const pool = {
      dbms: [
        {
          id: 'dbms-1',
          question: 'What is normalization? Explain 1NF, 2NF, 3NF with examples.',
          answer: 'Normalization is the process of organizing data to reduce redundancy. 1NF: atomic values; 2NF: no partial dependencies; 3NF: no transitive dependencies. Example: separate author table from book table when authors repeat.',
          sourceName: 'GeeksforGeeks',
          sourceUrl: 'https://www.geeksforgeeks.org/database-normalization/',
          difficulty: 'Easy',
          companyTags: ['Amazon','Google'],
          isMCQ: false
        },
        {
          id: 'dbms-2',
          question: 'Explain ACID properties in DBMS.',
          answer: 'ACID stands for Atomicity, Consistency, Isolation, Durability. Atomicity ensures transactions are all-or-nothing; Consistency ensures DB moves between valid states; Isolation keeps concurrent transactions independent; Durability persists committed changes.',
          sourceName: 'TutorialsPoint',
          sourceUrl: 'https://www.tutorialspoint.com/dbms/dbms_transactions.htm',
          difficulty: 'Medium',
          companyTags: ['Microsoft'],
          isMCQ: false
        }
      ],
      os: [
        {
          id: 'os-1',
          question: 'What is a process vs a thread?',
          answer: 'A process is an independent program in execution with its own memory; a thread is a lightweight unit within a process sharing memory. Threads enable concurrency within the same process.',
          sourceName: 'GeeksforGeeks',
          sourceUrl: 'https://www.geeksforgeeks.org/difference-between-process-and-thread/',
          difficulty: 'Easy',
          companyTags: ['TCS','Infosys'],
          isMCQ: false
        }
      ],
      cn: [
        {
          id: 'cn-1',
          question: 'Explain the difference between TCP and UDP.',
          answer: 'TCP is connection-oriented and reliable with flow/congestion control; UDP is connectionless and faster, used for streaming and low-latency apps.',
          sourceName: 'GeeksforGeeks',
          sourceUrl: 'https://www.geeksforgeeks.org/difference-between-tcp-and-udp/',
          difficulty: 'Easy',
          companyTags: ['Cisco'],
          isMCQ: false
        }
      ],
      oops: [
        {
          id: 'oops-1',
          question: 'What is polymorphism? Give example in Java.',
          answer: 'Polymorphism allows objects to be treated as instances of their parent class where overridden methods provide specific behavior. Example: method overriding in Java using subclasses.',
          sourceName: 'TutorialsPoint',
          sourceUrl: 'https://www.tutorialspoint.com/java/java_polymorphism.htm',
          difficulty: 'Easy',
          companyTags: ['Amazon'],
          isMCQ: false
        }
      ],
      se: [
        {
          id: 'se-1',
          question: 'What are the SDLC phases?',
          answer: 'SDLC phases: Requirement, Design, Implementation, Testing, Deployment, Maintenance.',
          sourceName: 'GeeksforGeeks',
          sourceUrl: 'https://www.geeksforgeeks.org/software-engineering/',
          difficulty: 'Easy',
          companyTags: [],
          isMCQ: false
        }
      ],
      hr: [
        {
          id: 'hr-1',
          question: 'Tell me about a time you had a conflict in a team and how you resolved it.',
          answer: 'Use STAR: Situation, Task, Action, Result. Focus on actions you took and the positive outcome or lessons learned.',
          sourceName: 'InterviewBit',
          sourceUrl: 'https://www.interviewbit.com/career-corner/behavioral-interview-questions/',
          difficulty: 'Easy',
          companyTags: [],
          isMCQ: false
        }
      ]
    };

    const selected = pool[filters.topic] || pool['dbms'];
    let out = selected.slice();

    if (filters.difficulty) {
      out = out.filter(q => (q.difficulty || 'Easy').toLowerCase() === filters.difficulty.toLowerCase());
    }
    if (filters.mostAsked) {
      out = out.slice(0, 1);
    }
    if (filters.company) {
      out = out.filter(q => q.companyTags && q.companyTags.includes(filters.company));
    }
    return out;
  }
}

const corePracticeService = new CorePracticeService();
export default corePracticeService;
