import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export async function copyFolderSync(
  from,
  to,
  excludeNames = [],
  excludePath = null
) {
  fs.mkdirSync(to, { recursive: true });
  for (const element of fs.readdirSync(from)) {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);

    if (excludeNames.includes(element)) {
      console.log(chalk.yellow(`skipping ${element}`));
      continue;
    }

    // Check for path-based exclusion (specific courses folder)
    if (excludePath && fromPath === excludePath) {
      continue;
    }

    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else {
      await copyFolderSync(fromPath, toPath, excludeNames, excludePath);
    }
  }
}
