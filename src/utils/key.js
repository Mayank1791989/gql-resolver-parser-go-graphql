/* @flow */
export function parseKey(
  key: string,
): {| +typeName: string, +fieldName: string, isValid: boolean |} {
  const splitted = key.split('/');

  const typeName = splitted.length >= 1 ? splitted[0] : '';
  const fieldName = splitted.length >= 2 ? splitted[1] : '';

  return {
    typeName,
    fieldName,
    isValid: typeName !== '' && fieldName !== '',
  };
}
