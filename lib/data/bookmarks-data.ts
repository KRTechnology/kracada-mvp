export interface JobBookmark {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  logo?: string;
  postedDate: string;
  salary?: string;
}

export interface ArticleBookmark {
  id: string;
  title: string;
  author: string;
  publication: string;
  excerpt: string;
  image?: string;
  readTime: string;
  publishedDate: string;
  category: string;
}

export interface VideoBookmark {
  id: string;
  title: string;
  creator: string;
  platform: string;
  thumbnail?: string;
  duration: string;
  views: string;
  uploadedDate: string;
  description: string;
}

export interface HotelBookmark {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: string;
  image?: string;
  amenities: string[];
  description: string;
  checkIn: string;
  checkOut: string;
}

export const jobsBookmarks: JobBookmark[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    description:
      "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user-friendly web applications using React, TypeScript, and modern CSS frameworks. Experience with state management libraries like Redux or Zustand is required.",
    skills: ["React", "TypeScript"],
    postedDate: "2024-01-15",
    salary: "$120k - $150k",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    description:
      "Join our fast-growing startup as a Full Stack Engineer. You'll work on both frontend and backend development, using Node.js, React, and PostgreSQL. Experience with cloud platforms like AWS or Google Cloud is a plus.",
    skills: ["Node.js", "React"],
    postedDate: "2024-01-14",
    salary: "$100k - $130k",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    description:
      "We're seeking a talented UI/UX Designer to create beautiful and functional user interfaces. You should have experience with Figma, Adobe Creative Suite, and a strong portfolio showcasing your design work.",
    skills: ["Figma", "Adobe Creative Suite"],
    postedDate: "2024-01-13",
    salary: "$90k - $120k",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    description:
      "Looking for a DevOps Engineer to help us scale our infrastructure. You'll work with Docker, Kubernetes, AWS, and CI/CD pipelines. Experience with monitoring tools like Prometheus and Grafana is preferred.",
    skills: ["Docker", "Kubernetes"],
    postedDate: "2024-01-12",
    salary: "$110k - $140k",
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Analytics Corp",
    location: "Boston, MA",
    description:
      "Join our data science team to build machine learning models and analyze large datasets. You should have experience with Python, pandas, scikit-learn, and SQL. Experience with deep learning frameworks is a bonus.",
    skills: ["Python", "Machine Learning"],
    postedDate: "2024-01-11",
    salary: "$130k - $160k",
  },
  {
    id: "6",
    title: "Product Manager",
    company: "ProductHub",
    location: "Seattle, WA",
    description:
      "We're looking for a Product Manager to drive product strategy and execution. You should have experience with agile methodologies, user research, and data analysis. Technical background is a plus.",
    skills: ["Product Strategy", "Agile"],
    postedDate: "2024-01-10",
    salary: "$140k - $170k",
  },
  {
    id: "7",
    title: "Mobile App Developer",
    company: "AppTech Solutions",
    location: "Austin, TX",
    description:
      "Join our mobile development team to build cutting-edge iOS and Android applications. Experience with React Native, Swift, or Kotlin required. Knowledge of mobile UI/UX best practices is essential.",
    skills: ["React Native", "Swift"],
    postedDate: "2024-01-09",
    salary: "$110k - $140k",
  },
  {
    id: "8",
    title: "Security Engineer",
    company: "CyberDefense Inc.",
    location: "Washington, DC",
    description:
      "Help us protect our systems and data from cyber threats. You'll work on security architecture, penetration testing, and incident response. Experience with security tools and compliance frameworks required.",
    skills: ["Cybersecurity", "Penetration Testing"],
    postedDate: "2024-01-08",
    salary: "$130k - $160k",
  },
  {
    id: "9",
    title: "Cloud Architect",
    company: "CloudScale Systems",
    location: "Denver, CO",
    description:
      "Design and implement scalable cloud infrastructure solutions. Experience with AWS, Azure, or Google Cloud Platform required. Knowledge of infrastructure as code and containerization is essential.",
    skills: ["AWS", "Terraform"],
    postedDate: "2024-01-07",
    salary: "$150k - $180k",
  },
  {
    id: "10",
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Palo Alto, CA",
    description:
      "Build and deploy machine learning models at scale. Experience with Python, TensorFlow, PyTorch, and MLOps required. Knowledge of data engineering and model optimization is essential.",
    skills: ["Python", "TensorFlow"],
    postedDate: "2024-01-06",
    salary: "$160k - $190k",
  },
  {
    id: "11",
    title: "Frontend Architect",
    company: "WebTech Pro",
    location: "Chicago, IL",
    description:
      "Lead frontend architecture decisions and mentor junior developers. Deep expertise in modern JavaScript frameworks, performance optimization, and accessibility required. Experience with design systems is a plus.",
    skills: ["JavaScript", "Performance"],
    postedDate: "2024-01-05",
    salary: "$140k - $170k",
  },
  {
    id: "12",
    title: "Backend Developer",
    company: "ServerLogic",
    location: "Portland, OR",
    description:
      "Build robust backend services and APIs. Experience with Node.js, Python, or Java required. Knowledge of databases, caching, and microservices architecture is essential.",
    skills: ["Node.js", "PostgreSQL"],
    postedDate: "2024-01-04",
    salary: "$120k - $150k",
  },
  {
    id: "13",
    title: "QA Automation Engineer",
    company: "TestPro Solutions",
    location: "Raleigh, NC",
    description:
      "Develop and maintain automated test suites for web and mobile applications. Experience with Selenium, Cypress, or Appium required. Knowledge of CI/CD and test automation frameworks is essential.",
    skills: ["Selenium", "Cypress"],
    postedDate: "2024-01-03",
    salary: "$100k - $130k",
  },
  {
    id: "14",
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Atlanta, GA",
    description:
      "Streamline our development and deployment processes. Experience with Docker, Kubernetes, and CI/CD pipelines required. Knowledge of monitoring and logging tools is essential.",
    skills: ["Docker", "Jenkins"],
    postedDate: "2024-01-02",
    salary: "$115k - $145k",
  },
  {
    id: "15",
    title: "UX Researcher",
    company: "UserInsights",
    location: "Minneapolis, MN",
    description:
      "Conduct user research and usability studies to inform product decisions. Experience with research methodologies, user testing, and data analysis required. Knowledge of design tools is a plus.",
    skills: ["User Research", "Usability Testing"],
    postedDate: "2024-01-01",
    salary: "$90k - $120k",
  },
  {
    id: "16",
    title: "Technical Writer",
    company: "DocTech",
    location: "San Diego, CA",
    description:
      "Create clear and comprehensive technical documentation for our products and APIs. Experience with technical writing, API documentation, and developer guides required. Knowledge of programming concepts is essential.",
    skills: ["Technical Writing", "API Documentation"],
    postedDate: "2023-12-31",
    salary: "$80k - $110k",
  },
  {
    id: "17",
    title: "Data Engineer",
    company: "DataFlow Systems",
    location: "Phoenix, AZ",
    description:
      "Build and maintain data pipelines and ETL processes. Experience with Python, SQL, and big data technologies required. Knowledge of data warehousing and streaming platforms is essential.",
    skills: ["Python", "Apache Spark"],
    postedDate: "2023-12-30",
    salary: "$125k - $155k",
  },
  {
    id: "18",
    title: "Game Developer",
    company: "GameStudio Pro",
    location: "Orlando, FL",
    description:
      "Create engaging games for mobile and web platforms. Experience with Unity, Unreal Engine, or game development frameworks required. Knowledge of game design principles and optimization is essential.",
    skills: ["Unity", "C#"],
    postedDate: "2023-12-29",
    salary: "$95k - $125k",
  },
  {
    id: "19",
    title: "Blockchain Developer",
    company: "CryptoTech",
    location: "Miami, FL",
    description:
      "Develop smart contracts and decentralized applications. Experience with Solidity, Web3.js, and blockchain platforms required. Knowledge of cryptography and DeFi protocols is essential.",
    skills: ["Solidity", "Web3.js"],
    postedDate: "2023-12-28",
    salary: "$130k - $160k",
  },
  {
    id: "20",
    title: "Site Reliability Engineer",
    company: "ReliabilityFirst",
    location: "Dallas, TX",
    description:
      "Ensure high availability and performance of our production systems. Experience with monitoring, alerting, and incident response required. Knowledge of infrastructure automation and scaling is essential.",
    skills: ["Monitoring", "Incident Response"],
    postedDate: "2023-12-27",
    salary: "$135k - $165k",
  },
];

