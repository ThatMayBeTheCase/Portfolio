
// Build a mapping of each skill to its description.
document.addEventListener("DOMContentLoaded", () => {
    const skillContent = {
        html: "I am good at building structured and semantic HTML.",
        css: "I can create clean layouts and animations with modern CSS.",
        javascript: "I use JavaScript to make my projects interactive.",
        nodejs: "I haven't started using Node.js yet, but I'm looking forward to learning it!",
        react: "I haven't started using React yet, but I'm excited to learn it!",
        git: "I use Git for version control and clear commits. I haven't worked much with branches yet, since main works fine for personal projects.",
        github: "GitHub is where I host my portfolio and other projects."
    };

    const skills = document.getElementById("skills");
    const aboutTextP = document.querySelector("#about-text p");
    const aboutTitle = document.querySelector("#about-text h3");

    if (!skills || !aboutTextP || !aboutTitle) return;

    const defaultTitle = aboutTitle.textContent;
    const defaultParagraph = aboutTextP.textContent;

    let typingAbort = { stop: false };

    const prefersNoMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    async function typeText(el, fullText, speed = 18) {
        typingAbort.stop = true;
        await new Promise((r) => setTimeout(r, 0));

        typingAbort = { stop: false };
        const token = typingAbort;

        if (prefersNoMotion) {
            el.textContent = fullText;
            el.classList.remove("type-caret");
            return;
        }

        el.textContent = "";
        el.classList.add("type-caret");

        for (let i = 0; i < fullText.length; i++) {
            if (token.stop) break;
            el.textContent += fullText[i];

            const ch = fullText[i];
            const delay =
                ch === " " ? speed * 0.4 :
                ".!?".includes(ch) ? speed * 3 :
                ",;:".includes(ch) ? speed * 2 :
                speed;

            await new Promise((r) => setTimeout(r, delay));
        }

        el.classList.remove("type-caret");
        if (token.stop) el.textContent = fullText;
    }

    // Handle clicks on a skill to swap the about text.
    skills.addEventListener("click", (e) => {
        const target = e.target.closest("[data-skill]");
        if (!target) return;
        if (target.tagName.toLowerCase() === "a") e.preventDefault();

        const key = (target.dataset.skill || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        const nextText = skillContent[key];
        if (!nextText) return;

        aboutTitle.textContent = target.textContent.trim();

        document.querySelectorAll("#skills [data-skill]").forEach((el) => {
            el.classList.remove("is-active");
            if (el.getAttribute("role") === "tab") el.setAttribute("aria-selected", "false");
        });
        target.classList.add("is-active");
        if (target.getAttribute("role") === "tab") target.setAttribute("aria-selected", "true");

        typeText(aboutTextP, nextText, 18);
    });

    // Click outside the skills area resets the about section copy.
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
