export const menuItems = [
    {
        title: "🏆 DXTBidMasters Champion",
        path: "/",
    },
    {
        title: "DXTBidMasters Challenge - Conquer the Test",
        path: "/a",
    },
    {
        title: "DXTBidMasters Challenge - Explore Technology",
        path: "/abc",
    },
    {
        title: "DXTBidMasters Journey - Path to the Top",
        path: "/abcd",
    },
    {
        title: "DXTBidMasters Arena - Overcome All Obstacles",
        path: "/abcde",
    },
    {
        title: "DXTBidMasters Battle - Creativity Unleashed",
        path: "/abcdef",
    }
];

export const dbms = [
    {
        label: "MySQL",
        name: "mysql",
    },
    {
        label: "Postgresql",
        name: "postgresql"
    }
];

export const dbType = [
    {
        label: "SQL",
        name: "sql",
    },
    {
        label: "NoSQL",
        name: "nosql"
    }
];

export const chatHistories = [
    { id: 1, title: "Web Design Trends", description: "Discussing modern web design trends", createdAt: "2024-11-01T08:00:00Z" },
    { id: 2, title: "Learning Programming", description: "Tips for learning programming efficiently", createdAt: "2024-11-02T09:00:00Z" },
    { id: 3, title: "Mobile App Development", description: "Challenges in mobile app development", createdAt: "2024-11-03T10:00:00Z" },
    { id: 4, title: "Code Optimization", description: "Best practices for optimizing code performance", createdAt: "2024-11-04T11:00:00Z" },
    { id: 5, title: "UX/UI Principles", description: "Importance of UX/UI in design", createdAt: "2024-11-05T12:00:00Z" },
    { id: 6, title: "React Basics", description: "Getting started with React", createdAt: "2024-11-06T13:00:00Z" },
    { id: 7, title: "AI in Programming", description: "How AI is used in software development", createdAt: "2024-11-07T14:00:00Z" },
    { id: 8, title: "Agile Development", description: "Improving software development with Agile", createdAt: "2024-11-08T15:00:00Z" },
    { id: 9, title: "Game Development", description: "Exploring game development with code", createdAt: "2024-11-09T16:00:00Z" },
    { id: 10, title: "Node.js for Web Apps", description: "Using Node.js to build web applications", createdAt: "2024-11-10T17:00:00Z" },
    { id: 11, title: "Remote Work Challenges", description: "Overcoming remote work challenges in tech", createdAt: "2024-11-11T18:00:00Z" },
    { id: 12, title: "Blockchain Applications", description: "Exploring real-world blockchain use cases", createdAt: "2024-11-12T19:00:00Z" },
    { id: 13, title: "Python for Software Development", description: "Using Python for software development", createdAt: "2024-11-13T20:00:00Z" },
    { id: 14, title: "AI Chatbots", description: "How AI chatbots are transforming customer service", createdAt: "2024-11-14T21:00:00Z" },
    { id: 15, title: "Cloud Computing", description: "Cloud services and their impact on development", createdAt: "2024-11-15T22:00:00Z" },
    { id: 16, title: "JavaScript Frameworks", description: "Comparing popular JavaScript frameworks", createdAt: "2024-11-16T23:00:00Z" },
    { id: 17, title: "Data Privacy", description: "Best practices for ensuring data privacy", createdAt: "2024-11-17T08:30:00Z" },
    { id: 18, title: "Cybersecurity", description: "Cybersecurity trends and protecting systems", createdAt: "2024-11-18T09:30:00Z" },
    { id: 19, title: "AI and Automation", description: "The role of AI in automation", createdAt: "2024-11-19T10:30:00Z" },
    { id: 20, title: "Virtual Reality", description: "Applications of virtual reality in tech", createdAt: "2024-11-20T11:30:00Z" },
];

export const barData = [
    { name: 'Jan', Sales: 4000, Expenses: 2400 },
    { name: 'Feb', Sales: 3000, Expenses: 1398 },
    { name: 'Mar', Sales: 2000, Expenses: 9800 },
    { name: 'Apr', Sales: 2780, Expenses: 3908 },
    { name: 'May', Sales: 1890, Expenses: 4800 },
    { name: 'Jun', Sales: 2390, Expenses: 3800 },
    { name: 'Jul', Sales: 3490, Expenses: 4300 },
];

