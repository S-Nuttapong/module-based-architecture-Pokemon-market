export const isTruthy = (value: any) => !!value;

export const isFalsy = (value: any) => !value;

export const noop = <T extends any>(_: T) => { };

export const isNonEmptyArray = <T>(array?: T[] | T): array is T[] => Array.isArray(array) && !!array.length;
