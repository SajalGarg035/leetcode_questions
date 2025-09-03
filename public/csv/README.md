# LeetCode Company-wise Problems Directory

This application automatically discovers companies from your `leetcode-company-wise-problems` folder structure.

## Expected Folder Structure
```
public/
└── leetcode-company-wise-problems/
    ├── Accenture/
    │   └── 5. All.csv
    ├── Accolite/
    │   └── 5. All.csv
    ├── Adobe/
    │   └── 5. All.csv
    └── [CompanyName]/
        └── 5. All.csv (or All.csv)
```

## CSV Format
Each company's CSV file should have the following headers:
- `Difficulty` (required) - EASY, MEDIUM, HARD
- `Title` (required) - The question title
- `Frequency` (optional) - Frequency score (e.g., 100.0, 87.5)
- `Acceptance Rate` (optional) - Decimal acceptance rate (e.g., 0.540826122720978)
- `Link` (required) - URL to the LeetCode problem
- `Topics` (optional) - Comma-separated topics (e.g., "Math, Brainteaser")

## Example CSV Content
```csv
Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
MEDIUM,Bulb Switcher,100.0,0.540826122720978,https://leetcode.com/problems/bulb-switcher,"Math, Brainteaser"
EASY,Happy Number,99.0,0.580726470983853,https://leetcode.com/problems/happy-number,"Hash Table, Math, Two Pointers"
EASY,Two Sum,95.7,0.557770016057161,https://leetcode.com/problems/two-sum,"Array, Hash Table"
```

## File Name Variations Supported
The application will automatically check for these file names in each company folder:
- `5. All.csv` (most common)
- `All.csv`
- `5.All.csv`
- `all.csv`

## Features
- ✅ Automatic company discovery from folder structure
- ✅ Multiple file name format support
- ✅ Company-wise question organization
- ✅ Progress tracking with checkboxes
- ✅ Difficulty-based color coding
- ✅ Frequency indicators
- ✅ Acceptance rate display
- ✅ Topic tags
- ✅ Direct links to LeetCode problems
- ✅ Load more functionality (5 questions at a time)
- ✅ Responsive design
- ✅ Clean, modern UI

## Supported Companies (Auto-detected)
The application will automatically detect any company folder that contains an `All.csv` file. Based on your current structure:
- Accolite
- Accenture
- Acko
- Activision
- Adobe
- (and any additional companies you add)

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header/
│   ├── CompanySelector/
│   ├── QuestionList/
│   ├── QuestionItem/
│   └── LoadMoreButton/
├── hooks/              # Custom React hooks
├── services/           # API and data services
└── App.js             # Main application component
```

## Setup Instructions
1. Ensure your `leetcode-company-wise-problems` folder is in the `public` directory
2. Each company folder should contain an `All.csv` file with the correct format
3. Run `npm install` to install dependencies
4. Run `npm start` to start the development server
5. The application will automatically discover and list available companies
