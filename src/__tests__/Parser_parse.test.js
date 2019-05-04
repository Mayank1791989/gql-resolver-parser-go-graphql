/* @flow */
import parserPkg from '../index';

expect.addSnapshotSerializer({
  test: val => typeof val === 'object' && val.body && val.name,
  print: val => `Source(${val.name})`,
});

test('parse - ObjectType', () => {
  const Parser = parserPkg();
  const parser = Parser.create();
  const code = {
    name: 'resolvers/test.go',
    body: `
        package query

        import (
          "github.com/playlyfe/go-graphql"
        )

        func registerTestResolver(resolverMap map[string]interface{}) {
          resolverMap["Test/id"] = func(params *graphql.ResolveParams) (interface{}, error) {
            return nil, nil
          }

          resolverMap["Test/name"] = func(params *graphql.ResolveParams) (interface{}, error) {
            return nil, nil
          }
        }
      `,
  };

  const ast = parser.parse(code);
  expect(ast).toMatchInlineSnapshot(`
    Object {
      "kind": "ResolverDocument",
      "resolvers": Array [
        Object {
          "kind": "ObjectFieldResolver",
          "loc": Object {
            "end": 199,
            "source": Source(resolvers/test.go),
            "start": 177,
          },
          "name": Object {
            "kind": "Name",
            "loc": Object {
              "end": 197,
              "source": Source(resolvers/test.go),
              "start": 195,
            },
            "value": "id",
          },
          "type": Object {
            "kind": "Name",
            "loc": Object {
              "end": 194,
              "source": Source(resolvers/test.go),
              "start": 190,
            },
            "value": "Test",
          },
        },
        Object {
          "kind": "ObjectFieldResolver",
          "loc": Object {
            "end": 336,
            "source": Source(resolvers/test.go),
            "start": 312,
          },
          "name": Object {
            "kind": "Name",
            "loc": Object {
              "end": 334,
              "source": Source(resolvers/test.go),
              "start": 330,
            },
            "value": "name",
          },
          "type": Object {
            "kind": "Name",
            "loc": Object {
              "end": 329,
              "source": Source(resolvers/test.go),
              "start": 325,
            },
            "value": "Test",
          },
        },
      ],
    }
`);
});

test('parse - Scalars', () => {
  const Parser = parserPkg();
  const parser = Parser.create();
  const code = {
    name: 'resolvers/test.go',
    body: `
        package query

        import (
          "github.com/playlyfe/go-graphql"
        )

        func NewScalars() map[string]*graphql.Scalar {
	        scalars := map[string]*graphql.Scalar{}
          scalars["Test"] = &graphql.Scalar{
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
  };

  const ast = parser.parse(code);
  expect(ast).toMatchInlineSnapshot(`
    Object {
      "kind": "ResolverDocument",
      "resolvers": Array [
        Object {
          "kind": "ScalarTypeResolver",
          "loc": Object {
            "end": 224,
            "source": Source(resolvers/test.go),
            "start": 209,
          },
          "name": Object {
            "kind": "Name",
            "loc": Object {
              "end": 222,
              "source": Source(resolvers/test.go),
              "start": 218,
            },
            "value": "Test",
          },
        },
      ],
    }
  `);
});
