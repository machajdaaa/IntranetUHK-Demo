# UHK Intranet – demo nového designu

Klikací demo redesignu intranetu UHK. Čisté HTML, CSS a JavaScript: bez buildu, bez závislostí, bez backendu.
Slouží jen k ukázce a sběru zpětné vazby. Data jsou zástupná a přihlášení nic neověřuje.

## Co demo ukazuje

| Stránka | Soubor | Co se dá vyzkoušet |
| --- | --- | --- |
| Přihlášení | `index.html` | Validace prázdných polí, zobrazení / skrytí hesla, po vyplnění obou polí přechod na Přehled |
| Přehled | `prehled.html` | Načítání skeletony (při prvním otevření), sbalení / rozbalení bočního menu, náhled notifikací pod zvonkem, menu účtu, vysouvací menu na tabletu a mobilu |
| Můj profil | `profil.html` | Volba fakulty (mění logo v menu), přepnutí světlý / tmavý režim s plynulým přechodem |

Režim, fakulta a stav bočního menu se pamatují v prohlížeči (localStorage).
Odkazy, které vedou mimo demo (seznam notifikací, detail…), ukážou hlášku „Tato část není součástí dema“.
Odhlásit vrací na přihlášení. Responzivní zlomy: 1280 / 1024 / 768 px (zkuste zúžit okno).

Potřebuje aktuální prohlížeč (Chrome, Edge, Firefox, Safari z posledních 2 let), protože rozvržení používá CSS container queries.

## Spuštění lokálně

Stačí statický server ve složce s demem, například:

```
python3 -m http.server 8000
```

Pak otevřete http://localhost:8000. Otevření `index.html` přímo ze souboru funguje taky, ale localStorage se v některých prohlížečích nepamatuje.

## Nasazení na Render (odkaz pro ostatní)

1. Založte nové repo (GitHub nebo GitLab) a nahrajte do něj obsah této složky (`index.html` musí být v kořeni repa).
2. Na [render.com](https://render.com) zvolte **New → Static Site** a připojte repo.
3. Nastavení:
   - **Build Command:** `echo "bez buildu"`
   - **Publish Directory:** `.`
4. Klikněte na **Create Static Site**. Za chvíli dostanete veřejný odkaz `https://<nazev>.onrender.com`.

Místo ručního nastavení můžete použít přiložený `render.yaml` (Render → **New → Blueprint** → vybrat repo).
Každý další push do hlavní větve se nasadí automaticky.

Rychlejší alternativa bez repa: [app.netlify.com/drop](https://app.netlify.com/drop), kam stačí přetáhnout tuto složku.

## Struktura

```
index.html          přihlášení
prehled.html        Přehled
profil.html         Můj profil
assets/
  uhk.css           styly a tokeny design systému (světlý i tmavý režim)
  demo.css          doplňky jen pro demo (pozadí stránky, hláška)
  login.js          šablona a logika přihlášení
  main.js           šablona a logika Přehledu a profilu (jedna komponenta, parametr page)
  dc-runtime.js     malý runtime: šablony {{…}}, <sc-if>, <sc-for>, překreslení přes morphdom
  morphdom.min.js   knihovna morphdom 2.7.4 (MIT) – zachová prvky, takže fungují CSS přechody
  app.js            ukládání nastavení, odkazy mimo demo, spuštění stránek
```

Další úpravy v Claude Code: viz `CLAUDE.md`.
