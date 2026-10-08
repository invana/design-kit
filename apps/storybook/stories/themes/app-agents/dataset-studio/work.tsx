import * as React from 'react';

import { usePlayable, useReduced } from '../playbook/playbook';
import { datasetOps, EMPTY_DATASET, type DatasetState } from './ops/dataset-ops';
import { EMPTY_GRAPH, graphOps, type GraphState } from './ops/graph-ops';
import { EMPTY_MODEL, modelOps, type ModelState } from './ops/model-ops';

/**
 * The shared work at the playbook's position. A target answers to one component, so the
 * dataset, the model and the graph are read here once and handed to every page and panel.
 */
interface SharedWork {
  dataset: DatasetState;
  model: ModelState;
  graph: GraphState;
}

const WorkContext = React.createContext<SharedWork>({ dataset: EMPTY_DATASET, model: EMPTY_MODEL, graph: EMPTY_GRAPH });

export function WorkProvider({ children }: { children: React.ReactNode }) {
  const dataset = useReduced(EMPTY_DATASET, usePlayable('dataset').received, datasetOps.apply!);
  const model = useReduced(EMPTY_MODEL, usePlayable('model').received, modelOps.apply!);
  const graph = useReduced(EMPTY_GRAPH, usePlayable('graph').received, graphOps.apply!);
  const value = React.useMemo(() => ({ dataset, model, graph }), [dataset, model, graph]);
  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
}

export const useDataset = () => React.useContext(WorkContext).dataset;
export const useModel = () => React.useContext(WorkContext).model;
export const useGraph = () => React.useContext(WorkContext).graph;
