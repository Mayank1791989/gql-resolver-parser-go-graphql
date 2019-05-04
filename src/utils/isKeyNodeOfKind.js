/* @flow */
import { type SyntaxNode } from 'tree-sitter';

// kind[keyNode]
// -------^

export default function isKeyNodeOfKind(
  node: SyntaxNode,
  kind: 'resolverMap' | 'scalars',
): boolean {
  // isKeyNode
  if (node.type !== 'interpreted_string_literal') {
    return false;
  }

  if (!node.parent || !node.parent.firstChild) {
    return false;
  }

  const kindNode = node.parent.firstChild;

  return kindNode.text === kind;
}
