import notificationSound from '@/assets/sounds/notification.mp3';
import popSound from '@/assets/sounds/pop.mp3';
import axios from 'axios';
import {useRef, useState} from 'react';
import ChatInput, {type ChatFormData} from './ChatInput';
import type {Message} from './ChatMessages';
import ChatMessages from './ChatMessages';
import TypingIndicator from './TypingIndicator';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async ({prompt}: ChatFormData) => {
    try {
      setMessages(prev => [...prev, {content: prompt, role: 'user'}]);
      setIsBotTyping(true);
      setError('');
      popAudio.play();

      const {data} = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages(prev => [...prev, {content: data.message, role: 'bot'}]);
      notificationAudio.play();
    } catch (error) {
      // In real application log tools like SENTRY
      console.error(error);
      setError('Something went wrong, please try again!');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-auto">
        <h4 className="px-3 py-1 rounded-xl bg-green-600 text-white">
          Welcome to Smart GTP!
        </h4>

        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}

        {error && <p className="text-red-500">{error}</p>}

        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default ChatBot;
