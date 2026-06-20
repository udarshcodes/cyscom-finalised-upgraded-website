import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { 
  FaSearch, FaLock, FaUnlock, FaTerminal, FaTrophy, 
  FaCalendarAlt, FaChevronRight, FaFolder, FaFolderOpen,
  FaArrowLeft, FaArrowRight, FaBookOpen, FaUsers, FaExternalLinkAlt
} from 'react-icons/fa';

// ── PrismJS Syntax Highlighting ──
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import imageMap from '../image_map.json';

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  hard: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const EVENT_COVERS = {
  'cyberconverge-2025': '/img/cyberconverge.png',
  'finaltrace-2025': '/writeups/FinalTrace_2025/images/2.png',
  'cyscom-juice-shop-2025': '/img/juiceshop.png',
  'zypher-2023': '/img/zypher-logo.png',
};

const EVENT_LOGOS = {
  'cyberconverge-2025': '/writeups/CyberConverge_2025/images/logo.png',
  'cyscom-juice-shop-2025': '/writeups/Cyscom Juice Shop 2025/imagedata/logo.png',
  'finaltrace-2025': '/writeups/FinalTrace_2025/images/2.png',
  'zypher-2023': '/img/zypher-logo.png',
};

const EVENT_FOLDERS = {
  'cyberconverge-2025': 'CyberConverge_2025',
  'cyscom-juice-shop-2025': 'Cyscom Juice Shop 2025',
  'finaltrace-2025': 'FinalTrace_2025',
  'zypher-2023': 'Zypher_2023',
};

// ── Category mapping & normalization ──
const NORM_MAP = {
  'web': 'Web',
  'pwn': 'Pwn',
  'crypto': 'Cryptography',
  'cryptography': 'Cryptography',
  'cyptography': 'Cryptography',
  'forensics': 'Forensics',
  'forensics (e)': 'Forensics',
  'steganography': 'Steganography',
  'stego': 'Steganography',
  'reverse engineering': 'Reverse Engineering',
  'reversing': 'Reverse Engineering',
  'reverse_engineering': 'Reverse Engineering',
  'reverse-engineering': 'Reverse Engineering',
  'spectography': 'Forensics',
  'osint': 'OSINT',
  'misc': 'Misc',
  'general': 'General',
  'musical cipher': 'Musical Cipher',
  'arg': 'ARG',
  'text': 'Text',
  'linux': 'Linux',
  'network': 'Network',
  'boot2root': 'Boot2root',
};

const normalizeCategory = (cat) => {
  if (!cat) return 'General';
  const clean = cat.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase().trim();
  const normalized = NORM_MAP[clean] || (clean.charAt(0).toUpperCase() + clean.slice(1));
  // Improved input validation to prevent ReDoS
  if (!/^[a-zA-Z0-9_]{1,50}$/.test(clean)) {
    return 'Invalid category';
  }
  return normalized;
};

const CATEGORY_META = {
  'Web': { icon: '🌐', color: 'from-blue-600/10 to-indigo-600/10 border-blue-500/20 text-blue-400 hover:border-blue-500/30' },
  'Pwn': { icon: '🎯', color: 'from-red-600/10 to-orange-600/10 border-red-500/20 text-red-400 hover:border-red-500/30' },
  'Cryptography': { icon: '🔐', color: 'from-purple-600/10 to-pink-600/10 border-purple-500/20 text-purple-400 hover:border-purple-500/30' },
  'Forensics': { icon: '🔍', color: 'from-emerald-600/10 to-teal-600/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/30' },
  'OSINT': { icon: '🌍', color: 'from-cyan-600/10 to-sky-600/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/30' },
  'Reverse Engineering': { icon: '👾', color: 'from-rose-600/10 to-pink-600/10 border-rose-500/20 text-rose-400 hover:border-rose-500/30' },
  'Steganography': { icon: '🖼️', color: 'from-amber-600/10 to-yellow-600/10 border-amber-500/20 text-amber-400 hover:border-amber-500/30' },
  'Misc': { icon: '📦', color: 'from-slate-600/10 to-zinc-600/10 border-slate-500/20 text-slate-400 hover:border-slate-500/30' },
  'General': { icon: '⚙️', color: 'from-neutral-600/10 to-stone-600/10 border-neutral-500/20 text-neutral-400 hover:border-neutral-500/30' },
  'Linux': { icon: '🐧', color: 'from-orange-600/10 to-yellow-600/10 border-orange-500/20 text-orange-400 hover:border-orange-500/30' },
  'Network': { icon: '📡', color: 'from-sky-600/10 to-blue-600/10 border-sky-500/20 text-sky-400 hover:border-sky-500/30' },
  'Boot2root': { icon: '👑', color: 'from-rose-600/10 to-red-600/10 border-rose-500/20 text-rose-400 hover:border-rose-500/30' },
  'Musical Cipher': { icon: '🎵', color: 'from-violet-600/10 to-fuchsia-600/10 border-violet-500/20 text-violet-400 hover:border-violet-500/30' },
  'Text': { icon: '📝', color: 'from-yellow-600/10 to-amber-600/10 border-yellow-500/20 text-yellow-400 hover:border-yellow-500/30' },
  'ARG': { icon: '🎮', color: 'from-lime-600/10 to-emerald-600/10 border-lime-500/20 text-lime-400 hover:border-lime-500/30' },
};

const defaultCategoryMeta = { icon: '🔧', color: 'from-gray-600/10 to-gray-700/10 border-gray-500/20 text-gray-400 hover:border-gray-500/30' };


// ── Callout icons & config ──
const CALLOUT_CONFIG = {
  NOTE:      { icon: 'ℹ️', cls: 'callout-note',      title: 'Note' },
  INFO:      { icon: 'ℹ️', cls: 'callout-info',      title: 'Info' },
  TIP:       { icon: '💡', cls: 'callout-tip',       title: 'Tip' },
  HINT:      { icon: '💡', cls: 'callout-hint',      title: 'Hint' },
  SUCCESS:   { icon: '✅', cls: 'callout-success',   title: 'Success' },
  IMPORTANT: { icon: '📌', cls: 'callout-important', title: 'Important' },
  WARNING:   { icon: '⚠️', cls: 'callout-warning',   title: 'Warning' },
  ALERT:     { icon: '⚠️', cls: 'callout-alert',     title: 'Alert' },
  CAUTION:   { icon: '🛑', cls: 'callout-caution',   title: 'Caution' },
  ERROR:     { icon: '❌', cls: 'callout-error',     title: 'Error' },
  FAILURE:   { icon: '❌', cls: 'callout-failure',   title: 'Failure' },
};

