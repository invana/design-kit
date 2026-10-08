import { Button, Eyebrow, FloatingPanel, Stack, StatusDot, TimelineEntry, TimelineList } from '@invana/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { PlaybookControls, Step } from './playbook';

/** A step the playbook refused, and why. */
export interface Refused {
  step: Step;
  problems: string[];
}

/**
 * The playbook over the work — a story-only prototype of `PlaybookBar`: the step the work is
 * at, its narration, the steps so far (pick one to go to it), back and forward, and the steps
 * refused before they were recorded.
 */
export function PlaybookPanel({
  play,
  refused,
  collapsed,
  onCollapsedChange,
  onClose,
}: {
  play: PlaybookControls;
  refused: Refused[];
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onClose: () => void;
}) {
  const { steps, index, current } = play;
  return (
    <FloatingPanel
      title="Playbook"
      aside={steps.length ? `step ${index + 1} of ${steps.length}` : 'no steps yet'}
      summary={current?.title ?? (steps.length ? 'before the first step' : 'no steps yet')}
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      onClose={onClose}
      bodyClassName="p-3"
      footer={
        <Stack direction="row" gap="xs">
          <Button variant="ghost" size="icon-sm" aria-label="Previous step" disabled={!play.canPrevious} onClick={play.previous}>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next step" disabled={!play.canNext} onClick={play.next}>
            <ChevronRight />
          </Button>
          {!play.atLatest ? (
            <Button variant="ghost" size="sm" onClick={play.latest}>
              Latest
            </Button>
          ) : null}
        </Stack>
      }
    >
      <Stack gap="sm">
        {current ? (
          <Stack gap="xs">
            <Eyebrow aside={current.turn ? `answer ${current.turn}` : undefined}>{current.actor ?? 'step'}</Eyebrow>
            {current.narration ?? current.title}
          </Stack>
        ) : (
          <Eyebrow>{steps.length ? 'Before the agent changed the work' : "The agent's changes to the work arrive here"}</Eyebrow>
        )}
        {steps.length ? (
          <TimelineList variant="compact">
            {steps.map((step, i) => (
              <TimelineEntry
                key={step.id}
                when={`${i + 1}`}
                marker={<StatusDot tone={i === index ? 'info' : i < index ? 'success' : 'queued'} />}
                highlight={i === index ? 'info' : undefined}
                title={
                  <Button variant="link" size="xs" onClick={() => play.goTo(step.id)}>
                    {step.title}
                  </Button>
                }
              />
            ))}
          </TimelineList>
        ) : null}
        {refused.map(({ step, problems }) => (
          <Stack key={step.id} direction="row" gap="xs">
            <StatusDot tone="error" label="refused" />
            {`Refused “${step.title}”: ${problems.join('; ')}`}
          </Stack>
        ))}
      </Stack>
    </FloatingPanel>
  );
}