export const pieData = [
    { name: 'Direct Sales', value: 400 },
    { name: 'Retail', value: 300 },
    { name: 'Online', value: 300 },
    { name: 'Wholesale', value: 200 },
];

export const sqlCode = `SELECT
  DATE_FORMAT(sale_date, '%Y-%m') AS Month,
  SUM(total_sales) AS TotalSales,
  SUM(total_expenses) AS TotalExpenses
FROM
  sales_expenses
WHERE
  YEAR(sale_date) = 2023
GROUP BY
  DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY
  Month ASC;
`;

//HackAIthon - 2025

export const javaSkillsData = [
    { name: 'Object-Oriented Programming (OOP)', value: 1 },
    { name: 'Data types and variables', value: 2 },
    { name: 'Control structures', value: 3 },
    { name: 'Exception handling', value: 4 },
    { name: 'Collections Framework', value: 5 },
    { name: 'Generics', value: 6 },
    { name: 'String manipulation', value: 7 },
    { name: 'File I/O operations', value: 8 },
    { name: 'Multithreading', value: 9 },
    { name: 'Lambda expressions', value: 10 },
    { name: 'Stream API', value: 11 },
    { name: 'Annotations', value: 12 },
    { name: 'Reflection API', value: 13 },
    { name: 'Serialization/Deserialization', value: 14 },
    { name: 'Memory management', value: 15 },
    { name: 'Design patterns', value: 16 },
    { name: 'JDBC', value: 17 },
    { name: 'Java 8+ features', value: 18 },
    { name: 'Maven/Gradle', value: 19 },
    { name: 'Spring Framework', value: 20 },
    { name: 'Hibernate/JPA', value: 21 },
    { name: 'Unit testing', value: 22 },
    { name: 'REST API development', value: 23 },
    { name: 'JSON/XML processing', value: 24 },
    { name: 'Version control (Git)', value: 25 },
    { name: 'IDE proficiency', value: 26 },
    { name: 'Code quality practices', value: 27 },
    { name: 'Performance optimization', value: 28 },
    { name: 'Security best practices', value: 29 },
    { name: 'Documentation', value: 30 },
];

export const trainingLinks = [
    {
        title: "Java Programming Basics",
        url: "https://www.example.com/java-basics",
        description: "Learn the fundamentals of Java programming, including syntax, data types, and control structures."
    },
    {
        title: "Advanced Java Concepts",
        url: "https://www.example.com/advanced-java",
        description: "Explore advanced topics in Java such as multithreading, generics, and the Collections Framework."
    },
    {
        title: "Java Design Patterns",
        url: "https://www.example.com/java-design-patterns",
        description: "Understand common design patterns in Java and how to implement them effectively."
    },
    {
        title: "Spring Framework Essentials",
        url: "https://www.example.com/spring-framework",
        description: "Get started with the Spring Framework for building robust Java applications."
    },
    {
        title: "Hibernate and JPA",
        url: "https://www.example.com/hibernate-jpa",
        description: "Learn how to use Hibernate and JPA for object-relational mapping in Java applications."
    }
]