const customRenderer = new marked.Renderer();
customRenderer.heading = function(arg1, arg2) {
  let text = '', depth = 2;
  if (typeof arg1 === 'object') { text = arg1.text || ''; depth = arg1.depth || 2; }
  else { text = arg1 || ''; depth = arg2 || 2; }
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  const id = cleanText.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  return `<h${depth} id="${id}" class="anchor-heading">${text}</h${depth}>`;
};

customRenderer.link = function(arg1, arg2, arg3) {
  let href, title, text;
  if (typeof arg1 === 'object') { href = arg1.href; title = arg1.title; text = arg1.text; }
  else { href = arg1; title = arg2; text = arg3; }
  
  if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
    if (window.__CURRENT_EVENT_FOLDER__) {
      let cleanHref = href.startsWith('/') ? href.slice(1) : href;
      href = `/writeups/${window.__CURRENT_EVENT_FOLDER__}/${cleanHref}`;
    }
  }
  
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" download class="text-blue-400 hover:text-blue-300 underline underline-offset-2">${text}</a>`;
};

customRenderer.image = function(arg1, arg2, arg3) {
  let href, title, text;
  if (typeof arg1 === 'object') { href = arg1.href; title = arg1.title; text = arg1.text; }
  else { href = arg1; title = arg2; text = arg3; }
  
  if (href && !href.startsWith('http') && !href.startsWith('data:')) {
    let lookup = href.startsWith('/') ? href.slice(1) : href;
    if (imageMap[lookup]) {
      href = `/${imageMap[lookup]}`;
    } else if (lookup.startsWith('writeups/')) {
      href = `/${lookup}`;
    } else if (window.__CURRENT_EVENT_FOLDER__) {
      href = `/writeups/${window.__CURRENT_EVENT_FOLDER__}/${lookup}`;
    } else {
      href = `/${lookup}`;
    }
  }
  
  return `<img src="${href}" alt="${text || ''}" title="${title || ''}" />`;
};

marked.use({ renderer: customRenderer });

