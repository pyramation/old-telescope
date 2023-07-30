import { TelescopeInput } from './types';
import { TelescopeBuilder } from './builder';

export * from './builder';
export * from './bundler';
export * from './types';

export default async (input: TelescopeInput) => {
    const builder = new TelescopeBuilder(input);
    await builder.build();
};

const warn = 'THIS PACKAGE IS DEPRECATED please update to use https://github.com/cosmology-tech/telescope/';
function print(text) {
    const yellowBoldText = `\x1b[1m\x1b[33m${text}\x1b[0m`;
    process.stdout.write(yellowBoldText);
}

console.log(print(warn));

throw new Error(warn)