export const articlesBookmarks: ArticleBookmark[] = [
  {
    id: "1",
    title: "The Future of Remote Work in 2024",
    author: "Sarah Johnson",
    publication: "Tech Insights",
    excerpt:
      "As we move into 2024, remote work continues to evolve. Companies are adopting hybrid models, and new technologies are making virtual collaboration more seamless than ever. This article explores the latest trends and what to expect in the coming year.",
    readTime: "5 min read",
    publishedDate: "2024-01-15",
    category: "Workplace",
  },
  {
    id: "2",
    title: "10 Essential Skills for Modern Developers",
    author: "Mike Chen",
    publication: "Code Weekly",
    excerpt:
      "The technology landscape is constantly changing, and developers need to stay ahead of the curve. From cloud computing to AI integration, here are the ten most important skills that every developer should master in 2024.",
    readTime: "8 min read",
    publishedDate: "2024-01-14",
    category: "Development",
  },
  {
    id: "3",
    title: "Building Scalable Microservices Architecture",
    author: "Emily Rodriguez",
    publication: "Architecture Today",
    excerpt:
      "Microservices have become the standard for building large-scale applications. Learn the best practices for designing, implementing, and maintaining a robust microservices architecture that can handle millions of requests.",
    readTime: "12 min read",
    publishedDate: "2024-01-13",
    category: "Architecture",
  },
  {
    id: "4",
    title: "The Rise of AI in Software Development",
    author: "David Kim",
    publication: "AI Trends",
    excerpt:
      "Artificial Intelligence is transforming how we write code, debug applications, and deploy software. From GitHub Copilot to automated testing, discover how AI tools are making developers more productive than ever.",
    readTime: "6 min read",
    publishedDate: "2024-01-12",
    category: "AI",
  },
  {
    id: "5",
    title: "Effective Team Communication in Tech",
    author: "Lisa Wang",
    publication: "Leadership Insights",
    excerpt:
      "Communication is key to successful software development teams. Learn practical strategies for improving team collaboration, conducting effective code reviews, and fostering a positive engineering culture.",
    readTime: "7 min read",
    publishedDate: "2024-01-11",
    category: "Leadership",
  },
  {
    id: "6",
    title: "Optimizing Performance in React Applications",
    author: "Alex Thompson",
    publication: "Frontend Focus",
    excerpt:
      "Performance is crucial for user experience. This comprehensive guide covers React optimization techniques including code splitting, lazy loading, memoization, and bundle size optimization strategies.",
    readTime: "10 min read",
    publishedDate: "2024-01-10",
    category: "Frontend",
  },
  {
    id: "7",
    title: "The Future of Web Development in 2024",
    author: "Sarah Chen",
    publication: "Web Dev Weekly",
    excerpt:
      "Explore the latest trends in web development including new frameworks, tools, and methodologies that are shaping the future of the industry.",
    readTime: "8 min read",
    publishedDate: "2024-01-09",
    category: "Development",
  },
  {
    id: "8",
    title: "Building Scalable APIs with GraphQL",
    author: "Michael Rodriguez",
    publication: "API Insights",
    excerpt:
      "Learn how to design and implement scalable GraphQL APIs that provide flexible data fetching capabilities for modern applications.",
    readTime: "12 min read",
    publishedDate: "2024-01-08",
    category: "Backend",
  },
  {
    id: "9",
    title: "The Rise of Edge Computing",
    author: "Emily Watson",
    publication: "Tech Trends",
    excerpt:
      "Discover how edge computing is revolutionizing application performance and user experience by bringing computation closer to users.",
    readTime: "6 min read",
    publishedDate: "2024-01-07",
    category: "Infrastructure",
  },
  {
    id: "10",
    title: "Mastering TypeScript in 2024",
    author: "David Kim",
    publication: "Code Masters",
    excerpt:
      "A comprehensive guide to TypeScript best practices, advanced features, and how to leverage type safety in large-scale applications.",
    readTime: "15 min read",
    publishedDate: "2024-01-06",
    category: "Development",
  },
  {
    id: "11",
    title: "The Art of Code Review",
    author: "Lisa Johnson",
    publication: "Team Practices",
    excerpt:
      "Learn effective code review techniques that improve code quality, knowledge sharing, and team collaboration in software development.",
    readTime: "7 min read",
    publishedDate: "2024-01-05",
    category: "Leadership",
  },
  {
    id: "12",
    title: "Database Design Best Practices",
    author: "Robert Smith",
    publication: "Data Insights",
    excerpt:
      "Explore database design principles, normalization techniques, and optimization strategies for building robust data systems.",
    readTime: "11 min read",
    publishedDate: "2024-01-04",
    category: "Database",
  },
  {
    id: "13",
    title: "Mobile App Security Essentials",
    author: "Jennifer Lee",
    publication: "Security Weekly",
    excerpt:
      "Essential security practices for mobile app development including authentication, data encryption, and secure communication protocols.",
    readTime: "9 min read",
    publishedDate: "2024-01-03",
    category: "Security",
  },
  {
    id: "14",
    title: "The Psychology of User Experience",
    author: "Mark Wilson",
    publication: "UX Psychology",
    excerpt:
      "Understanding user psychology and behavior patterns to create more intuitive and engaging user experiences.",
    readTime: "13 min read",
    publishedDate: "2024-01-02",
    category: "UX",
  },
  {
    id: "15",
    title: "Cloud-Native Development Patterns",
    author: "Amanda Brown",
    publication: "Cloud Architecture",
    excerpt:
      "Modern development patterns for cloud-native applications including microservices, serverless, and containerization strategies.",
    readTime: "14 min read",
    publishedDate: "2024-01-01",
    category: "Cloud",
  },
];

