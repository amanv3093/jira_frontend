"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams } from "next/navigation";
import { useAIChat } from "@/hooks/ai";
import { ChatMessage } from "@/services/ai";
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Trash2,
} from "lucide-react";

const SUGGESTIONS = [
  "What tasks are overdue?",
  "Show me workspace stats",
  "Create a high priority task",
  "What's the team working on?",
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const workspaceId = params?.id as string;
  const aiChat = useAIChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || !workspaceId || aiChat.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    aiChat.mutate(
      { message: msg, workspaceId, history: messages },
      {
        onSuccess: (data) => {
          if (data) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: data.reply,
                actions: data.actions,
              },
            ]);
          }
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!workspaceId) return null;

  const widget = (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[75] h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          title="AI Assistant"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[75] w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">AI Assistant</p>
                <p className="text-[10px] opacity-80">
                  Manage tasks with natural language
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-950">
                  <MessageSquare className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    How can I help you today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ask me to create tasks, check status, or get insights
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1.5 w-full max-w-[280px]">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs text-left px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3 text-violet-500" />
                      <span className="text-[10px] font-medium text-violet-500">
                        AI
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px]">
                    {msg.content}
                  </div>
                  {/* Action badges */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.actions.map((action: any, j: number) => (
                        <div
                          key={j}
                          className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {action.function.replace("_", " ")}
                            {action.result?.task?.name &&
                              `: ${action.result.task.name}`}
                            {action.result?.project?.name &&
                              `: ${action.result.project.name}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {aiChat.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2.5">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={aiChat.isPending}
                className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || aiChat.isPending}
                className="p-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              AI can make mistakes. Verify important actions.
            </p>
          </div>
        </div>
      )}
    </>
  );

  if (typeof window === "undefined") return null;
  return ReactDOM.createPortal(widget, document.body);
}
