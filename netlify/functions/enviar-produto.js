exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const data = JSON.parse(event.body);
    const { data: dt, produto, valor, parcelas } = data;

    if (!dt || !produto || valor == null || parcelas == null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Todos os campos são obrigatórios." }),
      };
    }

    // fetch nativo do Node 18+ (Netlify usa Node 18)
    const response = await fetch("https://jorgegb2.app.n8n.cloud/webhook/novo-produto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: dt, produto, valor: Number(valor), parcelas: Number(parcelas) })
    });

    const result = await response.text();

    return { statusCode: 200, headers, body: result };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
