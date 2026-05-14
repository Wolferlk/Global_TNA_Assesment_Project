import "dotenv/config";
import { connectDb } from "./config/db.js";
import { JobRequest } from "./models/JobRequest.js";

const jobs = [
  {
    title: "Leaking kitchen tap",
    description: "Need a plumber to fix a leaking tap under the kitchen sink.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Maya Fraser",
    contactEmail: "maya@example.com"
  },
  {
    title: "Replace hallway light fitting",
    description: "Old pendant light needs replacing with a new fixture.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Callum Reid",
    contactEmail: "callum@example.com"
  },
  {
    title: "Paint small bedroom",
    description: "Bedroom walls need a fresh coat of paint before next weekend.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Aisha Khan",
    contactEmail: "aisha@example.com"
  },
  {
    title: "Fix sticking garden gate",
    description: "Wooden gate is scraping the ground and needs adjusted.",
    category: "Joinery",
    location: "Paisley",
    contactName: "Ross Taylor",
    contactEmail: "ross@example.com"
  },
  {
    title: "Install outdoor socket",
    description: "Looking for an electrician to install a weatherproof garden socket.",
    category: "Electrical",
    location: "Stirling",
    contactName: "Nina Clark",
    contactEmail: "nina@example.com"
  }
];

await connectDb();
await JobRequest.deleteMany({});
await JobRequest.insertMany(jobs);
console.log("Seeded job requests");
process.exit(0);
