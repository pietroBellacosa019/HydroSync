// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

// Verificar preferência de tema salva
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  icon.classList.replace("fa-moon", "fa-sun");
}

// Alternar tema claro/escuro
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Tela de Carregamento
window.addEventListener("load", function () {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      document
        .querySelectorAll(".animated")
        .forEach((el) => (el.style.opacity = 1));
    }, 500);
  }, 1500);
});

// Sistema de Notificações
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const notificationCards = document.querySelectorAll(".notification-card");
  const notificationsArea = document.querySelector(".notifications-area");
  const confirmModal = document.getElementById("confirmModal");
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const markAllReadBtn = document.querySelector(".mark-all-read");
  const actionToggleButtons = document.querySelectorAll(".notification-actions-toggle");

  let cardToDelete = null;

  // Inicializar animações
  const animatedElements = document.querySelectorAll(".animated");
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });

  // Mostrar/ocultar ações ao clicar no ícone de menu
  actionToggleButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.stopPropagation();
      const card = this.closest(".notification-card");
      card.classList.toggle("show-actions");
      
      // Fechar outros cards abertos
      document.querySelectorAll(".notification-card.show-actions").forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove("show-actions");
        }
      });
    });
  });

  // Fechar ações ao clicar fora
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".notification-actions-toggle") && !e.target.closest(".notification-actions")) {
      document.querySelectorAll(".notification-card.show-actions").forEach(card => {
        card.classList.remove("show-actions");
      });
    }
  });

  // Marcar todas como lidas
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function() {
      document.querySelectorAll(".notification-card.unread").forEach(card => {
        card.classList.remove("unread");
        card.dataset.read = "true";
        const readBtn = card.querySelector(".read-btn");
        if (readBtn) {
          readBtn.innerHTML = '<i class="fas fa-envelope-open"></i> Marcar como Não Lida';
        }
      });
      updateUnreadCounters();
      showToast("Todas as notificações foram marcadas como lidas", "success");
    });
  }

  // Filtros de Notificação
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filter = this.dataset.filter;
      filterNotifications(filter);
    });
  });

  // Função para filtrar notificações
  function filterNotifications(filter) {
    let hasVisibleNotifications = false;

    notificationCards.forEach((card) => {
      const category = card.dataset.category;
      const isPinned = card.dataset.pinned === "true";
      const isArchived = card.dataset.archived === "true";

      if (filter === "all") {
        card.style.display = isArchived ? "none" : "flex";
        if (!isArchived) hasVisibleNotifications = true;
      }
      else if (filter === "archived") {
        card.style.display = isArchived ? "flex" : "none";
        if (isArchived) hasVisibleNotifications = true;
      }
      else if (category === filter && !isArchived) {
        card.style.display = "flex";
        hasVisibleNotifications = true;
      } else {
        card.style.display = "none";
      }
    });

    checkEmptyState(hasVisibleNotifications);
  }

  // Verificar estado vazio (sem notificações)
  function checkEmptyState(hasNotifications) {
    const emptyState = document.querySelector(".empty-state");

    if (!hasNotifications) {
      if (!emptyState) {
        createEmptyState();
      }
    } else if (emptyState) {
      emptyState.remove();
    }
  }

  // Criar mensagem de estado vazio
  function createEmptyState() {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-state animated";
    emptyMsg.innerHTML = `
      <div class="empty-animation">
        <i class="fas fa-bell-slash"></i>
      </div>
      <h3>Nenhuma notificação encontrada</h3>
      <p>Não há notificações nesta categoria. Quando novas notificações chegarem, elas aparecerão aqui.</p>
      <button class="refresh-btn"><i class="fas fa-sync-alt"></i> Atualizar</button>
    `;
    notificationsArea.appendChild(emptyMsg);

    const refreshBtn = emptyMsg.querySelector(".refresh-btn");
    refreshBtn.addEventListener("click", function () {
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
      showToast("Atualizando notificações...", "info");
      setTimeout(() => {
        filterNotifications(document.querySelector(".filter-btn.active").dataset.filter);
      }, 1000);
    });
  }

  // Ações nas Notificações
  notificationsArea.addEventListener("click", function (e) {
    const pinBtn = e.target.closest(".pin-btn");
    const readBtn = e.target.closest(".read-btn");
    const deleteBtn = e.target.closest(".delete-btn");
    const archiveBtn = e.target.closest(".archive-btn");
    const unarchiveBtn = e.target.closest(".unarchive-btn");

    if (pinBtn) {
      e.preventDefault();
      togglePinNotification(pinBtn);
    }

    if (readBtn) {
      e.preventDefault();
      toggleReadStatus(readBtn);
    }

    if (deleteBtn) {
      e.preventDefault();
      cardToDelete = deleteBtn.closest(".notification-card");
      confirmModal.classList.add("active");
    }

    if (archiveBtn) {
      e.preventDefault();
      archiveNotification(archiveBtn);
    }

    if (unarchiveBtn) {
      e.preventDefault();
      unarchiveNotification(unarchiveBtn);
    }
  });

  // Confirmar exclusão
  confirmDeleteBtn.addEventListener("click", function () {
    if (cardToDelete) {
      deleteNotification(cardToDelete);
      showToast("Notificação excluída com sucesso", "success");
    }
    confirmModal.classList.remove("active");
  });

  // Cancelar exclusão
  cancelDeleteBtn.addEventListener("click", function () {
    confirmModal.classList.remove("active");
    cardToDelete = null;
  });

  // Fechar modal ao clicar fora
  confirmModal.addEventListener("click", function (e) {
    if (e.target === confirmModal) {
      confirmModal.classList.remove("active");
      cardToDelete = null;
    }
  });

  // Alternar estado de fixação
  function togglePinNotification(pinBtn) {
    const card = pinBtn.closest(".notification-card");
    const isPinned = card.dataset.pinned === "true";

    card.dataset.pinned = !isPinned;
    card.classList.toggle("pinned", !isPinned);
    pinBtn.innerHTML = isPinned
      ? '<i class="fas fa-thumbtack"></i> Fixar'
      : '<i class="fas fa-thumbtack"></i> Desafixar';

    reorderNotifications();

    const message = isPinned
      ? "Notificação desafixada"
      : "Notificação fixada no topo";
    showToast(message, "success");
  }

  // Reordenar notificações (fixadas primeiro)
  function reorderNotifications() {
    const cards = Array.from(document.querySelectorAll(".notification-card"));

    cards.sort((a, b) => {
      const aPinned = a.dataset.pinned === "true";
      const bPinned = b.dataset.pinned === "true";

      if (aPinned !== bPinned) {
        return bPinned - aPinned;
      }

      const aDate = new Date(a.querySelector(".notification-date").textContent);
      const bDate = new Date(b.querySelector(".notification-date").textContent);
      return bDate - aDate;
    });

    cards.forEach((c) => notificationsArea.appendChild(c));
  }

  // Alternar estado de leitura
  function toggleReadStatus(readBtn) {
    const card = readBtn.closest(".notification-card");
    const isRead = card.dataset.read === "true";

    card.dataset.read = !isRead;
    card.classList.toggle("unread", isRead);

    if (isRead) {
      readBtn.innerHTML = '<i class="fas fa-envelope"></i> Marcar como Lida';
      showToast("Notificação marcada como não lida", "info");
    } else {
      readBtn.innerHTML = '<i class="fas fa-envelope-open"></i> Marcar como Não Lida';
      showToast("Notificação marcada como lida", "success");
    }

    updateUnreadCounters();
  }

  // Arquivar notificação
  function archiveNotification(archiveBtn) {
    const card = archiveBtn.closest(".notification-card");
    card.dataset.archived = "true";
    card.style.display = "none";

    const currentFilter = document.querySelector(".filter-btn.active").dataset.filter;
    if (currentFilter !== "archived") {
      const visibleCards = document.querySelectorAll('.notification-card:not([style*="display: none"])');
      checkEmptyState(visibleCards.length > 0);
    }

    showToast("Notificação arquivada", "success");
    updateUnreadCounters();
  }

  // Desarquivar notificação
  function unarchiveNotification(unarchiveBtn) {
    const card = unarchiveBtn.closest(".notification-card");
    card.dataset.archived = "false";

    const currentFilter = document.querySelector(".filter-btn.active").dataset.filter;
    if (currentFilter !== "archived") {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

    const visibleCards = document.querySelectorAll('.notification-card:not([style*="display: none"])');
    checkEmptyState(visibleCards.length > 0);

    showToast("Notificação desarquivada", "success");
    updateUnreadCounters();
  }

  // Excluir notificação
  function deleteNotification(card) {
    card.classList.add("slide-out");

    card.addEventListener("animationend", function () {
      card.remove();

      const visibleCards = document.querySelectorAll('.notification-card:not([style*="display: none"])');
      checkEmptyState(visibleCards.length > 0);
    });

    updateUnreadCounters();
  }

  // Atualizar contadores de notificações não lidas
  function updateUnreadCounters() {
    const unreadCount = document.querySelectorAll(".notification-card.unread").length;

    const categories = ["all", "notice", "problem", "alert", "invoice"];

    categories.forEach((category) => {
      let count = 0;

      if (category === "all") {
        count = unreadCount;
      } else {
        count = document.querySelectorAll(`.notification-card.unread[data-category="${category}"]`).length;
      }

      const badge = document.querySelector(`.filter-btn[data-filter="${category}"] .filter-badge`);
      if (badge) {
        badge.textContent = count;
        if (count > 0) {
          badge.style.display = "flex";
        } else {
          badge.style.display = "none";
        }
      } else if (count > 0) {
        const btn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (btn) {
          const newBadge = document.createElement("span");
          newBadge.className = "filter-badge";
          newBadge.textContent = count;
          btn.appendChild(newBadge);
        }
      }
    });

    // Atualizar também o badge na Home (simulação)
    localStorage.setItem('unreadNotifications', unreadCount);
  }

  // Função para mostrar toast
  function showToast(message, type = "info", duration = 4000) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon, title;
    switch (type) {
      case "success":
        icon = "fa-check-circle";
        title = "Sucesso!";
        break;
      case "error":
        icon = "fa-exclamation-circle";
        title = "Erro!";
        break;
      case "warning":
        icon = "fa-exclamation-triangle";
        title = "Aviso!";
        break;
      default:
        icon = "fa-info-circle";
        title = "Informação";
    }

    toast.innerHTML = `
      <i class="fas ${icon}"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      toast.style.animation = "fadeOut 0.5s ease-out forwards";
      toast.addEventListener("animationend", () => toast.remove());
    });

    const timeout = setTimeout(() => {
      toast.style.animation = "fadeOut 0.5s ease-out forwards";
      toast.addEventListener("animationend", () => toast.remove());
    }, duration);

    toast.addEventListener("mouseenter", () => clearTimeout(timeout));
    toast.addEventListener("mouseleave", () => {
      setTimeout(() => {
        toast.style.animation = "fadeOut 0.5s ease-out forwards";
        toast.addEventListener("animationend", () => toast.remove());
      }, duration);
    });
  }

  // Chamar inicialmente para configurar o estado
  updateUnreadCounters();
  filterNotifications("all");
});