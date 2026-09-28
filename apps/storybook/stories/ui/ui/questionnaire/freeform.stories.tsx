import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@invana/ui';
import { Answers, useAnswers } from './_answers';

const meta: Meta<typeof Questionnaire> = {
  title: 'UI/UI/Questionnaire',
  component: Questionnaire,
  parameters: {
    layout: 'padded',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const choices = [
  { value: 'delegation', label: 'Delegation', description: 'Show how work moves to a specialist.' },
  { value: 'questions', label: 'Question prompts', description: 'Show choices while the interface waits.' },
  { value: 'both', label: 'Both together' },
];

const items = [{ name: 'direction', required: true, choices }] as const;

function FreeformQuestionnaire() {
  const { answers, onSubmit } = useAnswers();
  return (
    <>
      <Questionnaire items={items} onSubmit={onSubmit}>
        <QuestionnaireItem name="direction" required>
          <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
          <QuestionnaireDescription>Choose a direction or write your own.</QuestionnaireDescription>
          <QuestionnaireChoices>
            {choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                <QuestionnaireChoiceTitle>{choice.label}</QuestionnaireChoiceTitle>
                {choice.description ? (
                  <QuestionnaireChoiceDescription>{choice.description}</QuestionnaireChoiceDescription>
                ) : null}
              </QuestionnaireChoice>
            ))}
            <QuestionnaireInput aria-label="Another answer" placeholder="Type another answer…" />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      <Answers answers={answers} />
    </>
  );
}

export const Freeform: Story = {
  render: () => <FreeformQuestionnaire />,
};
