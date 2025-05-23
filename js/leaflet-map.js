// Initialisation de la carte
const map = L.map('map').setView([47.02532294922978, 4.708320362428112], 8); // Zoom sur le département 21

// Fond de carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Style des départements
const departementStyle = {
  color: "blue",
  weight: 2,
  opacity: 1,
  fillOpacity: 0
};

// Style des communes
const communeStyle = {
  color: "red",
  weight: 2,
  opacity: 1,
    fillColor: 'red',     // remplissage rouge
  fillOpacity: 0.4  
};

// Départements à charger
const departements = [
  {
    nom: "Côte-d'Or",
    url: "https://raw.githubusercontent.com/gregoiredavid/france-geojson/refs/heads/master/departements/21-cote-d-or/departement-21-cote-d-or.geojson"
  },
  {
    nom: "Saône-et-Loire",
    url: "https://raw.githubusercontent.com/gregoiredavid/france-geojson/refs/heads/master/departements/71-saone-et-loire/departement-71-saone-et-loire.geojson"
  }
];

// Communes ciblées (par nom)
const communesCiblees = {
  "21": ["Pouilly-en-Auxois"],
  "71": ["Matour"]
};

// URLs des fichiers GeoJSON des communes par département
const communesFiles = {
  "21": "https://raw.githubusercontent.com/gregoiredavid/france-geojson/refs/heads/master/departements/21-cote-d-or/communes-21-cote-d-or.geojson",
  "71": "https://raw.githubusercontent.com/gregoiredavid/france-geojson/refs/heads/master/departements/71-saone-et-loire/communes-71-saone-et-loire.geojson"
};

var myIcon = L.icon({
    iconUrl: './images/map/google-maps.png',
    iconSize: [38, 38],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

L.marker([47.32656318573532, 5.044057341878114], 
    {icon: myIcon})
    .addTo(map)
    .bindPopup("📍 Dijon")
    .openPopup()
    ;

// Ajout des contours des départements (juste l'enveloppe)
departements.forEach(dep => {
  fetch(dep.url)
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
        style: departementStyle
      }).addTo(map);
    })
    .catch(err => console.error("Erreur chargement département :", err));
});

// Ajout des contours des communes ciblées
Object.entries(communesFiles).forEach(([codeDep, url]) => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const communesFiltrees = {
        ...data,
        features: data.features.filter(feature =>
          communesCiblees[codeDep].includes(feature.properties.nom)
        )
      };

      const layer = L.geoJSON(communesFiltrees, {
        style: communeStyle,
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`📍 ${feature.properties.nom}`);
        }
      }).addTo(map);

    //   // Adapter la vue
    //   map.fitBounds(layer.getBounds());
    })
    .catch(err => console.error("Erreur chargement communes :", err));
});

const legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += `
    <h4 class="text-center">Légende</h4>
    
    <p class="legend"><i style="background: white; border: 2px solid blue; display: inline-block; width: 18px; height: 18px; margin-right: 8px;"></i> Départements</p>
    <p class="legend"><i style="background: #DC9D9B; border: 2px solid red; display: inline-block; width: 18px; height: 18px; margin-right: 8px;"></i> Antennes locales</p>
  `;
  return div;
};

legend.addTo(map);