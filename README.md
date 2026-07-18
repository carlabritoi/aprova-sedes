# Aprova SEDES

Plataforma web responsiva para preparação do concurso SEDES/DF, Edital nº 1/2026, com foco inicial nos cargos 202 (TDAS — Técnico Administrativo) e 405 (EDAS — Educador Social).

## O que já funciona

- landing page responsiva, clara e acessível;
- cadastro e login com senha derivada por `scrypt` no servidor local;
- onboarding por cargo, disponibilidade e dificuldade;
- dashboard, metas, sequência, tarefas e progresso persistente;
- plano diário e revisão espaçada em 24h, 7, 30 e 90 dias;
- banco de questões com explicação, referência, confiança e sinalização administrativa;
- simulado de 60 questões e 4 horas conforme o edital vigente;
- pontuação oficial do treino completo: 20 questões gerais × 1 ponto e 40 específicas × 2 pontos;
- resultado com nota, acertos, erros, brancos, tempo e desempenho por disciplina;
- caderno de erros, flashcards, lei seca, resumos e treino discursivo;
- gráficos, mapa de domínio, assistente contextual e painel administrativo;
- tema claro/escuro e adaptação para computador, tablet e celular;
- exportação dos dados do usuário em JSON.

## Executar

No Windows, clique com o botão direito em `start.ps1` e escolha **Executar com PowerShell**, ou execute:

```powershell
.\start.ps1
```

Depois abra [http://localhost:4173](http://localhost:4173). A opção **Explorar com dados demonstrativos** permite testar toda a jornada sem criar uma conta.

O arquivo `start.ps1` procura o Node.js instalado no computador e também reconhece o runtime fornecido pelo Codex.

## Estrutura

```text
public/
  index.html       Página base e metadados públicos
  styles.css       Design system e responsividade
  data.js          Cargos, disciplinas e banco inicial de treino
  app.js           Rotas, telas e interações da aplicação
database/
  schema.sql       Modelo PostgreSQL completo para produção
server.mjs         Servidor, autenticação e API local
start.ps1          Inicialização no Windows
```

## Fontes oficiais conferidas

- [Página oficial do concurso no Instituto Quadrix](https://quadrix.org.br/informacoes/3056/)
- [Edital nº 1/2026 atualizado após as retificações](https://anexos-r2.selecao.net.br/uploads/861/concursos/3056/anexos/b852c323-8771-4021-bbbd-8032e88e58e0.pdf)

A conferência realizada em 16/07/2026 identificou prova objetiva de múltipla escolha com cinco alternativas, 60 questões, 100 pontos e duração conjunta de 4 horas com a discursiva. O sistema mantém aviso para conferir normas em fontes oficiais antes da publicação definitiva de questões.

## Produção e endereço público

O frontend está pronto para hospedagem, mas uma publicação pública com contas reais exige conectar:

1. PostgreSQL ou Supabase usando `database/schema.sql`;
2. autenticação Google e confirmação/recuperação por e-mail;
3. armazenamento de arquivos e backups;
4. provedor de IA no servidor, com fila e validação antes da publicação;
5. monitor de atualização do edital e da legislação;
6. provedor de hospedagem que ofereça HTTPS e endereço gratuito.

O servidor local usa um arquivo JSON apenas para tornar a demonstração executável sem serviços pagos. Ele não deve ser utilizado como banco de produção.

## Regras para IA em produção

O pipeline deve executar geração, checagem de aderência ao edital, verificação de gabarito, validação de referência, detecção de ambiguidade e revisão humana quando a confiança ficar abaixo do limite. Chaves da IA nunca devem ser expostas no navegador.

## Aviso

Projeto educacional independente, sem vínculo oficial com a SEDES/DF ou o Instituto Quadrix. A plataforma oferece preparação estratégica e não promete aprovação.

