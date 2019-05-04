/* @flow */
import { type Point } from 'tree-sitter';
import { type GQLPosition } from './types';

export default function convertGQLPositionToPoint(
  position: GQLPosition,
): Point {
  return {
    row: position.line - 1,
    column: position.column - 1,
  };
}
