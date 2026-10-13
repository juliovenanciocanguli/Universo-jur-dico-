const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
$$(".nav-link", mainNav).forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const cards = $$(".article-card");
const searchInput = $("#articleSearch");
const filterButtons = $$(".filter-chip");
let currentFilter = "todos";

function filterArticles() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-PT");
  let shown = 0;
  cards.forEach(card => {
    const categoryMatch = currentFilter === "todos" || card.dataset.category === currentFilter;
    const textMatch = (card.dataset.search + " " + card.innerText).toLocaleLowerCase("pt-PT").includes(term);
    const visible = categoryMatch && textMatch;
    card.hidden = !visible;
    if (visible) shown++;
  });
  $("#noResults").hidden = shown !== 0;
}
searchInput.addEventListener("input", filterArticles);
filterButtons.forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle("selected", item === button));
  filterArticles();
}));

const articleContent = {
  direitos: {
    title: "Os direitos fundamentais na Constituição Angolana",
    paragraphs: [
      "Os direitos fundamentais ocupam um lugar central na Constituição da República de Angola. Expressam posições jurídicas essenciais da pessoa e funcionam como referência para a actuação dos poderes públicos.",
      "A sua compreensão exige distinguir direitos, liberdades e garantias de direitos económicos, sociais e culturais, sem esquecer os deveres fundamentais e os mecanismos de protecção previstos no ordenamento jurídico.",
      "Para um estudo completo, consulte a Constituição da República de Angola, a legislação complementar aplicável e a jurisprudência relevante."
    ]
  },
  ilicitude: {
    title: "O erro sobre a ilicitude no Direito Penal",
    paragraphs: [
      "O erro sobre a ilicitude relaciona-se com a consciência de que um comportamento é contrário ao Direito. Não deve ser confundido automaticamente com o erro sobre os elementos de facto que integram o tipo legal de crime.",
      "A análise jurídica deve considerar as regras do Código Penal Angolano sobre o erro, a censurabilidade e as circunstâncias concretas em que o agente actuou. A consequência depende do regime legal aplicável e dos factos provados.",
      "Este resumo é apenas introdutório. Para trabalhos académicos ou casos concretos, verifique a redacção vigente do Código Penal e a doutrina pertinente."
    ]
  },
  factos: {
    title: "Factos jurídicos com eficácia real",
    paragraphs: [
      "Os factos jurídicos são acontecimentos a que o Direito associa efeitos jurídicos. Quando produzem efeitos no domínio dos direitos reais, podem ser estudados segundo o tipo de alteração que provocam na situação jurídica.",
      "Em termos gerais, fala-se em factos constitutivos quando dão origem a um direito, translativos quando transferem um direito, modificativos quando alteram o seu conteúdo e extintivos quando determinam o seu fim.",
      "A classificação deve ser aplicada com atenção ao instituto jurídico concreto, às regras de aquisição e transmissão de direitos e aos requisitos de forma e publicidade previstos na lei."
    ]
  },
  investigacao: {
    title: "Como estruturar um trabalho de investigação jurídica",
    paragraphs: [
      "Uma investigação jurídica consistente começa com a delimitação do tema. Um tema demasiado amplo dificulta a formulação de uma pergunta clara e a selecção de fontes relevantes.",
      "Depois, formule o problema de investigação, os objectivos e, quando adequado, as hipóteses. Organize a pesquisa entre legislação, jurisprudência, doutrina e outras fontes pertinentes, registando as referências desde o início.",
      "A estrutura deve manter coerência entre problema, metodologia, desenvolvimento e conclusões. As regras de citação exigidas pela instituição devem ser aplicadas de forma uniforme."
    ]
  },
  legalidade: {
    title: "O princípio da legalidade criminal",
    paragraphs: [
      "O princípio da legalidade criminal protege as pessoas contra a criação arbitrária de crimes e penas. Em termos gerais, exige que a responsabilidade criminal tenha fundamento numa lei anterior ao facto.",
      "O princípio está ligado à segurança jurídica, à previsibilidade e à limitação do poder punitivo do Estado. A sua aplicação concreta depende das normas constitucionais e penais em vigor.",
      "Num estudo académico, é importante distinguir as suas dimensões, analisar as disposições legais aplicáveis e consultar doutrina e jurisprudência actualizadas."
    ]
  },
  contratos: {
    title: "O contrato e a força vinculativa das obrigações",
    paragraphs: [
      "O contrato é uma figura central do Direito das Obrigações. Através do acordo de vontades, as partes podem constituir, modificar ou extinguir relações jurídicas, dentro dos limites impostos pela lei.",
      "A validade e os efeitos de um contrato dependem, entre outros aspectos, da capacidade das partes, da declaração negocial, do objecto e da observância da forma legalmente exigida quando aplicável.",
      "A interpretação de uma cláusula ou a solução de um conflito contratual exige a análise do texto, das circunstâncias relevantes e das normas do ordenamento jurídico aplicável."
    ]
  }
};

const dialog = $("#articleDialog");
$$("[data-article]").forEach(button => button.addEventListener("click", () => {
  const article = articleContent[button.dataset.article];
  if (!article) return;
  $("#dialogTitle").textContent = article.title;
  $("#dialogContent").replaceChildren(...article.paragraphs.map(text => {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }));
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}));
$("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

const contactForm = $("#contactForm");
contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  const feedback = $("#formFeedback");
  const submit = $(".form-submit", contactForm);
  const payload = Object.fromEntries(new FormData(contactForm).entries());
  submit.disabled = true;
  submit.style.opacity = ".65";
  feedback.textContent = "A enviar a mensagem...";
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Não foi possível enviar.");
    feedback.textContent = result.message;
    contactForm.reset();
  } catch (error) {
    // If opened as a static site or hosted without the Node API, offer a WhatsApp fallback.
    const text = `Olá, UniJ!%0A%0ANome: ${encodeURIComponent(payload.name)}%0AE-mail: ${encodeURIComponent(payload.email)}%0AAssunto: ${encodeURIComponent(payload.subject || "Informação geral")}%0AMensagem: ${encodeURIComponent(payload.message)}`;
    feedback.textContent = "O formulário não está ligado ao servidor. Vamos abrir o WhatsApp para enviar a mensagem.";
    window.setTimeout(() => window.open(`https://wa.me/244925039977?text=${text}`, "_blank", "noopener"), 500);
  } finally {
    submit.disabled = false;
    submit.style.opacity = "1";
  }
});

// Highlight the current section in the navigation as the visitor scrolls.
const sections = $$("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}
