/* @flow */
import { dedent } from 'dentist';
import { type Source, type GQLPosition } from '../utils/types';

export default function code(
  source: Source,
): { source: Source, position: GQLPosition } {
  const sourceText = dedent(source.body);
  let position = null;
  forEachLine(sourceText, (line, index) => {
    const match = line.match(/--\^/u);
    if (match) {
      position = {
        // $FlowDisableNextLine
        column: match.index + 3,
        line: index,
      };
      return true;
    }
    return false;
  });

  if (!position) {
    throw new Error('Missing --^ in source');
  }

  return {
    source: { body: sourceText, name: source.name },
    position,
  };
}

function forEachLine(
  text: string,
  clb: (line: string, index: number) => boolean,
) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const shouldBreak = clb(lines[i], i);
    if (shouldBreak) {
      return;
    }
  }
}
