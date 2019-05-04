/* @flow */
import { parseKey } from './utils/key';
import isKeyNodeOfKind from './utils/isKeyNodeOfKind';
import parseGo from './utils/parseGo';
import convertGQLPositionToPoint from './utils/convertGQLPositionToPoint';
import { type Source, type GQLPosition } from './utils/types';

export default class Parser {
  parse(source: Source) {
    const tree = parseGo(source.body);
    // Finding resolverMap[key] expressions
    // where key is "Type/field"
    const resolvers = tree.rootNode
      .descendantsOfType('index_expression')
      .filter(node => {
        const { firstChild } = node;
        return (
          firstChild &&
          firstChild.type === 'identifier' &&
          (firstChild.text === 'resolverMap' || firstChild.text === 'scalars')
        );
      })
      .map(resolverNode => {
        const { firstChild } = resolverNode;
        if (!firstChild) {
          return null;
        }
        const name = firstChild.text;

        // find keyNode in resolverMap["key"]
        const nodes = resolverNode.descendantsOfType(
          'interpreted_string_literal',
        );
        const [keyNode] = nodes;
        const key = JSON.parse(keyNode.text);

        // scalars
        if (name === 'scalars') {
          return {
            kind: 'ScalarTypeResolver',
            name: {
              kind: 'Name',
              value: key,
              loc: {
                start: keyNode.startIndex + 1, // +1 to exclude "
                end: keyNode.endIndex - 1, // -1 to exclude "
                source,
              },
            },
            loc: {
              start: resolverNode.startIndex,
              end: resolverNode.endIndex,
              source,
            },
          };
        }

        // object types
        if (name === 'resolverMap') {
          const parsedKey = parseKey(key);

          // ignore invalid key resolverNodes
          if (!parsedKey.isValid) {
            return null;
          }

          const typeNameStart = keyNode.startIndex + 1;
          const typeNameEnd =
            keyNode.startIndex + 1 + parsedKey.typeName.length;

          return {
            kind: 'ObjectFieldResolver',
            name: {
              kind: 'Name',
              value: parsedKey.fieldName,
              loc: {
                start: typeNameEnd + 1,
                end: typeNameEnd + 1 + parsedKey.fieldName.length,
                source,
              },
            },
            type: {
              kind: 'Name',
              value: parsedKey.typeName,
              loc: {
                start: typeNameStart,
                end: typeNameEnd,
                source,
              },
            },
            loc: {
              start: resolverNode.startIndex,
              end: resolverNode.endIndex,
              source,
            },
          };
        }

        return null;
      })
      .filter(Boolean);

    return {
      kind: 'ResolverDocument',
      resolvers,
    };
  }

  getTokenAtPosition(source: Source, position: GQLPosition) {
    const tree = parseGo(source.body);
    // Finding resolverMap[key] expressions
    // where key is "Type/field"
    const point = convertGQLPositionToPoint(position);
    const node = tree.rootNode.namedDescendantForPosition(point);

    // @Todo handle syntax error while typing
    if (isKeyNodeOfKind(node, 'resolverMap')) {
      const key = JSON.parse(node.text);
      const parsedKey = parseKey(key);
      // ignore invalid key resolverNodes
      // if (!parsedKey.isValid) {
      //   return null;
      // }
      const typeNameEndCol =
        node.startPosition.column + 1 + parsedKey.typeName.length;

      if (point.column <= typeNameEndCol) {
        return {
          kind: 'ObjectType',
          name: parsedKey.typeName,
        };
      }
      return {
        kind: 'ObjectField',
        name: parsedKey.fieldName,
        type: parsedKey.typeName,
      };
    }

    if (isKeyNodeOfKind(node, 'scalars')) {
      const key = JSON.parse(node.text);
      return {
        kind: 'Scalar',
        name: key,
      };
    }

    return null;
  }
}
