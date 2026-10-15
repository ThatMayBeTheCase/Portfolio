document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("term-code");
  const terminal = document.getElementById("contact-terminal");
  const input = document.getElementById("term-input");
  if (!output || !terminal || !input) return;
  const inputShell = input.closest(".term-input-shell");
  // Measure the loaded font so the block follows selection and horizontal scrolling.
  const cursorMeasure = document.createElement("canvas").getContext("2d");
  function updateCursor() {
    if (!cursorMeasure) return;
    const style = window.getComputedStyle(input);
    cursorMeasure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const prefix = input.value.slice(
      0,
      input.selectionStart ?? input.value.length,
    );
    const width = cursorMeasure.measureText(prefix).width;
    const blockWidth = cursorMeasure.measureText("M").width;
    const position = Math.max(
      0,
      Math.min(width - input.scrollLeft, input.clientWidth - blockWidth),
    );
    inputShell.style.setProperty("--cursor-x", `${position}px`);
  }
  const scheduleCursor = () => requestAnimationFrame(updateCursor);
  for (const event of [
    "input",
    "keydown",
    "keyup",
    "click",
    "focus",
    "blur",
    "scroll",
    "select",
  ])
    input.addEventListener(event, scheduleCursor);
  document.addEventListener("selectionchange", () => {
    if (document.activeElement === input) scheduleCursor();
  });
  window.addEventListener("resize", scheduleCursor);
  document.fonts?.ready.then(scheduleCursor);
  scheduleCursor();
  const status = document.getElementById("term-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revision = 0;
  const history = [];
  let historyIndex = 0;
  const scrollOutput = () => {
    const pre = output.parentElement;
    pre.scrollTop = pre.scrollHeight;
  };
  async function print(lines, token, animate = true) {
    for (const line of lines) {
      if (token !== revision) return;
      // Render command input as text so it cannot inject markup.
      const row = document.createElement("span");
      output.append(row, document.createTextNode("\n"));
      const text = typeof line === "string" ? line : line.text;
      if (animate && !reducedMotion.matches) {
        for (const character of text) {
          if (token !== revision) return;
          row.textContent += character;
          scrollOutput();
          const delay =
            character === " " ? 10 : ".!?".includes(character) ? 75 : 25;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } else row.textContent = text;
      if (token !== revision) return;
      if (typeof line !== "string") {
        const link = document.createElement("a");
        link.href = line.href;
        link.textContent = line.text;
        row.replaceChildren(link);
      }
      scrollOutput();
      if (animate && !reducedMotion.matches)
        await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  async function run(raw) {
    const command = raw.trim();
    if (!command) return;
    // A new command invalidates any output animation still in progress.
    const token = ++revision;
    if (output.textContent && !output.textContent.endsWith("\n"))
      output.append("\n");
    await print(["[coffee@case] ~$ " + command], token, false);
    if (token !== revision) return;
    const [name, ...args] = command.toLowerCase().split(/\s+/);
    let lines;
    switch (name) {
      case "help":
        lines = [
          "Available commands:",
          "about          Show my introduction",
          "skills <name>  Explore a skill",
          "projects       Open my projects",
          "contact        Show contact details",
          "resume         Open my CV",
          "clear          Clear the terminal",
          "coffee         Brew a virtual coffee ☕",
          "date           Show local date and time",
          "theme [mode]   Toggle theme, light/dark/classic",
        ];
        break;
      case "about":
        document.dispatchEvent(new CustomEvent("portfolio:about"));
        lines = ["About me restored. See the About section."];
        break;
      case "skills": {
        const requested = args.join("").replace(/[.-]/g, "");
        const options = [...document.querySelectorAll("#skills [data-skill]")];
        const skill = options.find((el) => el.dataset.skill === requested);
        if (skill) {
          document.dispatchEvent(
            new CustomEvent("portfolio:skill", { detail: skill.dataset.skill }),
          );
          lines = [
            "Selected " + skill.textContent.trim() + ". See the About section.",
          ];
        } else
          lines = [
            "Usage: skills <name>",
            "Skills: " + options.map((el) => el.textContent.trim()).join(", "),
          ];
        break;
      }
      case "projects":
        window.location.assign(window.portfolioTheme.url("projects.html"));
        return;
      case "resume":
        window.location.assign(window.portfolioTheme.url("cv.html"));
        return;
      case "contact":
        lines = [
          "Timmy Wramborg",
          { text: "Phone: +46 76 134 73 02", href: "tel:+46761347302" },
          {
            text: "Email: timmy_wramborg97@hotmail.com",
            href: "mailto:timmy_wramborg97@hotmail.com",
          },
          {
            text: "LinkedIn: linkedin.com/in/timmy-wramborg",
            href: "https://www.linkedin.com/in/timmy-wramborg",
          },
          {
            text: "GitHub: github.com/ThatMayBeTheCase",
            href: "https://github.com/ThatMayBeTheCase",
          },
        ];
        break;
      case "date":
        lines = [
          new Date().toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "long",
          }),
        ];
        break;
      case "theme": {
        const themes = window.portfolioTheme.modes;
        const current = window.portfolioTheme.get();
        const mode =
          args[0] || themes[(themes.indexOf(current) + 1) % themes.length];
        if (!themes.includes(mode) || args.length > 1) {
          lines = ["Usage: theme [dark|light|classic]"];
        } else {
          window.portfolioTheme.set(mode);
          lines = [
            `${mode[0].toUpperCase() + mode.slice(1)} mode enabled.`,
          ];
        }
        break;
      }
      case "clear":
        output.replaceChildren();
        status.textContent = "Terminal cleared.";
        return;
      case "coffee":
        lines = [
          "Grinding beans…",
          "Brewing…",
          "   ( (",
          "    ) )",
          "  .------.",
          "  |      |]",
          "  \u0027------\u0027",
          "Coffee ready! ☕ Enjoy.",
        ];
        break;
      default:
        lines = ["Unknown command. Type help to see available commands."];
    }
    await print(lines, token);
    if (token === revision) status.textContent = "Command complete: " + name;
  }
  terminal
    .querySelector(".terminal-card")
    .addEventListener("click", (event) => {
      if (
        event.target.closest("a, input, button") ||
        window.getSelection()?.toString()
      )
        return;
      input.focus({ preventScroll: true });
    });
  terminal.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    history.push(value);
    historyIndex = history.length;
    input.value = "";
    scheduleCursor();
    run(value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    historyIndex = Math.max(
      0,
      Math.min(
        history.length,
        historyIndex + (event.key === "ArrowUp" ? -1 : 1),
      ),
    );
    input.value = history[historyIndex] || "";
  });
  function showContacts() {
    document.dispatchEvent(new CustomEvent("portfolio:close-navigation"));
    terminal.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "start",
    });
    run("contact");
  }
  document
    .getElementById("contact-link")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      showContacts();
    });
  if (window.location.hash === "#contact-terminal") showContacts();
});