export const roadmaps = [
    {
        id: 101,
        name: "Backend Mastery – Fast Track",
        goal: "Become Backend Developer",
        progress: 65,
        deadline: "2025-07-15",
        status: "on-track"
    },
    {
        id: 102,
        name: "Frontend Foundations",
        goal: "Get comfortable with React & Tailwind",
        progress: 100,
        deadline: "2025-08-01",
        status: "finished"
    },
    {
        id: 103,
        name: "Cloud Career Starter",
        goal: "Prepare for AWS Cloud Practitioner",
        progress: 20,
        deadline: "2025-06-30",
        status: "behind"
    },
    {
        id: 104,
        name: "Data Analytics Essentials",
        goal: "Land a data analyst internship",
        progress: 78,
        deadline: "2025-09-01",
        status: "on-track"
    },
    {
        id: 105,
        name: "DevOps Fastlane",
        goal: "Understand CI/CD and Docker",
        progress: 100,
        deadline: "2025-08-15",
        status: "finished"
    },
    {
        id: 106,
        name: "AI for Beginners",
        goal: "Build foundational AI/ML understanding",
        progress: 30,
        deadline: "2025-07-10",
        status: "behind"
    },
    {
        id: 107,
        name: "Software Engineering Prep",
        goal: "Ace technical interviews",
        progress: 85,
        deadline: "2025-07-30",
        status: "on-track"
    },
    {
        id: 108,
        name: "SQL & Database Mastery",
        goal: "Use SQL confidently at work",
        progress: 100,
        deadline: "2025-06-28",
        status: "finished"
    },
    {
        id: 109,
        name: "Productivity & Habits",
        goal: "Build consistent study habits",
        progress: 90,
        deadline: "2025-06-20",
        status: "on-track"
    },
    {
        id: 110,
        name: "Time Mastery – Study Edition",
        goal: "Build consistent study habits and daily routines",
        progress: 90,
        deadline: "2025-06-20",
        status: "on-track"
    },
    {
        id: 111,
        name: "Focus Booster Sprint",
        goal: "Reduce distractions and improve deep work",
        progress: 100,
        deadline: "2025-06-25",
        status: "finished"
    },
    {
        id: 112,
        name: "Atomic Habits in Action",
        goal: "Apply James Clear’s habit-building techniques",
        progress: 75,
        deadline: "2025-07-05",
        status: "on-track"
    },
    {
        id: 113,
        name: "Consistency Challenge",
        goal: "Study 1 hour daily for 30 days",
        progress: 50,
        deadline: "2025-06-30",
        status: "behind"
    }
];

export const certificate = [
    {
        name: "Introduction to Computer Science",
        issuer: "Coursera",
        issueDate: "2024-09-01",
        credentialID: "COURSERA-CSCI1001",
        credentialURL: "https://coursera.org/verify/COURSERA-CSCI1001",
        category: "Technical",
        certificateFile: null,
        status: "completed"
    },
    {
        name: "Data Structures and Algorithms",
        issuer: "Udemy",
        issueDate: "2025-01-15",
        credentialID: "UDEMY-CSCI2002",
        credentialURL: "https://udemy.com/certificate/UDEMY-CSCI2002",
        category: "Technical",
        certificateFile: null,
        status: "completed"
    },
    {
        name: "Database Systems",
        issuer: "edX",
        issueDate: "2025-05-10",
        credentialID: "EDX-CSCI3010",
        credentialURL: "https://edx.org/verify/EDX-CSCI3010",
        category: "Technical",
        certificateFile: null,
        status: "in-progress"
    },
    {
        name: "Artificial Intelligence Fundamentals",
        issuer: "LinkedIn Learning",
        issueDate: "2025-06-01",
        credentialID: "LI-CSCI4025",
        credentialURL: "https://linkedin.com/learning/certificates/LI-CSCI4025",
        category: "Technical",
        certificateFile: null,
        status: "planned"
    }
];

