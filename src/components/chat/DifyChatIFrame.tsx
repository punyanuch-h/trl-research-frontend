import { useState, useRef, useEffect, ComponentPropsWithoutRef } from "react";
import { useTranslation } from "react-i18next";
import { Send, X, MessageCircle, Bot, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import chatIcon from "/assets/chat_icon.svg";
import { useDifyChat } from "@/hooks/chat/useDifyChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DifyChatIframe() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage, resetChat } = useDifyChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`fixed right-6 bottom-6 p-4 rounded-full shadow-xl transition-all duration-300 z-[9999] hover:scale-105 active:scale-95 ${
          isOpen 
            ? "bg-red-500 rotate-90"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img src={chatIcon} alt="chat" className="w-7 h-7 invert brightness-0 filter" />
        )}
      </button>

      {isOpen && (
        <Card className="fixed right-6 bottom-24 w-[380px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl z-[9998] animate-in slide-in-from-bottom-5 fade-in duration-300 border-0 rounded-2xl overflow-hidden ring-1 ring-black/5">
          {/* Custom Header */}
          <div className="bg-primary p-4 flex items-center justify-between shrink-0 shadow-md z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">{t("chat.assistantTitle")}</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-8 w-8 rounded-full"
              onClick={resetChat}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-slate-50/50">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                    <MessageCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t("chat.welcomeTitle")}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{t("chat.welcomeMessage")}</p>
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      msg.content === "" && isLoading ? (
                        <div className="flex items-center gap-1.5 h-5">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"/>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"/>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"/>
                        </div>
                      ) : (
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-ul:my-1 prose-ol:my-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-500 hover:underline font-medium break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                            table: ({ node, ...props }) => <div className="overflow-x-auto my-2 rounded-md border border-gray-200"><table className="w-full text-left border-collapse text-xs" {...props} /></div>,
                            th: ({ node, ...props }) => <th className="bg-gray-50 p-2 border-b font-semibold text-gray-700" {...props} />,
                            td: ({ node, ...props }) => <td className="p-2 border-b last:border-0 border-gray-100" {...props} />,
                            hr: ({ node, ...props }) => <hr className="my-4 border-gray-200" {...props} />,
                            code: ({ node, className, children, ...props }: ComponentPropsWithoutRef<"code"> & { node?: unknown }) => {
                              const isInline = !String(children).includes('\n');
                              return isInline ? (
                                <code className="bg-gray-100 text-pink-500 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <div className="bg-slate-900 text-slate-50 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono shadow-inner">
                                  <code {...props}>{children}</code>
                                </div>
                              )
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-end relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("chat.inputPlaceholder")}
                  className="flex-1 min-h-[44px] pr-12 py-3 bg-gray-50 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl resize-none shadow-sm"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !inputValue.trim()}
                  className={`absolute right-1.5 bottom-1.5 h-8 w-8 rounded-lg transition-all duration-200 shadow-sm ${
                    inputValue.trim() ? "bg-primary hover:bg-primary/80 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
