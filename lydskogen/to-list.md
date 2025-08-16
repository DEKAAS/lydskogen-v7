# Lydskog Komplett Redesign - TODO Liste

## ⚠️ KRITISK - Les før du starter!

**Git Repository:** Du har allerede git-repo, så eksisterende kode er sikker. 

**Strategi:** Dette er en total redesign basert på ny wireframe og glassmorphism-estetikk. Gå gjennom hver seksjon metodisk og implementer det nye designet bit for bit.

---

## 🎨 Design System Fundamenter

### Global Fargepalett
- [ ] Implementer CSS custom properties for den nye 3-farge paletten:
  - `--primary-bg: #424A45` (Mørk grønn - Hovedbakgrunn)
  - `--section-bg: #CFC5B0` (Varm beige - Seksjoner og store elementer)
  - `--card-bg: #34464D` (Dyp blågrå - Kort og mindre elementer)
  - `--text-on-dark: #CFC5B0` (Beige tekst på mørk bakgrunn)
  - `--text-on-light: #34464D` (Mørk tekst på lys bakgrunn)
  - `--glass-section: rgba(207, 197, 176, 0.08)` (Seksjon glass-effekt)
  - `--glass-card: rgba(52, 70, 77, 0.15)` (Kort glass-effekt)
  - `--border-light: rgba(207, 197, 176, 0.2)` (Lys border)
  - `--border-dark: rgba(52, 70, 77, 0.3)` (Mørk border)

### Glassmorphism Base Klasser
- [ ] Opprett `.glass-section` klasse for store seksjoner:
  - `backdrop-filter: blur(20px)`
  - `background: var(--glass-section)`
  - `border: 1px solid var(--border-light)`
  - `border-radius: 24px`
  - Standardiserte box-shadows med varm beige glow

- [ ] Opprett `.glass-card` klasse for kort og mindre elementer:
  - `backdrop-filter: blur(15px)`
  - `background: var(--glass-card)`  
  - `border: 1px solid var(--border-dark)`
  - `border-radius: 16px`
  - Box-shadows med blågrå accent

- [ ] Opprett `.glass-button` variant for interaktive elementer
- [ ] Definér standard hover-states:
  - Seksjon hover: økt beige-glow og transparency
  - Kort hover: økt blågrå-glow og lift-effekt

### Typography System
- [ ] Implementer typografi-hierarki:
  - H1: 2.8rem, font-weight: 600
  - H2: 2.2rem, font-weight: 600  
  - H3: 1.8rem, font-weight: 500
  - Body: 1rem, font-weight: 400
  - Small: 0.85rem, font-weight: 400

### Animation System
- [ ] Definér standard easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- [ ] Opprett hover-transition: `all 0.4s ease`
- [ ] Implementer subtile gradient-animasjoner (20s sykler)

---

## 🏠 Hero-seksjon Implementering

### Bakgrunn og Layout
- [ ] **PRIORITET 1:** Fjern eller skjul eksisterende navbar øverst
- [ ] Implementer fullskjerm hero-container (`min-height: 100vh`)
- [ ] Legg til bakgrunnsbildet Hero.jpg:
  - **Bildesti:** `kodemappa\Lydskog-v6\lydskogen\public\images\Hero.png`
  - Implementer som `background-image` med proper sizing
  - `background-size: cover` for fullskjerm-dekning
  - `background-position: center` for optimal posisjonering
  - `background-attachment: fixed` for subtil parallax-effekt (optional)
