// === Inicializar EmailJS ===
(function () {
  // Tu Public Key desde EmailJS > Account > API Keys
  emailjs.init("ckumMuqPUV7STCQ-v");
})();

// === Variables globales - Menú hamburguesa ===
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

// === Abrir/cerrar menú hamburguesa ===
if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const bars = document.querySelectorAll(".bar");
    if (navMenu.classList.contains("active")) {
      bars[0].style.transform = "rotate(45deg)";
      bars[0].style.backgroundColor = "#D4AF37";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(-45deg)";
      bars[2].style.backgroundColor = "#D4AF37";
    } else {
      bars.forEach((bar) => {
        bar.removeAttribute("style");
      });
    }
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll(".menu li a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const bars = document.querySelectorAll(".bar");
      bars.forEach(bar => bar.removeAttribute("style"));
    });
  });
} else {
  console.warn("No se encontró el botón hamburguesa o el menú.");
}

// === Resaltar página actual en el menú ===
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".menu li a").forEach(link => {
  const linkHref = link.getAttribute("href");

  link.classList.remove("active-link");
  link.style.backgroundColor = "";
  link.style.color = "";

  if (linkHref === currentPage || linkHref === "./" + currentPage) {
    link.classList.add("active-link");
    link.style.backgroundColor = "#1a2b5c"; // Azul oscuro
    link.style.color = "white";
    link.style.fontWeight = "bold";
  }

  // Hover suave en todos los botones del menú
  link.addEventListener("mouseenter", () => {
    if (!link.classList.contains("active-link")) {
      link.style.backgroundColor = "rgba(26, 43, 92, 0.8)";
      link.style.color = "white";
    }
  });

  link.addEventListener("mouseleave", () => {
    if (!link.classList.contains("active-link")) {
      link.style.backgroundColor = "";
      link.style.color = "";
    }
  });
});

// === Variables globales - Modal de contacto ===
const contactoBtn = document.querySelector(".floating-btn-fixed");
const modalForm = document.getElementById("modal-contacto");
const overlay = document.getElementById("overlay");

// === Abrir modal desde el botón flotante ===
if (contactoBtn && modalForm && overlay) {
  contactoBtn.addEventListener("click", (e) => {
    e.preventDefault();

    modalForm.style.display = "block";
    overlay.style.display = "block";
  });
} else {
  console.error("No se encontró el botón flotante o el modal en esta página.");
}

// === Cerrar modal al hacer clic en X o fuera del formulario ===
const closeModal = document.querySelector(".modal-close");

if (closeModal && modalForm && overlay) {
  closeModal.addEventListener("click", () => {
    modalForm.style.display = "none";
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      modalForm.style.display = "none";
      overlay.style.display = "none";
    }
  });
} else {
  console.warn("No se encontró el botón para cerrar el modal o el overlay.");
}

// === Límite diario local (versión gratis) ===
const MAX_ENVIOS = 5;
let contadorEnvios = localStorage.getItem("contadorEmails") 
  ? parseInt(localStorage.getItem("contadorEmails")) 
  : 0;

const hoy = new Date().toLocaleDateString();
const fechaGuardada = localStorage.getItem("fechaEnvio");

if (fechaGuardada !== hoy) {
  // Reiniciar el contador si es un día nuevo
  contadorEnvios = 0;
  localStorage.removeItem("contadorEmails");
  localStorage.removeItem("fechaEnvio");
}

// === Enviar formulario por EmailJS ===
const form = document.getElementById("form-contacto");
const successMsg = document.getElementById("mensaje-exito");

if (form && successMsg) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (contadorEnvios >= MAX_ENVIOS) {
      alert("Lo sentimos, se alcanzó el límite diario de solicitudes.");
      return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim() || "";
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    // Enviar correo con EmailJS
    emailjs.send("service_6i46kf7", "template_4co2e29", {
      name: nombre,
      reply_to: email,
      message: mensaje,
      phone: telefono,
      to_email: "darioeduardocortestrujillo@gmail.com"
    })
    .then(() => {
      // Mostrar mensaje de éxito
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);

      // Limpiar formulario y cerrar modal
      this.reset();
      if (modalForm) modalForm.style.display = "none";
      if (overlay) overlay.style.display = "none";

      // Actualizar contador local
      contadorEnvios += 1;
      localStorage.setItem("contadorEmails", contadorEnvios);
      localStorage.setItem("fechaEnvio", hoy);

    }, (error) => {
      console.error("Error al enviar:", error.text);
      alert("Hubo un problema al enviar tu solicitud. ¿Service/Template ID correctos?");
    });
  });
} else {
  console.warn("El formulario o mensaje de éxito no están disponibles.");
}

// === Cerrar mensaje de éxito ===
const closeSuccess = document.querySelector(".exito-cerrar");

if (closeSuccess && successMsg) {
  closeSuccess.addEventListener("click", () => {
    successMsg.style.display = "none";
  });
}