// ── Post-process HTML: convert GitHub-style blockquote alerts into callout cards ──
function processCallouts(html) {
  // Match blockquotes containing [!TYPE] pattern
  return html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|INFO|TIP|HINT|SUCCESS|IMPORTANT|WARNING|ALERT|CAUTION|ERROR|FAILURE)\]\s*<br\s*\/?>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (match, type, content) => {
      const cfg = CALLOUT_CONFIG[type.toUpperCase()] || CALLOUT_CONFIG.NOTE;
      return `<div class="callout ${cfg.cls}"><span class="callout-icon">${cfg.icon}</span><div class="callout-content"><div class="callout-title">${cfg.title}</div><p>${content.trim()}</p></div></div>`;
    }
  ).replace(
    // Fallback: [!TYPE] followed by newline instead of <br>
    /<blockquote>\s*<p>\s*\[!(NOTE|INFO|TIP|HINT|SUCCESS|IMPORTANT|WARNING|ALERT|CAUTION|ERROR|FAILURE)\]\s*\n([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (match, type, content) => {
      const cfg = CALLOUT_CONFIG[type.toUpperCase()] || CALLOUT_CONFIG.NOTE;
      return `<div class="callout ${cfg.cls}"><span class="callout-icon">${cfg.icon}</span><div class="callout-content"><div class="callout-title">${cfg.title}</div><p>${content.trim()}</p></div></div>`;
    }
  );
}

// ── Post-process HTML: add language labels to fenced code blocks ──
function processCodeBlocks(html) {
  // marked wraps fenced code as <pre><code class="language-xxx">
  return html.replace(
    /<pre><code class="language-(\w+)">/g,
    (match, lang) => `<pre><span class="code-lang-label">${lang}</span><code class="language-${lang}">`
  );
}

// ── Post-process HTML: convert Tools Used lists into interactive cards with icons ──
function processTools(html) {
  if (typeof window === 'undefined') return html;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const container = doc.querySelector('div');
    if (!container) return html;

    // Helper to extract tool name and description
    function parseToolLine(htmlText, text) {
      const colonIdx = text.indexOf(':');
      const hyphenIdx = text.indexOf(' -');
      
      let separatorIdx = -1;
      let sepLength = 0;
      
      if (colonIdx !== -1 && (hyphenIdx === -1 || colonIdx < hyphenIdx)) {
        separatorIdx = colonIdx;
        sepLength = 1;
      } else if (hyphenIdx !== -1) {
        separatorIdx = hyphenIdx;
        sepLength = 2;
      }
      
      if (separatorIdx !== -1) {
        const name = text.slice(0, separatorIdx).trim();
        const nameEscaped = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const sepStr = sepLength === 1 ? ':' : '\\s*-\\s*';
        const regex = new RegExp(`^.*?${nameEscaped}.*?${sepStr}`, 'i');
        const descHtml = htmlText.replace(regex, '').trim();
        return { name, desc: descHtml };
      }
      
      return { name: text, desc: '' };
    }

    const toolIcons = {
      pwntools: '🛠️',
      gdb: '🐞',
      pwndbg: '🐞',
      ghidra: '🐉',
      ropper: '🧬',
      checksec: '🛡️',
      steghide: '🥷',
      zbarimg: '🔍',
      zsteg: '🍯',
      cyberchef: '🧪',
      exiftool: '📸',
      nmap: '🛰️',
      wireshark: '🦈',
      burpsuite: '🥪',
      burp: '🥪',
      gimp: '🎨',
      stegsolve: '🖼️',
      python: '🐍',
      pillow: '🧸',
      sqlmap: '💉',
      john: '☠️',
      hashcat: '🔥',
      hydra: '🐉',
      gobuster: '🚪',
      dirbuster: '🚪',
      dirsearch: '🚪',
      metasploit: '💥',
      radare2: '🎯',
      binary: '👾',
      reversing: '👾',
      steganography: '🖼️',
      osint: '🌍',
      google: '🔍',
      lens: '📷',
      earth: '🌍',
      edchart: '📊',
      dcode: '🔢',
      jwt: '🪙',
      netcat: '🔌',
      nc: '🔌',
      curl: '🌐',
      wget: '🌐',
      decrypt: '🔓',
      cracker: '🔓',
      base64: '📦',
      md5: '🔑',
      sha256: '🔑',
      openssl: '🔒',
    };

    function getIcon(name) {
      const cleanName = name.toLowerCase();
      for (const [key, icon] of Object.entries(toolIcons)) {
        if (cleanName.includes(key)) return icon;
      }
      return '🔧';
    }

    function createCardsContainer(toolItems) {
      const cardsContainer = doc.createElement('div');
      cardsContainer.className = 'tools-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6';

      toolItems.forEach(tool => {
        if (!tool.name) return;
        const card = doc.createElement('div');
        card.className = 'tool-card p-4 rounded-xl border border-white/8 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/15 hover:-translate-y-0.5 transition-all flex items-start gap-3.5 group cursor-pointer';
        
        const iconWrapper = doc.createElement('div');
        iconWrapper.className = 'tool-icon-wrapper w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/8 group-hover:border-white/15 group-hover:bg-white/8 transition-all text-xl shrink-0';
        iconWrapper.textContent = getIcon(tool.name);

        const infoWrapper = doc.createElement('div');
        infoWrapper.className = 'tool-info flex-1 min-w-0';

        const title = doc.createElement('h5');
        title.className = 'tool-name font-semibold text-white/95 text-[13px] group-hover:text-white transition-all whitespace-normal break-words m-0';
        title.textContent = tool.name;

        infoWrapper.appendChild(title);

        if (tool.desc) {
          const desc = doc.createElement('p');
          desc.className = 'tool-desc text-[11px] text-white/40 mt-1 whitespace-normal break-words leading-relaxed m-0';
          desc.innerHTML = tool.desc;
          infoWrapper.appendChild(desc);
        }

        card.appendChild(iconWrapper);
        card.appendChild(infoWrapper);
        cardsContainer.appendChild(card);
      });

      return cardsContainer;
    }

    // --- CASE A: Tools Used Heading followed by UL/OL ---
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (/^(tools\s+used|used\s+tools|tools):?$/i.test(text)) {
        const next = heading.nextElementSibling;
        if (next && (next.tagName === 'UL' || next.tagName === 'OL')) {
          const toolItems = [];
          const lis = Array.from(next.querySelectorAll('li'));
          lis.forEach(li => {
            toolItems.push(parseToolLine(li.innerHTML, li.textContent));
          });

          if (toolItems.length > 0) {
            const cards = createCardsContainer(toolItems);
            next.parentNode.replaceChild(cards, next);
          }
        }
      }
    });

    // --- CASE B: Single Paragraph tag starting with "Tools Used:" or similar ---
    const paragraphs = Array.from(container.querySelectorAll('p'));
    paragraphs.forEach(p => {
      const innerHTML = p.innerHTML.trim();
      const parts = innerHTML.split(/<br\s*\/?>|\n/gi).map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        const firstLine = parts[0].replace(/<[^>]*>/g, '').trim();
        if (/^(tools\s+used|used\s+tools|tools):?$/i.test(firstLine)) {
          const toolItems = [];
          parts.slice(1).forEach(part => {
            const cleanPart = part.replace(/<[^>]*>/g, '').trim();
            const parsed = parseToolLine(part, cleanPart);
            toolItems.push(parsed);
          });

          if (toolItems.length > 0) {
            const cards = createCardsContainer(toolItems);
            const newHeader = doc.createElement('h4');
            newHeader.className = 'anchor-heading text-white/80';
            newHeader.textContent = parts[0].replace(/<[^>]*>/g, '').replace(/:$/, '').trim();
            
            p.parentNode.insertBefore(newHeader, p);
            p.parentNode.insertBefore(cards, p);
            p.parentNode.removeChild(p);
          }
        }
      }
    });

    return container.innerHTML;
  } catch (e) {
    console.error('Error processing tools', e);
    return html;
  }
}

// ── Post-process HTML: wrap Step headings and contents into beautiful GitHub-style steps vertical timeline ──
function processSteps(html) {
  if (typeof window === 'undefined') return html;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const container = doc.querySelector('div');
    if (!container) return html;

    const headings = Array.from(container.querySelectorAll('h3, h4, h5'));
    const stepHeadings = headings.filter(h => /^step\s+\d+/i.test(h.textContent.trim()));
    if (stepHeadings.length === 0) return html;

    stepHeadings.forEach((heading, idx) => {
      const nextHeading = stepHeadings[idx + 1];
      const stepItem = doc.createElement('div');
      stepItem.className = 'step-item';

      const stepNum = doc.createElement('div');
      stepNum.className = 'step-number';
      const numMatch = heading.textContent.match(/step\s+(\d+)/i);
      stepNum.textContent = numMatch ? numMatch[1] : (idx + 1);
      stepItem.appendChild(stepNum);

      const stepContent = doc.createElement('div');
      stepContent.className = 'step-content';

      heading.classList.add('step-title');
      
      const parent = heading.parentNode;
      parent.insertBefore(stepItem, heading);
      stepContent.appendChild(heading);

      let sibling = stepItem.nextElementSibling;
      while (sibling && sibling !== nextHeading && !stepHeadings.includes(sibling)) {
        const nextSib = sibling.nextElementSibling;
        stepContent.appendChild(sibling);
        sibling = nextSib;
      }
      stepItem.appendChild(stepContent);
    });

    // Wrap consecutive .step-item elements
    const stepItems = Array.from(container.querySelectorAll('.step-item'));
    if (stepItems.length > 0) {
      let currentContainer = null;
      stepItems.forEach(item => {
        if (!currentContainer || item.previousElementSibling !== currentContainer) {
          currentContainer = doc.createElement('div');
          currentContainer.className = 'steps-container';
          item.parentNode.insertBefore(currentContainer, item);
        }
        currentContainer.appendChild(item);
      });
    }

    return container.innerHTML;
  } catch (e) {
    console.error('Error processing steps', e);
    return html;
  }
}

