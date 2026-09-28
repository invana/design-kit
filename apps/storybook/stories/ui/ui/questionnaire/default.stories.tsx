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
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
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
    name: 'source',
    required: true,
    prompt: 'Where does the data come from?',
    description: 'Pick the system the model will read first.',
    choices: [
      { value: 'warehouse', label: 'Warehouse', description: 'Snowflake, BigQuery or Postgres.' },
      { value: 'files', label: 'Files', description: 'CSV or Parquet uploads.' },
      { value: 'api', label: 'An API', description: 'A REST endpoint polled on a schedule.' },
    ],
  },
  {
    name: 'cadence',
    required: true,
    prompt: 'How often should it refresh?',
    description: 'You can change this later in the source settings.',
    choices: [
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'manual', label: 'Only when I ask' },
    ],
  },
] as const;

function DefaultQuestionnaire() {
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
                  {'description' in choice ? (
                    <QuestionnaireChoiceDescription>{choice.description}</QuestionnaireChoiceDescription>
                  ) : null}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      <Answers answers={answers} />
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultQuestionnaire />,
};
