// Initialisiere die Karte
var map = L.map('map').setView([47.3769, 8.5417], 13);

// Basiskarte hinzufügen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Beispielkoordinaten für Polygone
var polygonCoordinates = [
    [
        [47.378, 8.54],
        [47.377, 8.543],
        [47.375, 8.542]
    ],
    [
        [47.376, 8.538],
        [47.374, 8.539],
        [47.375, 8.537]
    ]
];

// Google Sheets CSV-Daten laden
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT5lDPRJssgQ6YWnIjEECaYzLBWz4-yYeQH1NIr92AYEZvlbG7LpJUNzPeeoWJovzkr8nxg_o3x0jUp/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(csvText => {
        // Parse CSV-Daten mit PapaParse
        var data = Papa.parse(csvText, {
            header: true, // Erste Zeile als Header verwenden
            skipEmptyLines: true // Leere Zeilen überspringen
        }).data;

        // Dynamisch Polygone hinzufügen
        polygonCoordinates.forEach((coords, index) => {
            if (data[index]) { // Prüfen, ob entsprechende Daten vorhanden sind
                // Farbe basierend auf dem Status setzen
                var color = data[index].Status.toLowerCase() === "gut" ? "green" : "red";

                // Polygon erstellen mit dynamischem Style
                var polygon = L.polygon(coords, {
                    color: color, // Umrissfarbe
                    fillColor: color, // Füllfarbe
                    fillOpacity: 0.5 // Transparenz
                }).addTo(map);

                // Popup mit dynamischen Daten binden
                polygon.bindPopup(
                    `<strong>${data[index].Name}</strong><br>${data[index].Beschreibung}<br>Status: ${data[index].Status}`
                );
            }
        });

        // Debugging: Konsolenausgabe der Daten
        console.log(data);
    })
    .catch(error => console.error("Fehler beim Laden der CSV-Daten:", error));
