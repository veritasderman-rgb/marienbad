import { useState, useRef, useEffect } from 'react'
import type { Locale } from '@/i18n/config'
import { chatFaq, chatLinks } from '@/data/chatFaq'

interface Props {
  locale: Locale
  translations: {
    title: string
    placeholder: string
    greeting: string
    disclaimer: string
  }
}

interface Message {
  role: 'user' | 'assistant'
  text: string
  link?: string
}

// FAQ data imported from external file for maintainability

function findAnswer(query: string, locale: Locale): { text: string; link?: string } | null {
  const q = query.toLowerCase()
  for (const [key, topic] of Object.entries(chatFaq)) {
    const localeData = topic[locale]
    if (localeData && localeData.q.some(keyword => q.includes(keyword.toLowerCase()))) {
      return { text: localeData.a, link: chatLinks[key]?.[locale] }
    }
  }
  return null
}

const fallbacks: Record<Locale, string> = {
  cs: 'Omlouvám se, na tuto otázku bohužel nemám odpověď. Pro podrobnější informace nás kontaktujte na webmaster.cz@ensanahotels.com nebo navštivte naše stránky.',
  de: 'Entschuldigung, auf diese Frage habe ich leider keine Antwort. Für weitere Informationen kontaktieren Sie uns unter webmaster.cz@ensanahotels.com.',
  en: 'I\'m sorry, I don\'t have an answer to that question. For more information, please contact us at webmaster.cz@ensanahotels.com or browse our website.',
  ru: 'Извините, на этот вопрос у меня нет ответа. Для подробной информации свяжитесь с нами: webmaster.cz@ensanahotels.com.',
}

export default function ChatWidget({ locale, translations: tr }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const q = input.trim()
    if (!q) return

    const userMsg: Message = { role: 'user', text: q }
    const result = findAnswer(q, locale)
    const botMsg: Message = result
      ? { role: 'assistant', text: result.text, link: result.link }
      : { role: 'assistant', text: fallbacks[locale] }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 z-50 md:bottom-8 w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: '#a7336d' }}
        aria-label={tr.title}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-50 md:bottom-8 bg-white rounded-2xl shadow-2xl border border-beige-200 flex flex-col overflow-hidden" style={{ maxHeight: '28rem' }}>
      {/* Header */}
      <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-turquoise-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span className="text-sm font-semibold">{tr.title}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white cursor-pointer" aria-label="Close">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-beige-500 text-sm text-center py-6">{tr.greeting}</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-700 text-white rounded-br-sm'
                : 'bg-beige-100 text-beige-800 rounded-bl-sm'
            }`}>
              {msg.text}
              {msg.link && (
                <a href={msg.link} className="block mt-1.5 text-xs font-medium text-turquoise-600 hover:underline">
                  {'→ '}
                  {locale === 'cs' ? 'Více informací' : locale === 'de' ? 'Mehr erfahren' : locale === 'ru' ? 'Подробнее' : 'Learn more'}
                </a>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-beige-200 p-3 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tr.placeholder}
            className="flex-1 px-3 py-2 text-sm border border-beige-200 rounded-full focus:outline-none focus:border-turquoise-400 focus:ring-1 focus:ring-turquoise-400"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-indigo-700 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shrink-0 cursor-pointer"
            aria-label="Send"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
        <p className="text-[0.625rem] text-beige-400 text-center mt-1.5">{tr.disclaimer}</p>
      </div>
    </div>
  )
}
