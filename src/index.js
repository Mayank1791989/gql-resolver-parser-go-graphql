/* @flow */
import Parser from './Parser';

export default function parserPkg() {
  return {
    create() {
      return new Parser();
    },
  };
}
