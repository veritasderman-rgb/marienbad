# Databáze důkazů (`balneology_evidence.json`)

Ověřené studie a oficiální dokumenty pro zdravotní tvrzení na marienbad.com. Vznikla 11. 9. 2026 rešerší v PubMed a Consensus; každý záznam byl zkontrolován proti abstraktu.

## Struktura záznamu

| Pole | Význam |
|---|---|
| `id` | stabilní klíč (autor‑rok‑téma) |
| `topics` | štítky pro filtrování (`artroza`, `ledviny`, `co2`, `post-covid`, `onkologie`, `lesni-koupel`, …) |
| `citation` | krátká citace do textu („Forestier R et al. 2025, Int J Biometeorol") |
| `design`, `n`, `population` | typ studie, velikost a populace |
| `finding_cs` | co studie zjistila, česky, bez přehánění |
| `limitations_cs` | hlavní omezení — **vždy uvést spolu s nálezem** |
| `claim_level` | `A` = jen fakt existence (probíhající studie, indikace) · `B` = opora pro „možný přínos" · `C` = opora pro konkrétní tvrzení s velikostí efektu |
| `url` | DOI nebo odkaz na Consensus/PubMed |

## Jak používat

1. Najít téma: `jq '.entries[] | select(.topics[] == "ledviny") | {citation, finding_cs, claim_level}' data/evidence/balneology_evidence.json`
2. Tvrzení kategorie C psát jen se záznamem `claim_level: C`; kategorie B stačí `B`.
3. Do frontmatteru článku zkopírovat `citation` → `title`, `url` → `url` a stručný `finding_cs` + omezení → `note`.
4. Nový zdroj přidat sem dřív, než se použije v článku. Záznamy označené štítkem `upozorneni` jsou studie, které tvrzení **nepodporují** (např. negativní RCT plynových injekcí) — slouží k tomu, aby se chyba neopakovala.

Redakční pravidla: `CLAUDE.md` → „Zdravotní tvrzení". Plán auditu: `docs/content-audits/cs-medicinsky-audit-plan.md`.
