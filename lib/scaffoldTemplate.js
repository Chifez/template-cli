import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyCoursesFolder } from './utils/copyCoursesFolder.js';
import { copyFolderSync } from './utils/copyfolder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const spinner = ora();

export async function scaffoldTemplate({
  template,
  courses,
  projectPath,
  projectName,
}) {
  const TEMPLATES = {
    custom: 'custom-template',
    sveltejs: 'svelte-template',
    reactjs: 'react-template',
    nextjs: 'next-template',
  };

  const COURSE_PATHS = {
    custom: 'courses',
    reactjs: 'src/courses',
    sveltejs: 'src/lib/courses',
    nextjs: 'app/courses',
  };

  spinner.text = chalk.yellow('Getting project...');
  const templatePath = path.resolve(
    __dirname,
    'templates',
    TEMPLATES[template]
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${template}" does not exist.`);
  }

  if (projectPath !== process.cwd() && !fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
  const coursePathToExclude = path.join(templatePath, COURSE_PATHS[template]);

  spinner.text = chalk.yellow('Copying template files...');
  await copyFolderSync(
    templatePath,
    projectPath,
    ['node_modules'],
    coursePathToExclude
  );

  // Always copy the courses folder structure, conditionally copy contents
  spinner.text = chalk.yellow('Setting up courses folder...');
  await copyCoursesFolder(template, templatePath, projectPath, courses);

  console.log(
    chalk.yellow(
      `Project ${projectName} created using template "${template}" ${
        courses ? 'with' : 'without'
      } demo courses.`
    )
  );
  console.log(
    chalk.yellow(
      `You can ${
        courses
          ? 'edit or create new courses in the courses folder'
          : 'create new courses in the courses folder'
      }`
    )
  );
}
