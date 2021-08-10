/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module hard-break-spaces
 * @fileoverview
 *   Warn when too many spaces are used to create a hard break.
 *
 * @example {"name": "ok.md"}
 *
 *   Lorem ipsum··
 *   dolor sit amet
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Lorem ipsum···
 *   dolor sit amet.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:12-2:1: Use two spaces for hard line breaks
 */

import {lintRule} from 'unified-lint-rule'
import visit from 'unist-util-visit'
import position from 'unist-util-position'
import generated from 'unist-util-generated'

const remarkLintHardBreakSpaces = lintRule(
  'remark-lint:hard-break-spaces',
  hardBreakSpaces
)

export default remarkLintHardBreakSpaces

var reason = 'Use two spaces for hard line breaks'

function hardBreakSpaces(tree, file) {
  var contents = String(file)

  visit(tree, 'break', visitor)

  function visitor(node) {
    var value

    if (!generated(node)) {
      value = contents
        .slice(position.start(node).offset, position.end(node).offset)
        .split('\n', 1)[0]
        .replace(/\r$/, '')

      if (value.length > 2) {
        file.message(reason, node)
      }
    }
  }
}
