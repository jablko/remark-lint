import type {Node} from 'unist'
import type {VFile} from 'vfile'
import type {Plugin} from 'unified'
import type {Label, Severity} from './lib/index.js'

export interface RuleMeta {
  /**
   * Name of the lint rule
   */
  origin: string

  /**
   * Link to documentation
   */
  url?: string | undefined
}

export function lintRule<Tree extends Node = Node, Options = unknown>(
  name: string | RuleMeta,
  rule: Rule<Tree, Options>
): Plugin<
  [(Options | [Label | Severity, (Options | undefined)?] | undefined | void)?],
  Tree
>

export type Rule<Tree extends Node = Node, Options = unknown> = (
  node: Tree,
  file: VFile,
  options: Options,
  next: Callback
) => Promise<Tree | undefined | void> | Tree | undefined | void

export {Severity, Label} from './lib/index.js'
