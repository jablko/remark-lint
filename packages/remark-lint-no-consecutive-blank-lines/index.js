/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-consecutive-blank-lines
 * @fileoverview
 *   Warn for too many consecutive blank lines.
 *   Knows about the extra line needed between a list and indented code, and two
 *   lists.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   always uses one blank line between blocks if possible, or two lines when
 *   needed.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md"}
 *
 *   Foo…
 *   ␊
 *   …Bar.
 *
 * @example {"name": "empty-document.md"}
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Foo…
 *   ␊
 *   ␊
 *   …Bar
 *   ␊
 *   ␊
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   4:1: Remove 1 line before node
 *   4:5: Remove 2 lines after node
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import visit from 'unist-util-visit'
import position from 'unist-util-position'
import generated from 'unist-util-generated'

const remarkLintNoConsecutiveBlankLines = lintRule(
  'remark-lint:no-consecutive-blank-lines',
  noConsecutiveBlankLines
)

export default remarkLintNoConsecutiveBlankLines

function noConsecutiveBlankLines(tree, file) {
  visit(tree, visitor)

  function visitor(node) {
    var children = node.children
    var head
    var tail

    if (!generated(node) && children) {
      head = children[0]

      if (head && !generated(head)) {
        // Compare parent and first child.
        compare(position.start(node), position.start(head), 0)

        // Compare between each child.
        children.forEach(visitChild)

        tail = children[children.length - 1]

        // Compare parent and last child.
        if (tail !== head && !generated(tail)) {
          compare(position.end(node), position.end(tail), 1)
        }
      }
    }
  }

  // Compare the difference between `start` and `end`, and warn when that
  // difference exceeds `max`.
  function compare(start, end, max) {
    var diff = end.line - start.line
    var lines = Math.abs(diff) - max
    var reason

    if (lines > 0) {
      reason =
        'Remove ' +
        lines +
        ' ' +
        plural('line', Math.abs(lines)) +
        ' ' +
        (diff > 0 ? 'before' : 'after') +
        ' node'

      file.message(reason, end)
    }
  }

  function visitChild(child, index, all) {
    var previous = all[index - 1]

    if (previous && !generated(previous) && !generated(child)) {
      compare(position.end(previous), position.start(child), 2)
    }
  }
}
