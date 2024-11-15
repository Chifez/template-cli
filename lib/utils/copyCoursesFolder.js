import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { copyFolderSync } from './copyfolder.js';

export async function copyCoursesFolder(
  template,
  templatePath,
  projectPath,
  includeContents
) {
  const COURSE_PATHS = {
    custom: path.join('courses'),
    reactjs: path.join('src', 'courses'),
    sveltejs: path.join('src', 'lib', 'courses'),
    nextjs: path.join('app', 'courses'),
  };

  console.log('include contents', includeContents);
  const from = path.join(templatePath, COURSE_PATHS[template]);
  const to = path.join(projectPath, COURSE_PATHS[template]);

  // Create the 'courses' folder if it doesn't exist
  fs.mkdirSync(to, { recursive: true });

  if (includeContents && fs.existsSync(from)) {
    // Copy all contents of the courses folder if includeContents is true
    await copyFolderSync(from, to);
  } else {
    // Just create an empty 'courses' folder, without copying any content
    console.log(chalk.yellow(`Created empty courses folder at: ${to}`));
  }
}
