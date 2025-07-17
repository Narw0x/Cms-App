import React, { useState, useEffect, useRef } from 'react';
import { Groq } from 'groq-sdk';

// Define message type
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chat: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Loading text phrases for animation
    const loadingTexts = ['Processing...', 'Analyzing...', 'Generating...'];

    // Cycle through loading texts
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    // Initialize Groq SDK with API key
    const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
        dangerouslyAllowBrowser: true,
    });

    // Check if API key is available
    useEffect(() => {
        if (!import.meta.env.VITE_GROQ_API_KEY) {
            console.error('VITE_GROQ_API_KEY is not set in your environment variables.');
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            console.log('Sending message to Groq API:', userMessage.content);
            const chatCompletion = await groq.chat.completions.create({
                messages: [...messages, userMessage].map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
                model: 'llama-3.3-70b-versatile',
                max_tokens: 500,
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: chatCompletion.choices[0]?.message?.content || 'No response',
            };
            setMessages((prev) => [...prev, assistantMessage]);
            console.log('Received response:', assistantMessage.content);
        } catch (error) {
            console.error('Error fetching Groq API:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Error: Could not connect to AI service. Check console for details.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col h-full border-r border-gray-200 rounded-lg">
            <div className="p-2 bg-white border-b rounded-t-lg">
                <h1 className="text-lg font-semibold text-black">AI Chat</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-[90%] p-1 rounded-lg shadow-sm text-sm ${
                            msg.role === 'user'
                                ? 'bg-blue-500 text-white ml-auto'
                                : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-1">
                        <span className="text-gray-600 text-xs animate-text-fade">
                            {loadingTexts[loadingTextIndex]}
                        </span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 bg-white border-t rounded-b-lg">
                <div className="flex flex-col space-y-2">
                    <textarea
                        className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-400 text-sm transition-all duration-200"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={2}
                    />
                    <button
                        className="w-full bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm transition-colors duration-200 rounded-b-lg"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;