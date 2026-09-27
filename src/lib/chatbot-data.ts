/**
 * Local knowledge base for the Student Query Chatbot.
 *
 * NOTE: All details below are SAMPLE/DEMO data for an academic project.
 * They do not describe a real college.
 */

export type Intent = {
  /** Machine name of the intent, e.g. "fees" */
  tag: string;
  /** Human label shown in the UI */
  label: string;
  /** Example ways a student may phrase this question */
  examples: string[];
  /** Keywords used by the matcher (single words or short phrases) */
  keywords: string[];
  /** Predefined answer returned when this intent wins */
  response: string;
};

export const FALLBACK_RESPONSE =
  "I'm sorry, I couldn't understand your question. Please ask about courses, admissions, fees, timings, exams, library, hostel, transport, placements, or contact information.";

export const WELCOME_MESSAGE =
  "Hello! I'm the Student Query Assistant for Sample Institute of Technology (demo data). Ask me about courses, admissions, fees, timings, exams, library, hostel, transport, placements, location or contact details.";

export const INTENTS: Intent[] = [
  {
    tag: "greeting",
    label: "Greeting",
    examples: ["hi", "hello there", "good morning"],
    keywords: ["hi", "hello", "hey", "good morning", "good evening", "namaste"],
    response:
      "Hi there! I can help with course, fee, admission, timing and campus questions. What would you like to know?",
  },
  {
    tag: "courses",
    label: "Courses",
    examples: [
      "What courses are available?",
      "Which courses do you offer?",
      "Tell me about the courses",
    ],
    keywords: ["course", "courses", "program", "programme", "programs", "degree", "branch", "stream", "subjects"],
    response:
      "We offer B.Tech in Computer Science, Information Technology, Electronics & Communication, Mechanical and Civil Engineering, plus MCA, MBA and B.Sc. Computer Science. (Sample data)",
  },
  {
    tag: "departments",
    label: "Departments",
    examples: ["What departments are there?", "List the departments"],
    keywords: ["department", "departments", "faculty", "dept"],
    response:
      "There are seven departments: Computer Science, Information Technology, Electronics & Communication, Mechanical, Civil, Management Studies and Basic Sciences. (Sample data)",
  },
  {
    tag: "duration",
    label: "Course duration",
    examples: ["How long is the course?", "What is the course duration?"],
    keywords: ["duration", "how long", "years", "semester count", "length of course"],
    response:
      "B.Tech programmes run for 4 years (8 semesters), MCA and MBA for 2 years (4 semesters), and B.Sc. for 3 years. (Sample data)",
  },
  {
    tag: "admission",
    label: "Admission",
    examples: [
      "How do I apply for admission?",
      "What is the admission process?",
      "Tell me about eligibility",
    ],
    keywords: ["admission", "admissions", "apply", "application", "enroll", "enrol", "eligibility", "entrance", "join"],
    response:
      "Admissions open in May each year. Apply online, upload your 10th/12th marksheets and entrance score, then attend counselling. Minimum eligibility for B.Tech is 60% in Physics, Chemistry and Mathematics. (Sample data)",
  },
  {
    tag: "fees",
    label: "Fees",
    examples: ["What are the fees?", "How much is the tuition fee?", "Fee structure please"],
    keywords: ["fee", "fees", "tuition", "cost", "price", "payment", "scholarship", "how much"],
    response:
      "B.Tech tuition is Rs. 85,000 per year, MCA/MBA Rs. 70,000 per year and B.Sc. Rs. 40,000 per year. A one-time admission charge of Rs. 3,000 applies. Merit scholarships cover up to 50%. (Sample data)",
  },
  {
    tag: "timings",
    label: "Timings",
    examples: ["What are the class timings?", "When does college start?", "College timings"],
    keywords: ["timing", "timings", "class time", "schedule", "start time", "college hours", "lecture", "shift"],
    response:
      "Classes run Monday to Friday, 9:00 AM to 4:30 PM, with a lunch break from 1:00 PM to 1:45 PM. Saturdays are reserved for labs and workshops until 1:00 PM. (Sample data)",
  },
  {
    tag: "office",
    label: "Office timings",
    examples: ["When is the administrative office open?", "Office hours"],
    keywords: ["office", "administration", "admin", "reception", "counter", "office timing"],
    response:
      "The administrative office is open Monday to Saturday, 9:30 AM to 5:00 PM. The accounts counter closes at 4:00 PM. (Sample data)",
  },
  {
    tag: "exams",
    label: "Examinations",
    examples: ["When are the exams?", "Tell me about the examination pattern"],
    keywords: ["exam", "exams", "examination", "test", "result", "results", "marks", "internal", "grading"],
    response:
      "Two internal assessments are held each semester, followed by end-semester exams in November and April. Results are published on the student portal within three weeks. A minimum 75% attendance is required to sit for exams. (Sample data)",
  },
  {
    tag: "library",
    label: "Library",
    examples: ["What are the library timings?", "How many books can I borrow?"],
    keywords: ["library", "books", "borrow", "reading room", "journal", "e-books"],
    response:
      "The central library is open 8:00 AM to 8:00 PM on weekdays and 9:00 AM to 2:00 PM on Saturdays. Students may borrow up to 4 books for 14 days and access digital journals from campus. (Sample data)",
  },
  {
    tag: "hostel",
    label: "Hostel",
    examples: ["Is hostel accommodation available?", "Hostel fees"],
    keywords: ["hostel", "accommodation", "room", "mess", "boarding", "dorm", "stay"],
    response:
      "Separate hostels for boys and girls are available on campus. Charges are Rs. 55,000 per year including mess. Rooms are shared by two students and Wi-Fi plus 24x7 security are provided. (Sample data)",
  },
  {
    tag: "transport",
    label: "Transport",
    examples: ["Is there bus facility?", "Tell me about transportation"],
    keywords: ["transport", "bus", "buses", "travel", "pickup", "shuttle", "van", "route"],
    response:
      "College buses operate on 12 routes across the city with morning pickup between 7:15 AM and 8:30 AM. The annual transport fee is Rs. 18,000 depending on distance. (Sample data)",
  },
  {
    tag: "placements",
    label: "Placements",
    examples: ["What about placements?", "Which companies visit campus?"],
    keywords: ["placement", "placements", "job", "jobs", "recruit", "recruitment", "package", "salary", "internship", "company"],
    response:
      "The placement cell recorded 87% placement last year, with an average package of Rs. 5.2 LPA and a highest of Rs. 18 LPA. Training in aptitude and interviews starts in the fifth semester. (Sample data)",
  },
  {
    tag: "contact",
    label: "Contact",
    examples: ["How can I contact the college?", "Give me the phone number"],
    keywords: ["contact", "phone", "number", "email", "mail", "call", "helpline", "reach"],
    response:
      "You can call the helpdesk at +91 90000 12345 (9:30 AM - 5:00 PM) or email admissions@sample-institute.edu. (Sample demo contact details)",
  },
  {
    tag: "location",
    label: "Location",
    examples: ["Where is the college located?", "What is the address?"],
    keywords: ["location", "where", "address", "campus", "reach", "situated", "map", "directions"],
    response:
      "The campus is at 24 Lakeview Road, Sector 7, Sample City - 560001, about 6 km from the central railway station. (Sample data)",
  },
  {
    tag: "scholarship",
    label: "Scholarships",
    examples: ["Are scholarships available?", "Tell me about fee concession"],
    keywords: ["scholarship", "concession", "financial aid", "waiver", "merit"],
    response:
      "Merit scholarships waive 25-50% of tuition for students scoring above 90% in qualifying exams. Government scholarships for eligible categories are processed by the office. (Sample data)",
  },
  {
    tag: "facilities",
    label: "Campus facilities",
    examples: ["What facilities are on campus?", "Do you have sports grounds?"],
    keywords: ["facility", "facilities", "sports", "gym", "canteen", "lab", "labs", "wifi", "ground"],
    response:
      "The campus has computer and electronics labs, a canteen, sports grounds for cricket and basketball, a gym, an auditorium and campus-wide Wi-Fi. (Sample data)",
  },
  {
    tag: "thanks",
    label: "Thanks",
    examples: ["thank you", "thanks a lot"],
    keywords: ["thanks", "thank you", "thankyou", "appreciate"],
    response: "You're welcome! Feel free to ask another question about the college.",
  },
];
