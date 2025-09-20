"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatClientProps {
  botSlug: string;
}

export default function ChatClient({ botSlug }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: getBotWelcomeMessage(botSlug),
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(botSlug, inputText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Back Button */}
      <div className="absolute top-3 left-4 z-30">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="px-4 pb-4 pt-4 space-y-3 flex-1 overflow-y-auto relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                message.isBot
                  ? "bg-white/90 backdrop-blur-sm text-gray-800 border border-white/20"
                  : "bg-green-500 text-white shadow-md"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isBot ? "text-gray-400" : "text-green-100"
              }`}>
                {message.timestamp.toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 relative z-20">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function getBotWelcomeMessage(botSlug: string) {
  const welcomeMessages = {
    yaprak: "Merhaba! Ben Yaprak, çevre dostu yaşam konusunda size yardımcı olmaya geldim. 🌱 Hangi konuda bilgi almak istiyorsunuz?",
    robi: "Selam! Ben Robi, enerji tasarrufu ve yenilenebilir enerji konularında uzmanım. ⚡ Nasıl yardımcı olabilirim?",
    bugday: "Merhaba! Ben Buğday, sürdürülebilir tarım ve gıda güvenliği konularında rehberinizim. 🌾 Hangi konuyu öğrenmek istiyorsunuz?",
    damla: "Selam! Ben Damla, su tasarrufu ve su kaynaklarının korunması konusunda size yardımcı olacağım. 💧 Hangi konuda bilgi almak istiyorsunuz?",
  };

  return welcomeMessages[botSlug as keyof typeof welcomeMessages] || welcomeMessages.yaprak;
}

function getBotResponse(botSlug: string, userMessage: string) {
  const responses = {
    yaprak: [
      "Çevre dostu yaşam için geri dönüşüm çok önemli! 🗑️",
      "Doğaya saygılı ürünler kullanarak dünyamızı koruyabiliriz. 🌍",
      "Bitki yetiştirmek hem keyifli hem de çevreye faydalı! 🌿",
    ],
    robi: [
      "Enerji tasarrufu için LED ampuller kullanmayı unutmayın! 💡",
      "Güneş enerjisi geleceğimiz için çok önemli! ☀️",
      "Elektronik cihazları kullanmadığınızda kapatmayı unutmayın! 🔌",
    ],
    bugday: [
      "Organik tarım hem sağlıklı hem de sürdürülebilir! 🥬",
      "Yerel üreticileri desteklemek önemli! 🏡",
      "Gıda israfını önlemek için planlı alışveriş yapın! 🛒",
    ],
    damla: [
      "Su tasarrufu için kısa duş almayı unutmayın! 🚿",
      "Muslukları kapatmayı unutmayın! 🚰",
      "Yağmur suyunu toplamak harika bir fikir! ☔",
    ],
  };

  const botResponses = responses[botSlug as keyof typeof responses] || responses.yaprak;
  return botResponses[Math.floor(Math.random() * botResponses.length)];
}
