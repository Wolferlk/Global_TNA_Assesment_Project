import "dotenv/config";
import { connectDb } from "./config/db.js";
import { JobRequest } from "./models/JobRequest.js";

const sampleRequests = {
  Plumbing: [
    "Leaking kitchen tap",
    "Blocked bathroom sink",
    "Low water pressure",
    "Running toilet repair",
    "Burst outdoor pipe",
    "New dishwasher connection",
    "Radiator valve replacement",
    "Shower mixer repair",
    "Kitchen drain smell",
    "Bathroom pipe inspection"
  ],
  Electrical: [
    "Replace hallway light fitting",
    "Install outdoor socket",
    "Fix tripping breaker",
    "Bedroom plug socket repair",
    "Kitchen extractor wiring",
    "Garage light installation",
    "Smart thermostat wiring",
    "Bathroom fan replacement",
    "Garden lighting fault",
    "Consumer unit check"
  ],
  Painting: [
    "Paint small bedroom",
    "Refresh living room walls",
    "Paint hallway and stairs",
    "Touch up kitchen ceiling",
    "Exterior door repaint",
    "Fence painting",
    "Nursery wall repaint",
    "Bathroom mould paint",
    "Office feature wall",
    "Window frame painting"
  ],
  Joinery: [
    "Fix sticking garden gate",
    "Repair loose stair tread",
    "Build airing cupboard shelves",
    "Replace internal door",
    "Fit skirting boards",
    "Repair kitchen cabinet hinge",
    "Install loft hatch trim",
    "Build alcove shelves",
    "Fix wooden floorboard",
    "Replace garden decking board"
  ]
};

const locations = ["Glasgow", "Edinburgh", "Paisley", "Stirling", "Hamilton"];
const names = ["Maya Fraser", "Callum Reid", "Aisha Khan", "Ross Taylor", "Nina Clark"];

const jobs = Object.entries(sampleRequests).flatMap(([category, titles]) =>
  titles.map((title, index) => ({
    title,
    description: `${title} needed at a homeowner property. Please inspect and quote for the work.`,
    category,
    location: locations[index % locations.length],
    contactName: names[index % names.length],
    contactEmail: `homeowner${category.toLowerCase()}${index + 1}@example.com`
  }))
);

await connectDb();
await JobRequest.deleteMany({});
await JobRequest.insertMany(jobs);
console.log(`Seeded ${jobs.length} job requests`);
process.exit(0);
