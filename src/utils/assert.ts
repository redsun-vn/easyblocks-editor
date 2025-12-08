function assertDefined<T>(value: T, message?: string): Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error(message ?? "Value is undefined");
  }

  return value as Exclude<T, undefined>;
}

export { assertDefined };
