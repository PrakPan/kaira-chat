const fs = require("fs");
const path = require("path");

const tripsPagePath = path.join(process.cwd(), "/pages/trips/[type]/[slug].js");
const tripsPageBackupPath = path.join(
  process.cwd(),
  "/pages/trips/[type]/_trips.js.bak"
);

// Function to rename the trips page to a backup file
function renameFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
      console.log(`Renamed ${src} to ${dest}`);
    } else {
      console.log(`${src} does not exist.`);
    }
  } catch (err) {
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  switch (args[0]) {
    case "prebuild":
      // Rename the trips page to exclude it from the build
      renameFile(tripsPagePath, tripsPageBackupPath);
      break;
    case "postbuild":
      // Ensure the backup file is restored after the build process
      renameFile(tripsPageBackupPath, tripsPagePath);
      break;
    default:
      process.exit();
  }
} else {
  console.log("Expected command line arguments: <prebuild> or <postbuild>");
  process.exit();
}

// In case of process termination (e.g., Ctrl+C)
process.on("SIGINT", () => {
  renameFile(tripsPageBackupPath, tripsPagePath);
  process.exit();
});
