# Pokyny pro Claude Code – demo UHK Intranetu

Statické klikací demo redesignu intranetu Univerzity Hradec Králové. Cíl: ukázat kolegům design a sebrat zpětnou vazbu.
Nasazuje se jako Render Static Site (viz README). Nepřidávej build, framework ani backend, pokud o to uživatel výslovně nepožádá.

## Jak demo funguje

- Každá stránka (`index.html`, `prehled.html`, `profil.html`) načte `morphdom.min.js`, `dc-runtime.js`, komponentu (`login.js` / `main.js`) a `app.js`.
- Komponenta = šablona (řetězec HTML) + třída `Component extends DCLogic` s metodou `renderVals()`, která vrací hodnoty pro šablonu.
- Šablona:
  - `{{název}}` vloží hodnotu;
  - `onClick="{{fn}}"` (také `onInput`, `onChange`, `onSubmit`) napojí obsluhu;
  - `<sc-if value="{{x}}">` zobrazí obsah podmíněně;
  - `<sc-for list="{{pole}}" as="p">` vykreslí obsah opakovaně;
  - atributy `hint-*` se ignorují.
- `this.setState({...})` naplánuje překreslení. Překresluje se přes morphdom, prvky zůstávají, takže CSS přechody a animace (sbalení menu, vysunutí panelu) fungují.
- `main.js` je jedna komponenta pro Přehled i profil, přepíná se vlastností `page` (`prehled` / `profil`). Vlastnost `theme` (`light` / `dark`) a stav `fac` (fakulta) mění vzhled.
- `app.js` ukládá režim, fakultu a stav menu do localStorage a obsluhuje odkazy `data-demo-off` (hláška „není součástí dema“) a `data-href`.

## Pravidla design systému (dodržuj při každé změně)

- **Jazyk:** veškeré texty v UI česky. Primární modrá `#1D4ED8` (token `--p`). Písmo Inter.
- **Barvy:** jen tokeny z `uhk.css` (`--p`, `--ps`, `--bg`, `--sf`, `--tx`, `--tx2`, `--tx3`, `--ln`…). Nepiš natvrdo `#fff` pro plochy, použij `var(--sf)`. Tmavý režim řeší třída `.theme-dark` na předkovi `.uhk`: každá nová barva potřebuje tmavou variantu.
- **Odsazení:** jen škála po 4 px (tokeny `--sp-*`). Karty mají vnitřní odsazení 24 px, mezi kartami 16–24 px.
- **Zaoblení:**
  - pilulka: tlačítka, štítky, záložky;
  - 12 px: pole a vyhledávání;
  - 16 px: položky seznamů a menu, bannery;
  - 20–24 px: karty, tabulky, dialogy, sidebar, horní lišta.
  - Stejná funkce = stejný tvar a velikost na všech obrazovkách.
- **Hover:** jednotný přechod 0,3 s. Zvýraznění při najetí nikdy nekončí na hraně textu: vodorovný odstup alespoň 12 px. Pokud má text lícovat s okrajem, použij záporný okraj.
- **Ikony:**
  - Material ikony, u menu (hamburger) zaoblené konce čar.
  - Ikony aplikací a kategorií jsou v dlaždici 22 × 22 px se zaoblením 7 px. Přehled má šedou neutrální dlaždici, ve vybraném stavu bílou s modrou ikonou.
  - „Ilustrace = stav, ikona = akce“: prázdné a chybové stavy používají ilustraci ze složených závorek { }.
- **Boční menu:**
  - Sbalené 80 px, rozbalené 256 px. Tlačítko « / » je vždy pod logem.
  - Od 1280 px rozbalení odsune obsah, pod 1280 px je overlay. Od 1024 px má stejnou animaci jako na PC (80 → 256 px), pod 1024 px vyjede zleva.
- **Logo:** jen oficiální logotyp „{ } UHK“ (nebo fakultní) ve variantě „small“ jako SVG křivky z grafického manuálu (třída `uhk-lt`), nikdy text psaný písmem rozhraní. Černá #1D1D1B, v tmavém režimu bílá, bez efektů. Kolem logotypu ochranná zóna velká jako jeho výška. „Intranet“ stojí za zónou a dělicí čarou. Minimum 16 px.
- **Načítání:** jen skeletony, žádné spinnery. Na tabletu a mobilu se posuvníky skrývají.
- **Přístupnost:** viditelný fokus, `aria-*` u ikonových tlačítek, respektuj `prefers-reduced-motion`.

## Zásady práce

- Nevymýšlej nové funkce. Co není jisté, napiš uživateli jako otázku („k ověření“), nedoplňuj potichu.
- Po změně stylů zkontroluj světlý i tmavý režim a šířky 1440, 1024, 768 a 390 px.
- Data (jména, notifikace, aplikace) jsou zástupná, ponech je zástupná.