export const someProfiles = [
  {
    "id": "u001",
    "firstName": "DXTBidMasters",
    "lastName": "FHN.DXT",
    "email": "DXTBidMasters@mail.com",
    "certs": [
      {
        "name": "AWS Certified Solutions Architect – Associate",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-06-15",
        "credentialId": "AWS-123456",
        "category": "technical",
        "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        "fileUrl": "https://example.com/certs/aws-solutions-architect.pdf"
      },
      {
        "name": "Scrum Master Certified (SMC)",
        "issuer": "Scrum Alliance",
        "issueDate": "2022-11-01",
        "credentialId": "SMC-987654",
        "category": "non-technical",
        "url": "https://www.scrumalliance.org/",
        "fileUrl": "https://example.com/certs/scrum-master.pdf"
      },
      {
        "name": "Java SE 8 Programmer I",
        "issuer": "Oracle",
        "issueDate": "2023-06-15",
        "credentialId": "ORCL-JAVA-123456",
        "category": "technical",
        "url": "https://education.oracle.com/java-se-8-programmer-i/pexam_1Z0-808",
        "fileUrl": "https://example.com/certs/java-se-8-programmer-i.pdf"
      }
    ]
  },
  {
    "id": "u002",
    "firstName": "Brian",
    "lastName": "Kumar",
    "email": "brian.kumar@example.com",
    "certs": [
      {
        "name": "Google Professional Data Engineer",
        "issuer": "Google Cloud",
        "issueDate": "2023-04-10",
        "credentialId": "GCP-ENG-223344",
        "category": "technical",
        "url": "https://cloud.google.com/certification/data-engineer",
        "fileUrl": "https://example.com/certs/google-data-engineer.pdf"
      },
      {
        "name": "Tableau Desktop Specialist",
        "issuer": "Tableau",
        "issueDate": "2021-12-05",
        "credentialId": "TAB-999333",
        "category": "technical",
        "url": "https://www.tableau.com/learn/certification",
        "fileUrl": "https://example.com/certs/tableau-desktop.pdf"
      }
    ]
  },
  {
    "id": "u003",
    "firstName": "Carla",
    "lastName": "Lopez",
    "email": "carla.lopez@example.com",
    "certs": [
      {
        "name": "Certified Kubernetes Administrator (CKA)",
        "issuer": "Cloud Native Computing Foundation",
        "issueDate": "2022-08-20",
        "credentialId": "CKA-222222",
        "category": "technical",
        "url": "https://training.linuxfoundation.org/certification/cka/",
        "fileUrl": "https://example.com/certs/kubernetes-cka.pdf"
      },
      {
        "name": "LFCA – Linux Foundation Certified IT Associate",
        "issuer": "Linux Foundation",
        "issueDate": "2023-02-01",
        "credentialId": "LFCA-554433",
        "category": "technical",
        "url": "https://training.linuxfoundation.org/certification/lfca/",
        "fileUrl": "https://example.com/certs/lfca.pdf"
      }
    ]
  },
  {
    "id": "u004",
    "firstName": "Daniel",
    "lastName": "Smith",
    "email": "daniel.smith@example.com",
    "certs": [
      {
        "name": "Salesforce Certified Administrator",
        "issuer": "Salesforce",
        "issueDate": "2023-01-12",
        "credentialId": "SF-ADMIN-789456",
        "category": "technical",
        "url": "https://trailhead.salesforce.com/credentials/administrator",
        "fileUrl": "https://example.com/certs/salesforce-admin.pdf"
      },
      {
        "name": "Trailhead Ranger",
        "issuer": "Salesforce",
        "issueDate": "2022-09-28",
        "credentialId": "RANGER-112233",
        "category": "non-technical",
        "url": "https://trailhead.salesforce.com/en/ranger",
        "fileUrl": "https://example.com/certs/trailhead-ranger.pdf"
      }
    ]
  },
  {
    "id": "u005",
    "firstName": "Eva",
    "lastName": "Tanaka",
    "email": "eva.tanaka@example.com",
    "certs": [
      {
        "name": "Oracle Certified Professional: Java SE 11 Developer",
        "issuer": "Oracle",
        "issueDate": "2023-07-22",
        "credentialId": "ORCL-JSE11-889900",
        "category": "technical",
        "url": "https://education.oracle.com/java-se-11-developer/trackp_623",
        "fileUrl": "https://example.com/certs/oracle-java11.pdf"
      },
      {
        "name": "Oracle Cloud Infrastructure Foundations",
        "issuer": "Oracle",
        "issueDate": "2022-06-10",
        "credentialId": "OCI-FOUND-445566",
        "category": "technical",
        "url": "https://education.oracle.com/oci-foundations",
        "fileUrl": "https://example.com/certs/oci-foundations.pdf"
      }
    ]
  }
];

export const detailRoadmaps = [
  {
    "id": "r001",
    "name": "Become a Java Developer",
    "userId": "u001",
    "goal": "Java Developer",
    "due": "2025-09-01",
    "hpw": 10
  },
  {
    "id": "r002",
    "name": "DevOps Foundations",
    "userId": "u002",
    "goal": "DevOps Engineer",
    "due": "2025-08-15",
    "hpw": 8
  },
  {
    "id": "r003",
    "name": "Machine Learning Basics",
    "userId": "u003",
    "goal": "Machine Learning Engineer",
    "due": "2025-12-31",
    "hpw": 12
  },
  {
    "id": "r004",
    "name": "Fullstack Web Developer Path",
    "userId": "u004",
    "goal": "Fullstack Developer",
    "due": "2026-01-30",
    "hpw": 15
  },
  {
    "id": "r005",
    "name": "Business Analyst Bootcamp",
    "userId": "u005",
    "goal": "Business Analyst",
    "due": "2025-10-20",
    "hpw": 6
  },
  {
    "id": "r006",
    "name": "Cloud Practitioner Journey",
    "userId": "u001",
    "goal": "AWS Cloud Practitioner",
    "due": "2025-07-10",
    "hpw": 5
  },
  {
    "id": "r007",
    "name": "Frontend React Developer",
    "userId": "u003",
    "goal": "Frontend Developer",
    "due": "2025-11-25",
    "hpw": 10
  },
  {
    "id": "r008",
    "userId": "u001",
    "name": "Backend Engineering Crash Course",
    "goal": "Master backend basics in a week",
    "due": "2025-06-07",
    "hpw": 10
  },
];

