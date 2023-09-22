import React, { ChangeEvent } from 'react';
import { useAsync } from 'react-use';
// import { scan } from 'rxjs/operators';

import { llms } from '@grafana/experimental';

import { InlineField, Input, Spinner } from '@grafana/ui';

interface Props {
  onReply: (reply: any) => void;
}
export const LLMEditor: React.FC<Props> = ({ onReply }) => {
  const [input, setInput] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const { loading, error } = useAsync(async () => {
    const enabled = await llms.openai.enabled();
    setEnabled(enabled);
    if (!enabled) {
      console.log('LLM is not enabled');
      return false;
    }

    console.log('LLM is enabled');
    if (message === '') {
      console.log('No message');
      return;
    }

    console.log('Sending message');

    // Stream the completions. Each element is the next stream chunk.
    const response = await llms.openai.chatCompletions({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
            You are a Grafana and SQL database expert. 
            Generate only the sql query without adding any other details.
            The result will be written directly in a query editor, Add the details as sql comment.

            My database schema is:
            ${localStorage.getItem('table_schema')}
          `,
        },
        { role: 'user', content: message },
      ],
    });

    // Subscribe to the stream and update the state for each returned value.
    console.log('Response to console');
    console.log(response)
    const reply = response?.choices[0]?.message?.content;
    onReply(reply);
    return reply;
  }, [message]);

  if (error) {
    return <>Failed to load LLM Model</>;
  }

  if (!enabled) {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
      <InlineField label="Prompt" labelWidth={16} grow>
        <Input
          height={20}
          width={100}
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setInput(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setMessage(input);
            }
          }}
          placeholder="Enter a message"
          disabled={loading}
        />
      </InlineField>
      {loading && <Spinner />}
    </div>
  );
};
