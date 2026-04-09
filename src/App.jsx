import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── Competências ──────────────────────────────────────────────────────────────
const COMPETENCIAS = [
  { key: "construirPlanos",    label: "Construir Planos",      full: "Habilidade em construir planos" },
  { key: "resolverDesafios",   label: "Resolver Desafios",     full: "Resolver desafios e desvios do plano" },
  { key: "alcanceResultados",  label: "Alcance de Resultados", full: "Direcionar o time para alcance de resultados/metas" },
  { key: "criarProcessos",     label: "Criar Processos",       full: "Criar processos" },
  { key: "desenvolverPessoas", label: "Desenvolver Pessoas",   full: "Desenvolver pessoas" },
  { key: "desenvolverLideres", label: "Novos Líderes",         full: "Desenvolver novos líderes" },
];

const COMO_DEVERIA_INICIAL = {
  construirPlanos: 9, resolverDesafios: 8, alcanceResultados: 9,
  criarProcessos: 10, desenvolverPessoas: 8, desenvolverLideres: 9,
};

const SENHA = "lider2024";

const round2 = (n) => Math.round(n * 100) / 100;

const FORM_VAZIO = {
  nome: "", posicao: "", nivel: "Tático",
  construirPlanos: "", resolverDesafios: "", alcanceResultados: "",
  criarProcessos: "", desenvolverPessoas: "", desenvolverLideres: "",
};