export const courseNodes = [
  {
    id: "c001",
    name: "Java Basics",
    link: "https://www.udemy.com/course/java-programming",
    status: "finished",
    avg_time_to_finish: 5,
    roadmapId: "r001",
    childs: ["c002"]
  },
  {
    id: "c002",
    name: "OOP in Java",
    link: "https://www.coursera.org/learn/object-oriented-java",
    status: "finished",
    avg_time_to_finish: 4,
    roadmapId: "r001",
    childs: ["c003", "c004"]
  },
  {
    id: "c003",
    name: "Collections Framework",
    link: "https://www.geeksforgeeks.org/collections-in-java-2",
    status: "unfinished",
    avg_time_to_finish: 3,
    roadmapId: "r001",
    childs: ["c005"]
  },
  {
    id: "c004",
    name: "Exception Handling",
    link: "https://www.javatpoint.com/exception-handling-in-java",
    status: "finished",
    avg_time_to_finish: 2,
    roadmapId: "r001",
    childs: ["c005"]
  },
  {
    id: "c005",
    name: "Multithreading",
    link: "https://www.udemy.com/course/multithreading-and-concurrency-in-java",
    status: "unfinished",
    avg_time_to_finish: 6,
    roadmapId: "r001",
    childs: []
  },
  {
    id: "c006",
    name: "Spring Boot Basics",
    link: "https://www.udemy.com/course/spring-boot-tutorial-for-beginners",
    status: "finished",
    avg_time_to_finish: 5,
    roadmapId: "r006",
    childs: ["c007"]
  },
  {
    id: "c007",
    name: "REST API Development",
    link: "https://www.coursera.org/learn/developing-restful-apis",
    status: "finished",
    avg_time_to_finish: 3,
    roadmapId: "r006",
    childs: ["c008"]
  },
  {
    id: "c008",
    name: "Spring Data JPA",
    link: "https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa",
    status: "unfinished",
    avg_time_to_finish: 4,
    roadmapId: "r006",
    childs: ["c009"]
  },
  {
    id: "c009",
    name: "Spring Security",
    link: "https://spring.io/projects/spring-security",
    status: "unfinished",
    avg_time_to_finish: 5,
    roadmapId: "r006",
    childs: ["c010"]
  },
  {
    id: "c010",
    name: "Dockerize Spring App",
    link: "https://www.youtube.com/watch?v=XM7sE7GYKxU",
    status: "unfinished",
    avg_time_to_finish: 3,
    roadmapId: "r006",
    childs: []
  },{
    id: "c011",
    name: "Intro to Backend",
    link: "https://example.com/backend-intro",
    status: "finished",
    avg_time_to_finish: 4,
    roadmapId: "r008",
    childs: ["node-b2"]
  },
  {
    id: "c012",
    name: "Node.js Fundamentals",
    link: "https://example.com/nodejs",
    status: "unfinished",
    avg_time_to_finish: 12,
    roadmapId: "r008",
    childs: ["node-b3"]
  },
  {
    id: "c013",
    name: "Express.js Basics",
    link: "https://example.com/expressjs",
    status: "unfinished",
    avg_time_to_finish: 10,
    roadmapId: "r008",
    childs: ["node-b4"]
  },
  {
    id: "c014",
    name: "MongoDB and Mongoose",
    link: "https://example.com/mongodb",
    status: "unfinished",
    avg_time_to_finish: 14,
    roadmapId: "r008",
    childs: ["node-b5"]
  },
  {
    id: "c015",
    name: "JWT & Authentication",
    link: "https://example.com/jwt-auth",
    status: "unfinished",
    avg_time_to_finish: 10,
    roadmapId: "r008",
    childs: ["node-b6"]
  },
  {
    id: "c016",
    name: "Testing APIs with Postman",
    link: "https://example.com/postman",
    status: "unfinished",
    avg_time_to_finish: 10,
    roadmapId: "r008",
    childs: []
  },
];