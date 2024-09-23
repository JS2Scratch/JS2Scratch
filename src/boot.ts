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

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { addDep, buildProject, createPackage, createProject, removeDep, runProject, updateDep } from "./cli/berryProject";
import { cwd } from "process";
import { basename, join, resolve } from "path";
import { error } from "./cli/berryProject";
import chalk from 'chalk';
import { existsSync } from 'fs';

function parseStrings(...args: any) {
    return args.map((str: any) => {
        const [name, version] = str.split('@');

        const versionIsValid = version && (/^(\d+\.)?(\d+\.)?(\d+)$/.test(version) || version === 'latest');

        return {
            name: name,
            version: versionIsValid ? (version === 'latest' ? "*" : version) : "*"
        };
    });
}

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
            if (process.platform != "win32" && !argv.bypass) error("js2scratch only works on the windows architecture.");

            return createProject(argv.name, argv.path);
        }
    )

    .command(
        'init',
        'Creates a new `berry` project in the current-working-directrory\n',
        () => { },
        (argv) => {
            if (process.platform != "win32" && !argv.bypass) error("js2scratch only works on the windows architecture.");

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
            if (process.platform != "win32" && !argv.bypass) error("js2scratch only works on the windows architecture.");

            let resolved = resolve(argv.path);
            return buildProject(resolved, basename(resolved));
        }
    )

    .command(
        'run [path]',
        'Builds and runs the current `berry` project in the current-working-directory, or in the provided one, in TurboWarp\n',
        (yargs) => {
            return yargs.positional('path', {
                type: 'string',
                default: './',
                describe: 'Path to the `berry` project'
            });
        },
        (argv) => {
            if (process.platform != "win32" && !argv.bypass) error("js2scratch only works on the windows architecture.");

            let resolved = resolve(argv.path);
            return runProject(resolved, basename(resolved));
        }
    )

    .command(
        'lib [name] [path]',
        'Creates a new `berry` package for JS2Scratch. Bundles with a `Berry.toml`.\n',
        (yargs) => {
            return yargs
                .positional('name', {
                    type: 'string',
                    default: 'my-package',
                    describe: 'The name of the package'
                })
                .positional('path', {
                    type: 'string',
                    default: './',
                    describe: 'The path to create the package'
                });
        },
        (argv) => {
            if (process.platform != "win32" && !argv.bypass) error("js2scratch only works on the windows architecture.");

            return createPackage(argv.name, argv.path);
        }
    )
    .command(
        'add [libs...]',
        'Adds a new dependency to the project in the current-working-directory.\n',
        (yargs) => {
            return yargs
                .positional('libs', {
                    describe: 'The libraries to include (name@version)',
                    type: 'string',
                    array: true
                });
        },
        async (argv) => {
            if (process.platform != "win32" && !argv.bypass) {
                console.error("js2scratch only works on the windows architecture.");
                return;
            }

            const parsedLibs = parseStrings(...(argv.libs as any));
            await addDep(parsedLibs);
        }
    )

    .command(
        'remove [libs...]',
        'Removes the given packages in the project that is in the current-working-directory.\n',
        (yargs) => {
            return yargs
                .positional('libs', {
                    describe: 'The libraries to remove (name)',
                    type: 'string',
                    array: true
                });
        },
        async (argv) => {
            if (process.platform != "win32" && !argv.bypass) {
                console.error("js2scratch only works on the windows architecture.");
                return;
            }

            let libs = argv.libs;
            let libsFolder = join(cwd(), "lib");

            if (!existsSync(libsFolder)) {
                error("there are no dependencies to remove");
            };

            return removeDep(libsFolder, (libs as any));
        }
    )

    .command(
        'update',
        'Reads the currently-active-Berry.toml file and adds any dependencies. Does not remove dependencies.\n',
        (yargs) => {},
        async (argv) => {
            if (process.platform != "win32" && !argv.bypass) {
                console.error("js2scratch only works on the windows architecture.");
                return;
            }

            let libs = argv.libs;
            let libsFolder = join(cwd(), "lib");

            if (!existsSync(libsFolder)) {
                error("there are no dependencies to remove");
            };

            if (!existsSync(join(cwd(), "Berry.toml"))) {
                error("no 'Berry.toml' could be found");
            };

            return updateDep(libsFolder, join(cwd(), "Berry.toml"));
        }
    )

    .command(
        'publish',
        'Returns information on publishing a package.',
        (yargs) => { },
        (argv) => {
            // Format with links
            console.log(chalk.blue("[INFO]") +
                ": To publish a package on `berry`; you need to submit a pull request " +
                "\u001b]8;;https://github.com/JS2Scratch/berry-registry/pulls\u001b\\here\u001b]8;;\u001b\\" +
                ". More about publishing can be found " +
                "\u001b]8;;https://github.com/JS2Scratch/berry-registry/blob/main/README.md\u001b\\here\u001b]8;;\u001b\\!");
        }
    )

    .option('bypass', {
        alias: 'b',
        type: 'boolean',
        description: 'Bypass the platform-block on JS2Scratch. May cause errors.',
    })

    // Parse the command line arguments
    .version()
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .demandCommand(1, chalk.red("error: ") + "invalid usage; see above ^") // Enforce command input
    .argv;