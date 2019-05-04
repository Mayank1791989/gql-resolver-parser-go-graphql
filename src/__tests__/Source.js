/* @flow */
// @TODO: import from gql
export default class Source {
  body: string;
  name: string;

  constructor(body: string, name: string) {
    this.body = body;
    this.name = name;
  }
}
