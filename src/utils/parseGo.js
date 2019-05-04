/* @flow */
import Parser from 'tree-sitter';
import languageGo from 'tree-sitter-go';

export default function parserGoCode(code: string) {
  const parser = new Parser();
  parser.setLanguage(languageGo);
  return parser.parse(code);
}
