import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Endpoint de teste
app.get("/", (req, res) => {
  res.json({ message: "API de cartórios funcionando!" });
});

// Endpoint principal
app.post("/cartorio", async (req, res) => {
  const { municipio, uf } = req.body;

  if (!municipio || !uf) {
    return res.status(400).json({ error: "Informe municipio e uf" });
  }

  try {
    // Consulta a API pública por UF
    const response = await fetch(`https://www.registral.org.br/api/serventias?uf=${uf}`);
    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao acessar a API registral.org.br" });
    }

    const data = await response.json();

    // Filtra os cartórios que atendem o município
    const cartoriosMunicipio = data.filter(c =>
      c.municipio.toLowerCase() === municipio.toLowerCase()
    );

    if (cartoriosMunicipio.length === 0) {
      return res.status(404).json({ error: "Nenhum cartório encontrado para este município" });
    }

    res.json({ cartorios: cartoriosMunicipio });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
