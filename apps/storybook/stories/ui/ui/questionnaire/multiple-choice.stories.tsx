import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
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

const layers = [
  { value: 'raw', label: 'Raw' },
  { value: 'staged', label: 'Staged' },
  { value: 'modelled', label: 'Modelled' },
  { value: 'published', label: 'Published' },
];

const items = [{ name: 'layers', required: true, choices: layers }] as const;

function MultipleChoiceQuestionnaire() {
  const { answers, onSubmit } = useAnswers();
  return (
    <>
      <Questionnaire items={items} onSubmit={onSubmit}>
        <QuestionnaireItem name="layers" required multiple>
          <QuestionnaireTitle>Which layers should the agent read?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick every layer that applies.</QuestionnaireDescription>
          <QuestionnaireChoices>
            {layers.map((layer) => (
              <QuestionnaireChoice key={layer.value} value={layer.value}>
                <QuestionnaireChoiceTitle>{layer.label}</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ))}
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

export const MultipleChoice: Story = {
  render: () => <MultipleChoiceQuestionnaire />,
};
