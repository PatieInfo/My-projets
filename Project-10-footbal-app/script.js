// ---- ADD YOUR KEY LOCALLY IN VS CODE — NEVER SHARE IT ----
const API_KEY = "932baf2fabmsh2046c615055d603p15e4f7jsnd28012d3c38b";

async function testAPI() {
  try {
    const today = new Date();
    const year  = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day   = String(today.getDate()).padStart(2, "0");
    const date  = `${year}-${month}-${day}`;

    const response = await fetch(
      `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${date}`,
      {
        headers: {
          "X-RapidAPI-Key":  API_KEY,
          "X-RapidAPI-Host": "sportapi7.p.rapidapi.com"
        }
      }
    );

    const statusCode = response.status;
    const rawText    = await response.text();

    document.body.innerHTML = `
      <div style="font-family:Arial; padding:30px; background:#1a1a2e;
      color:white; min-height:100vh">
        <h2 style="color:#f5c842">🔍 API Test Result</h2>
        <p style="margin-top:10px">Status Code:
          <strong style="color:#00ff88">${statusCode}</strong>
        </p>
        <pre style="margin-top:15px; color:#aaa; font-size:0.75em;
        white-space:pre-wrap; background:#0a0a1a; padding:20px;
        border-radius:10px; max-height:80vh; overflow-y:auto">${rawText.slice(0, 3000)}</pre>
      </div>`;

  } catch (error) {
    document.body.innerHTML = `
      <div style="font-family:Arial; padding:30px; background:#1a1a2e;
      color:white; min-height:100vh">
        <h1 style="color:#ff6b6b">❌ Error</h1>
        <p style="margin-top:15px; color:#aaa">${error.message}</p>
      </div>`;
  }
}

testAPI();