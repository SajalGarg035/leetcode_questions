import Papa from 'papaparse';

export const loadQuestionsFromCSV = async (company) => {
  console.log(`🔥 loadQuestionsFromCSV called for company: ${company}`);
  
  try {
    // Try different possible file names for the CSV
    const possibleFiles = [
      '5. All.csv',
      'All.csv', 
      '5.All.csv',
      'all.csv'
    ];
    
    console.log(`🔍 Trying files for ${company}:`, possibleFiles);
    
    let csvText = null;
    let foundFile = null;
    
    for (const fileName of possibleFiles) {
      console.log(`📁 Trying to fetch: /leetcode-company-wise-problems/${company}/${fileName}`);
      try {
        const response = await fetch(`/leetcode-company-wise-problems/${company}/${fileName}`);
        console.log(`📡 Response status for ${fileName}:`, response.status, response.ok);
        if (response.ok) {
          csvText = await response.text();
          foundFile = fileName;
          console.log(`✅ Found file: ${fileName}, text length: ${csvText.length}`);
          
          // Debug: Check if we got HTML instead of CSV
          if (csvText.includes('<!DOCTYPE html>')) {
            console.log(`❌ Got HTML instead of CSV! File not found or not served correctly.`);
            console.log(`💡 Make sure ${company}/${fileName} exists in the public folder.`);
            continue; // Try next file
          }
          
          console.log(`📄 First 100 chars of CSV:`, csvText.substring(0, 100));
          break;
        }
      } catch (error) {
        console.log(`❌ Error fetching ${fileName}:`, error);
        continue;
      }
    }
    
    if (!csvText) {
      console.log(`💥 No CSV file found for ${company}`);
      throw new Error(`No CSV file found for ${company}`);
    }
    
    console.log(`🎯 About to parse CSV for ${company}, file: ${foundFile}`);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(`✨ Papa.parse complete for ${company}/${foundFile}`);
          console.log(`Parsed ${results.data.length} questions from ${company}/${foundFile}`);
          
          // Debug: Log the raw CSV data to see the structure
          console.log(`Raw CSV data for ${company}:`, results.data);
          console.log(`First row keys:`, results.data[0] ? Object.keys(results.data[0]) : 'No data');
          console.log(`First row data:`, results.data[0]);
          console.log(`Second row data:`, results.data[1]);
          
          const validQuestions = results.data.filter(row => {
            console.log(`Checking row:`, row);
            console.log(`Row.Title:`, row.Title);
            console.log(`Row.Title exists:`, row.Title && row.Title.trim());
            return row.Title && row.Title.trim();
          }).map(row => ({
            question: row.Title,
            difficulty: row.Difficulty,
            category: row.Topics,
            link: row.Link,
            frequency: row.Frequency,
            acceptanceRate: row['Acceptance Rate']
          }));
          
          // Debug: Log the parsed questions structure
          console.log(`Valid questions for ${company}:`, validQuestions);
          console.log(`Sample question structure:`, validQuestions[0]);
          console.log(`Questions array length:`, validQuestions.length);
          
          resolve(validQuestions);
        },
        error: (error) => {
          console.log(`💥 Papa.parse error for ${company}:`, error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.log(`💥 Outer catch error for ${company}:`, error);
    throw new Error(`Error loading questions for ${company}: ${error.message}`);
  }
};

// Function to discover companies by trying to access their CSV files
export const discoverAvailableCompanies = async () => {
  console.log('Starting company discovery...');
  
  const potentialCompanies = [
  "AMD",
  "AQR Capital Management",
  "Accenture",
  "Accolite",
  "Acko",
  "Activision",
  "Adobe",
  "Affirm",
  "Agoda",
  "Airbnb",
  "Airbus SE",
  "Airtel",
  "Airwallex",
  "Akamai",
  "Akuna Capital",
  "Alibaba",
  "Altimetrik",
  "Amadeus",
  "Amazon",
  "Amdocs",
  "American Express",
  "Analytics quotient",
  "Anduril",
  "Aon",
  "Apollo.io",
  "AppDynamics",
  "AppFolio",
  "Apple",
  "Applied Intuition",
  "Arcesium",
  "Arista Networks",
  "Asana",
  "Atlassian",
  "Attentive",
  "Audible",
  "Aurora",
  "Autodesk",
  "Avalara",
  "Avito",
  "Axon",
  "BILL Holdings",
  "BNY Mellon",
  "BP",
  "Baidu",
  "Bank of America",
  "Barclays",
  "Bentley Systems",
  "BharatPe",
  "BitGo",
  "BlackRock",
  "BlackStone",
  "Blizzard",
  "Block",
  "Bloomberg",
  "Bolt",
  "Booking.com",
  "Bosch",
  "Box",
  "Braze",
  "Brex",
  "Bridgewater Associates",
  "ByteDance",
  "CARS24",
  "CEDCOSS",
  "CME Group",
  "CRED",
  "CTC",
  "CVENT",
  "Cadence",
  "Canonical",
  "Capgemini",
  "Capital One",
  "Careem",
  "Cashfree",
  "Celigo",
  "Chewy",
  "Chime",
  "Circle",
  "Cisco",
  "Citadel",
  "Citigroup",
  "Citrix",
  "Clari",
  "Cleartrip",
  "Cloudera",
  "Cloudflare",
  "Coforge",
  "Cognizant",
  "Cohesity",
  "Coinbase",
  "Comcast",
  "Commvault",
  "Compass",
  "Confluent",
  "ConsultAdd",
  "Coupang",
  "Coursera",
  "Coveo",
  "Credit Karma",
  "Criteo",
  "CrowdStrike",
  "Cruise",
  "CureFit",
  "DE Shaw",
  "DP world",
  "DRW",
  "DXC Technology",
  "Darwinbox",
  "Databricks",
  "Datadog",
  "Dataminr",
  "Delhivery",
  "Deliveroo",
  "Dell",
  "Deloitte",
  "DeltaX",
  "Deutsche Bank",
  "DevRev",
  "Devsinc",
  "Devtron",
  "Directi",
  "Disney",
  "Docusign",
  "DoorDash",
  "Dream11",
  "Dropbox",
  "Druva",
  "Dunzo",
  "Duolingo",
  "EPAM Systems",
  "EY",
  "EarnIn",
  "Edelweiss Group",
  "Electronic Arts",
  "Epic Systems",
  "Expedia",
  "FPT",
  "FactSet",
  "Faire",
  "Fastenal",
  "Fidelity",
  "Fiverr",
  "Flexera",
  "Flexport",
  "Flipkart",
  "Fortinet",
  "Freecharge",
  "FreshWorks",
  "GE Digital",
  "GE Healthcare",
  "GSA Capital",
  "GSN Games",
  "Gameskraft",
  "Garmin",
  "Geico",
  "General Motors",
  "Genpact",
  "GoDaddy",
  "Gojek",
  "Goldman Sachs",
  "Google",
  "Grab",
  "Grammarly",
  "Graviton",
  "Groupon",
  "Groww",
  "Grubhub",
  "Guidewire",
  "Gusto",
  "HCL",
  "HP",
  "HPE",
  "HSBC",
  "Harness",
  "HashedIn",
  "Hertz",
  "HiLabs",
  "Highspot",
  "Hive",
  "Hiver",
  "Honeywell",
  "Hotstar",
  "Houzz",
  "Huawei",
  "Hubspot",
  "Hudson River Trading",
  "Hulu",
  "IBM",
  "IIT Bombay",
  "IMC",
  "INDmoney",
  "IVP",
  "IXL",
  "InMobi",
  "Indeed",
  "Info Edge",
  "Informatica",
  "Infosys",
  "Instacart",
  "Intel",
  "Intuit",
  "J.P. Morgan",
  "Jane Street",
  "Jump Trading",
  "Juniper Networks",
  "Juspay",
  "KLA",
  "Kakao",
  "Karat",
  "Komprise",
  "LINE",
  "LTI",
  "Larsen & Toubro",
  "Lendingkart Technologies",
  "Lenskart",
  "Licious",
  "Liftoff",
  "LinkedIn",
  "LiveRamp",
  "Lowe's",
  "Lucid",
  "Luxoft",
  "Lyft",
  "MAQ Software",
  "MSCI",
  "Machine Zone",
  "MakeMyTrip",
  "Mapbox",
  "Mastercard",
  "MathWorks",
  "McKinsey",
  "Media.net",
  "Meesho",
  "Mercari",
  "Meta",
  "Microsoft",
  "Microstrategy",
  "Millennium",
  "MindTree",
  "Mindtickle",
  "Miro",
  "Mitsogo",
  "Mixpanel",
  "Mobileye",
  "Moengage",
  "Moloco",
  "MongoDB",
  "Morgan Stanley",
  "Mountblue",
  "Moveworks",
  "Myntra",
  "NCR",
  "Nagarro",
  "National Instruments",
  "National Payments Corporation of India",
  "Navan",
  "Navi",
  "NetApp",
  "NetEase",
  "Netflix",
  "Netskope",
  "Netsuite",
  "Nextdoor",
  "Niantic",
  "Nielsen",
  "Nike",
  "NinjaCart",
  "Nokia",
  "Nordstrom",
  "Notion",
  "Nuro",
  "Nutanix",
  "Nvidia",
  "Nykaa",
  "OKX",
  "Odoo",
  "Okta",
  "Ola Cabs",
  "OpenAI",
  "Opendoor",
  "Optiver",
  "Optum",
  "Oracle",
  "Otter.ai",
  "Ozon",
  "Palantir Technologies",
  "Palo Alto Networks",
  "Patreon",
  "PayPal",
  "PayPay",
  "PayU",
  "Paycom",
  "Paytm",
  "Peloton",
  "PhonePe",
  "Pinterest",
  "Pocket Gems",
  "Point72",
  "Pony.ai",
  "PornHub",
  "Poshmark",
  "Postmates",
  "PubMatic",
  "Publicis Sapient",
  "Pure Storage",
  "Pwc",
  "QBurst",
  "Qualcomm",
  "Qualtrics",
  "Quora",
  "RBC",
  "Rakuten",
  "Reddit",
  "Remitly",
  "Revolut",
  "Riot Games",
  "Ripple",
  "Rippling",
  "Rivian",
  "Robinhood",
  "Roblox",
  "Roche",
  "Rokt",
  "Roku",
  "Rubrik",
  "SAP",
  "SIG",
  "SOTI",
  "Salesforce",
  "Samsara",
  "Samsung",
  "Scale AI",
  "Sentry",
  "ServiceNow",
  "ShareChat",
  "Shopee",
  "Shopify",
  "Siemens",
  "Sigmoid",
  "Slice",
  "Smartsheet",
  "Snap",
  "Snapdeal",
  "Snowflake",
  "SoFi",
  "Societe Generale",
  "Softwire",
  "Sony",
  "SoundHound",
  "Splunk",
  "Spotify",
  "Sprinklr",
  "Squarepoint Capital",
  "Squarespace",
  "StackAdapt",
  "Stackline",
  "Stripe",
  "Sumo Logic",
  "Swiggy",
  "Synopsys",
  "Tanium",
  "Target",
  "Tech Mahindra",
  "Tejas Networks",
  "Tekion",
  "Tencent",
  "Teradata",
  "Tesco",
  "Tesla",
  "Texas Instruments",
  "The Trade Desk",
  "Thomson Reuters",
  "ThoughtWorks",
  "ThousandEyes",
  "Tiger Analytics",
  "TikTok",
  "Tinder",
  "Tinkoff",
  "Toast",
  "Toptal",
  "Tower Research Capital",
  "Trexquant",
  "Trilogy",
  "Tripadvisor",
  "TuSimple",
  "Turing",
  "Turo",
  "Turvo",
  "Twilio",
  "Twitch",
  "Two Sigma",
  "UBS",
  "UKG",
  "USAA",
  "Uber",
  "UiPath",
  "Unity",
  "Upstart",
  "Urban Company",
  "VK",
  "VMware",
  "Valve",
  "Vanguard",
  "Veeva Systems",
  "Verily",
  "Veritas",
  "Verkada",
  "Vimeo",
  "Virtu Financial",
  "Virtusa",
  "Visa",
  "Walmart Labs",
  "Warnermedia",
  "WatchGuard",
  "Wayfair",
  "Waymo",
  "WeRide",
  "Wealthfront",
  "Wells Fargo",
  "Western Digital",
  "Whatnot",
  "WinZO",
  "Wipro",
  "Wise",
  "Wish",
  "Wissen Technology",
  "Wix",
  "Workday",
  "Works Applications",
  "WorldQuant",
  "X",
  "Yahoo",
  "Yandex",
  "Yelp",
  "Yext",
  "ZS Associates",
  "ZScaler",
  "Zalando",
  "Zendesk",
  "Zenefits",
  "Zepto",
  "Zeta",
  "Zillow",
  "ZipRecruiter",
  "Zluri",
  "Zoho",
  "Zomato",
  "Zoom",
  "Zoox",
  "Zopsmart",
  "Zynga",
  "athenahealth",
  "blinkit",
  "carwale",
  "ciena",
  "eBay",
  "fourkites",
  "instabase",
  "jio",
  "josh technology",
  "opentext",
  "oyo",
  "peak6",
  "persistent systems",
  "razorpay",
  "redbus",
  "smartnews",
  "tcs",
  "thoughtspot",
  "zeta suite"
];

  
  const availableCompanies = [];
  const possibleFiles = ['5. All.csv', 'All.csv', '5.All.csv', 'all.csv'];
  
  // Check companies in smaller batches to avoid overwhelming the browser
  const batchSize = 5;
  
  for (let i = 0; i < potentialCompanies.length; i += batchSize) {
    const batch = potentialCompanies.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (company) => {
      for (const fileName of possibleFiles) {
        try {
          const response = await fetch(`/leetcode-company-wise-problems/${company}/${fileName}`, { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          
          if (response.ok) {
            console.log(`Found: ${company}/${fileName}`);
            return company;
          }
        } catch (error) {
          // Continue to next file
        }
      }
      return null;
    });
    
    const batchResults = await Promise.all(batchPromises);
    const validCompanies = batchResults.filter(company => company !== null);
    availableCompanies.push(...validCompanies);
    
    // Add a small delay between batches
    if (i + batchSize < potentialCompanies.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Log progress
    console.log(`Checked ${i + batchSize}/${potentialCompanies.length} companies, found ${availableCompanies.length} so far`);
  }
  
  console.log(`Discovery complete: Found ${availableCompanies.length} companies`);
  return availableCompanies.sort();
};

export const getAvailableCompanies = () => {
  // Fallback list based on common companies
  return [
    'Accenture', 'Accolite', 'Adobe', 'Amazon', 'Apple', 'Bloomberg', 'ByteDance', 
    'Cisco', 'Coinbase', 'Databricks', 'DoorDash', 'eBay', 'Facebook', 'Goldman Sachs',
    'Google', 'IBM', 'Indeed', 'Intel', 'LinkedIn', 'Lyft', 'Microsoft', 'Netflix', 
    'NVIDIA', 'Oracle', 'PayPal', 'Qualcomm', 'Salesforce', 'Snapchat', 'Tesla', 
    'Uber', 'VMware', 'Yahoo', 'Zoom'
  ];
};
