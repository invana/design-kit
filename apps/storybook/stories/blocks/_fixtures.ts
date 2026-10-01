import type { BlockOptionsByKind } from '@invana/blocks';

/**
 * Block specs more than one shell draws. The `Blocks/<Kind>` stories and the
 * dashboard's `Dashboard/Blocks` story read the same object, which is the
 * point: one JSON, a conversation turn or a panel around it.
 */

export const TIMESERIES: BlockOptionsByKind['timeseries'] = {
  unit: 'units',
  series: [
    {
      name: 'Weekly demand',
      points: [
        ['Jul', 6800],
        ['Aug', 7400],
        ['Sep', 8200],
        ['Oct', 8900],
        ['Nov', 9600],
        ['Dec', 10400],
      ],
    },
  ],
  band: { label: '80% interval', lower: 8000, upper: 11000 },
  forecastFrom: 'Oct',
  forecastLabel: 'today',
  marks: [{ at: 'Aug', tone: 'warn' }],
};

export const TABLE: BlockOptionsByKind['table'] = {
  columns: [
    { key: 'store', label: 'Store' },
    { key: 'margin', label: 'Margin', align: 'right' },
    { key: 'delta', label: 'Δ pts', align: 'right' },
  ],
  rows: [
    { store: 'North Mall', margin: '11.4%', delta: { value: '−3.1', tone: 'bad' } },
    { store: 'Northgate', margin: '12.0%', delta: { value: '−2.6', tone: 'bad' } },
    { store: 'Riverside', margin: '15.8%', delta: { value: '+0.4', tone: 'good' } },
  ],
  total: 214,
  noun: 'stores',
};

/** A table a reader picks rows from: `rowKey` names a row, `selected` draws one picked. */
export const STEPS_TABLE: BlockOptionsByKind['table'] = {
  columns: [
    { key: 'step', label: 'Step', mono: true },
    { key: 'layer', label: 'Layer' },
    { key: 'p50', label: 'p50', align: 'right', mono: true },
    { key: 'failed', label: 'Failed', align: 'right', mono: true },
  ],
  rows: [
    { step: 'translate', layer: 'llm', p50: '5.8s', failed: '0' },
    { step: 'validate', layer: 'agent', p50: '2ms', failed: '0' },
    { step: 'execute', layer: 'graph data', p50: '48ms', failed: { value: '1', tone: 'bad' } },
    { step: 'verify_result', layer: 'agent', p50: '3ms', failed: '0' },
  ],
  rowKey: 'step',
  selected: 'execute',
};

export const RECORD: BlockOptionsByKind['record'] = {
  header: { title: 'Acme Holdings', initials: 'AH', status: { label: 'at risk', tone: 'bad' } },
  rows: [
    { label: 'Segment', value: 'Enterprise' },
    { label: 'ARR', value: '£412,000' },
    { label: 'Renewal', value: '14 Jan 2027 · in 107 days' },
  ],
};

/** A strip of figures fitted to the width, two of them read against a ceiling. */
export const RUN_FIGURES: BlockOptionsByKind['grid'] = {
  minTileWidth: 130,
  tiles: [
    { label: 'Tasks', value: '4 / 7', delta: 'running', gauge: { value: 4, max: 7 } },
    { label: 'Elapsed', value: '12s', delta: 'no timeout yet' },
    { label: 'Tokens', value: '8.2k', delta: 'of 40k ceiling', gauge: { value: 8.2, max: 40 } },
    { label: 'Rows', value: '1,880', delta: 'so far' },
    { label: 'Failed', value: '1', delta: 'execute', tone: 'bad', flag: true },
  ],
};

export const FORM: BlockOptionsByKind['form'] = {
  question: 'Scenario inputs',
  fields: [
    { name: 'price', label: 'Price change', type: 'number', unit: '%', default: -5 },
    { name: 'elasticity', label: 'Elasticity', type: 'number', default: 1.3, above: 0 },
    { name: 'starts', label: 'Starts', type: 'date', default: '2026-11-01' },
  ],
  submit: 'Run scenario',
};