// ── Helper to strip literal flag section from markdown body ──
function stripFlagFromMarkdown(md, flag) {
  if (!md || !flag) return md;
  try {
    const escapedFlag = flag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:###?\\s*(?:the\\s+)?flag(?:\\s+(?:found|would\\s+be|is))?:?\\s*[\\r\\n]+(?:>\\s*|##\\s*|\\*\\*\\s*)*)${escapedFlag}\\s*`, 'gi');
    return md.replace(regex, '').trim();
  } catch (e) {
    console.error('Error stripping flag', e);
    return md;
  }
}

// ── Helper to mask literal flag values inside the HTML content ──
function maskFlagInHtml(html, flag, showFlag) {
  if (!html || !flag) return html;
  try {
    const escapedFlag = flag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedFlag, 'gi');
    return html.replace(regex, () => {
      if (showFlag) {
        return `<span class="flag-revealed">${flag}</span>`;
      } else {
        return `<span class="flag-masked">••••••••••••</span>`;
      }
    });
  } catch (e) {
    console.error('Error masking flag', e);
    return html;
  }
}

// ── Helper to strip the duplicate header and metadata block at the top ──
function stripDuplicateHeader(md) {
  if (!md) return '';
  let clean = md.trim();
  const lines = clean.split(/\r?\n/);
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('#')) {
      headerIndex = i;
      break;
    }
  }
  if (headerIndex !== -1) {
    let endIndex = headerIndex + 1;
    while (endIndex < lines.length) {
      const line = lines[endIndex].trim();
      if (line === '' || line.startsWith('>') || line.startsWith('-') || line.startsWith('*') || line.startsWith('+')) {
        endIndex++;
      } else {
        break;
      }
    }
    lines.splice(headerIndex, endIndex - headerIndex);
    clean = lines.join('\n').trim();
  }
  return clean;
}

