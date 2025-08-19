export interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  // New fields for job posts (optional for backward compatibility)
  applicantsCount?: number;
  viewsCount?: number;
  isRemote?: boolean;
}

export const jobsData: JobItem[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Lagos, Nigeria",
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building scalable web applications using React, TypeScript, and modern frontend technologies. This role involves collaborating with designers and backend developers to create seamless user experiences.",
    skills: ["React", "TypeScript", "JavaScript"],
    applicantsCount: 200,
    viewsCount: 200,
    isRemote: true,
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "InnovateTech",
    location: "Abuja, Nigeria",
    description:
      "Join our growing team as a Full Stack Engineer. You'll work on both frontend and backend development, building robust applications that serve millions of users. Experience with Node.js, React, and cloud platforms is required.",
    skills: ["Node.js", "React", "AWS"],
    applicantsCount: 150,
    viewsCount: 180,
    isRemote: false,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studios",
    location: "Port Harcourt, Nigeria",
    description:
      "We're seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces. You'll work closely with product managers and developers to bring designs to life. Proficiency in Figma and design systems is essential.",
    skills: ["Figma", "UI Design", "Prototyping"],
    applicantsCount: 120,
    viewsCount: 160,
    isRemote: true,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudFirst Inc",
    location: "Kano, Nigeria",
    description:
      "Join our DevOps team to help build and maintain our cloud infrastructure. You'll be responsible for CI/CD pipelines, monitoring, and ensuring high availability of our services. Experience with Docker and Kubernetes required.",
    skills: ["Docker", "Kubernetes", "AWS"],
    applicantsCount: 80,
    viewsCount: 120,
    isRemote: false,
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Ibadan, Nigeria",
    description:
      "We're looking for a Data Scientist to analyze complex datasets and build predictive models. You'll work with large-scale data and help drive business decisions through data insights. Python and machine learning experience required.",
    skills: ["Python", "Machine Learning", "SQL"],
    applicantsCount: 95,
    viewsCount: 140,
    isRemote: true,
  },
  {
    id: 6,
    title: "Mobile App Developer",
    company: "AppWorks",
    location: "Kaduna, Nigeria",
    description:
      "Join our mobile development team to create innovative iOS and Android applications. You'll work with React Native and native technologies to build high-performance mobile apps that users love.",
    skills: ["React Native", "iOS", "Android"],
    applicantsCount: 110,
    viewsCount: 150,
    isRemote: false,
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "ServerTech",
    location: "Enugu, Nigeria",
    description:
      "We need a Backend Developer to build scalable APIs and microservices. You'll work with modern technologies like Go, Python, and cloud platforms to create robust backend systems that support our growing user base.",
    skills: ["Go", "Python", "Microservices"],
    applicantsCount: 130,
    viewsCount: 170,
    isRemote: true,
  },
  {
    id: 8,
    title: "Product Manager",
    company: "ProductHub",
    location: "Jos, Nigeria",
    description:
      "Join our product team to drive the development of innovative software products. You'll work with cross-functional teams to define product strategy, prioritize features, and ensure successful product launches.",
    skills: ["Product Strategy", "Agile", "User Research"],
    applicantsCount: 75,
    viewsCount: 110,
    isRemote: false,
  },
  {
    id: 9,
    title: "QA Engineer",
    company: "QualityFirst",
    location: "Calabar, Nigeria",
    description:
      "We're seeking a QA Engineer to ensure the quality of our software products. You'll design and execute test plans, automate testing processes, and work closely with development teams to identify and resolve issues.",
    skills: ["Test Automation", "Selenium", "Jest"],
    applicantsCount: 85,
    viewsCount: 125,
    isRemote: true,
  },
  {
    id: 10,
    title: "Security Engineer",
    company: "SecureNet",
    location: "Benin City, Nigeria",
    description:
      "Join our security team to protect our systems and data from threats. You'll implement security best practices, conduct security audits, and respond to security incidents. Experience with security tools and compliance required.",
    skills: ["Cybersecurity", "Penetration Testing", "Compliance"],
    applicantsCount: 60,
    viewsCount: 90,
    isRemote: false,
  },
  {
    id: 11,
    title: "Cloud Architect",
    company: "CloudScale",
    location: "Maiduguri, Nigeria",
    description:
      "We need a Cloud Architect to design and implement scalable cloud solutions. You'll work with AWS, Azure, and Google Cloud to create robust infrastructure that supports our growing applications and user base.",
    skills: ["AWS", "Azure", "Terraform"],
    applicantsCount: 70,
    viewsCount: 100,
    isRemote: true,
  },
  {
    id: 12,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Zaria, Nigeria",
    description:
      "Join our AI team to build and deploy machine learning models. You'll work with large datasets, implement ML algorithms, and help integrate AI solutions into our products. Strong Python and ML framework experience required.",
    skills: ["Python", "TensorFlow", "PyTorch"],
    applicantsCount: 90,
    viewsCount: 130,
    isRemote: false,
  },
  {
    id: 13,
    title: "Frontend Developer",
    company: "WebCraft",
    location: "Lagos, Nigeria",
    description:
      "We're looking for a Frontend Developer to create beautiful and responsive web applications. You'll work with modern JavaScript frameworks, CSS, and design systems to build user-friendly interfaces.",
    skills: ["JavaScript", "CSS", "Vue.js"],
    applicantsCount: 140,
    viewsCount: 190,
    isRemote: true,
  },
  {
    id: 14,
    title: "Database Administrator",
    company: "DataSys",
    location: "Abuja, Nigeria",
    description:
      "Join our database team to manage and optimize our database systems. You'll ensure high performance, security, and availability of our data infrastructure. Experience with PostgreSQL and MySQL required.",
    skills: ["PostgreSQL", "MySQL", "Database Design"],
    applicantsCount: 65,
    viewsCount: 95,
    isRemote: false,
  },
  {
    id: 15,
    title: "Network Engineer",
    company: "NetConnect",
    location: "Port Harcourt, Nigeria",
    description:
      "We need a Network Engineer to design and maintain our network infrastructure. You'll work with routers, switches, and network security devices to ensure reliable connectivity and optimal performance.",
    skills: ["Cisco", "Network Security", "VPN"],
    applicantsCount: 55,
    viewsCount: 80,
    isRemote: false,
  },
  {
    id: 16,
    title: "Software Architect",
    company: "ArchitectPro",
    location: "Kano, Nigeria",
    description:
      "Join our architecture team to design scalable software systems. You'll create technical blueprints, establish coding standards, and guide development teams in implementing best practices.",
    skills: ["System Design", "Architecture", "Microservices"],
    applicantsCount: 100,
    viewsCount: 145,
    isRemote: true,
  },
  {
    id: 17,
    title: "UX Researcher",
    company: "UserInsights",
    location: "Ibadan, Nigeria",
    description:
      "We're seeking a UX Researcher to understand user needs and behaviors. You'll conduct user interviews, usability studies, and analyze data to inform product design decisions.",
    skills: ["User Research", "Usability Testing", "Analytics"],
    applicantsCount: 70,
    viewsCount: 105,
    isRemote: false,
  },
  {
    id: 18,
    title: "Site Reliability Engineer",
    company: "ReliabilityFirst",
    location: "Kaduna, Nigeria",
    description:
      "Join our SRE team to ensure the reliability and performance of our systems. You'll implement monitoring, automate operations, and work on incident response to maintain high availability.",
    skills: ["Monitoring", "Automation", "Incident Response"],
    applicantsCount: 80,
    viewsCount: 115,
    isRemote: true,
  },
  {
    id: 19,
    title: "Technical Writer",
    company: "DocTech",
    location: "Enugu, Nigeria",
    description:
      "We need a Technical Writer to create clear and comprehensive documentation for our products. You'll work with development teams to document APIs, user guides, and technical specifications.",
    skills: ["Technical Writing", "Documentation", "API Docs"],
    applicantsCount: 45,
    viewsCount: 70,
    isRemote: false,
  },
  {
    id: 20,
    title: "Scrum Master",
    company: "AgileWorks",
    location: "Jos, Nigeria",
    description:
      "Join our agile team to facilitate Scrum ceremonies and help teams deliver high-quality software. You'll coach teams on agile practices and ensure smooth project delivery.",
    skills: ["Scrum", "Agile", "Team Coaching"],
    applicantsCount: 50,
    viewsCount: 75,
    isRemote: true,
  },
];

// Get unique locations for the dropdown
export const getUniqueLocations = (): string[] => {
  const locations = jobsData.map((job) => job.location);
  return [...new Set(locations)].sort();
};

// Get unique skills for search functionality
export const getUniqueSkills = (): string[] => {
  const allSkills = jobsData.flatMap((job) => job.skills);
  return [...new Set(allSkills)].sort();
};
