// Fonction pour ouvrir une modale
function ouvrirModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Charger la liste si pas encore chargée
  if (modalId === "modal-bus") {
      chargerFichier('dataList/bus-liste.json', 'liste-bus-container', 'bus');
  }

  if (modalId === "modal-restaurant") {
      chargerFichier('dataList/restaurant-liste.json', 'liste-restaurant-container', 'restaurant');
  }

  if (modalId === "modal-supermarche") {
      chargerFichier('dataList/supermarche-liste.json', 'liste-supermarche-container', 'supermarche');
  }
}

// Fonction pour fermer une modale
function fermerModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Fonction générique pour charger un fichier JSON et générer le HTML
function chargerFichier(url, cibleId, type) {
  const container = document.getElementById(cibleId);

  // Si déjà chargé, on ne recharge pas
  if (container.dataset.charged === "true") return;

  fetch(url)
      .then(response => {
          if (!response.ok) throw new Error(`Erreur lors du chargement de ${url}`);
          return response.json();
      })
      .then(data => {
          let html = '';

          // Génère le HTML selon le type de données
          if (type === 'bus') {
              html = genererListeBus(data.bus);
          } else if (type === 'restaurant') {
              html = genererListeRestaurant(data.restaurants);
          } else if (type === 'supermarche') {
              html = genererListeSupermarche(data.supermarches);
          }

          container.innerHTML = html;
          container.dataset.charged = "true";
      })
      .catch(error => {
          console.error("Impossible de charger le fichier :", error);
          container.innerHTML = "<p>Chargement impossible.</p>";
      });
}

// === Générateur de liste Bus ===
function genererListeBus(buses) {
  let html = '<ul class="contenu-scroll">';
  buses.forEach(bus => {

      const badgeHTML = bus.badge && bus.badge.length > 0 ? `
        <span class="badge-couleur vertical" style="--badge-width: 40px; --badge-height: 20px;">
          ${bus.badge.map(c => `<div style="background-color: ${c}"></div>`).join('')}
        </span>
      ` : '';

      const noteHTML = bus.note ? `<small> (${bus.note})</small>` : '';

      html += `
        <li>
          <button class="bouton-liste" onclick="ouvrirModal('${bus.id}')">
            ${bus.numero}${noteHTML}
            ${badgeHTML}
          </button>
        </li>`;
  });
  html += '</ul>';
  return html;
}

// === Exemple pour Restaurant (à adapter avec tes données) ===
function genererListeRestaurant(restaurants) {
  let html = '<ul class="contenu-scroll">';
  restaurants.forEach(r => {
      html += `
        <li>
          <button class="bouton-liste" onclick="ouvrirModal('${r.id}')">
            ${r.nom}
          </button>
        </li>`;
  });
  html += '</ul>';
  return html;
}

// === Exemple pour Supermarché (à adapter avec tes données) ===
function genererListeSupermarche(supermarches) {
  let html = '<ul class="contenu-scroll">';
  supermarches.forEach(s => {
      html += `
        <li>
          <button class="bouton-liste" onclick="ouvrirModal('${s.id}')">
            ${s.nom}
          </button>
        </li>`;
  });
  html += '</ul>';
  return html;
}