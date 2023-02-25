const fs = require("fs");
const format = require("date-fns/format");

// Get document, or throw exception on error
try {
  const filePath = "./public/updated-date.txt";
  timestamp = format(new Date(), "MMM dd, yyyy hh:mm a");
  fs.writeFileSync(filePath, timestamp);
  console.log(timestamp);
} catch (e) {
  console.log(e);
}
