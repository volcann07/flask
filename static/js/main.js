document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Abrir menú" : "Cerrar menú");
    navigation.classList.toggle("is-open", !expanded);
    menuToggle.innerHTML = `<i data-lucide="${expanded ? "menu" : "x"}"></i>`;
    window.lucide?.createIcons();
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      navigation.classList.remove("is-open");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      window.lucide?.createIcons();
    });
  });

  document.querySelectorAll(".card-expand").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".material-card");
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      card.classList.toggle("is-expanded", !expanded);
      button.querySelector("i").setAttribute("data-lucide", expanded ? "plus" : "minus");
      button.firstChild.textContent = expanded
        ? (card.classList.contains("card-organic") ? "DESCUBRIR EL COMPOST " : "VER CÓMO PREPARAR ")
        : "OCULTAR DETALLES ";
      window.lucide?.createIcons();
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  window.lucide?.createIcons();
});
