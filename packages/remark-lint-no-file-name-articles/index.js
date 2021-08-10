/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-articles
 * @fileoverview
 *   Warn when file names start with an article.
 *
 * @example {"name": "title.md"}
 *
 * @example {"name": "a-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `a`
 *
 * @example {"name": "the-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `the`
 *
 * @example {"name": "teh-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `teh`
 *
 * @example {"name": "an-article.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `an`
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNoFileNameArticles = lintRule(
  'remark-lint:no-file-name-articles',
  noFileNameArticles
)

export default remarkLintNoFileNameArticles

function noFileNameArticles(tree, file) {
  var match = file.stem && file.stem.match(/^(the|teh|an?)\b/i)

  if (match) {
    file.message('Do not start file names with `' + match[0] + '`')
  }
}
