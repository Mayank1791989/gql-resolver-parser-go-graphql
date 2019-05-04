/* @flow */
import parserPkg from '../index';
import code from './code';

test('ObjectType', () => {
  const { source, position } = code({
    name: 'resolvers/test.go',
    body: `
      package query

      import (
        "github.com/playlyfe/go-graphql"
      )

      func registerTestResolver(resolverMap map[string]interface{}) {
        resolverMap["Test/id"] = func(params *graphql.ResolveParams) (interface{}, error) {
                 //---^
          return nil, nil
        }

        resolverMap["Test/name"] = func(params *graphql.ResolveParams) (interface{}, error) {
          return nil, nil
        }
      }
    `,
  });

  const Parser = parserPkg();
  const parser = Parser.create();
  const token = parser.getTokenAtPosition(source, position);
  expect(token).toMatchInlineSnapshot(`
    Object {
      "kind": "ObjectType",
      "name": "Test",
    }
  `);
});

test('ObjectType/field', () => {
  const { source, position } = code({
    name: 'resolvers/test.go',
    body: `
      package query

      import (
        "github.com/playlyfe/go-graphql"
      )

      func registerTestResolver(resolverMap map[string]interface{}) {
        resolverMap["Test/id"] = func(params *graphql.ResolveParams) (interface{}, error) {
                 //--------^
          return nil, nil
        }

        resolverMap["Test/name"] = func(params *graphql.ResolveParams) (interface{}, error) {
          return nil, nil
        }
      }
    `,
  });

  const Parser = parserPkg();
  const parser = Parser.create();
  const token = parser.getTokenAtPosition(source, position);
  expect(token).toMatchInlineSnapshot(`
    Object {
      "kind": "ObjectField",
      "name": "id",
      "type": "Test",
    }
  `);
});

test('Scalars', () => {
  const Parser = parserPkg();
  const parser = Parser.create();
  const { source, position } = code({
    name: 'resolvers/test.go',
    body: `
      package query

      import (
        "github.com/playlyfe/go-graphql"
      )

      func NewScalars() map[string]*graphql.Scalar {
        scalars := map[string]*graphql.Scalar{}
        scalars["Test"] = &graphql.Scalar{
          //------^
          ParseValue: func(context interface{}, value interface{}) (interface{}, error) {
          },
          ParseLiteral: func(context interface{}, value interface{}) (interface{}, error) {
          },
          Serialize: func(context interface{}, value interface{}) (interface{}, error) {
            return value, nil
          },
        }
      }
    `,
  });

  const token = parser.getTokenAtPosition(source, position);
  expect(token).toMatchInlineSnapshot(`
    Object {
      "kind": "Scalar",
      "name": "Test",
    }
  `);
});
