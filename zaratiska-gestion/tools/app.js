document.getElementById('csvFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const csvData = event.target.result;

    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";", // ← Change en ";" si tu utilises des points-virgules
      complete: function (results) {
        console.log("Résultats bruts :", results); // Debug

        if (results.errors.length > 0) {
          alert("⚠️ Erreur(s) dans le CSV :\n" + JSON.stringify(results.errors, null, 2));
          return;
        }

        let data = results.data;

        // Supprimer les lignes vides ou mal formées
        data = data.filter(item => item.NUMERO);

        // Vérifier les doublons
        const seen = new Set();
        const filteredData = data.filter(item => {
          const duplicate = seen.has(item.NUMERO);
          seen.add(item.NUMERO);
          return !duplicate;
        });

        // Trier par numéro de bus
        filteredData.sort((a, b) => a.NUMERO?.localeCompare(b.NUMERO));

        // Afficher le rendu
        displayPreview(filteredData);

        // Générer le JSON
        generateJSON(filteredData);
      },
      error: function (err) {
        alert("❌ Erreur lors du parsing du CSV :\n" + err.message);
      }
    });
  };

  reader.onerror = function () {
    alert("❌ Impossible de lire le fichier.");
  };

  reader.readAsText(file);
});

function displayPreview(data) {
  const preview = document.getElementById('preview');
  preview.innerHTML = '<ul class="contenu-scroll">';

  data.forEach(bus => {
    // Badge couleur
    const badgeCouleurs = bus["BADGE_COULEUR"] ? bus["BADGE_COULEUR"].split(',').map(c => `<div style="background-color: ${c.trim()}"></div>`).join('') : '';
    const badgeHTML = badgeCouleurs ? `
      <span class="badge-couleur vertical" style="--badge-width: 40px; --badge-height: 20px;">
        ${badgeCouleurs}
      </span>
    ` : '';

    // Note (optionnelle)
    const noteHTML = bus["NOTE"] ? `<small> (${bus["NOTE"]})</small>` : '';

    // Bouton de liste
    preview.innerHTML += `
      <li>
        <button class="bouton-liste">
          ${bus["NUMERO"]}${noteHTML}
          ${badgeHTML}
        </button>
      </li>`;
  });

  preview.innerHTML += '</ul>';
}

function generateJSON(data) {
  const jsonData = {
    bus: data.map((item, index) => ({
      id: item["ID_MODAL"] || `modal-bus-details-${index + 1}`,
      numero: item["NUMERO"],
      description: item["DESCRIPTION"],
      badge: item["BADGE_COULEUR"] ? item["BADGE_COULEUR"].split(',').map(c => c.trim()) : [],
      note: item["NOTE"] || ''
    }))
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'bus.json';
  link.textContent = 'Télécharger bus.json';
  link.style.display = 'block';
  link.style.marginTop = '20px';
  link.style.textAlign = 'center';

  const preview = document.getElementById('preview');
  preview.appendChild(link);
}