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
}

const faq: Record<string, Record<Locale, { q: string[]; a: string }>> = {
  springs: {
    cs: { q: ['prameny', 'pramen', 'kolik pramenů', 'minerální'], a: 'V Mariánských Lázních vyvěrá přes 40 minerálních pramenů s teplotou 7–10 °C, bohatých na CO₂. Nejznámější jsou Křížový, Ferdinandův, Rudolfův a Karolinin pramen. Lázeňský lékař vám sestaví individuální pitný plán.' },
    de: { q: ['quellen', 'quelle', 'mineralquellen', 'wie viele quellen'], a: 'In Marienbad gibt es über 40 Mineralquellen mit einer Temperatur von 7–10 °C, reich an CO₂. Die bekanntesten sind die Kreuzquelle, Ferdinandsquelle, Rudolfsquelle und Karolinenquelle.' },
    en: { q: ['springs', 'spring', 'how many springs', 'mineral'], a: 'Marienbad has over 40 mineral springs at 7–10 °C, rich in CO₂. The most famous are the Cross Spring, Ferdinand Spring, Rudolf Spring and Caroline Spring. A spa physician will create your individual drinking plan.' },
    ru: { q: ['источники', 'источник', 'сколько источников', 'минеральн'], a: 'В Марианских Лазнях более 40 минеральных источников с температурой 7–10 °C, богатых CO₂. Самые известные — Крестовый, Фердинандов, Рудольфов и Каролинин источники.' },
  },
  hotels: {
    cs: { q: ['hotel', 'ubytování', 'kde bydlet', 'kolik hotelů', 'ensana'], a: 'Ensana provozuje 7 lázeňských hotelů v Mariánských Lázních — od 5hvězdičkového Nové Lázně po 3hvězdičkové hotely Vltava a Svoboda. Všechny nabízejí přístup k lázeňským procedurám. Více na stránce Ubytování.' },
    de: { q: ['hotel', 'unterkunft', 'übernacht', 'ensana'], a: 'Ensana betreibt 7 Kurhotels in Marienbad — vom 5-Sterne-Hotel Nové Lázně bis zu 3-Sterne-Hotels Vltava und Svoboda. Alle bieten Zugang zu Kuranwendungen.' },
    en: { q: ['hotel', 'accommodation', 'where to stay', 'ensana'], a: 'Ensana operates 7 spa hotels in Marienbad — from the 5-star Nové Lázně to 3-star hotels Vltava and Svoboda. All offer access to spa treatments. See our Accommodation page for details.' },
    ru: { q: ['отель', 'проживание', 'где остановиться', 'ensana'], a: 'Ensana управляет 7 курортными отелями в Марианских Лазнях — от 5-звёздочного Нове Лазне до 3-звёздочных Влтава и Свобода.' },
  },
  treatments: {
    cs: { q: ['procedury', 'léčba', 'kúra', 'co2', 'uhličit', 'rašelin'], a: 'Hlavní procedury zahrnují uhličité koupele (CO₂), rašelinové zábaly, pitnou kúru a klimatoterapii. Konkrétní procedury vždy konzultujte s lázeňským lékařem. Více na stránce Léčivé prameny & Lázně.' },
    de: { q: ['behandlung', 'kur', 'therapie', 'co2', 'moor'], a: 'Zu den Hauptanwendungen gehören Kohlensäurebäder (CO₂), Moorpackungen, Trinkkur und Klimatherapie. Individuelle Behandlungen werden vom Kurarzt verordnet.' },
    en: { q: ['treatment', 'therapy', 'cure', 'co2', 'peat'], a: 'Main treatments include carbonated baths (CO₂), peat wraps, drinking cure and climate therapy. Specific treatments should always be discussed with a spa physician.' },
    ru: { q: ['процедуры', 'лечение', 'курс', 'co2', 'торф'], a: 'Основные процедуры: углекислые ванны (CO₂), торфяные обёртывания, питьевой курс и климатотерапия. Конкретные процедуры назначает курортный врач.' },
  },
  getting_there: {
    cs: { q: ['doprava', 'jak se dostat', 'vlak', 'auto', 'vzdálenost', 'praha'], a: 'Mariánské Lázně jsou 2 hodiny autem z Prahy, 1 hodinu z Plzně a 3 hodiny z Mnichova. Jede sem přímý vlak i autobus. Více na stránce Plánování cesty.' },
    de: { q: ['anreise', 'wie komme ich', 'zug', 'auto', 'entfernung', 'münchen'], a: 'Marienbad liegt 2 Stunden von Prag, 1 Stunde von Pilsen und 3 Stunden von München entfernt. Es gibt direkte Zug- und Busverbindungen.' },
    en: { q: ['get there', 'travel', 'train', 'car', 'distance', 'prague'], a: 'Marienbad is 2 hours from Prague, 1 hour from Pilsen and 3 hours from Munich by car. Direct train and bus connections are available.' },
    ru: { q: ['добраться', 'транспорт', 'поезд', 'машина', 'расстояние', 'прага'], a: 'Марианские Лазни — 2 часа от Праги, 1 час от Пльзени и 3 часа от Мюнхена на машине. Есть прямые поезда и автобусы.' },
  },
  insurance: {
    cs: { q: ['pojišťovna', 'hradí', 'poukaz', 'příspěvek'], a: 'České zdravotní pojišťovny v mnoha případech hradí část nákladů na lékařsky indikovaný lázeňský pobyt. Více informací najdete na lazneml.cz/lazenska-pece.' },
    de: { q: ['versicherung', 'krankenkasse', 'kur auf rezept', 'kostenübernahme'], a: 'Deutsche und österreichische Krankenkassen übernehmen in vielen Fällen einen Teil der Kosten für ärztlich verordnete Kuraufenthalte. Fragen Sie Ihren Arzt.' },
    en: { q: ['insurance', 'cover', 'cost', 'pay'], a: 'Health insurance may cover part of medically prescribed spa stays. Consult your physician and insurance provider for details.' },
    ru: { q: ['страховка', 'покрывает', 'стоимость', 'оплата'], a: 'Медицинская страховка может покрыть часть расходов на санаторно-курортное лечение по назначению врача.' },
  },
  unesco: {
    cs: { q: ['unesco', 'dědictví', 'světové'], a: 'Mariánské Lázně jsou od roku 2021 součástí světového dědictví UNESCO jako součást „Slavných lázeňských měst Evropy". Od roku 2023 mají statut klimatických lázní.' },
    de: { q: ['unesco', 'welterbe', 'weltkulturerbe'], a: 'Marienbad gehört seit 2021 zum UNESCO-Welterbe als Teil der „Great Spa Towns of Europe". Seit 2023 trägt es den Status eines Klimakurortes.' },
    en: { q: ['unesco', 'heritage', 'world heritage'], a: 'Marienbad has been a UNESCO World Heritage Site since 2021 as part of the "Great Spa Towns of Europe". Since 2023 it holds climate spa status.' },
    ru: { q: ['юнеско', 'наследие', 'всемирное'], a: 'Марианские Лазни — объект Всемирного наследия ЮНЕСКО с 2021 года в составе «Великих курортных городов Европы». С 2023 года имеют статус климатического курорта.' },
  },
  booking: {
    cs: { q: ['rezerv', 'objedn', 'ceník', 'cena', 'kolik stojí'], a: 'Rezervace ubytování a lázeňských pobytů probíhá přes ensanahotels.com. Ceny se liší podle sezóny a typu hotelu. Podrobný cenový průvodce najdete v našem magazínu.' },
    de: { q: ['buchen', 'reservier', 'preis', 'kosten'], a: 'Buchungen erfolgen über ensanahotels.com. Die Preise variieren je nach Saison und Hotel. Einen detaillierten Preisführer finden Sie in unserem Magazin.' },
    en: { q: ['book', 'reserv', 'price', 'cost', 'how much'], a: 'Bookings are made through ensanahotels.com. Prices vary by season and hotel type. Find our detailed price guide in the Magazine section.' },
    ru: { q: ['бронир', 'заказ', 'цена', 'стоимость', 'сколько стоит'], a: 'Бронирование — через ensanahotels.com. Цены зависят от сезона и типа отеля. Подробный ценовой гид — в нашем журнале.' },
  },
}

function findAnswer(query: string, locale: Locale): string | null {
  const q = query.toLowerCase()
  for (const topic of Object.values(faq)) {
    const localeData = topic[locale]
    if (localeData && localeData.q.some(keyword => q.includes(keyword))) {
      return localeData.a
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
    const answer = findAnswer(q, locale) ?? fallbacks[locale]
    const botMsg: Message = { role: 'assistant', text: answer }

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
