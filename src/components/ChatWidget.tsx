import { useState, useRef, useEffect } from 'react'
import type { Locale } from '@/i18n/config'

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

const links: Record<string, Record<Locale, string>> = {
  springs: { cs: '/cs/mineralni-prameny', de: '/de/mineralquellen', en: '/en/mineral-springs', ru: '/ru/mineralnye-istochniki' },
  hotels: { cs: '/cs/ubytovani', de: '/de/unterkunft', en: '/en/accommodation', ru: '/ru/prozhivanie' },
  treatments: { cs: '/cs/mineralni-prameny', de: '/de/mineralquellen', en: '/en/mineral-springs', ru: '/ru/mineralnye-istochniki' },
  getting_there: { cs: '/cs/prakticke-informace', de: '/de/praktische-infos', en: '/en/practical-info', ru: '/ru/prakticheskaya-informaciya' },
  insurance: { cs: '/cs/prakticke-informace', de: '/de/praktische-infos', en: '/en/practical-info', ru: '/ru/prakticheskaya-informaciya' },
  unesco: { cs: '/cs/historie', de: '/de/geschichte', en: '/en/history', ru: '/ru/istoriya' },
  booking: { cs: '/cs/ubytovani', de: '/de/unterkunft', en: '/en/accommodation', ru: '/ru/prozhivanie' },
  activities: { cs: '/cs/co-delat', de: '/de/aktivitaeten', en: '/en/things-to-do', ru: '/ru/chem-zanyatsya' },
  magazine: { cs: '/cs/magazin', de: '/de/magazin', en: '/en/magazine', ru: '/ru/zhurnal' },
}

