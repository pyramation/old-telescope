export * from './encoding';
export * from './clients';
export * from './registry';
export * from './utils';
export * from './bundle';
export * from './state';
export * from './plugins';
export * from './types';

const warn = 'THIS PACKAGE IS DEPRECATED please update to use https://github.com/cosmology-tech/telescope/';
function print(text) {
    const yellowBoldText = `\x1b[1m\x1b[33m${text}\x1b[0m`;
    return yellowBoldText;
}

console.log(print(warn));

throw new Error(warn)