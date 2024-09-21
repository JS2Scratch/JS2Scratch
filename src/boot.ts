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
import { buildProject, createProject } from "./cli/berryProject";
import { cwd } from "process";
import { basename } from "path";

// Define a simple command using yargs
yargs(hideBin(process.argv))
    .scriptName("berry")
    .usage('$0 <cmd> [args]')

    .command(
        'new [name] [path]',
        'Creates a new `berry` project for JS2Scratch. Bundles with a `Berry.toml`.\n',
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
            return createProject(argv.name, argv.path);
        }
    )

    .command(
        'init',
        'Creates a new `berry` project in the current-working-directrory\n',
        () => { },
        (argv) => {
            let wd = cwd();
            return createProject(basename(wd), ".");
        }
    )

    .command(
        'build [path]',
        'Builds the current `berry` project in the current-working-directory, or in the provided one\n',
        (yargs) => {
            return yargs.positional('path', {
                type: 'string',
                default: './',
                describe: 'Path to the `berry` project'
            });
        },
        (argv) => {
            return buildProject(argv.path);
        }
    )

    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
    })

    // Parse the command line arguments
    .help()
    .argv;