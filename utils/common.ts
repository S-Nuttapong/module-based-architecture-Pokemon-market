export const isTruthy = (value: any) => !!value;

export const isFalsy = (value: any) => !value;

export const noop = <T extends any>(_: T) => { };