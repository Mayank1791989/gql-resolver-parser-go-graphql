/* @flow */
declare module 'tree-sitter' {
  declare export type Point = {
    row: number,
    column: number,
  };

  declare export type Range = {
    start: Point,
    end: Point,
  };

  declare export type Edit = {
    startIndex: number,
    oldEndIndex: number,
    newEndIndex: number,
    startPosition: Point,
    oldEndPosition: Point,
    newEndPosition: Point,
  };

  declare export type Logger = (
    message: string,
    params: { [param: string]: string },
    type: 'parse' | 'lex',
  ) => void;

  declare export interface Input {
    seek(index: number): void;
    read(): any;
  }

  declare export interface SyntaxNode {
    tree: Tree;
    type: string;
    isNamed: boolean;
    text: string;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    parent: SyntaxNode | null;
    children: Array<SyntaxNode>;
    namedChildren: Array<SyntaxNode>;
    childCount: number;
    namedChildCount: number;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    nextNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;

    hasChanges(): boolean;
    hasError(): boolean;
    isMissing(): boolean;
    toString(): string;
    child(index: number): SyntaxNode | null;
    namedChild(index: number): SyntaxNode | null;
    firstChildForIndex(index: number): SyntaxNode | null;
    firstNamedChildForIndex(index: number): SyntaxNode | null;

    descendantForIndex(index: number): SyntaxNode;
    descendantForIndex(startIndex: number, endIndex: number): SyntaxNode;
    namedDescendantForIndex(index: number): SyntaxNode;
    namedDescendantForIndex(startIndex: number, endIndex: number): SyntaxNode;
    descendantForPosition(position: Point): SyntaxNode;
    descendantForPosition(startPosition: Point, endPosition: Point): SyntaxNode;
    namedDescendantForPosition(position: Point): SyntaxNode;
    namedDescendantForPosition(
      startPosition: Point,
      endPosition: Point,
    ): SyntaxNode;
    descendantsOfType(
      types: string | Array<string>,
      startPosition?: Point,
      endPosition?: Point,
    ): Array<SyntaxNode>;

    closest(types: string | Array<string>): SyntaxNode | null;
    walk(): TreeCursor;
  }

  declare export interface TreeCursor {
    nodeType: string;
    nodeText: string;
    nodeIsNamed: boolean;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    +currentNode: SyntaxNode;
    reset(node: SyntaxNode): void;
    gotoParent(): boolean;
    gotoFirstChild(): boolean;
    gotoFirstChildForIndex(index: number): boolean;
    gotoNextSibling(): boolean;
  }

  declare export interface Tree {
    +rootNode: SyntaxNode;
    edit(delta: Edit): Tree;
    walk(): TreeCursor;
    getChangedRanges(other: Tree): Array<Range>;
    getEditedRange(other: Tree): Range;
  }

  declare export default class Parser {
    parse(input: string | Input, previousTree?: Tree): Tree;
    getLanguage(): any;
    setLanguage(language: any): void;
    getLogger(): Logger;
    setLogger(logFunc: Logger): void;
  }
}