// ── Estilos base ──────────────────────────────────────────────────────────────
const card    = { backgroundColor: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,.08)", marginBottom: 24 };
const thBase  = { padding: "10px 14px", color: "#fff", fontWeight: 600, fontSize: 13, textAlign: "left" };
const tdBase  = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #f0f0f0" };
const inp     = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box", outline: "none" };
const numInp  = { ...inp, textAlign: "center", border: "1px solid #c5cae9" };
const btnPrim = { backgroundColor: "#1a237e", color: "#fff", padding: "11px 28px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 15 };

// ── Componente principal ──────────────────────────────────────────────────────
export default function App() {
  const [aba,             setAba]             = useState("formulario");
  const [colaboradores,   setColaboradores]   = useState([]);
  const [comoDeveria,     setComoDeveria]     = useState(COMO_DEVERIA_INICIAL);
  const [nextId,          setNextId]          = useState(1);
  const [tipoGrafico,     setTipoGrafico]     = useState("radar");
  const [enviado,         setEnviado]         = useState(false);
  const [senhaInput,      setSenhaInput]      = useState("");
  const [autenticado,     setAutenticado]     = useState(false);
  const [erroSenha,       setErroSenha]       = useState(false);
  const [form,            setForm]            = useState(FORM_VAZIO);
  const [erroForm,        setErroForm]        = useState("");
  const [sucessoAdd,      setSucessoAdd]      = useState("");
  const [instrucoes,      setInstrucoes]      = useState(false);

  // ── Cálculos ────────────────────────────────────────────────────────────
  const media = (key) => {
    if (!colaboradores.length) return 0;
    return round2(colaboradores.reduce((s, c) => s + (Number(c[key]) || 0), 0) / colaboradores.length);
  };
  const mediaPessoa = (c) =>
    round2(COMPETENCIAS.reduce((s, comp) => s + (Number(c[comp.key]) || 0), 0) / COMPETENCIAS.length);

  const dadosGrafico = COMPETENCIAS.map((comp) => ({
    competencia: comp.label,
    "Como é": media(comp.key),
    "Como deveria ser": Number(comoDeveria[comp.key]) || 0,
  }));

  const dadosScatter = COMPETENCIAS.map((comp) => ({
    x: media(comp.key),
    y: Number(comoDeveria[comp.key]) || 0,
    label: comp.label,
  }));

  // ── Formulário ───────────────────────────────────────────────────────────
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdicionar = () => {
    if (!form.nome.trim()) { setErroForm("Nome é obrigatório."); return; }
    for (const comp of COMPETENCIAS) {
      const v = form[comp.key];
      if (v === "" || isNaN(Number(v)) || Number(v) < 0 || Number(v) > 10) {
        setErroForm(`"${comp.full}": insira um valor entre 0 e 10.`);
        return;
      }
    }
    setErroForm("");
    const novo = { id: nextId, nome: form.nome, posicao: form.posicao, nivel: form.nivel };
    COMPETENCIAS.forEach((c) => { novo[c.key] = Number(form[c.key]); });
    setColaboradores((prev) => [...prev, novo]);
    setNextId((n) => n + 1);
    setForm(FORM_VAZIO);
    setSucessoAdd(`${form.nome} adicionado com sucesso!`);
    setTimeout(() => setSucessoAdd(""), 3000);
  };

  const remover = (id) => setColaboradores((prev) => prev.filter((c) => c.id !== id));

  // ── Enviar Resultados ────────────────────────────────────────────────────
  const handleEnviar = () => {
    if (!colaboradores.length) { setErroForm("Adicione ao menos um colaborador antes de enviar."); return; }
    setEnviado(true);
    setErroForm("");
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (senhaInput === SENHA) { setAutenticado(true); setErroSenha(false); }
    else { setErroSenha(true); setSenhaInput(""); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "#2a2a2a", color: "#fff", borderRadius: 14, padding: "20px 32px", marginBottom: 24, boxShadow: "0 4px 18px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Diagnóstico: Desenvolvimento de Liderança</h1>
            <p style={{ margin: "6px 0 0", opacity: .6, fontSize: 14 }}>Avaliação de competências — pontue de 0 a 10</p>
          </div>

          {/* Logo LEADRIX */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 32 }}>
            {/* Ícone geométrico */}
            <svg width="56" height="52" viewBox="0 0 112 104" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Forma exterior superior esquerda */}
              <polygon points="56,2 30,17 30,47 44,39 44,25 56,18" fill="white"/>
              {/* Forma exterior superior direita */}
              <polygon points="56,2 82,17 82,47 68,39 68,25 56,18" fill="white"/>
              {/* Acento verde */}
              <polygon points="44,39 56,32 56,46 44,52" fill="#4CAF50"/>
              {/* Forma inferior */}
              <polygon points="30,47 44,55 56,102 56,86 46,60 30,52" fill="white"/>
              <polygon points="82,47 68,55 56,102 56,86 66,60 82,52" fill="white"/>
            </svg>
            {/* Texto LEADRIX */}
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 5, color: "#fff", lineHeight: 1, fontFamily: "Arial, sans-serif" }}>LEADRIX</span>
            <span style={{ fontSize: 7.5, letterSpacing: 2.5, color: "rgba(255,255,255,.55)", fontWeight: 400, lineHeight: 1 }}>LIDERE SEU MERCADO COM IA</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ id: "formulario", label: "📋 Formulário" }, { id: "resultados", label: "🔒 Resultados" }].map((t) => (
              <button key={t.id} onClick={() => setAba(t.id)}
                style={{ padding: "10px 26px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                  backgroundColor: aba === t.id ? "#1a237e" : "#fff",
                  color: aba === t.id ? "#fff" : "#1a237e",
                  boxShadow: "0 2px 6px rgba(0,0,0,.1)" }}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={() => setInstrucoes(true)}
            style={{ padding: "10px 22px", borderRadius: 8, border: "2px solid #1a237e", cursor: "pointer",
              fontWeight: 700, fontSize: 14, backgroundColor: "#fff", color: "#1a237e",
              boxShadow: "0 2px 6px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: 6 }}>
            ℹ️ Instruções
          </button>
        </div>

        {/* Modal de Instruções */}
        {instrucoes && (
          <div onClick={() => setInstrucoes(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.55)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: 14, padding: "36px 40px", maxWidth: 680, width: "100%",
                boxShadow: "0 8px 40px rgba(0,0,0,.25)", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

              {/* Botão fechar */}
              <button onClick={() => setInstrucoes(false)}
                style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none",
                  fontSize: 22, cursor: "pointer", color: "#999", lineHeight: 1 }}>
                ✕
              </button>

              <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: 16, fontSize: 20, lineHeight: 1.3 }}>
                ℹ️ Instruções de Preenchimento
              </h2>

              <p style={{ color: "#444", fontSize: 14, lineHeight: 1.75, margin: "0 0 16px" }}>
                Esta é uma avaliação das capacidades de liderança dos colaboradores/líderes, com foco no contexto atual do negócio e, principalmente, nos desafios futuros — incluindo o impacto da IA e novas formas de trabalho.
              </p>

              <p style={{ color: "#444", fontSize: 14, lineHeight: 1.75, margin: "0 0 20px" }}>
                O objetivo é entender quais habilidades são realmente relevantes hoje e quais serão necessárias para sustentar o crescimento da empresa, considerando estratégia, gestão e processos.
              </p>

              <div style={{ backgroundColor: "#f8f9ff", border: "1px solid #e8eaf6", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
                <p style={{ color: "#1a237e", fontWeight: 700, fontSize: 14, margin: "0 0 14px" }}>Como preencher:</p>
                <p style={{ color: "#444", fontSize: 14, lineHeight: 1.75, margin: "0 0 12px" }}>
                  Para cada habilidade, atribua uma nota numérica, com base na performance real do colaborador.
                </p>
                <p style={{ color: "#555", fontWeight: 700, fontSize: 13, margin: "0 0 8px" }}>Considere:</p>
                <ul style={{ margin: "0 0 14px", paddingLeft: 20, color: "#444", fontSize: 14, lineHeight: 2 }}>
                  <li>Entrega atual</li>
                  <li>Consistência</li>
                  <li>Capacidade de evolução e adaptação</li>
                </ul>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#444", fontSize: 14, lineHeight: 2 }}>
                  <li>Evite avaliar apenas percepção — baseie-se em evidências do dia a dia</li>
                  <li>Diferencie níveis de maturidade (não concentre notas altas sem critério)</li>
                  <li>Leve em conta o contexto futuro: algumas habilidades podem ganhar ou perder relevância</li>
                </ul>
              </div>

              <p style={{ color: "#444", fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
                <strong>Quanto mais precisa for a nota, mais confiável será a análise</strong> gerada a partir dessa avaliação.
              </p>

              <div style={{ backgroundColor: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 10, padding: "14px 20px", marginBottom: 28 }}>
                <p style={{ color: "#2e7d32", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  📤 Ao clicar no botão <strong>Enviar Resultados</strong>, nosso time receberá as informações e retornará em breve.
                </p>
              </div>

              <button onClick={() => setInstrucoes(false)}
                style={{ ...btnPrim, width: "100%", padding: 13, fontSize: 15 }}>
                Entendido — Iniciar Avaliação
              </button>
            </div>
          </div>
        )}

        {/* ═══════ ABA FORMULÁRIO ═══════ */}
        {aba === "formulario" && (
          <>
            {/* Card do formulário */}
            <div style={card}>
              <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: 20, fontSize: 18 }}>➕ Adicionar Colaborador</h2>

              {/* Identificação */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#555", fontSize: 13 }}>Nome *</label>
                  <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do colaborador" style={inp} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#555", fontSize: 13 }}>Posição</label>
                  <input name="posicao" value={form.posicao} onChange={handleChange} placeholder="Cargo / função" style={inp} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#555", fontSize: 13 }}>Nível</label>
                  <select name="nivel" value={form.nivel} onChange={handleChange} style={inp}>
                    <option>Tático</option>
                    <option>Estratégico</option>
                    <option>Operacional</option>
                  </select>
                </div>
              </div>

              {/* Competências */}
              <div style={{ backgroundColor: "#f8f9ff", border: "1px solid #e8eaf6", borderRadius: 10, padding: 18, marginBottom: 18 }}>
                <p style={{ margin: "0 0 14px", fontWeight: 700, color: "#3949ab", fontSize: 14 }}>🎯 Pontue de 0 a 10:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  {COMPETENCIAS.map((comp) => (
                    <div key={comp.key}>
                      <label style={{ display: "block", marginBottom: 5, fontWeight: 600, color: "#555", fontSize: 12, lineHeight: 1.3 }}>{comp.full}</label>
                      <input type="number" name={comp.key} value={form[comp.key]} onChange={handleChange}
                        min="0" max="10" step="0.5" placeholder="0 – 10" style={numInp} />
                    </div>
                  ))}
                </div>
              </div>

              {erroForm && (
                <div style={{ color: "#c62828", backgroundColor: "#ffebee", border: "1px solid #ef9a9a", borderRadius: 7, padding: "9px 14px", marginBottom: 14, fontSize: 13 }}>
                  ⚠️ {erroForm}
                </div>
              )}
              {sucessoAdd && (
                <div style={{ color: "#2e7d32", backgroundColor: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 7, padding: "9px 14px", marginBottom: 14, fontSize: 13 }}>
                  ✅ {sucessoAdd}
                </div>
              )}

              <button onClick={handleAdicionar} style={btnPrim}>
                + Adicionar Colaborador
              </button>
            </div>

            {/* Tabela */}
            <div style={{ ...card, overflowX: "auto" }}>
              <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: colaboradores.length ? 16 : 8, fontSize: 18 }}>
                👥 Colaboradores adicionados ({colaboradores.length})
              </h2>

              {colaboradores.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa", fontSize: 14 }}>
                  Nenhum colaborador adicionado ainda. Use o formulário acima.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1a237e" }}>
                      <th style={thBase}>Nome</th>
                      <th style={thBase}>Posição</th>
                      <th style={{ ...thBase, textAlign: "center" }}>Nível</th>
                      {COMPETENCIAS.map((c) => (
                        <th key={c.key} style={{ ...thBase, textAlign: "center", fontSize: 11, minWidth: 76 }}>{c.label}</th>
                      ))}
                      <th style={{ ...thBase, textAlign: "center", backgroundColor: "#283593" }}>Média</th>
                      <th style={{ ...thBase, textAlign: "center" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map((c, i) => {
                      const nivelCor = c.nivel === "Estratégico"
                        ? { bg: "#e3f2fd", fg: "#1565c0" }
                        : c.nivel === "Operacional"
                          ? { bg: "#fff3e0", fg: "#e65100" }
                          : { bg: "#e8f5e9", fg: "#2e7d32" };
                      return (
                        <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdBase, fontWeight: 700 }}>{c.nome}</td>
                          <td style={{ ...tdBase, color: "#666", fontSize: 12 }}>{c.posicao || "—"}</td>
                          <td style={{ ...tdBase, textAlign: "center" }}>
                            <span style={{ backgroundColor: nivelCor.bg, color: nivelCor.fg, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                              {c.nivel}
                            </span>
                          </td>
                          {COMPETENCIAS.map((comp) => (
                            <td key={comp.key} style={{ ...tdBase, textAlign: "center" }}>{c[comp.key]}</td>
                          ))}
                          <td style={{ ...tdBase, textAlign: "center", fontWeight: 700, color: "#1a237e" }}>
                            {mediaPessoa(c)}
                          </td>
                          <td style={{ ...tdBase, textAlign: "center" }}>
                            <button onClick={() => remover(c.id)}
                              style={{ backgroundColor: "#ffebee", color: "#c62828", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Média geral */}
                    <tr style={{ backgroundColor: "#e8eaf6", fontWeight: 700 }}>
                      <td colSpan={3} style={{ ...tdBase, color: "#1a237e", fontWeight: 700 }}>MÉDIA GERAL</td>
                      {COMPETENCIAS.map((comp) => (
                        <td key={comp.key} style={{ ...tdBase, textAlign: "center", color: "#1a237e" }}>
                          {media(comp.key)}
                        </td>
                      ))}
                      <td style={{ ...tdBase, textAlign: "center", color: "#1a237e" }}>
                        {round2(COMPETENCIAS.reduce((s, c) => s + media(c.key), 0) / COMPETENCIAS.length)}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Botão Enviar Resultados */}
              <div style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  onClick={handleEnviar}
                  disabled={colaboradores.length === 0}
                  style={{
                    backgroundColor: enviado ? "#2e7d32" : "#c62828",
                    color: "#fff", padding: "12px 32px", border: "none",
                    borderRadius: 8, cursor: colaboradores.length === 0 ? "not-allowed" : "pointer",
                    fontWeight: 700, fontSize: 15, opacity: colaboradores.length === 0 ? .5 : 1,
                    boxShadow: "0 3px 10px rgba(0,0,0,.15)",
                  }}>
                  {enviado ? "✅ Resultados enviados!" : "📤 Enviar Resultados"}
                </button>
                {enviado && (
                  <span style={{ fontSize: 13, color: "#2e7d32", fontWeight: 600 }}>
                    Os resultados já estão disponíveis na aba <strong>Resultados</strong> (senha protegida).
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ═══════ ABA RESULTADOS — LOGIN ═══════ */}
        {aba === "resultados" && !autenticado && (
          <div style={{ ...card, maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
            <h2 style={{ color: "#1a237e", margin: "0 0 8px", fontSize: 22 }}>Área Restrita</h2>
            <p style={{ color: "#777", marginBottom: 28, fontSize: 14 }}>
              Digite a senha para acessar os resultados e o gráfico comparativo.
            </p>
            <input
              type="password" value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Senha"
              style={{ ...inp, marginBottom: 12, fontSize: 16, border: erroSenha ? "2px solid #c62828" : "1px solid #ddd" }} />
            {erroSenha && (
              <div style={{ color: "#c62828", fontSize: 13, marginBottom: 12 }}>Senha incorreta. Tente novamente.</div>
            )}
            <button onClick={handleLogin} style={{ ...btnPrim, width: "100%", padding: 13, fontSize: 16 }}>
              Acessar
            </button>
          </div>
        )}

        {/* ═══════ ABA RESULTADOS — CONTEÚDO ═══════ */}
        {aba === "resultados" && autenticado && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              {!enviado ? (
                <span style={{ color: "#e65100", fontWeight: 700, fontSize: 14, backgroundColor: "#fff3e0", padding: "8px 14px", borderRadius: 8 }}>
                  ⚠️ Nenhum resultado enviado ainda. Preencha o formulário e clique em "Enviar Resultados".
                </span>
              ) : (
                <span style={{ color: "#2e7d32", fontWeight: 700, fontSize: 14, backgroundColor: "#e8f5e9", padding: "8px 14px", borderRadius: 8 }}>
                  ✅ {colaboradores.length} colaborador(es) — resultados recebidos
                </span>
              )}
              <button onClick={() => { setAutenticado(false); setSenhaInput(""); }}
                style={{ backgroundColor: "#ffebee", color: "#c62828", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                🔓 Sair
              </button>
            </div>

            {!enviado ? (
              <div style={{ ...card, textAlign: "center", padding: "48px 32px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ color: "#999", fontSize: 15 }}>
                  Aguardando envio de resultados.<br />Volte à aba <strong>Formulário</strong> e clique em <strong>"Enviar Resultados"</strong>.
                </p>
              </div>
            ) : (
              <>
                {/* Tabela como é vs como deveria */}
                <div style={card}>
                  <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: 20, fontSize: 18 }}>
                    📊 Como é vs Como deveria ser
                  </h2>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ ...thBase, backgroundColor: "#1a237e", padding: "12px 16px" }}>Competência</th>
                        <th style={{ ...thBase, backgroundColor: "#283593", textAlign: "center", padding: "12px 16px" }}>
                          Como é <span style={{ fontWeight: 400, fontSize: 11 }}>(média do formulário)</span>
                        </th>
                        <th style={{ ...thBase, backgroundColor: "#b71c1c", textAlign: "center", padding: "12px 16px" }}>
                          Como deveria ser <span style={{ fontWeight: 400, fontSize: 11 }}>(editável)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPETENCIAS.map((comp, i) => (
                        <tr key={comp.key} style={{ backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdBase, fontWeight: 600 }}>{comp.full}</td>

                          {/* Como é */}
                          <td style={{ ...tdBase, textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                              <div style={{ width: 120, height: 10, backgroundColor: "#e0e0e0", borderRadius: 6, overflow: "hidden" }}>
                                <div style={{ width: `${media(comp.key) * 10}%`, height: "100%", backgroundColor: "#1a237e", borderRadius: 6 }} />
                              </div>
                              <span style={{ fontWeight: 700, color: "#1a237e", fontSize: 16, minWidth: 36 }}>{media(comp.key)}</span>
                            </div>
                          </td>

                          {/* Como deveria ser (editável) */}
                          <td style={{ ...tdBase, textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                              <div style={{ width: 120, height: 10, backgroundColor: "#ffcdd2", borderRadius: 6, overflow: "hidden" }}>
                                <div style={{ width: `${(comoDeveria[comp.key] || 0) * 10}%`, height: "100%", backgroundColor: "#c62828", borderRadius: 6 }} />
                              </div>
                              <input type="number" min="0" max="10" step="0.5"
                                value={comoDeveria[comp.key]}
                                onChange={(e) => setComoDeveria((prev) => ({ ...prev, [comp.key]: Number(e.target.value) }))}
                                style={{ width: 64, padding: "6px 8px", borderRadius: 7, border: "2px solid #c62828",
                                  textAlign: "center", fontWeight: 700, fontSize: 15, color: "#c62828", outline: "none" }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: "#f3e5f5", fontWeight: 700 }}>
                        <td style={{ ...tdBase, color: "#6a1b9a", fontWeight: 700 }}>MÉDIA GERAL</td>
                        <td style={{ ...tdBase, textAlign: "center", color: "#1a237e", fontSize: 16 }}>
                          {round2(COMPETENCIAS.reduce((s, c) => s + media(c.key), 0) / COMPETENCIAS.length)}
                        </td>
                        <td style={{ ...tdBase, textAlign: "center", color: "#c62828", fontSize: 16 }}>
                          {round2(COMPETENCIAS.reduce((s, c) => s + (Number(comoDeveria[c.key]) || 0), 0) / COMPETENCIAS.length)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Seletor de gráfico */}
                <div style={{ ...card, padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#1a237e", fontSize: 14 }}>Tipo de gráfico:</span>
                    {[
                      { id: "radar",     label: "🕸️ Radar" },
                      { id: "linhas",    label: "📈 Linhas" },
                      { id: "dispersao", label: "🔵 Dispersão" },
                    ].map((t) => (
                      <button key={t.id} onClick={() => setTipoGrafico(t.id)}
                        style={{ padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                          backgroundColor: tipoGrafico === t.id ? "#1a237e" : "#e8eaf6",
                          color: tipoGrafico === t.id ? "#fff" : "#1a237e" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gráfico */}
                <div style={card}>
                  <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                    {tipoGrafico === "radar"     && "🕸️ Radar — Comparativo de Competências"}
                    {tipoGrafico === "linhas"    && "📈 Linhas — Como é vs Como deveria ser"}
                    {tipoGrafico === "dispersao" && "🔵 Dispersão — Como é (X) vs Como deveria ser (Y)"}
                  </h2>
                  <p style={{ color: "#888", fontSize: 12, marginBottom: 20 }}>
                    {tipoGrafico === "dispersao"
                      ? "Cada ponto = uma competência. Pontos acima da diagonal = gap (deveria ser maior que o atual)."
                      : "🔵 Azul = Como é (média do formulário) • 🔴 Vermelho = Como deveria ser"}
                  </p>

                  {tipoGrafico === "radar" && (
                    <ResponsiveContainer width="100%" height={420}>
                      <RadarChart data={dadosGrafico} margin={{ top: 10, right: 60, bottom: 10, left: 60 }}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 12, fill: "#444" }} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: "#999" }} tickCount={6} />
                        <Radar name="Como deveria ser" dataKey="Como deveria ser"
                          stroke="#c62828" fill="#c62828" fillOpacity={0.15} strokeWidth={2.5} dot={{ r: 4 }} />
                        <Radar name="Como é" dataKey="Como é"
                          stroke="#1a237e" fill="#1a237e" fillOpacity={0.25} strokeWidth={2.5} dot={{ r: 4 }} />
                        <Legend wrapperStyle={{ fontSize: 13 }} />
                        <Tooltip formatter={(v) => v.toFixed(2)} />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}

                  {tipoGrafico === "linhas" && (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={dadosGrafico} margin={{ top: 10, right: 30, bottom: 70, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="competencia" tick={{ fontSize: 11, fill: "#555" }} angle={-30} textAnchor="end" height={90} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} tickCount={6} />
                        <Tooltip formatter={(v) => v.toFixed(2)} />
                        <Legend wrapperStyle={{ fontSize: 13 }} />
                        <Line type="monotone" dataKey="Como deveria ser"
                          stroke="#c62828" strokeWidth={2.5} dot={{ r: 5, fill: "#c62828" }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="Como é"
                          stroke="#1a237e" strokeWidth={2.5} strokeDasharray="6 3"
                          dot={{ r: 5, fill: "#1a237e" }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  {tipoGrafico === "dispersao" && (
                    <ResponsiveContainer width="100%" height={420}>
                      <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" dataKey="x" name="Como é" domain={[0, 10]} tickCount={6}
                          label={{ value: "Como é (média)", position: "insideBottom", offset: -12, fontSize: 13, fill: "#1a237e" }}
                          tick={{ fontSize: 11 }} />
                        <YAxis type="number" dataKey="y" name="Como deveria ser" domain={[0, 10]} tickCount={6}
                          label={{ value: "Como deveria ser", angle: -90, position: "insideLeft", offset: 14, fontSize: 13, fill: "#c62828" }}
                          tick={{ fontSize: 11 }} />
                        <ZAxis range={[90, 90]} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }}
                          content={({ payload }) => {
                            if (!payload?.length) return null;
                            const d = payload[0].payload;
                            const gap = (d.y - d.x).toFixed(2);
                            return (
                              <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                                <p style={{ margin: 0, fontWeight: 700, color: "#1a237e" }}>{d.label}</p>
                                <p style={{ margin: "4px 0 0" }}>Como é: <strong>{d.x}</strong></p>
                                <p style={{ margin: "2px 0 0", color: "#c62828" }}>Como deveria: <strong>{d.y}</strong></p>
                                <p style={{ margin: "4px 0 0", fontWeight: 700, color: gap > 0 ? "#c62828" : "#2e7d32" }}>
                                  Gap: {gap > 0 ? `+${gap}` : gap}
                                </p>
                              </div>
                            );
                          }} />
                        <Scatter data={dadosScatter} fill="#1a237e" opacity={0.85}
                          label={{ dataKey: "label", position: "top", fontSize: 10, fill: "#333", offset: 8 }} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Cards de gap */}
                <div style={card}>
                  <h2 style={{ color: "#1a237e", marginTop: 0, marginBottom: 16, fontSize: 18 }}>🎯 Resumo de Gaps</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {COMPETENCIAS.map((comp) => {
                      const comoE   = media(comp.key);
                      const deveria = Number(comoDeveria[comp.key]) || 0;
                      const gap     = round2(deveria - comoE);
                      const cor = gap > 3 ? "#c62828" : gap > 1.5 ? "#e65100" : "#2e7d32";
                      const bg  = gap > 3 ? "#ffebee" : gap > 1.5 ? "#fff3e0" : "#e8f5e9";
                      return (
                        <div key={comp.key} style={{ backgroundColor: bg, borderRadius: 10, padding: "14px 16px", borderLeft: `4px solid ${cor}` }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#333" }}>{comp.full}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13 }}>
                            <span style={{ color: "#1a237e" }}>Como é: <strong>{comoE}</strong></span>
                            <span style={{ color: "#c62828" }}>Deveria: <strong>{deveria}</strong></span>
                          </div>
                          <p style={{ margin: "6px 0 0", fontWeight: 700, color: cor, fontSize: 15 }}>
                            Gap: {gap > 0 ? `+${gap}` : gap}
                            {gap > 3 ? " 🔴" : gap > 1.5 ? " 🟡" : " 🟢"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <p style={{ textAlign: "center", color: "#bbb", fontSize: 12, marginTop: 4 }}>
          Diagnóstico de Desenvolvimento de Liderança — dados confidenciais
        </p>
      </div>
    </div>
  );
}
