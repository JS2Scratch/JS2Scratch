/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Validates if the directory schema matches
export function validateDirectorySchema(dirPath: string): ValidationResult {
    const errors: string[] = [];

    function validateProjectJsonSchema(jsonData: any) {
        if (typeof jsonData !== 'object' || jsonData === null) {
            errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: Root should be an object.`);
            return;
        }

        for (const key in jsonData) {
            const value = jsonData[key];
            
            if (typeof(value) !== "object" || value === null)
            {
                
                errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: Sprite-Data, ${chalk.bold(chalk.blue(`${key}`))}, should be an object.`);
            } else {
                if (!('Type' in value)) {
                    errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: Sprite-Data, ${chalk.bold(chalk.blue(`${key}`))}, should contain a type, "Sprite", or "Background".`);
                } else {
                    if (value['Type'] != "Sprite" && value['Type'] != "Background") {
                        errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: Sprite-Data, ${chalk.bold(chalk.blue(`${key}`))}, should have a type that is "Sprite", or "Background". Got ${chalk.bold(chalk.blue(`${value['Type']}`))}.`);
                    }
                }

                if ('Costumes' in value) {
                    let costumes = value["Costumes"];
                    if (!Array.isArray(costumes)) {
                        errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: The ${chalk.bold(chalk.blue('"Costumes"'))} property of Sprite-Data '${chalk.bold(chalk.blue(`${key}`))}' should be an array.`);
                    } else {
                        costumes.forEach((costume: any, index: number) => {
                            if (!Array.isArray(costume) || costume.length !== 2) {
                                errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: The ${chalk.bold(chalk.blue('"Costumes"'))} property of Sprite-Data '${chalk.bold(chalk.blue(`${key}`))}' should have a length of "2" (name, path).`);
                            } else {
                                if (typeof costume[0] !== 'string') {
                                    errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: The ${chalk.bold(chalk.blue('"Costumes"'))} property of Sprite-Data '${chalk.bold(chalk.blue(`${key}`))}' - "name" should be a string, got ${typeof costume[0]}.`);
                                }
                                if (typeof costume[1] !== 'string') {
                                    errors.push(`${chalk.bold(chalk.red("Invalid project.d.json"))}: The ${chalk.bold(chalk.blue('"Costumes"'))} property of Sprite-Data '${chalk.bold(chalk.blue(`${key}`))}' - "path" should be a string, got ${typeof costume[1]}.`);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    
    let projectJson = path.join(dirPath, 'project.d.json');
    if (!fs.existsSync(projectJson)) {
        errors.push('Missing "project.d.json" in the root directory.');
    } else {
        validateProjectJsonSchema(JSON.parse(fs.readFileSync(projectJson).toString()));
    }

    function validateFileName(filePath: string, dirName: string) {
        const fileName = path.basename(filePath);
        if (fileName.endsWith('.js')) {
            const nameParts = fileName.split('.');
            if (nameParts.length < 3 || !['Sprite', 'Background'].includes(nameParts[nameParts.length - 2])) {
                if (dirName !== "") {
                    if (!['Sprite', 'Background'].includes(dirName.split('.').pop() || "")) {
                        let dirParts = dirName.split(".");
                        if (dirParts.length < 2 || ['Sprite', 'Background'].includes(dirParts[1])) {
                            errors.push(`Invalid file or directory name: ${filePath}`);
                        }
                    }
                } else {
                    errors.push(`Invalid file name: ${filePath}`);
                }
            }
        }
    }

    function traverseDirectory(currentPath: string, dirName: string = "") {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                traverseDirectory(fullPath, entry.name);
            } else if (entry.isFile()) {
                validateFileName(fullPath, dirName);
            }
        }
    }

    traverseDirectory(dirPath);

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}