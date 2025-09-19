// TERMINAL FÖR CONTACT INFO

document.addEventListener("DOMContentLoaded", () => {
  const termCode = document.getElementById("term-code");
  const contactLink = document.getElementById("contact-link");
  if (!termCode || !contactLink) return;

  // Spara originaltexten så du kan återställa terminalen
  const defaultTerminalText = termCode.textContent.trim();

  // Kontakt-script som körs i terminalen
  const contactLines = [
    '<span class="prompt">[coffee@fedora]</span><span class="path"> ~ </span>$ clear',
    '<span class="prompt">[coffee@fedora]</span><span class="path"> ~ </span>$ cd ~/contact',
    '<span class="prompt">[coffee@fedora]</span><span class="path"> ~/contact </span>$ nano contacts.conf',
    '"Name": "Timmy",',
    '"Email": <a href="mailto:timmy_wramborg97@hotmail.com">"timmy@coffee.com",</a>',
    '"LinkedIn": <a href="https://www.linkedin.com/in/timmy-wramborg" target="_blank" rel="noopener">"linkedin.com/in/timmy",</a>',
    '"GitHub":  <a href="https://github.com/ThatMayBeTheCase" target="_blank" rel="noopener">"github.com/timmy",</a>',
    '',
    '^G Get Help   ^O Write Out   ^X Exit',
    '<span class="prompt">[coffee@fedora]</span><span class="path"> ~/contact </span>$ _'
  ];

  // animera inte om användaren valt det
  const prefersNoMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Abort-token så vi kan stoppa en pågående skrivning
  let termAbort = { stop: false };

  async function typeTerminalSession(lines, charSpeed = 14, linePause = 220) {
    termAbort.stop = true;
    await Promise.resolve();

    termAbort = { stop: false };
    const token = termAbort;

    // Ingen animation, då Skrivs ut allt direkt
    if (prefersNoMotion) {
      termCode.innerHTML = lines.join("\n");
      return;
    }

    const rendered = [];
    termCode.innerHTML = "";

async function typeLine(htmlLine) {
  const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const promptMatch = htmlLine.match(
    /^(<span class="prompt">[\s\S]*?<\/span><span class="path">[\s\S]*?<\/span>\s*\$\s*)([\s\S]*)$/
  );

  if (promptMatch) {
    const prefixHTML = promptMatch[1];
    const restHTML   = promptMatch[2];

    const tmp = document.createElement("div");
    tmp.innerHTML = restHTML;
    const restPlain = tmp.textContent || "";

    rendered.push(prefixHTML);
    let current = "";

    for (let i = 0; i < restPlain.length; i++) {
      if (token.stop) return;
      current += restPlain[i];
      rendered[rendered.length - 1] = prefixHTML + esc(current);
      termCode.innerHTML = rendered.join("\n");

      const ch = restPlain[i];
      const delay =
        ch === " " ? charSpeed * 0.35 :
        ".!?".includes(ch) ? charSpeed * 3 :
        ",;:".includes(ch) ? charSpeed * 2 :
        charSpeed;

      await new Promise(r => setTimeout(r, delay));
    }

    if (restHTML.includes("<")) {
      rendered[rendered.length - 1] = prefixHTML + restHTML;
      termCode.innerHTML = rendered.join("\n");
    }
    return;
  }

  const hasHtml = htmlLine.includes("<");

  if (hasHtml) {
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlLine;
    const plain = tmp.textContent || "";

    rendered.push("");
    let current = "";
    for (let i = 0; i < plain.length; i++) {
      if (token.stop) return;
      current += plain[i];
      rendered[rendered.length - 1] = current;
      termCode.innerHTML = rendered.join("\n");

      const ch = plain[i];
      const delay =
        ch === " " ? charSpeed * 0.35 :
        ".!?".includes(ch) ? charSpeed * 3 :
        ",;:".includes(ch) ? charSpeed * 2 :
        charSpeed;

      await new Promise(r => setTimeout(r, delay));
    }
    rendered[rendered.length - 1] = htmlLine;
    termCode.innerHTML = rendered.join("\n");
    return;
  }

  rendered.push("");
  let current = "";
  for (let i = 0; i < htmlLine.length; i++) {
    if (token.stop) return;
    current += htmlLine[i];
    rendered[rendered.length - 1] = current;
    termCode.innerHTML = rendered.join("\n");

    const ch = htmlLine[i];
    const delay =
      ch === " " ? charSpeed * 0.35 :
      ".!?".includes(ch) ? charSpeed * 3 :
      ",;:".includes(ch) ? charSpeed * 2 :
      charSpeed;

    await new Promise(r => setTimeout(r, delay));
  }
}


    for (let idx = 0; idx < lines.length; idx++) {
      if (token.stop) break;
      await typeLine(lines[idx]);
      if (token.stop) break;

      // Radpaus (lite kortare efter tomrad)
      const pause = lines[idx].trim() === "" ? linePause * 0.4 : linePause;
      await new Promise((r) => setTimeout(r, pause));
    }
  }

  // Trigga terminal när man klickar på Contacts
  contactLink.addEventListener("click", (e) => {
    e.preventDefault();

    typeTerminalSession(contactLines, 50, 220);
  });
});

