
// TERMINAL FOR CONTACT INFO
document.addEventListener("DOMContentLoaded", () => {
  const termCode = document.getElementById("term-code");
  const contactLink = document.getElementById("contact-link");
    if (!termCode || !contactLink) return;

  // SAVE ORIGINAL TEXT
  const defaultTerminalText = termCode.textContent.trim();

  // CONTACT INFO
  const contact = {
    name: "Timmy",
    email: "timmy_wramborg97@hotmail.com",
    linkedin: "https://www.linkedin.com/in/timmy-wramborg",
    github: "https://github.com/ThatMayBeTheCase",
  };
  // TERMINAL TEXT (array of strings)
  const contactLines = [
    `<span class="prompt">[coffee@case] ~ $ clear</span>`,
    `<span class="prompt">[coffee@case]</span><span class="path"> ~ </span>$ cd ~/contact`,
    `<span class="prompt">[coffee@case]</span><span class="path"> ~/contact </span>$ nano contacts.conf`,
    `"Name": "Timmy",`,
    `"Email": <a href="mailto:${contact.email}">"timmy@coffee.com",</a>`,
    `"LinkedIn": <a href="${contact.linkedin}" target="_blank" rel="noopener">"linkedin.com/in/timmy",</a>`,
    `"GitHub":  <a href="${contact.github}" target="_blank" rel="noopener">"github.com/timmy",</a>`,
    ``,
    `<span class="prompt">^G Get Help   ^O Write Out   <a id="term-exit" href="">^X Exit</a></span>`,
    `<span class="prompt">[coffee@case]</span><span class="path"> ~/contact </span>$ _`
  ];

  // Reduced animations if requested by user
  const prefersNoMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Abort-token
  let termAbort = { stop: false };

  // Async funktion that runs terminal typing
  async function runTerminalTyping(lines, charSpeed = 14, linePause = 220) {
    termAbort.stop = true;
    await Promise.resolve();

    termAbort = { stop: false };
    const token = termAbort;

    // If no animation is requested, just show the text
    if (prefersNoMotion) {
      termCode.innerHTML = lines.join("\n");
      return;
    }

    const renderedLines = [];
    termCode.innerHTML = "";

    async function typeLine(htmlLine) {

      if (/^<span class="prompt">[\s\S]*?<\/span>$/.test(htmlLine)) {
        renderedLines.push(htmlLine);
        termCode.innerHTML = renderedLines.join("\n");
        return;
      }

      const escapeHTML = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      
      const promptMatch = htmlLine.match(
        /^(<span class="prompt">[\s\S]*?<\/span><span class="path">[\s\S]*?<\/span>\s*\$\s*)([\s\S]*)$/
      );

      if (promptMatch) {
        const prefixHTML = promptMatch[1];
        const restHTML   = promptMatch[2];

        const tmp = document.createElement("div");
        tmp.innerHTML = restHTML;
        const restPlain = tmp.textContent || "";

        renderedLines.push(prefixHTML);
        let typedSoFar = "";

        for (let i = 0; i < restPlain.length; i++) {
          if (token.stop) return;
            typedSoFar += restPlain[i];
            renderedLines[renderedLines.length - 1] = prefixHTML + escapeHTML(typedSoFar);
            termCode.innerHTML = renderedLines.join("\n");

            const char = restPlain[i];
            const charDelayMs =
            char === " " ? charSpeed * 0.35 :
            ".!?".includes(char) ? charSpeed * 3 :
            ",;:".includes(char) ? charSpeed * 2 :
            charSpeed;

            await new Promise(r => setTimeout(r, charDelayMs));
        }

        if (restHTML.includes("<")) {
          renderedLines[renderedLines.length - 1] = prefixHTML + restHTML;
          termCode.innerHTML = renderedLines.join("\n");
        }
        return;
      }

      const hasHtml = htmlLine.includes("<");

      if (hasHtml) {
        const tmp = document.createElement("div");
        tmp.innerHTML = htmlLine;
        const plainText = tmp.textContent || "";

        renderedLines.push("");
        let typedSoFar = "";
        for (let i = 0; i < plainText.length; i++) {
          if (token.stop) return;
            typedSoFar += plainText[i];
            renderedLines[renderedLines.length - 1] = typedSoFar;
            termCode.innerHTML = renderedLines.join("\n");

            const char = plainText[i];
            const charDelayMs =
            char === " " ? charSpeed * 0.35 :
            ".!?".includes(char) ? charSpeed * 3 :
            ",;:".includes(char) ? charSpeed * 2 :
            charSpeed;

            await new Promise(r => setTimeout(r, charDelayMs));
        }
        renderedLines[renderedLines.length - 1] = htmlLine;
        termCode.innerHTML = renderedLines.join("\n");
        return;
      }

      renderedLines.push("");
      let typedSoFar = "";
      for (let i = 0; i < htmlLine.length; i++) {
        if (token.stop) return;
          typedSoFar += htmlLine[i];
          renderedLines[renderedLines.length - 1] = typedSoFar;
          termCode.innerHTML = renderedLines.join("\n");

          const char = htmlLine[i];
          const charDelayMs =
          char === " " ? charSpeed * 0.35 :
          ".!?".includes(char) ? charSpeed * 3 :
          ",;:".includes(char) ? charSpeed * 2 :
          charSpeed;

          await new Promise(r => setTimeout(r, charDelayMs));
      }
    }


    for (let charIndex = 0; charIndex < lines.length; charIndex++) {
      if (token.stop) break;
      await typeLine(lines[charIndex]);
      if (token.stop) break;

      const pause = lines[charIndex].trim() === "" ? linePause * 0.4 : linePause;
      await new Promise((r) => setTimeout(r, pause));
    }
  }

  // Start terminal when clicking "contacts"
  contactLink.addEventListener("click", (e) => {
    e.preventDefault();

    runTerminalTyping(contactLines, 50, 220);
  });
});