export const videosBookmarks: VideoBookmark[] = [
  {
    id: "1",
    title: "Complete React Tutorial for Beginners",
    creator: "CodeMaster Pro",
    platform: "YouTube",
    duration: "2:34:15",
    views: "1.2M",
    uploadedDate: "2024-01-15",
    description:
      "Learn React from scratch with this comprehensive tutorial. Covers everything from basic concepts to advanced patterns like hooks and context.",
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    creator: "TypeScript Guru",
    platform: "YouTube",
    duration: "1:45:30",
    views: "456K",
    uploadedDate: "2024-01-14",
    description:
      "Master advanced TypeScript patterns including generics, utility types, and type guards. Perfect for developers looking to level up their TypeScript skills.",
  },
  {
    id: "3",
    title: "Docker and Kubernetes Deep Dive",
    creator: "DevOps Academy",
    platform: "YouTube",
    duration: "3:12:45",
    views: "789K",
    uploadedDate: "2024-01-13",
    description:
      "Comprehensive guide to containerization and orchestration. Learn Docker best practices and Kubernetes deployment strategies.",
  },
  {
    id: "4",
    title: "Building REST APIs with Node.js",
    creator: "Backend Mastery",
    platform: "YouTube",
    duration: "1:58:20",
    views: "623K",
    uploadedDate: "2024-01-12",
    description:
      "Step-by-step tutorial on building scalable REST APIs using Node.js, Express, and MongoDB. Includes authentication and error handling.",
  },
  {
    id: "5",
    title: "CSS Grid and Flexbox Mastery",
    creator: "CSS Wizard",
    platform: "YouTube",
    duration: "1:23:10",
    views: "892K",
    uploadedDate: "2024-01-11",
    description:
      "Master modern CSS layout techniques with Grid and Flexbox. Learn responsive design patterns and advanced styling techniques.",
  },
  {
    id: "6",
    title: "Git and GitHub Best Practices",
    creator: "Version Control Pro",
    platform: "YouTube",
    duration: "1:15:45",
    views: "1.1M",
    uploadedDate: "2024-01-10",
    description:
      "Learn Git workflows, branching strategies, and collaboration techniques. Perfect for teams working on shared codebases.",
  },
  {
    id: "7",
    title: "Advanced CSS Grid Techniques",
    creator: "CSS Mastery",
    platform: "YouTube",
    duration: "2:05:30",
    views: "756K",
    uploadedDate: "2024-01-09",
    description:
      "Master advanced CSS Grid techniques for creating complex layouts and responsive designs.",
  },
  {
    id: "8",
    title: "React Performance Optimization",
    creator: "React Pro",
    platform: "YouTube",
    duration: "1:45:20",
    views: "892K",
    uploadedDate: "2024-01-08",
    description:
      "Learn advanced React performance optimization techniques including memoization, code splitting, and bundle optimization.",
  },
  {
    id: "9",
    title: "Node.js Security Best Practices",
    creator: "Security Expert",
    platform: "YouTube",
    duration: "1:30:15",
    views: "445K",
    uploadedDate: "2024-01-07",
    description:
      "Essential security practices for Node.js applications including authentication, authorization, and data validation.",
  },
  {
    id: "10",
    title: "Docker for Beginners",
    creator: "Container Master",
    platform: "YouTube",
    duration: "2:20:45",
    views: "1.3M",
    uploadedDate: "2024-01-06",
    description:
      "Complete beginner's guide to Docker containerization, from basic concepts to advanced deployment strategies.",
  },
  {
    id: "11",
    title: "AWS Lambda Deep Dive",
    creator: "Cloud Guru",
    platform: "YouTube",
    duration: "1:55:30",
    views: "678K",
    uploadedDate: "2024-01-05",
    description:
      "Comprehensive guide to AWS Lambda serverless computing, including best practices and optimization techniques.",
  },
  {
    id: "12",
    title: "Python Data Science Fundamentals",
    creator: "Data Science Pro",
    platform: "YouTube",
    duration: "3:10:20",
    views: "1.5M",
    uploadedDate: "2024-01-04",
    description:
      "Learn the fundamentals of data science with Python, including pandas, numpy, and matplotlib libraries.",
  },
  {
    id: "13",
    title: "Vue.js 3 Complete Course",
    creator: "Vue Master",
    platform: "YouTube",
    duration: "4:25:15",
    views: "987K",
    uploadedDate: "2024-01-03",
    description:
      "Complete Vue.js 3 course covering composition API, reactivity, and building real-world applications.",
  },
  {
    id: "14",
    title: "MongoDB Database Design",
    creator: "Database Expert",
    platform: "YouTube",
    duration: "2:15:40",
    views: "567K",
    uploadedDate: "2024-01-02",
    description:
      "Learn MongoDB database design principles, schema optimization, and best practices for NoSQL databases.",
  },
  {
    id: "15",
    title: "Flutter App Development",
    creator: "Mobile Dev Pro",
    platform: "YouTube",
    duration: "3:45:30",
    views: "1.2M",
    uploadedDate: "2024-01-01",
    description:
      "Complete Flutter development course for building cross-platform mobile applications with Dart.",
  },
];

