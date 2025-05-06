function ouvrirModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function fermerModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
  }






// Fonction générique pour charger un fichier HTML dans un conteneur
function chargerFichier(url, cibleId) {
    const container = document.getElementById(cibleId);
  
    // Vérifie si déjà chargé
    if (container.dataset.charged === "true") return;
  
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Erreur lors du chargement de ${url}`);
        return response.text();
      })
      .then(data => {
        container.innerHTML = data;
        container.dataset.charged = "true";
      })
      .catch(error => {
        console.error("Impossible de charger le fichier :", error);
        container.innerHTML = "<p>Chargement impossible.</p>";
      });
  }
  
  // Fonction appelée quand on clique sur un lien BUS / RESTAURANT / SUPERMARCHÉ
  function ouvrirModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  
    // Charger la liste et les modales correspondantes
    if (modalId === "modal-bus") {
      chargerFichier('dataList/bus-liste.html', 'liste-bus-container');
      chargerFichier('dataList/bus-modales.html', 'modales-bus-container');
    }
  
    if (modalId === "modal-restaurant") {
      chargerFichier('dataList/restaurant-liste.html', 'liste-restaurant-container');
      chargerFichier('dataList/restaurant-modales.html', 'modales-restaurant-container');
    }
  
    if (modalId === "modal-supermarche") {
      chargerFichier('dataList/supermarche-liste.html', 'liste-supermarche-container');
      chargerFichier('dataList/supermarche-modales.html', 'modales-supermarche-container');
    }
  }
  
  // Fonction pour fermer une modale
  function fermerModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }