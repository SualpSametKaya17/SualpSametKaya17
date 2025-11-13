"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load selected database from localStorage
  useEffect(() => {
    const dbName = localStorage.getItem("selectedDatabase");
    if (dbName) {
      setSelectedDatabase(dbName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!selectedDatabase) {
      alert("Lütfen önce Veritabanı Ayarları sayfasından bir veritabanı seçin!");
      return;
    }

    // Get database config from localStorage
    const dbConfigString = localStorage.getItem("dbConfig");
    if (!dbConfigString) {
      alert("Veritabanı bağlantı bilgileri bulunamadı. Lütfen önce veritabanına bağlanın.");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Encode config to base64 for transmission
      const dbConfigBase64 = btoa(dbConfigString);

      const response = await axios.post("/api/chat", {
        message: input,
        database: selectedDatabase,
        history: messages,
        dbConfig: dbConfigBase64,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Database Info Bar */}
      {selectedDatabase && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-800">
          <span className="font-medium">Aktif Veritabanı:</span> {selectedDatabase}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-2xl font-semibold mb-2">
                AI Rapor Asistanına Hoş Geldiniz
              </h2>
              <p className="text-sm">
                Veritabanınız hakkında soru sorun ve rapor oluşturun
              </p>
              {!selectedDatabase && (
                <p className="text-red-500 mt-4">
                  ⚠️ Lütfen Veritabanı Ayarları sayfasından bir veritabanı seçin
                </p>
              )}
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <Loader2 className="animate-spin text-gray-600" size={20} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Veritabanınız hakkında bir soru sorun..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading || !selectedDatabase}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !selectedDatabase}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={20} />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
