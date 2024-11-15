#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { scaffoldTemplate } from '../lib/scaffoldTemplate.js';

const spinner = ora();

program
  .version('1.0.0')
  .description('A simple CLI like create react app for scaffolding projects');

program
  .argument('[projectName]', 'name of the project')
  .option('-t, --template <template>', 'name of the template')
  .option('-c, --courses', 'include demo courses')
  .action(async (projectName, option) => {
    let { template, courses } = option;
    if (!projectName) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter the project name:',
          default: '.',
          when: !projectName,
        },
      ]);
      projectName = answer.projectName;
    }

    if (!template) {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'select a template',
          choices: ['custom', 'reactjs', 'sveltejs', 'nextjs'],
          default: 0,
        },
      ]);
      template = answer.template;
    }
    const projectPath =
      projectName === '.'
        ? process.cwd()
        : path.resolve(process.cwd(), projectName);

    if (courses === undefined) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'courses',
          message: 'would you like to use demo course',
          default: true,
        },
      ]);
      courses = answer.courses;
    }

    spinner.start('Scaffolding...');
    try {
      await scaffoldTemplate({ template, courses, projectPath, projectName });
      spinner.succeed(chalk.green('Done! Your project is ready.'));
      console.log(
        `To get started,  ${chalk.blue(
          'cd into your project'
        )} then run ${chalk.blue('npm install')}`
      );
      console.log(`Now run ${chalk.blue('npm run dev')}`);
      chalk.blue('Happy hacking ');
    } catch (error) {
      spinner.fail(chalk.red(`Failed to scaffold the project. ${error}`));
    }
  });

program.parse(process.argv);