/* --------------------------------------------------------------------------------------------------- */

/* ABOUT ME / SKILLS SEKTIONEN */
document.addEventListener("DOMContentLoaded", () => {
  // text for each skill, attached to keys (objects)
  const skillContent = {
    html: "I am good at building structured and semantic HTML.",
    css: "I can create clean layouts and animations with modern CSS.",
    javascript: "I use JavaScript to make my projects interactive.",
    nodejs: "I haven't started using Node.js yet, but I'm looking forward to learning it!",
    java: "I haven't started using java yet, but I'm excited to learn it!",
    springboot: "I have yet to learn Spring Boot, but it's something I'm excited for.",
    git: "I use Git for version control and clear commits. I haven't worked much with branches yet, since main works fine for personal projects.",
    github: "GitHub is where I host my portfolio and other projects."
  };

  // fetching referenses
  const skills = document.getElementById("skills");
  const aboutTextP = document.querySelector("#about-text p");
  const aboutTitle = document.querySelector("#about-text h3");
  if (!skills || !aboutTextP || !aboutTitle) return;

  // saves default text
  const defaultTitle = aboutTitle.textContent;
  const defaultParagraph = aboutTextP.textContent;

  let typingAbort = { stop: false };

  // reduced animations
  const prefersNoMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // function for typing text char by char
  async function typeText(el, fullText, speed = 18) {
    typingAbort.stop = true;
    await new Promise((r) => setTimeout(r, 0));

    // create new token
    typingAbort = { stop: false };
    const token = typingAbort;

    // reduced animations, write all text and remove caret.
    if (prefersNoMotion) {
      el.textContent = fullText;
      el.classList.remove("type-caret");
      return;
    }

    // blinking caret
    el.textContent = "";
    el.classList.add("type-caret");

    // Loops through each character, cancel at token change
    for (let i = 0; i < fullText.length; i++) {
      if (token.stop) break;
      el.textContent += fullText[i];

      // delay some characters for realism
      const char = fullText[i];
      const charDelayMs =
        char === " " ? speed * 0.4 :
        ".!?".includes(char) ? speed * 3 :
        ",;:".includes(char) ? speed * 2 :
        speed;

      await new Promise((r) => setTimeout(r, charDelayMs));
    }

    // remove caret after loop
    el.classList.remove("type-caret");
    if (token.stop) el.textContent = fullText;
  }

  // listens to clicks on skill-bar
  skills.addEventListener("click", (e) => {
    const target = e.target.closest("[data-skill]");
    if (!target) return;
    if (target.tagName.toLowerCase() === "a") e.preventDefault();

    // retrieve skill key
    const { skill: key = "" } = target.dataset;

    // write out new text, if not return
    const nextText = skillContent[key];
    if (!nextText) return;

    // change title to key
    aboutTitle.textContent = target.textContent.trim();

    // visual marking of active skill
    document.querySelectorAll("#skills [data-skill]").forEach((el) => {
      el.classList.remove("is-active");
      if (el.getAttribute("role") === "tab") el.setAttribute("aria-selected", "false");
    });
    target.classList.add("is-active");
    if (target.getAttribute("role") === "tab") target.setAttribute("aria-selected", "true");

    // typewriter animation on new text
    typeText(aboutTextP, nextText, 18);
  });
});

/* ------------------------------------------------------------------------------- */

//  Media query hamburgermenu
document.addEventListener('DOMContentLoaded', () => { 
  const toggleBtn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggleBtn || !nav) return;

  const icon = toggleBtn.querySelector('i');

  function setOpen(isOpen) {
    nav.setAttribute('data-open', isOpen ? 'true' : 'false');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
    }
  }

  // starts closed
  setOpen(false);

  toggleBtn.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    setOpen(!open);
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    const isClickInside = nav.contains(e.target) || toggleBtn.contains(e.target);
    if (!isClickInside && nav.getAttribute('data-open') === 'true') {
      setOpen(false);
    }
  });
});
