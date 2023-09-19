import React, { ChangeEvent } from 'react';
import { useAsync } from 'react-use';
import { scan } from 'rxjs/operators';

import { llms } from '@grafana/experimental';

import { Input, Spinner } from '@grafana/ui';

interface Props {
  onReply: (reply: string) => void;
}
export const LLMEditor: React.FC<Props> = ({ onReply }) => {
  const [input, setInput] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const { loading, error } = useAsync(async () => {
    const enabled = await llms.openai.enabled();
    setEnabled(enabled);
    if (!enabled) {
      console.log('LLM is not enabled')
      return false;
    }

    console.log('LLM is enabled')
    if (message === '') {
      console.log('No message')
      return;
    }

    console.log('Sending message')
    // Stream the completions. Each element is the next stream chunk.
    const stream = llms.openai
      .streamChatCompletions({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a SQL assistant.' },
          { role: 'user', content: message },
        ],
      })
      .pipe(
        // Accumulate the stream chunks into a single string.
        scan((acc, delta) => acc + delta, '')
      );

    console.log('Subscribing to stream')
    // Subscribe to the stream and update the state for each returned value.
    return stream.subscribe(onReply);
  }, [message]);

  if (error) {
    return <>Failed to load LLM Model</>;
  }

  if (!enabled) {
    return null
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
      <Input
        height={20}
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
      {loading && <Spinner />}
    </div>
  );
};
