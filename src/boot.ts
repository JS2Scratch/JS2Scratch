/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : boot.ts
* Description       : Bootstraps the JS2Scratch environment
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 13/09/2024	saaawdust	Created file, setup environment
*
/******************************************************************/

import { parseProgram } from "./env/parseProgram";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Define a simple command using yargs
yargs(hideBin(process.argv))
  .scriptName("berry")
  .usage('$0 <cmd> [args]')
  
  // Create a command 'greet' that accepts options
  .command(
    'new [name] [path]',
    'Creates a new `berry` project for JS2Scratch. Bundles with a `Berry.toml`.',
    (yargs) => {
      return yargs
        .positional('name', {
          type: 'string',
          default: 'my-project',
          describe: 'The name of the project'
        })
        .positional('path', {
          type: 'string',
          default: './',
          describe: 'The path to create the project'
        });
    },
    (argv) => {
      console.log(`Creating a new berry project named ${argv.name} at ${argv.path}`);
    }
  )
  
  // Create another command 'add' that takes two numbers
  .command(
    'add [a] [b]',
    'Adds two numbers together',
    (yargs) => {
      return yargs
        .positional('a', {
          type: 'number',
          describe: 'First number',
          demandOption: true,
        })
        .positional('b', {
          type: 'number',
          describe: 'Second number',
          demandOption: true,
        });
    },
    (argv) => {
      const result = (argv.a || 0) + (argv.b || 0);
      console.log(`The sum of ${argv.a} and ${argv.b} is ${result}`);
    }
  )

  // Add global options such as verbose mode
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  
  // Parse the command line arguments
  .help()
  .argv;