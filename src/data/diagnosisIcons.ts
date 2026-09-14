/**
 * Ikony diagnóz pro rozcestník léčby.
 *
 * Stejná řeč jako ostatní ikony na webu: obrys v mřížce 24 × 24, tah
 * `currentColor` o síle 1,5, bez výplně. Tvary jsou zjednodušené —
 * v pětadvaceti pixelech je čitelná silueta orgánu nebo kloubu, ne anatomie.
 * Renderovat přes `<svg … set:html={diagnosisIcons[id]} />`.
 */
export const diagnosisIcons: Record<string, string> = {
  // Kloubní štěrbina mezi dvěma konci kostí, po stranách značky opotřebení.
  osteoarthritis:
    '<path d="M9.5 3v4c0 1.6-1.6 2-1.6 3.2 0 .9.7 1.4 1.2 1.8" /><path d="M14.5 3v4c0 1.6 1.6 2 1.6 3.2 0 .9-.7 1.4-1.2 1.8" /><path d="M8 13.5h8" /><path d="M9.5 15.6V21M14.5 15.6V21" /><path d="M4.8 11.2l1.4.6M19.2 11.2l-1.4.6M5.4 14.6l1.5-.3M18.6 14.6l-1.5-.3" />',

  // Kyčelní náhrada: jamka, hlavice, šikmý krček a dřík ve stehenní kosti.
  'hip-replacement':
    '<circle cx="8" cy="7.6" r="2.7" /><path d="M4.4 9.1a4.2 4.2 0 016-5.3" /><path d="M10 9.5l2.6 2.7" /><rect x="11.4" y="11.8" width="5.6" height="9.8" rx="2" /><path d="M14.2 13.4v5.6" />',

  // Koleno: kost nad, kost pod a destička náhrady mezi nimi.
  'knee-replacement':
    '<path d="M10 3v4.4c0 1.3-1.4 1.6-1.4 2.6" /><path d="M14 3v4.4c0 1.3 1.4 1.6 1.4 2.6" /><rect x="7.4" y="10.2" width="9.2" height="3.4" rx="1.2" /><path d="M9.8 15.8c0 1.4 1 1.8 1 3V21" /><path d="M14.2 15.8c0 1.4-1 1.8-1 3V21" />',

  // Páteř: obratle nad sebou v mírném prohnutí.
  spine:
    '<path d="M12 2.5v2" /><rect x="9.2" y="4.5" width="5.6" height="2.6" rx="1" /><rect x="9.5" y="8" width="5.6" height="2.6" rx="1" /><rect x="9.9" y="11.5" width="5.6" height="2.6" rx="1" /><rect x="9.5" y="15" width="5.6" height="2.6" rx="1" /><path d="M12 18.5v3" /><path d="M8 6.4H6M7.9 9.9H6M8.3 13.4H6" />',

  // Ruka s vyznačenými klouby prstů.
  'rheumatoid-arthritis':
    '<path d="M7 13.5V7.2a1.2 1.2 0 012.4 0v4.3" /><path d="M9.4 11.5V5.6a1.2 1.2 0 012.4 0v5.9" /><path d="M11.8 11.5V6.1a1.2 1.2 0 012.4 0v5.4" /><path d="M14.2 11.8V8.4a1.2 1.2 0 012.4 0v6.2c0 3.3-2.1 6.4-5.4 6.4-3 0-4.8-2-5.6-4L4 14.2a1.3 1.3 0 012-1.6l1 1" /><circle cx="8.2" cy="8.4" r=".7" /><circle cx="10.6" cy="7" r=".7" /><circle cx="13" cy="7.4" r=".7" />',

  // Kožní ložiska se šupinkami na končetině.
  psoriasis:
    '<rect x="7" y="2.6" width="10" height="18.8" rx="5" /><circle cx="11.4" cy="8.6" r="2.4" /><circle cx="13.6" cy="15.2" r="1.7" /><path d="M10.4 7.6l2 2M12.4 7.6l-2 2" /><path d="M12.9 14.5l1.4 1.4" />',

  // Ledvina s kameny a odstupujícím močovodem.
  'kidney-stones':
    '<path d="M14.2 3.8c3.3 0 5.5 3.5 5.5 8.2s-2.2 8.2-5.5 8.2c-2.7 0-4.7-2-4.7-4.4 0-2 1.8-3.1 1.8-3.8 0-.8-1.8-1.9-1.8-3.8 0-2.4 2-4.4 4.7-4.4z" /><circle cx="15" cy="14.6" r="1.1" /><circle cx="16.7" cy="12.4" r=".8" /><path d="M10.1 12.2c-1.5.6-2.3 1.9-2.3 3.6v2.4a2.6 2.6 0 01-2.6 2.6H4" />',

  // Močový měchýř s močovody.
  urological:
    '<path d="M8 4.5v3.2c0 1.6.8 2.4 1.6 3.2" /><path d="M16 4.5v3.2c0 1.6-.8 2.4-1.6 3.2" /><path d="M12 11c3.3 0 5.5 2.1 5.5 4.9 0 2.6-2.2 4.6-5.5 4.6s-5.5-2-5.5-4.6C6.5 13.1 8.7 11 12 11z" /><path d="M12 20.5v1.2" /><path d="M9.6 15.4c.8-.7 1.6-1 2.4-1s1.6.3 2.4 1" />',

  // Stužka: péče po onkologické léčbě.
  'oncology-aftercare':
    '<path d="M9.3 21.4l4.9-11.6c.9-2.1.1-4-1.7-4.7-1.9-.7-3.8.3-4.5 2.2-.7 1.9.2 3.7 1.9 4.4l4.8 9.7" /><path d="M9.9 11.7l1.9-.4" />',

  // Plíce s průdušnicí.
  respiratory:
    '<path d="M12 3v8" /><path d="M9.6 6.4h4.8" /><path d="M9.6 6.4c-.6 1.4-2.1 2-3.3 3.1C5 10.7 4.4 12.4 4.4 14.6c0 3 .9 5 2.6 5 1.5 0 2.6-1.4 2.6-3.6V6.4z" /><path d="M14.4 6.4c.6 1.4 2.1 2 3.3 3.1 1.3 1.2 1.9 2.9 1.9 5.1 0 3-.9 5-2.6 5-1.5 0-2.6-1.4-2.6-3.6V6.4z" />',

  // Žaludek s jícnem a vývodem do dvanáctníku.
  digestive:
    '<path d="M8.4 3v3.4" /><path d="M8.4 6.4c0 2.8 1.4 3.4 3.6 3.4 3 0 5 2 5 5 0 3.4-2.6 5.6-5.8 5.6-2.8 0-4.8-1.6-5.4-3.8" /><path d="M8.4 6.4c-1.5 1-2.3 2.6-2.3 4.6 0 1.6.4 2.8.8 3.8" /><path d="M17 14.8l2.6.8" /><path d="M11.2 20.4v1.2" />',

  // Metabolismus: kapka a měřicí stupnice.
  metabolic:
    '<path d="M9 3.5c2.4 2.8 3.8 4.8 3.8 6.6A3.8 3.8 0 019 13.9a3.8 3.8 0 01-3.8-3.8c0-1.8 1.4-3.8 3.8-6.6z" /><path d="M14.4 20.2a5.4 5.4 0 10-1.9-9.2" /><path d="M17.4 14.8v2.4l1.8 1" />',

  // Hlava a třes.
  parkinsons:
    '<circle cx="12" cy="8.4" r="5.6" /><path d="M9.4 7.4c.9-1.1 1.8-1.1 2.6 0s1.7 1.1 2.6 0" /><path d="M9.4 10.6c.9-1.1 1.8-1.1 2.6 0s1.7 1.1 2.6 0" /><path d="M3.4 19.4c1-1.5 2.1-1.5 3.1 0s2.1 1.5 3.1 0 2.1-1.5 3.1 0 2.1 1.5 3.1 0 2.1-1.5 3.1 0" />',

  // Nervový kořen vystupující mezi obratli.
  'nerve-root':
    '<rect x="3.4" y="4.8" width="6.2" height="4.6" rx="1.6" /><rect x="3.4" y="13" width="6.2" height="4.6" rx="1.6" /><path d="M9.6 11.2h3.1c1.5 0 2.4.9 3 2.1l1.5 3" /><path d="M17.2 16.3l2.6-.7M17.2 16.3l1.1 2.5" /><path d="M1.8 7.1h1.6M1.8 15.3h1.6" />',

  // Chodidlo s brněním.
  polyneuropathy:
    '<path d="M8.6 19.8c-.7-1.6-2.4-2.4-3.4-3.6-1-1.2-1.4-2.6-1.4-4.6 0-4.4 2.2-8.2 5.2-8.2 2 0 2.8 1.4 2.8 3.4 0 2.2-.8 3.4-.8 5 0 1.4 1 2 1 3.6 0 2.4-1.6 4.4-3.4 4.4z" /><path d="M14.6 8.4l2.4-1.2M15.6 12l2.6-.2M15.2 15.6l2.4 1.2" /><path d="M20 5.6l1.6-1M20.6 11.4h1.8M20.2 17.4l1.6 1" />',

  // Tlakoměr: manžeta a číselník.
  hypertension:
    '<circle cx="15.4" cy="9.4" r="4.4" /><path d="M15.4 7v2.4l1.7 1" /><rect x="3" y="12.6" width="8.6" height="6.4" rx="1.6" /><path d="M11.6 15.2c1 0 1.6-.6 1.6-1.6" /><path d="M5.2 19v1.6M9.4 19v1.6" />',

  // Srdce s křivkou EKG.
  'ischaemic-heart':
    '<path d="M12 20.4S3.8 15.3 3.8 9.6A4.6 4.6 0 0112 7.2a4.6 4.6 0 018.2 2.4c0 5.7-8.2 10.8-8.2 10.8z" /><path d="M5.6 12.6h2.8l1.4-2.6 1.8 5 1.6-3.4 1 1h3.2" />',

  // Zúžená tepna a průtok krve.
  'peripheral-arterial':
    '<path d="M2.4 7.6h6.1c1.3 0 1.3 1.9 2.7 1.9s1.4-1.9 2.7-1.9h7.7" /><path d="M2.4 16.4h6.1c1.3 0 1.3-1.9 2.7-1.9s1.4 1.9 2.7 1.9h7.7" /><path d="M4.6 12h2.6M13.6 12h5.8" /><path d="M17.6 10.2L19.4 12l-1.8 1.8" />',

  // Achillova šlacha a bolest v úponu na patní kosti.
  'tendon-pain':
    '<path d="M9.4 3.2v8.2c0 1.1.5 1.8 1.4 2.3l4.1 2.1c1.1.6 1.7 1.4 1.7 2.4 0 1.3-1 2.4-2.5 2.4H4.8" /><path d="M13.2 3.2v6.4" /><path d="M13.2 9.6c0 2.4-1.5 3.4-1.5 5.1" /><circle cx="7.2" cy="18.2" r="2.4" /><path d="M17.4 6.6l2.2-1.4M19 10.4l2.2.2M17.8 13.8l2 1.4" />',
}

/** Ikona diagnózy; prázdný řetězec, pokud pro ni ještě není. */
export function diagnosisIcon(id: string): string {
  return diagnosisIcons[id] ?? ''
}
