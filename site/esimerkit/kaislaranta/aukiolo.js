// "Auki nyt" -tila aukioloajoista. Sama tiedosto kaikilla esimerkkisivuilla (demopohjissa yleinen).
// Lukee ajat elementistä #aukiolo (data-ma … data-su = "HH:MM-HH:MM"; puuttuva päivä = suljettu)
// ja päivittää:
//   [data-tila]    lyhyt tila, esim. "Auki nyt" / "Suljettu"; lisää luokan on-auki tai on-kiinni
//   [data-tanaan]  pitkä tila, esim. "Auki nyt, sulkeutuu klo 17" / "Suljettu, avataan huomenna klo 7.30"
//   [data-paiva="1…7"]  tämän päivän rivi saa luokan on-tanaan ja aria-current="date"
// Ilman JavaScriptiä sivulla näkyy HTML:n kiinteä viikkoaikataulu.
// Testaus: ?aika=2026-11-09T12:00 asettaa kellonajan.
(function () {
  var lahde = document.getElementById("aukiolo");
  if (!lahde) return;
  var avaimet = ["su", "ma", "ti", "ke", "to", "pe", "la"]; // Date.getDay()-järjestys
  var nimet = ["sunnuntaina", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"];

  var nyt = new Date();
  var testi = /[?&]aika=([^&]+)/.exec(location.search);
  if (testi) { var t = new Date(decodeURIComponent(testi[1])); if (!isNaN(t)) nyt = t; }

  function minuutit(hhmm) { var o = hhmm.split(":"); return +o[0] * 60 + +o[1]; }
  function klo(m) { var h = Math.floor(m / 60), min = m % 60; return h + (min ? "." + (min < 10 ? "0" : "") + min : ""); }
  function ajat(paiva) {
    var arvo = lahde.getAttribute("data-" + avaimet[paiva]);
    if (!arvo) return null;
    var o = arvo.split("-");
    return { auki: minuutit(o[0]), kiinni: minuutit(o[1]) };
  }

  var tamaPaiva = nyt.getDay();
  var hetki = nyt.getHours() * 60 + nyt.getMinutes();
  var tanaan = ajat(tamaPaiva);
  var auki = !!tanaan && hetki >= tanaan.auki && hetki < tanaan.kiinni;
  var pitka;

  if (auki) {
    pitka = "Auki nyt, sulkeutuu klo " + klo(tanaan.kiinni);
  } else if (tanaan && hetki < tanaan.auki) {
    pitka = "Suljettu, avataan tänään klo " + klo(tanaan.auki);
  } else {
    pitka = "Suljettu";
    for (var i = 1; i <= 7; i++) {
      var p = (tamaPaiva + i) % 7, a = ajat(p);
      if (a) { pitka += ", avataan " + (i === 1 ? "huomenna" : nimet[p]) + " klo " + klo(a.auki); break; }
    }
  }

  document.querySelectorAll("[data-tila]").forEach(function (el) {
    el.textContent = auki ? "Auki nyt" : "Suljettu";
    el.classList.add(auki ? "on-auki" : "on-kiinni");
  });
  document.querySelectorAll("[data-tanaan]").forEach(function (el) {
    el.textContent = pitka;
    el.classList.add(auki ? "on-auki" : "on-kiinni");
  });
  var maanantaistaAlkaen = tamaPaiva === 0 ? 7 : tamaPaiva;
  document.querySelectorAll('[data-paiva="' + maanantaistaAlkaen + '"]').forEach(function (el) {
    el.classList.add("on-tanaan");
    el.setAttribute("aria-current", "date");
  });
})();
