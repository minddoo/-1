// translation.js - Handles file upload, translation via LibreTranslate, and disease code lookup via KOICD

// Utility: fetch translation
async function translateText(text, targetLang = "en") {
  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source: "auto", target: targetLang, format: "text" })
  });
  if (!response.ok) throw new Error("Translation service error");
  const data = await response.json();
  return data.translatedText;
}

// Utility: disease code lookup using KOICD (simple GET, returns HTML)
async function lookupDiseaseCode(query) {
  const url = `https://www.koicd.kr/sch/searchTotal.do?keyword=${encodeURIComponent(query)}`;
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) throw new Error("Disease lookup error");
  const html = await response.text();
  // Very simple parsing: look for pattern like "KCD-9" code inside the html
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const resultRows = doc.querySelectorAll(".searchResult tr");
  const results = [];
  resultRows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 2) {
      const name = cells[0].textContent.trim();
      const code = cells[1].textContent.trim();
      results.push({ name, code });
    }
  });
  return results;
}

// UI handling
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-upload");
  const originalArea = document.getElementById("original-text");
  const translatedArea = document.getElementById("translated-text");
  const translateBtn = document.getElementById("translate-btn");
  const diseaseInput = document.getElementById("disease-search");
  const diseaseBtn = document.getElementById("disease-search-btn");
  const diseaseResults = document.getElementById("disease-results");

  // File upload handling
  fileInput.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    originalArea.value = text;
    translatedArea.value = "";
    diseaseResults.innerHTML = "";
  });

  // Translate button
  translateBtn.addEventListener("click", async () => {
    const text = originalArea.value;
    if (!text) return alert("Please upload a file first.");
    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";
    try {
      const translated = await translateText(text);
      translatedArea.value = translated;
    } catch (err) {
      console.error(err);
      alert("Translation failed.");
    } finally {
      translateBtn.disabled = false;
      translateBtn.textContent = "Translate";
    }
  });

  // Disease code lookup
  diseaseBtn.addEventListener("click", async () => {
    const query = diseaseInput.value.trim();
    if (!query) return alert("Enter disease name to search.");
    diseaseBtn.disabled = true;
    diseaseBtn.textContent = "Searching...";
    diseaseResults.innerHTML = "";
    try {
      const results = await lookupDiseaseCode(query);
      if (results.length === 0) {
        diseaseResults.textContent = "No results found.";
      } else {
        const ul = document.createElement("ul");
        results.forEach(r => {
          const li = document.createElement("li");
          li.textContent = `${r.name} → ${r.code}`;
          ul.appendChild(li);
        });
        diseaseResults.appendChild(ul);
      }
    } catch (err) {
      console.error(err);
      diseaseResults.textContent = "Lookup failed.";
    } finally {
      diseaseBtn.disabled = false;
      diseaseBtn.textContent = "Lookup Disease Code";
    }
  });
});
