const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  // Cabeçalhos CORS
  const headers = {
    "Access-Control-Allow-Origin": "https://registrar-compras.netlify.app", // substitua pelo seu domínio
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Resposta para preflight (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const data = JSON.parse(event.body);

    // Validação de campos obrigatórios
    const { data: dt, produto, valor, parcelas } = data;
    if (!dt || !produto || valor == null || parcelas == null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Todos os campos são obrigatórios." }),
      };
    }

    // Envia para o webhook do n8n
    const response = await fetch("https://jorgegb2.app.n8n.cloud/webhook/novo-produto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: dt, produto, valor, parcelas }),
    });

    const result = await response.text();

    return {
      statusCode: 200,
      headers,
      body: result,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