/* ABOUT ME / SKILLS SEKTIONEN */
document.addEventListener("DOMContentLoaded", () => {
  // en ordbok (objekt)
  const skillContent = {
    html: "I am good at building structured and semantic HTML.",
    css: "I can create clean layouts and animations with modern CSS.",
    javascript: "I use JavaScript to make my projects interactive.",
    nodejs: "I haven't started using Node.js yet, but I'm looking forward to learning it!",
    react: "I haven't started using React yet, but I'm excited to learn it!",
    git: "I use Git for version control and clear commits. I haven't worked much with branches yet, since main works fine for personal projects.",
    github: "GitHub is where I host my portfolio and other projects."
  };

  // Hämtar referenser
  const skills = document.getElementById("skills");
  const aboutTextP = document.querySelector("#about-text p");
  const aboutTitle = document.querySelector("#about-text h3");

  // avbryter om något element saknas (failsafe)
  if (!skills || !aboutTextP || !aboutTitle) return;

  // sparar original rubrik och text så den kan återställas
  const defaultTitle = aboutTitle.textContent;
  const defaultParagraph = aboutTextP.textContent;

  // avbryter pågående animation vid aktivering av något annat
  let typingAbort = { stop: false };

  // om användaren har reducerade animationer på stängs den av
  const prefersNoMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // skriver ut texten tecken för tecken
  async function typeText(el, fullText, speed = 18) {
    typingAbort.stop = true;
    await new Promise((r) => setTimeout(r, 0));

    // skapar en ny abort token
    typingAbort = { stop: false };
    const token = typingAbort;

    // om användaren inte vill ha animationer skrivs hela texten ut direkt
    if (prefersNoMotion) {
      el.textContent = fullText;
      el.classList.remove("type-caret");
      return;
    }

    // Blinkande karet
    el.textContent = "";
    el.classList.add("type-caret");

    // loopar över alla tecken i texten, bryt vid token ändring
    for (let i = 0; i < fullText.length; i++) {
      if (token.stop) break;
      el.textContent += fullText[i];

      // fördröjer utskrift av speciella tecken för mer realistisk effekt
      const ch = fullText[i];
      const delay =
        ch === " " ? speed * 0.4 :
        ".!?".includes(ch) ? speed * 3 :
        ",;:".includes(ch) ? speed * 2 :
        speed;

      // delay mellan nästa tecken
      await new Promise((r) => setTimeout(r, delay));
    }

    // när loopen är klar, tar bort blinkande karet
    el.classList.remove("type-caret");
    if (token.stop) el.textContent = fullText;
  }

  // Lyssnar på clicks i skills baren
  skills.addEventListener("click", (e) => {
    const target = e.target.closest("[data-skill]");
    if (!target) return;
    if (target.tagName.toLowerCase() === "a") e.preventDefault();

    // plocka ut värdet från data-skill
    const key = (target.dataset.skill || "");

    // skriv ut den nya texten, om den finns
    const nextText = skillContent[key];
    if (!nextText) return;

    // ändra rubrik till vald skill kategori
    aboutTitle.textContent = target.textContent.trim();

    // visuell markering av vald skill
    document.querySelectorAll("#skills [data-skill]").forEach((el) => {
      el.classList.remove("is-active");
      if (el.getAttribute("role") === "tab") el.setAttribute("aria-selected", "false");
    });
    target.classList.add("is-active");
    if (target.getAttribute("role") === "tab") target.setAttribute("aria-selected", "true");

    // kör skrivmaskins animation på den nya texten
    typeText(aboutTextP, nextText, 18);
  });

  // Lyssnar på clicks utanfor skills baren, nollställer "about me" sektion
  document.addEventListener("click", (e) => {
    if (!skills.contains(e.target)) {
      aboutTitle.textContent = defaultTitle;
      typeText(aboutTextP, defaultParagraph, 18);
      document.querySelectorAll("#skills [data-skill]").forEach((el) => {
        el.classList.remove("is-active");
        if (el.getAttribute("role") === "tab") el.setAttribute("aria-selected", "false");
      });
    }
  });
});