const faq: Record<string, Record<Locale, { q: string[]; a: string }>> = {
  springs: {
    cs: { q: ['prameny', 'pramen', 'kolik pramenů', 'minerální'], a: 'V Mariánských Lázních vyvěrá přes 40 minerálních pramenů s teplotou 7–10 °C, bohatých na CO₂. Nejznámější jsou Křížový, Ferdinandův, Rudolfův a Karolinin pramen.' },
    de: { q: ['quellen', 'quelle', 'mineralquellen', 'wie viele quellen'], a: 'In Marienbad gibt es über 40 Mineralquellen mit einer Temperatur von 7–10 °C, reich an CO₂. Die bekanntesten sind die Kreuzquelle, Ferdinandsquelle, Rudolfsquelle und Karolinenquelle.' },
    en: { q: ['springs', 'spring', 'how many springs', 'mineral'], a: 'Marienbad has over 40 mineral springs at 7–10 °C, rich in CO₂. The most famous are the Cross Spring, Ferdinand Spring, Rudolf Spring and Caroline Spring.' },
    ru: { q: ['источники', 'источник', 'сколько источников', 'минеральн'], a: 'В Марианских Лазнях более 40 минеральных источников с температурой 7–10 °C, богатых CO₂.' },
  },
  hotels: {
    cs: { q: ['hotel', 'ubytování', 'kde bydlet', 'kolik hotelů', 'ensana'], a: 'Ensana provozuje 7 lázeňských hotelů — od 5hvězdičkového Nové Lázně po 3hvězdičkové Vltava a Svoboda.' },
    de: { q: ['hotel', 'unterkunft', 'übernacht', 'ensana'], a: 'Ensana betreibt 7 Kurhotels — vom 5-Sterne-Hotel Nové Lázně bis zu 3-Sterne-Hotels Vltava und Svoboda.' },
    en: { q: ['hotel', 'accommodation', 'where to stay', 'ensana'], a: 'Ensana operates 7 spa hotels — from the 5-star Nové Lázně to 3-star hotels Vltava and Svoboda.' },
    ru: { q: ['отель', 'проживание', 'где остановиться', 'ensana'], a: 'Ensana управляет 7 курортными отелями — от 5-звёздочного Нове Лазне до 3-звёздочных Влтава и Свобода.' },
  },
  treatments: {
    cs: { q: ['procedury', 'léčba', 'kúra', 'co2', 'uhličit', 'rašelin'], a: 'Hlavní procedury: uhličité koupele (CO₂), rašelinové zábaly, pitná kúra a klimatoterapie. Konkrétní procedury vždy konzultujte s lázeňským lékařem.' },
    de: { q: ['behandlung', 'kur', 'therapie', 'co2', 'moor'], a: 'Hauptanwendungen: Kohlensäurebäder (CO₂), Moorpackungen, Trinkkur und Klimatherapie. Individuelle Behandlungen verordnet der Kurarzt.' },
    en: { q: ['treatment', 'therapy', 'cure', 'co2', 'peat'], a: 'Main treatments: carbonated baths (CO₂), peat wraps, drinking cure and climate therapy. Always consult a spa physician.' },
    ru: { q: ['процедуры', 'лечение', 'курс', 'co2', 'торф'], a: 'Основные процедуры: углекислые ванны (CO₂), торфяные обёртывания, питьевой курс и климатотерапия.' },
  },
  getting_there: {
    cs: { q: ['doprava', 'jak se dostat', 'vlak', 'auto', 'vzdálenost', 'praha'], a: 'Mariánské Lázně: 2 h z Prahy, 1 h z Plzně, 3 h z Mnichova. Přímý vlak i autobus.' },
    de: { q: ['anreise', 'wie komme ich', 'zug', 'auto', 'entfernung', 'münchen'], a: 'Marienbad: 2 Std. von Prag, 1 Std. von Pilsen, 3 Std. von München. Direkte Zug- und Busverbindungen.' },
    en: { q: ['get there', 'travel', 'train', 'car', 'distance', 'prague'], a: 'Marienbad: 2h from Prague, 1h from Pilsen, 3h from Munich. Direct train and bus connections available.' },
    ru: { q: ['добраться', 'транспорт', 'поезд', 'машина', 'расстояние', 'прага'], a: 'Марианские Лазни: 2 ч от Праги, 1 ч от Пльзени, 3 ч от Мюнхена. Прямые поезда и автобусы.' },
  },
  insurance: {
    cs: { q: ['pojišťovna', 'hradí', 'poukaz', 'příspěvek'], a: 'České pojišťovny v mnoha případech hradí část nákladů na lázeňský pobyt. Více na lazneml.cz.' },
    de: { q: ['versicherung', 'krankenkasse', 'kur auf rezept', 'kostenübernahme'], a: 'Deutsche/österreichische Krankenkassen übernehmen oft einen Teil der Kosten für Kuraufenthalte.' },
    en: { q: ['insurance', 'cover', 'cost', 'pay'], a: 'Health insurance may cover part of medically prescribed spa stays. Ask your physician.' },
    ru: { q: ['страховка', 'покрывает', 'стоимость', 'оплата'], a: 'Страховка может покрыть часть расходов на курортное лечение по назначению врача.' },
  },
  unesco: {
    cs: { q: ['unesco', 'dědictví', 'světové'], a: 'Od 2021 součást UNESCO „Slavná lázeňská města Evropy". Od 2023 statut klimatických lázní.' },
    de: { q: ['unesco', 'welterbe', 'weltkulturerbe'], a: 'Seit 2021 UNESCO-Welterbe „Great Spa Towns of Europe". Seit 2023 Klimakurort.' },
    en: { q: ['unesco', 'heritage', 'world heritage'], a: 'UNESCO World Heritage since 2021 ("Great Spa Towns of Europe"). Climate spa since 2023.' },
    ru: { q: ['юнеско', 'наследие', 'всемирное'], a: 'Объект ЮНЕСКО с 2021 («Великие курортные города Европы»). Климатический курорт с 2023.' },
  },
  booking: {
    cs: { q: ['rezerv', 'objedn', 'ceník', 'cena', 'kolik stojí'], a: 'Rezervace přes ensanahotels.com. Ceny se liší podle sezóny a hotelu.' },
    de: { q: ['buchen', 'reservier', 'preis', 'kosten'], a: 'Buchungen über ensanahotels.com. Preise variieren nach Saison und Hotel.' },
    en: { q: ['book', 'reserv', 'price', 'cost', 'how much'], a: 'Book through ensanahotels.com. Prices vary by season and hotel.' },
    ru: { q: ['бронир', 'заказ', 'цена', 'стоимость', 'сколько стоит'], a: 'Бронирование через ensanahotels.com. Цены зависят от сезона и отеля.' },
  },
  activities: {
    cs: { q: ['co dělat', 'aktivit', 'výlet', 'fontán', 'golf', 'kolonád'], a: 'Zpívající fontána, Hlavní kolonáda, Royal Golf Club (1905), Park Boheminium, Kladská a desítky dalších atrakcí.' },
    de: { q: ['was tun', 'aktivität', 'ausflug', 'fontäne', 'golf', 'kolonnade'], a: 'Singende Fontäne, Hauptkolonnade, Royal Golf Club (1905), Park Boheminium, Kladská u.v.m.' },
    en: { q: ['what to do', 'activit', 'trip', 'fountain', 'golf', 'colonnade'], a: 'Singing Fountain, Main Colonnade, Royal Golf Club (1905), Boheminium Park, Kladská and more.' },
    ru: { q: ['чем заняться', 'активност', 'экскурси', 'фонтан', 'гольф', 'колоннад'], a: 'Поющий фонтан, Главная колоннада, Royal Golf Club (1905), парк Богеминиум, Кладска.' },
  },
}

function findAnswer(query: string, locale: Locale): { text: string; link?: string } | null {
  const q = query.toLowerCase()
  for (const [key, topic] of Object.entries(faq)) {
    const localeData = topic[locale]
    if (localeData && localeData.q.some(keyword => q.includes(keyword))) {
      return { text: localeData.a, link: links[key]?.[locale] }
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
        className="fixed bottom-20 left-6 z-50 md:bottom-8 w-12 h-12 rounded-full bg-indigo-700 text-white shadow-lg hover:bg-indigo-600 transition-colors flex items-center justify-center cursor-pointer"
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
