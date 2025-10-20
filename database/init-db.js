// ✅ Use the acadwell database
const dbName = "acadwell";
const db = db.getSiblingDB(dbName);

// ✅ Create collections if they don't exist
db.createCollection("users");
db.createCollection("questions");
db.createCollection("answers");
db.createCollection("messages");
db.createCollection("grades");
db.createCollection("wellness");
db.createCollection("badges");

// ✅ Create indexes for faster lookups
db.users.createIndex({ email: 1 }, { unique: true }); // For login & registration
db.users.createIndex({ role: 1 }); // For filtering by role
db.questions.createIndex({ tags: 1, created_at: -1 });

// ✅ Insert sample users (for testing login)
db.users.insertMany([
  {
    id: "user-1",
    role: "student",
    name: "John Student",
    regNumber: "20230001",
    email: "student@example.com",
    password: "$2b$12$samplehashedpassword", // hashed password placeholder
    university: "ABC University",
    year: "2nd Year",
    field: "Computer Science",
    created_at: new Date()
  },
  {
    id: "user-2",
    role: "teacher",
    name: "Dr. Jane Teacher",
    email: "teacher@example.com",
    password: "$2b$12$samplehashedpassword", // hashed password placeholder
    university: "XYZ University",
    department: "CSE",
    designation: "Assistant Professor",
    created_at: new Date()
  },
  {
    id: "user-3",
    role: "others",
    name: "Mark External",
    email: "others@example.com",
    password: "$2b$12$samplehashedpassword", // hashed password placeholder
    organization: "Global EdTech",
    role_name: "External Examiner",
    created_at: new Date()
  }
]);

// ✅ Insert sample questions (keeping your existing sample data)
db.questions.insertMany([
  {
    id: "1",
    title: "How to prepare for Data Structures exam?",
    content: "I'm struggling with trees and graphs. Any tips?",
    tags: ["data-structures", "exam", "trees", "graphs"],
    created_at: new Date(),
    anonymous_id: "sample-user-1"
  },
  {
    id: "2",
    title: "Best resources for Flask development?",
    content: "Looking for good tutorials and documentation.",
    tags: ["flask", "python", "web-development"],
    created_at: new Date(),
    anonymous_id: "sample-user-2"
  }
]);

print("✅ Database initialized successfully with sample users and questions!");