- [ ] Legg overlay med mørk grønn (#424A45) transparens:
  - Meget subtil overlay (10-20% opacity) for å sikre kontrast
  - Langsom, nesten umerkelig animasjon (25-30 sekunder)

### Glass Container og Navigasjon  
- [ ] Implementer stor sentralt plassert glass-section (80vw, max-width: 900px)
- [ ] Bruk varm beige glass-effekt (--glass-section) oppå bakgrunnsbildet
- [ ] Opprett innebygget navbar:
  - Kompakt design med blågrå glass-effekt (--glass-card)
  - 4 navigasjonselementer: "Hjem", "Tjenester", "Kontakt", "Om oss"
  - Tekst i beige (--text-on-dark) 
  - Hover-effekter med økt blågrå glow

### Hovedinnhold
- [ ] Implementer "Lydskog" tittel (2.8rem) i beige (--text-on-dark)
- [ ] Legg til slagord: "Hvor lyd blir til opplevelse"
- [ ] Implementer hover-effekter med varm beige glow
- [ ] Subtile text-shadow effekter for dybde

### Responsiv Hero
- [ ] Mobile breakpoints (max-width: 768px):
  - Reduser container padding
  - Juster font-størrelser
  - Optimaliser navbar for mobile
- [ ] Tablet breakpoints (max-width: 1024px)

---

## 🖼️ Portfolio/Galleri-seksjon

### Layout Struktur
- [ ] Opprett ny seksjon under hero med padding og spacing
- [ ] Implementer seksjonstittel "Portfolio" eller "Våre Arbeider"
- [ ] Beskrivende undertekst om lyddesign-prosjekter

### Grid-system for Artwork
- [ ] Implementer responsive CSS Grid:
  - Desktop: 3 kolonner
  - Tablet: 2 kolonner  
  - Mobile: 1 kolonne
- [ ] Opprett blågrå glass-kort for hvert portfolio-element:
  - Bruk --glass-card bakgrunn og --border-dark
  - Bildeholder med aspect-ratio preservation
  - Hover-effekter med scale og blågrå glow
  - Overlay med prosjektnavn i beige tekst

### Interactive Pop-up System
- [ ] Implementer modal-system for artwork visning:
  - Mørk grønn backdrop-blur (#424A45 med 80% opacity)
  - Stor beige glass-modal (--glass-section) med detaljert innhold
  - Lukke-knapp med blågrå glass-effekt
  - Keyboard navigation (ESC for lukking)
  - Smooth fade-in/out animasjoner

### Portfolio Data Structure
- [ ] Definer data-struktur for portfolio-elementer:
  - Bilde-URL og alt-tekst
  - Prosjektnavn og beskrivelse  
  - Kategori/sjanger
  - Tekniske detaljer
  - Klient-informasjon (hvis relevant)

### Portfolio Hover Effects
- [ ] Implementer avanserte hover-states:
  - Subtle scale-transform (1.02-1.05)
  - Gylden glow med økt intensitet
  - Smooth overganger på alle elementer
  - Text-reveal animasjoner

---

## 🛠️ Tjenester-seksjon

### Section Layout
- [ ] Opprett tjenester-container med mørk grønn bakgrunn
- [ ] Implementer seksjonstittel "Våre Tjenester" i beige
- [ ] Legg til beskrivende ingress i beige med redusert opacity

### Service Cards Grid
- [ ] Opprett grid-layout for tjeneste-kort:
  - 2-3 kolonner på desktop
  - 1-2 kolonner på tablet
  - 1 kolonne på mobile
- [ ] Design blågrå glass-kort for hver tjeneste:
  - Bruk --glass-card bakgrunn
  - Ikon-område øverst (beige ikoner)
  - Tjeneste-navn (H3) i beige
  - Kort beskrivelse i beige med redusert opacity
  - "Les mer" knapp med hover-effekter

### Tjeneste-kategorier å implementere
- [ ] **Lyddesign for Film/Video:**
  - Beskrivelse av prosess
  - Eksempler på leveranser
  - Prising-indikasjon
- [ ] **Musikkproduksjon:**
  - Studio-tjenester
  - Mixing og mastering
  - Instrumentale produksjoner
- [ ] **Podcast-produksjon:**
  - Recording setup
  - Post-production
  - Distribusjon
- [ ] **Live Sound Engineering:**
  - Event-setup
  - Teknisk support
  - Utstyr-leie

### Interactive Service Details
- [ ] Implementer expandable service-kort:
  - Click-to-expand funksjonalitet
  - Smooth height-animasjoner
  - Detaljert informasjon ved utvidelse
  - Collapse-funksjonalitet

---

## 📞 Kontakt-seksjon

### Section Structure
- [ ] Opprett kontakt-container med mørk grønn bakgrunn
- [ ] Implementer "Kontakt Oss" tittel i beige
- [ ] Legg til varm, innbydende beskrivelse i beige

### Contact Form Design
- [ ] Opprett beige glassmorphism kontaktskjema:
  - Input-felt med glass-section styling
  - Labels i blågrå som animerer til beige
  - Placeholder-tekst i redusert beige opacity
  - Focus-states med økt glow og beige borders

### Form Fields å implementere
- [ ] **Grunnleggende felt:**
  - Navn (required)
  - E-post (required, validation)
  - Telefon (optional)
  - Bedrift/Organisasjon (optional)
- [ ] **Prosjekt-detaljer:**
  - Prosjekttype (dropdown)
  - Budsjett-range (dropdown)
  - Tidslinje (dropdown)
  - Detaljert beskrivelse (textarea)

### Contact Information Display
- [ ] Opprett info-kort ved siden av skjema:
  - Kontaktinformasjon
  - Arbeidsider og responstid
  - Sosiale medier-lenker
  - Lokasjon (hvis relevant)

### Form Functionality
- [ ] Implementer form validation:
  - Real-time validation feedback
  - Smooth error-state animasjoner
  - Success-states med bekreftelses-melding
- [ ] Legg til submit-håndtering:
  - Loading-states under sending
  - Success-melding etter innsending
  - Error-håndtering ved feil

---

## 🌐 Global Navigation og Footer

### Sticky Navigation (Optional)
- [ ] Vurder implementering av sticky nav ved scroll:
  - Smooth fade-in når bruker scroller ned
  - Kompakt design med glass-effekt
  - Quick-links til alle seksjoner

### Footer Design
- [ ] Opprett minimal footer:
  - Copyright-informasjon
  - Viktige lenker
  - Kontaktinformasjon
  - Glass-styling konsistent med resten

### Scroll Behavior
- [ ] Implementer smooth scroll mellom seksjoner:
  - Scroll-to-section funksjonalitet
  - Smooth scroll-behavior
  - Active section indicators

---

## 📱 Responsiv Design og Optimalisering

### Mobile-first Implementation
- [ ] **Mobiloptimalisering (320px-768px):**
  - Stack alle elementer vertikalt
  - Øk touch-targets til minimum 44px
  - Reduser padding og margins
  - Optimaliser font-størrelser

### Tablet Optimization
- [ ] **Tablet-tilpasning (768px-1024px):**
  - 2-kolonne layouts hvor passende
  - Justerte glass-container størrelser
  - Optimaliserte hover-states for touch

### Desktop Enhancement
- [ ] **Desktop-forbedringer (1024px+):**
  - Full 3-kolonne grid-layouts
  - Avanserte hover-effekter
  - Parallax-effekter (subtle)
  - Større glass-containere

### Performance Optimization
- [ ] **Ytelse-forbedringer:**
  - Lazy loading for portfolio-bilder
  - Optimaliserte animasjoner med `will-change`
  - Minifiserte CSS og JavaScript
  - Compressed image assets

---

## 🎯 Interactive Features og Micro-animations

### Scroll-triggered Animations
- [ ] Implementer scroll-reveal animasjoner:
  - Fade-in effekter for seksjoner
  - Staggered animasjoner for grid-elementer
  - Smooth parallax på bakgrunns-elementer

### Advanced Hover States
- [ ] Implementer avanserte hover-interaksjoner:
  - Magnetic hover-effekter på knapper
  - Color-shift animasjoner
  - Organic transform-effekter

### Loading States
- [ ] Opprett vakre loading-animasjoner:
  - Skeleton-screens for langsom lasting
  - Organic pulse-animasjoner
  - Smooth transitions mellom states

---

## ✅ Testing og Quality Assurance

### Cross-browser Testing
- [ ] Test i alle major browsere:
  - Chrome (desktop og mobile)
  - Firefox (desktop og mobile)
  - Safari (desktop og mobile)
  - Edge

### Accessibility Testing
- [ ] Implementer accessibility features:
  - Proper ARIA labels
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast validation
  - Focus indicators

### Performance Testing
- [ ] Utfør ytelse-testing:
  - Google PageSpeed Insights
  - Core Web Vitals optimization
  - Mobile performance testing
  - Loading time optimization

### Final Polish
- [ ] Siste finpuss:
  - Alle animasjoner er smooth og bug-frie
  - Responsivt design fungerer perfekt
  - Alle interactive elementer responderer korrekt
  - Loading-hastigheter er optimale
  - Error-states er implementert og testat

---

## 🚀 Deployment og Launch

### Pre-launch Checklist
- [ ] Testing på staging-miljø
- [ ] Final content review
- [ ] SEO optimization check
- [ ] Social media meta tags

### Launch Process
- [ ] Deploy til produksjon
- [ ] Monitor for errors første 24 timer
- [ ] Collect user feedback
- [ ] Minor adjustments based på feedback

---

**Total estimert tid:** 40-60 timer avhengig av kompleksitet og antall portfolio-elementer.

**Anbefalt rekkefølge:**
1. Design system fundamenter
2. Hero-seksjon
3. Portfolio-seksjon
4. Tjenester-seksjon  
5. Kontakt-seksjon
6. Responsiv optimalisering
7. Testing og polish