export const hotelsBookmarks: HotelBookmark[] = [
  {
    id: "1",
    name: "Grand Plaza Hotel",
    location: "New York, NY",
    rating: 4.8,
    price: "$299/night",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    description:
      "Luxury hotel in the heart of Manhattan with stunning city views. Perfect for business travelers and tourists alike.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "2",
    name: "Oceanview Resort & Spa",
    location: "Miami Beach, FL",
    rating: 4.6,
    price: "$450/night",
    amenities: ["Beach Access", "Spa", "Pool", "Gym"],
    description:
      "Beachfront resort with private beach access and world-class spa facilities. Ideal for a relaxing getaway.",
    checkIn: "4:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: "3",
    name: "Mountain Lodge Retreat",
    location: "Aspen, CO",
    rating: 4.9,
    price: "$380/night",
    amenities: ["Skiing", "Hot Tub", "Restaurant", "Fireplace"],
    description:
      "Cozy mountain lodge with ski-in/ski-out access. Perfect for winter sports enthusiasts and nature lovers.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "4",
    name: "Urban Boutique Hotel",
    location: "San Francisco, CA",
    rating: 4.4,
    price: "$220/night",
    amenities: ["Free WiFi", "Gym", "Restaurant", "Bar"],
    description:
      "Modern boutique hotel in the trendy Mission District. Close to tech companies and cultural attractions.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "5",
    name: "Historic Inn & Suites",
    location: "Charleston, SC",
    rating: 4.7,
    price: "$180/night",
    amenities: ["Historic Charm", "Garden", "Restaurant", "Free WiFi"],
    description:
      "Beautifully restored historic inn with southern charm. Located in the heart of Charleston's historic district.",
    checkIn: "4:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: "6",
    name: "Desert Oasis Resort",
    location: "Palm Springs, CA",
    rating: 4.5,
    price: "$320/night",
    amenities: ["Pool", "Spa", "Golf", "Restaurant"],
    description:
      "Luxury desert resort with stunning mountain views. Features world-class golf courses and spa facilities.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "7",
    name: "Coastal Retreat Inn",
    location: "Malibu, CA",
    rating: 4.7,
    price: "$580/night",
    amenities: ["Beach Access", "Ocean View", "Spa", "Restaurant"],
    description:
      "Exclusive beachfront inn with private beach access and stunning Pacific Ocean views. Perfect for a romantic getaway.",
    checkIn: "4:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: "8",
    name: "Urban Loft Hotel",
    location: "Brooklyn, NY",
    rating: 4.3,
    price: "$280/night",
    amenities: ["Rooftop Bar", "Gym", "Restaurant", "Free WiFi"],
    description:
      "Modern boutique hotel in trendy Brooklyn with industrial-chic design and rooftop views of Manhattan skyline.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "9",
    name: "Mountain View Lodge",
    location: "Banff, AB",
    rating: 4.8,
    price: "$420/night",
    amenities: ["Mountain View", "Skiing", "Hot Tub", "Restaurant"],
    description:
      "Rustic luxury lodge in the heart of the Canadian Rockies with breathtaking mountain views and outdoor activities.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "10",
    name: "Tropical Paradise Resort",
    location: "Maui, HI",
    rating: 4.6,
    price: "$650/night",
    amenities: ["Beach Access", "Pool", "Spa", "Golf"],
    description:
      "Luxury tropical resort with pristine beaches, world-class amenities, and authentic Hawaiian hospitality.",
    checkIn: "4:00 PM",
    checkOut: "12:00 PM",
  },
];
