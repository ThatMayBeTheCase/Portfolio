document.addEventListener("DOMContentLoaded", () => {
  const skillContent = {
    html: "I build structured web pages with semantic HTML.",
    css: "I create responsive layouts, styling and animations with CSS.",
    javascript: "I use JavaScript to handle user interactions and update page content dynamically.",
    python: "I have foundational knowledge of Python and machine learning.",
    mysql: "I have basic experience with MySQL for storing and retrieving data in backend applications.",
    java: "I have a foundation in Java through coursework and practical backend development.",
    springboot: "I use Spring Boot to build backend applications with Spring Data JPA and MySQL.",
    git: "I use Git to track changes and manage development with branches and merges.",
    github: "I use GitHub to manage repositories and review changes through pull requests.",
    cicd: "I use GitHub Actions to automate builds, tests and deployments with Docker and Docker Compose."
  };

  const skills = document.getElementById("skills");
  const aboutTextP = document.querySelector("#about-text p");
  const aboutTitle = document.getElementById("about-title");
  if (!skills || !aboutTextP || !aboutTitle) return;

  const defaultTitle = aboutTitle.textContent;
  const defaultParagraph = aboutTextP.textContent;

  const options = [...skills.querySelectorAll("[data-skill]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revision = 0;

  function markSelected(selected) {
    options.forEach(option => option.classList.toggle("is-active", option === selected));
  }

  function resetAbout() {
    revision++;
    aboutTitle.textContent = defaultTitle;
    aboutTextP.textContent = defaultParagraph;
    aboutTextP.classList.remove("type-caret");
    markSelected(null);
  }

  document.querySelector('.navbar a[href="#about-me"]')?.addEventListener("click", resetAbout);
  document.addEventListener("portfolio:about", resetAbout);

  async function typeText(el, fullText, speed = 18) {
    // A reset or another selection cancels the previous writer.
    const token = ++revision;

    if (reducedMotion.matches) {
      el.textContent = fullText;
      el.classList.remove("type-caret");
      return;
    }

    el.textContent = "";
    el.classList.add("type-caret");

    for (let i = 0; i < fullText.length; i++) {
      if (token !== revision) return;
      el.textContent += fullText[i];

      const char = fullText[i];
      const charDelayMs =
        char === " " ? speed * 0.4 :
        ".!?".includes(char) ? speed * 3 :
        ",;:".includes(char) ? speed * 2 :
        speed;

      await new Promise((r) => setTimeout(r, charDelayMs));
    }

    if (token === revision) el.classList.remove("type-caret");
  }

  function selectSkill(target) {
    const text = skillContent[target.dataset.skill];
    if (!text) return;
    aboutTitle.textContent = target.textContent.trim();
    markSelected(target);
    typeText(aboutTextP, text);
  }

  document.addEventListener("portfolio:skill", event => {
    const target = options.find(option => option.dataset.skill === event.detail);
    if (target) selectSkill(target);
  });

  skills.addEventListener("click", event => {
    const target = event.target.closest("[data-skill]");
    if (!target || !skills.contains(target)) return;
    event.preventDefault();
    if (target.classList.contains("is-active")) resetAbout();
    else selectSkill(target);
  });
});
