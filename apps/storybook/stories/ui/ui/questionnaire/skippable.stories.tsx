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
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
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

const items = [
  {
    name: 'audience',
    required: true,
    prompt: 'Who reads this dashboard?',
    description: 'Required — the layout depends on it.',
    choices: [
      { value: 'analysts', label: 'Analysts' },
      { value: 'leadership', label: 'Leadership' },
    ],
  },
  {
    name: 'detail',
    required: false,
    prompt: 'How much detail should it include?',
    description: 'Skip this if you are not sure yet.',
    choices: [
      { value: 'focused', label: 'Focused' },
      { value: 'complete', label: 'Complete flow' },
    ],
  },
  {
    name: 'alerts',
    required: false,
    prompt: 'Should it send alerts?',
    description: 'Optional.',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
] as const;

function SkippableQuestionnaire() {
  const { answers, onSubmit } = useAnswers();
  return (
    <>
      <Questionnaire items={items} onSubmit={onSubmit}>
        <QuestionnaireProgress />
        {items.map((question) => (
          <QuestionnaireItem key={question.name} name={question.name} required={question.required}>
            <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
            <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
            <QuestionnaireChoices>
              {question.choices.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  <QuestionnaireChoiceTitle>{choice.label}</QuestionnaireChoiceTitle>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      <Answers answers={answers} />
    </>
  );
}

export const Skippable: Story = {
  render: () => <SkippableQuestionnaire />,
};
