import fs from "fs";
import path from "path";

export function readTeamsData() {
  const filePath = path.join(process.cwd(), "data", "fc25_teams.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}
