export const isTruthy = (value: any) => !!value;

export const isFalsy = (value: any) => !value;

export const noop = <T extends any>(_: T) => { };

export function isNonEmptyArray<T>(array?: T[] | T): array is T[] {
    return Array.isArray(array) && !!array.length;
}
