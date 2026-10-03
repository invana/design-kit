import * as React from 'react';
import type { AskState, BlockKind, BlockProps } from '@invana/blocks';

import type { BlockVariant } from '../../fixtures/blocks';
import type { Log } from './variant-grid';

export type BlockAction = (action: string, value?: unknown) => void;

/**
 * A block as its shell holds it: the story owns `state` and `value`, the way a consumer does,
 * and moves an ask on when it is answered — `reply` settles it with the value, `skip` with its
 * default. Every action reaches `onAction` (the Actions panel) and the cell's event log.
 */
export function LiveBlock<K extends BlockKind>({
  component: Component,
  variant,
  onAction,
  log,
}: {
  component: React.ComponentType<BlockProps<K>>;
  variant: BlockVariant<K>;
  onAction?: BlockAction;
  log: Log;
}) {
  const [state, setState] = React.useState<AskState | undefined>(variant.state);
  const [value, setValue] = React.useState<unknown>(variant.value);

  const act: BlockAction = (action, v) => {
    onAction?.(action, v);
    log('onAction', v === undefined ? [action] : [action, v]);
    if (action === 'reply') {
      setState('answered');
      setValue(v);
    } else if (action === 'skip') {
      setState('skipped');
    }
  };

  return <Component spec={variant.spec} state={state} value={value} id={variant.turn.id} onAction={act} />;
}
