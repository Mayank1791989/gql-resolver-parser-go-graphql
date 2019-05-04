/* @flow */
export type Source = {
  +name: string,
  +body: string,
};

export type GQLPosition = {
  +line: number,
  +column: number,
};