const Writeups = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [revealedFlags, setRevealedFlags] = useState({});
  const [currentView, setCurrentView] = useState('events');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const contentContainerRef = useRef(null);

  // Initialize PrismJS global and load languages dynamically to bypass ESM hoisting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.Prism = Prism;
      import('prismjs/components/prism-python');
      import('prismjs/components/prism-bash');
      import('prismjs/components/prism-sql');
      import('prismjs/components/prism-json');
      
      // Load markup-templating first since PHP component depends on it
      import('prismjs/components/prism-markup-templating')
        .then(() => import('prismjs/components/prism-php'))
        .catch(err => console.error('Error loading Prism PHP component', err));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname.endsWith('/categories')) {
        setCurrentView('categories');
      } else {
        setCurrentView('events');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/writeups`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        // Group into events
        const eventsMap = {};
        data.writeups.forEach(w => {
          const eName = w.event_name || 'Uncategorized';
          if (!eventsMap[eName]) {
            eventsMap[eName] = {
              id: eName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              title: eName,
              cover: w.cover_image_url || null,
              description: '',
              challenges: []
            };
          }
          eventsMap[eName].challenges.push({
            id: w.slug,
            title: w.title,
            categories: w.tags || [],
            content_markdown: w.content_markdown || ''
          });
        });
        
        setEvents(Object.values(eventsMap));
      } catch { console.error('Error fetching index'); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const timer = setTimeout(() => {
        const cats = {};
        selectedEvent.challenges.forEach(ch => { cats[ch.categories[0] || 'general'] = true; });
        setExpandedCategories(cats);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedEvent]);

   function parseHeadings(md) {
    if (!md) return [];
    return md.split(/\r?\n/).reduce((acc, line) => {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        const isH2 = line.startsWith('## ');
        const raw = isH2 ? line.slice(3) : line.slice(4);
        const clean = raw.replace(/\{:.*?\}/g,'').replace(/\[(.*?)\]\(.*?\)/g,'$1').replace(/\*\*(.*?)\*\*/g,'$1').replace(/`(.*?)`/g,'$1').trim();
        const id = clean.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
        acc.push({ text: clean, id, level: isH2 ? 2 : 3 });
      }
      return acc;
    }, []);
  }

  // Load challenges when event changes
  useEffect(() => {
    (async () => {
      setShowFlag(false);
      if (!selectedEvent || currentView === 'categories') return;
      
      if (!selectedChallenge) {
        setMarkdownContent('');
        setHeadings([]);
        setLoadingContent(false);
        return;
      }
      
      setLoadingContent(true);
      try {
        let text = selectedChallenge.content_markdown || '';
        window.__CURRENT_EVENT_FOLDER__ = EVENT_FOLDERS[selectedEvent.id] || selectedEvent.title;
        
        // Strip duplicate top header & metadata
        text = stripDuplicateHeader(text);
        
        // Strip duplicate flag section
        if (selectedChallenge.flag) {
          text = stripFlagFromMarkdown(text, selectedChallenge.flag);
        }
        
        setMarkdownContent(text);
        setHeadings(parseHeadings(text));
      } catch {
        setMarkdownContent('### Error\nFailed to load content.');
        setHeadings([]);
      } finally { setLoadingContent(false); }
    })();
  }, [selectedEvent, selectedChallenge, currentView]);

  const toggleRevealFlag = (chId) => {
    setRevealedFlags(prev => ({ ...prev, [chId]: !prev[chId] }));
  };

  // Post-render: copy buttons + syntax highlighting (DOM post-processing)
  useEffect(() => {
    if (loadingContent || !contentContainerRef.current) return;
    const timer = setTimeout(() => {
      const container = contentContainerRef.current;
      if (!container) return;

      // Highlight code blocks
      Prism.highlightAllUnder(container);

      // Copy buttons for code blocks
      container.querySelectorAll('.markdown-content pre').forEach(pre => {
        if (pre.querySelector('.copy-code-btn')) return;
        pre.style.position = 'relative';
        pre.classList.add('group');
        const btn = document.createElement('button');
        btn.className = 'copy-code-btn absolute top-2.5 right-2.5 p-1.5 bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 text-white/30 hover:text-white/70 rounded-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-semibold';
        btn.innerHTML = '📋 Copy';
        btn.addEventListener('click', async () => {
          const codeEl = pre.querySelector('code');
          if (codeEl) {
            await navigator.clipboard.writeText(codeEl.innerText.trim());
            btn.innerHTML = '✓ Copied!';
            btn.classList.add('text-emerald-400', 'border-emerald-500/30');
            setTimeout(() => { btn.innerHTML = '📋 Copy'; btn.classList.remove('text-emerald-400', 'border-emerald-500/30'); }, 2000);
          }
        });
        pre.appendChild(btn);
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [markdownContent, loadingContent]);

  const handleEventChange = (ev) => { setSelectedEvent(ev); setSelectedChallenge(null); setSearchQuery(''); setSidebarOpen(false); };
  const toggleCategory = (cat) => setExpandedCategories(p => ({ ...p, [cat]: !p[cat] }));

  const getGroupedChallenges = () => {
    if (!selectedEvent) return {};
    const filtered = selectedEvent.challenges.filter(ch =>
      (ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || ch.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filtered.reduce((g, ch) => {
      const cat = ch.categories[0] || 'general';
      (g[cat] = g[cat] || []).push(ch);
      return g;
    }, {});
  };

  const getPagination = () => {
    if (!selectedEvent || !selectedChallenge) return { prev: null, next: null };
    const i = selectedEvent.challenges.findIndex(ch => ch.id === selectedChallenge.id);
    return { prev: i > 0 ? selectedEvent.challenges[i-1] : null, next: i < selectedEvent.challenges.length-1 ? selectedEvent.challenges[i+1] : null };
  };

  const getGroupedCategories = () => {
    const grouped = {};
    events.forEach(ev => {
      ev.challenges.forEach(ch => {
        let cats = [];
        if (Array.isArray(ch.categories)) {
          ch.categories.forEach(cat => {
            if (cat.includes('/')) {
              cat.split('/').forEach(part => cats.push(part.trim()));
            } else {
              cats.push(cat.trim());
            }
          });
        } else if (ch.categories) {
          if (ch.categories.includes('/')) {
            ch.categories.split('/').forEach(part => cats.push(part.trim()));
          } else {
            cats.push(ch.categories.trim());
          }
        } else {
          cats.push('General');
        }

        cats.forEach(rawCat => {
          const normCat = normalizeCategory(rawCat);
          if (!grouped[normCat]) {
            grouped[normCat] = [];
          }
          if (!grouped[normCat].some(item => item.id === ch.id && item.eventId === ev.id)) {
            grouped[normCat].push({
              ...ch,
              eventId: ev.id,
              eventTitle: ev.title
            });
          }
        });
      });
    });

    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => a.title.localeCompare(b.title));
    });

    return grouped;
  };

  const navToEventsHub = () => { setCurrentView('events'); setSelectedEvent(null); setSelectedChallenge(null); navigate('/writeups'); setSidebarOpen(false); };
  const navToCategories = () => { setCurrentView('categories'); setSelectedCategory(null); navigate('/writeups/categories'); setSidebarOpen(false); };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border border-white/15 border-t-white/50 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">Loading...</p>
      </div>
    </div>
  );

  const groupedChallenges = getGroupedChallenges();
  const pagination = getPagination();

  // Render markdown with callout + code lang + step timeline + inline flag masking post-processing
  const renderedHtml = maskFlagInHtml(
    processSteps(processTools(processCodeBlocks(processCallouts(marked.parse(markdownContent))))),
    selectedChallenge?.flag,
    showFlag
  );

  return (
    <div className="h-[calc(100vh-96px)] mt-24 w-full overflow-hidden bg-black text-white flex flex-col lg:flex-row relative">
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 w-10 h-10 rounded-xl bg-black/80 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
        style={{ backdropFilter: 'blur(12px)' }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d={sidebarOpen ? "M1 1L15 11M1 11L15 1" : "M0 1H16M0 6H16M0 11H16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ════════════════════════════════════════════════════ */}
      {/* SIDEBAR                                             */}
      {/* ════════════════════════════════════════════════════ */}
      <aside className={`fixed lg:relative z-40 w-[272px] lg:w-[264px] h-[calc(100vh-112px)] lg:h-[calc(100vh-128px)] top-24 lg:top-0 left-4 lg:left-0 lg:ml-4 lg:my-4 rounded-2xl glass-sidebar-float p-5 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] lg:translate-x-0 opacity-0 lg:opacity-100'}`}>



        {/* Nav links */}
        <div className="space-y-0.5 mb-4">
          {[
            { label: 'Events Archives', icon: <FaBookOpen className="text-[10px]" />, active: currentView==='events' && !selectedEvent, onClick: navToEventsHub },
            { label: 'Categories', icon: <FaTerminal className="text-[10px]" />, active: currentView==='categories', onClick: navToCategories },
          ].map(item => (
            <button key={item.label} onClick={item.onClick}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 ${item.active ? 'bg-white/[0.06] text-white border border-white/8' : 'text-white/25 hover:text-white/60 hover:bg-white/[0.02] border border-transparent'}`}>
              {item.icon} {item.label}
            </button>
          ))}
          {/* Main Site button removed as it is in the global nav */}
        </div>

        {/* Challenge tree */}
        {currentView === 'events' && selectedEvent && (
          <div className="flex-grow flex flex-col min-h-0 pt-3 border-t border-white/[0.04]">
            <div className="mb-2.5 px-1 flex items-center gap-2">
              {EVENT_LOGOS[selectedEvent.id] && <img src={EVENT_LOGOS[selectedEvent.id]} alt="" className="w-4 h-4 rounded object-contain" onError={e=>e.target.style.display='none'} />}
              <span className="text-[11px] font-bold text-white/70 tracking-wide line-clamp-1 flex-grow">{selectedEvent.title}</span>
              <button onClick={() => setSelectedEvent(null)} className="text-[9px] font-bold text-white/15 hover:text-white/40 transition-colors">✕</button>
            </div>

            <div className="relative mb-2.5">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-white/12 text-[10px]"><FaSearch /></span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
                className="w-full pl-7 pr-3 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-lg focus:outline-none focus:border-white/12 text-[11px] text-white/60 placeholder:text-white/12 transition-all" />
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
              {Object.keys(groupedChallenges).length === 0
                ? <div className="text-center py-6 text-white/10 text-xs">No matches.</div>
                : Object.entries(groupedChallenges).map(([catName, challenges]) => {
                    const isExpanded = expandedCategories[catName] !== false;
                    return (
                      <div key={catName} className="space-y-0.5">
                        <button onClick={() => toggleCategory(catName)}
                          className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 hover:text-white/50 px-1 py-0.5 rounded transition-colors">
                          <span className="flex items-center gap-1.5">
                            {isExpanded ? <FaFolderOpen className="text-white/30" /> : <FaFolder className="text-white/15" />} {catName}
                          </span>
                          <FaChevronRight className={`text-[7px] text-white/10 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.15}}
                              className="overflow-hidden pl-2 border-l border-white/[0.04] space-y-px">
                              {challenges.map(ch => (
                                <button key={ch.id} onClick={() => { setSelectedChallenge(ch); setSidebarOpen(false); }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-200 border flex items-center justify-between group ${
                                    selectedChallenge?.id === ch.id
                                      ? 'bg-white/[0.05] text-white/80 border-white/8 font-medium'
                                      : 'bg-transparent text-white/30 border-transparent hover:bg-white/[0.02] hover:text-white/55'
                                  }`}>
                                  <span className="line-clamp-1 flex-grow pr-1.5">{ch.title}</span>
                                  <span className="text-[9px] text-white/10 font-semibold">{ch.points}p</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
              }
            </div>

            {selectedChallenge && (
              <button onClick={() => setSelectedChallenge(null)}
                className="mt-2.5 w-full text-center py-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-[10px] font-semibold tracking-wider uppercase text-white/25 hover:text-white/50 rounded-xl transition-all">
                ← Overview
              </button>
            )}
          </div>
        )}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT                                        */}
      {/* ════════════════════════════════════════════════════ */}
      <div className="flex-grow h-full flex flex-col lg:flex-row min-w-0 relative z-10 lg:ml-4 lg:mr-4 lg:my-4">
        <main ref={contentContainerRef}
          className="flex-grow h-full overflow-y-auto p-6 md:p-10 lg:px-16 lg:py-10 min-w-0 flex flex-col lg:rounded-2xl lg:border lg:border-white/[0.03] lg:bg-white/[0.008]">
          {loadingContent ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border border-white/12 border-t-white/40 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[10px] text-white/15 tracking-[0.3em] uppercase">Loading...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={currentView==='categories'?'categories':(selectedEvent ? selectedEvent.id+'-'+(selectedChallenge?.id||'overview') : 'gallery')}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}
                className="flex-grow flex flex-col">

                {/* ── CATEGORIES ── */}
                {currentView === 'categories' && (() => {
                  const groupedCats = getGroupedCategories();
                  if (!selectedCategory) {
                    return (
                      <div className="max-w-4xl mx-auto w-full py-4">
                        <div className="mb-10">
                          <p className="text-[10px] text-white/15 font-bold uppercase tracking-[0.4em] mb-2">{"// Classification"}</p>
                          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight text-white">Categories</h2>
                          <p className="text-white/25 text-sm max-w-md leading-relaxed">Browse all CTF challenges aggregated by security domains.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(groupedCats).map(([catName, list]) => {
                            const meta = CATEGORY_META[catName] || defaultCategoryMeta;
                            return (
                              <motion.div key={catName} whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.2 }}
                                onClick={() => setSelectedCategory(catName)}
                                className={`group p-5 rounded-2xl border cursor-pointer bg-gradient-to-br ${meta.color} flex flex-col justify-between h-36 backdrop-blur-md`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-3xl filter drop-shadow">{meta.icon}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/8 px-2.5 py-1 rounded-full text-white/60 group-hover:text-white group-hover:bg-white/10 transition-all">
                                    {list.length} {list.length === 1 ? 'Chall' : 'Challs'}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:translate-x-0.5 transition-transform">{catName}</h3>
                                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed line-clamp-1">Explore {catName.toLowerCase()} solutions</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else {
                    const list = groupedCats[selectedCategory] || [];
                    return (
                      <div className="max-w-4xl mx-auto w-full py-4">
                        <div className="mb-8 flex items-center gap-3">
                          <button onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/10 hover:border-white/15 text-white/60 hover:text-white transition-all text-xs font-semibold">
                            <FaArrowLeft className="text-[9px]" /> Back to Categories
                          </button>
                          <span className="text-white/15 text-xs">/</span>
                          <span className="text-white/50 text-xs font-semibold">{selectedCategory}</span>
                        </div>

                        <div className="mb-8">
                          <h2 className="text-xl md:text-2xl font-extrabold mb-1 tracking-tight text-white flex items-center gap-2">
                            <span>{CATEGORY_META[selectedCategory]?.icon || '🔧'}</span>
                            <span>{selectedCategory} Challenges</span>
                          </h2>
                          <p className="text-white/30 text-xs">{list.length} challenges found across all archives.</p>
                        </div>

                        <div className="w-full border border-white/8 rounded-2xl bg-white/[0.008] backdrop-blur-md overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b border-white/8 bg-white/[0.01]">
                                  <th className="text-left py-3.5 px-5 text-[10px] font-bold text-white/45 uppercase tracking-[0.1em]">Challenge</th>
                                  <th className="text-left py-3.5 px-5 text-[10px] font-bold text-white/45 uppercase tracking-[0.1em]">Event</th>
                                  <th className="text-left py-3.5 px-5 text-[10px] font-bold text-white/45 uppercase tracking-[0.1em]">Difficulty</th>
                                  <th className="text-left py-3.5 px-5 text-[10px] font-bold text-white/45 uppercase tracking-[0.1em]">Points</th>
                                  <th className="text-right py-3.5 px-5 text-[10px] font-bold text-white/45 uppercase tracking-[0.1em]">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/[0.04]">
                                {list.map(ch => {
                                  const diffColor = DIFFICULTY_COLORS[ch.difficulty] || DIFFICULTY_COLORS.medium;
                                  const ev = events.find(e => e.id === ch.eventId);
                                  return (
                                    <tr key={`${ch.eventId}-${ch.id}`} className="hover:bg-white/[0.015] transition-colors group">
                                      <td className="py-4 px-5 align-middle">
                                        <span onClick={() => {
                                          setSelectedEvent(ev);
                                          setSelectedChallenge(ch);
                                          setCurrentView('events');
                                        }} className="font-semibold text-white/80 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5">
                                          {ch.title}
                                        </span>
                                      </td>
                                      <td className="py-4 px-5 align-middle text-white/30 text-xs">
                                        {ch.eventTitle}
                                      </td>
                                      <td className="py-4 px-5 align-middle">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${diffColor}`}>
                                          {ch.difficulty}
                                        </span>
                                      </td>
                                      <td className="py-4 px-5 align-middle text-white/50 text-xs font-semibold">
                                        {ch.points}
                                      </td>
                                      <td className="py-4 px-5 align-middle text-right">
                                        <button onClick={() => {
                                          setSelectedEvent(ev);
                                          setSelectedChallenge(ch);
                                          setCurrentView('events');
                                        }} className="px-3 py-1 bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 text-white/60 hover:text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all">
                                          Writeup
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}

                {/* ── EVENTS GALLERY ── */}
                {currentView === 'events' && !selectedEvent && (
                  <div className="max-w-3xl mx-auto w-full py-4">
                    <div className="mb-10">
                      <p className="text-[10px] text-white/15 font-bold uppercase tracking-[0.4em] mb-2">{"// Archives"}</p>
                      <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight text-white">CTF Archives</h2>
                      <p className="text-white/25 text-sm max-w-md leading-relaxed">Select an event to explore writeups, solutions, and flag tokens.</p>
                    </div>

                    <div className="space-y-3">
                      {events.map(ev => {
                        const logo = EVENT_LOGOS[ev.id] || EVENT_COVERS[ev.id];
                        return (
                          <motion.div key={ev.id} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}
                            onClick={() => handleEventChange(ev)}
                            className="group flex items-center gap-5 p-4 rounded-2xl cursor-pointer crypto-card">
                            
                            {/* Logo on left */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {logo ? (
                                <img src={logo} alt={ev.title} className="w-full h-full object-contain p-1.5" onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML = `<span class="text-lg font-black text-white/15">${ev.title.charAt(0)}</span>`; }} />
                              ) : (
                                <span className="text-lg font-black text-white/15">{ev.title.charAt(0)}</span>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-white/90 transition-colors truncate">{ev.title}</h3>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-white/20 font-semibold">
                                <span className="flex items-center gap-1"><FaCalendarAlt className="text-[8px]" /> {ev.date || 'Archive'}</span>
                                <span>•</span>
                                <span>{ev.challenges?.length || 0} challenges</span>
                              </div>
                              {ev.description && <p className="text-white/20 text-xs mt-1 line-clamp-1 hidden md:block">{ev.description}</p>}
                            </div>

                            {/* Arrow */}
                            <FaChevronRight className="text-white/10 text-xs group-hover:text-white/30 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── EVENT DETAIL / CHALLENGE ── */}
                {currentView === 'events' && selectedEvent && (
                  <div className="max-w-3xl mx-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="text-[10px] uppercase font-bold tracking-[0.12em] text-white/15 mb-5 flex items-center gap-1.5 select-none">
                      <span className="cursor-pointer hover:text-white/40 transition-colors" onClick={navToEventsHub}>Events</span>
                      <FaChevronRight className="text-[7px]" />
                      <span className="text-white/25 cursor-pointer hover:text-white/50 transition-colors" onClick={() => setSelectedChallenge(null)}>{selectedEvent.title}</span>
                      {selectedChallenge && (
                        <>
                          <FaChevronRight className="text-[7px]" />
                          <span className="text-white/20 capitalize">{selectedChallenge.categories[0]}</span>
                          <FaChevronRight className="text-[7px]" />
                          <span className="text-white/35 max-w-[120px] text-ellipsis overflow-hidden whitespace-nowrap">{selectedChallenge.title}</span>
                        </>
                      )}
                    </div>

                    {selectedChallenge ? (
                      /* ── Challenge header ── */
                      <div className="border-b border-white/[0.05] pb-6 mb-8">
                        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-3 leading-tight">{selectedChallenge.title}</h1>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedChallenge.categories.map(c => (
                            <span key={c} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-white/40 border border-white/[0.06] rounded-md">{c}</span>
                          ))}
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${DIFFICULTY_COLORS[selectedChallenge.difficulty]}`}>{selectedChallenge.difficulty}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/8 text-amber-400/70 border border-amber-500/12 rounded-md flex items-center gap-1">
                            <FaTrophy className="text-[9px]" /> {selectedChallenge.points} pts
                          </span>
                        </div>
                        {selectedChallenge.flag && (
                          <div className="mt-5 p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/30"><FaTerminal className="text-[11px]" /></span>
                              <div>
                                <p className="text-[8px] text-white/15 uppercase tracking-[0.3em] font-bold">Flag</p>
                                <div className="font-mono text-xs tracking-wider mt-0.5 select-all">
                                  {showFlag ? <span className="text-emerald-400 font-semibold">{selectedChallenge.flag}</span> : <span className="text-white/8 select-none">•••••••••••••••••••••</span>}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => setShowFlag(!showFlag)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] border transition-all flex items-center gap-1.5 select-none ${showFlag ? 'bg-white/[0.03] border-white/8 text-white/40' : 'bg-white text-black border-transparent'}`}>
                              {showFlag ? <><FaLock className="text-[9px]" /> Hide</> : <><FaUnlock className="text-[9px]" /> Reveal</>}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ── Event overview ── */
                      <div className="mb-8 flex flex-col flex-grow">
                        {EVENT_COVERS[selectedEvent.id] && (
                          <div className="event-cover rounded-2xl overflow-hidden mb-5 h-44 md:h-56 flex-shrink-0">
                            <img src={EVENT_COVERS[selectedEvent.id]} alt={selectedEvent.title} className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display='none'} />
                          </div>
                        )}
                        <div className="flex items-start gap-4 border-b border-white/[0.05] pb-6 flex-shrink-0">
                          {EVENT_LOGOS[selectedEvent.id] && (
                            <img src={EVENT_LOGOS[selectedEvent.id]} alt="" className="w-11 h-11 rounded-xl object-contain border border-white/[0.05] bg-white/[0.02] p-1 flex-shrink-0" onError={e => e.target.style.display='none'} />
                          )}
                          <div className="flex-grow animate-fade-in">
                            <div className="flex items-center gap-2 text-white/20 text-[10px] mb-1.5 font-semibold">
                              <FaCalendarAlt className="text-[9px]" /> <span>{selectedEvent.date || 'Archives'}</span>
                              <span className="text-white/8">•</span>
                              <span>{selectedEvent.challenges?.length || 0} challenges</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{selectedEvent.title}</h1>
                            {selectedEvent.description && <p className="text-white/25 text-sm mt-1.5 max-w-xl leading-relaxed">{selectedEvent.description}</p>}
                          </div>
                          <button onClick={navToEventsHub}
                            className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl text-[11px] font-semibold text-white/25 hover:text-white/50 transition-all flex items-center gap-1.5 flex-shrink-0">
                            <FaArrowLeft className="text-[9px]" /> Back
                          </button>
                        </div>

                        {/* Challenges Table */}
                        <div className="mt-8 flex-grow">
                          <h2 className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mb-4">{"// Challenges List"}</h2>
                          <div className="overflow-x-auto border border-white/[0.04] rounded-xl bg-white/[0.005]">
                            <table className="w-full border-collapse text-left text-[11px] md:text-xs text-white/40">
                              <thead>
                                <tr className="border-b border-white/[0.04] bg-white/[0.015] text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                  <th className="px-4 py-3">Challenge</th>
                                  <th className="px-4 py-3">Difficulty</th>
                                  <th className="px-4 py-3">Points</th>
                                  <th className="px-4 py-3">Category</th>
                                  <th className="px-4 py-3">Flag</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/[0.02]">
                                {selectedEvent.challenges.map(ch => {
                                  const isRevealed = revealedFlags[ch.id];
                                  return (
                                    <tr key={ch.id} className="hover:bg-white/[0.01] transition-colors">
                                      <td className="px-4 py-3 font-semibold text-white/75 hover:text-white cursor-pointer transition-colors" onClick={() => setSelectedChallenge(ch)}>
                                        {ch.title}
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${DIFFICULTY_COLORS[ch.difficulty] || DIFFICULTY_COLORS.medium}`}>
                                          {ch.difficulty}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 font-medium text-white/60">
                                        {ch.points} pts
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/[0.04] text-white/40 border border-white/[0.05] rounded-md">
                                          {ch.categories[0] || 'general'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        {ch.flag ? (
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs max-w-[150px] truncate">
                                              {isRevealed ? (
                                                <span className="text-emerald-400 font-semibold select-all">{ch.flag}</span>
                                              ) : (
                                                <span className="text-white/10 select-none">••••••••••••</span>
                                              )}
                                            </span>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); toggleRevealFlag(ch.id); }}
                                              className="p-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded text-[10px] text-white/40 hover:text-white/80 transition-all flex items-center justify-center"
                                              title={isRevealed ? "Hide flag" : "Reveal flag"}
                                            >
                                              {isRevealed ? <FaLock className="text-[8px]" /> : <FaUnlock className="text-[8px]" />}
                                            </button>
                                          </div>
                                        ) : (
                                          <span className="text-white/10">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rendered markdown */}
                    <div className="markdown-content flex-grow" dangerouslySetInnerHTML={{ __html: renderedHtml }} />

                    {/* Prev / Next */}
                    {selectedChallenge && (pagination.prev || pagination.next) && (
                      <div className="mt-14 pt-6 border-t border-white/[0.05] grid grid-cols-2 gap-3 select-none">
                        {pagination.prev ? (
                          <button onClick={() => setSelectedChallenge(pagination.prev)}
                            className="flex flex-col items-start p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.05] hover:border-white/8 rounded-xl transition-all group text-left">
                            <span className="text-[9px] text-white/15 uppercase tracking-wider font-semibold flex items-center gap-1"><FaArrowLeft className="text-[8px] group-hover:-translate-x-0.5 transition-transform" /> Previous</span>
                            <span className="text-[11px] font-bold text-white/30 group-hover:text-white/60 mt-1 line-clamp-1 transition-colors">{pagination.prev.title}</span>
                          </button>
                        ) : <div />}
                        {pagination.next ? (
                          <button onClick={() => setSelectedChallenge(pagination.next)}
                            className="flex flex-col items-end p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.05] hover:border-white/8 rounded-xl transition-all group text-right w-full">
                            <span className="text-[9px] text-white/15 uppercase tracking-wider font-semibold flex items-center gap-1">Next <FaArrowRight className="text-[8px] group-hover:translate-x-0.5 transition-transform" /></span>
                            <span className="text-[11px] font-bold text-white/30 group-hover:text-white/60 mt-1 line-clamp-1 transition-colors">{pagination.next.title}</span>
                          </button>
                        ) : <div />}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* ════════════════════════════════════════════════════ */}
        {/* TOC                                                 */}
        {/* ════════════════════════════════════════════════════ */}
        {headings.length > 0 && selectedChallenge && currentView === 'events' && (
          <aside className="w-full lg:w-48 h-full overflow-y-auto p-4 flex-shrink-0 hidden lg:block custom-scrollbar select-none lg:rounded-2xl glass-toc lg:ml-3">
            <h3 className="text-[8px] font-extrabold uppercase tracking-[0.35em] text-white/12 mb-3">On this page</h3>
            <nav className="space-y-1.5">
              {headings.map((h, i) => (
                <a key={i} href={`#${h.id}`}
                  className={`block text-[11px] leading-snug transition-all hover:text-white/60 ${h.level===3 ? 'pl-3 text-white/15' : 'text-white/25 font-semibold'}`}>
                  {h.text}
                </a>
              ))}
            </nav>
            <div className="mt-5 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[8px] text-white/8 font-semibold uppercase tracking-widest">
                <div className="w-1 h-1 rounded-full bg-white/12 animate-pulse" /> CYSCOM VIT
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Writeups;
