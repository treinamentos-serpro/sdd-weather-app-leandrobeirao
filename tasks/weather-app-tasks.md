# Backlog de Tarefas — Weather App

Este documento transforma o plano técnico em tarefas pequenas, dependentes e verificáveis para implementação incremental da v1. Cada tarefa concentra uma responsabilidade e, quando possível, limita-se a um ou dois arquivos relevantes.

## Matriz de rastreabilidade funcional

A tabela liga cada requisito funcional da spec às tarefas que implementam o
comportamento e às tarefas que o validam. A análise atual não identifica
requisito funcional sem tarefa correspondente.

| Requisito | Implementação | Validação | Cobertura |
| --- | --- | --- | --- |
| RF1 — Buscar cidade por nome | T-07, T-09, T-11, T-16 | T-19, T-22, T-24 | Completa |
| RF2 — Desambiguar resultados | T-07, T-09, T-10, T-13, T-16 | T-19, T-21, T-23, T-24 | Completa |
| RF3 — Exibir clima atual | T-01, T-08, T-10, T-14, T-16 | T-20, T-21, T-23, T-24 | Completa |
| RF4 — Exibir previsão de cinco dias | T-01, T-04, T-05, T-08, T-10, T-14 | T-18, T-20, T-23, T-24, T-27 | Completa |
| RF5 — Alternar unidade de temperatura | T-01, T-04, T-10, T-14, T-15, T-16 | T-21, T-23, T-24, T-27, T-28 | Completa |
| RF6 — Indicar estado de carregamento | T-06, T-09, T-10, T-12, T-16 | T-19, T-21, T-22, T-25 | Completa |
| RF7 — Tratar estado vazio | T-09, T-12, T-16 | T-21, T-22, T-25 | Completa |
| RF8 — Tratar erro e indisponibilidade | T-02, T-05, T-06, T-07, T-08, T-09, T-10, T-12, T-16 | T-18, T-19, T-20, T-21, T-22, T-25 | Completa |
| RF9 — Validar entrada da busca | T-03, T-09, T-11, T-16 | T-17, T-22, T-25 | Completa |
| RF10 — Controlar consultas concorrentes | T-09, T-10, T-16 | T-21, T-25 | Completa |

**Lacunas encontradas:** nenhuma. Os requisitos não funcionais, como
responsividade, acessibilidade, desempenho e compatibilidade, permanecem
cobertos pelos critérios de aceite das tarefas de UI, E2E e hardening, mas não
foram misturados nesta matriz de requisitos funcionais.

## Priorização e tamanho

`P0` representa o caminho mínimo necessário para entregar uma experiência
funcional e publicável. `P1` representa cobertura de qualidade, falhas e
regressão que deve acompanhar a v1. `P2` fica reservado para melhorias adiáveis;
nenhuma tarefa atual foi classificada como P2 porque todas fazem parte do
escopo obrigatório da v1.

Tamanho relativo: `P` é pequeno (até meio dia), `M` é médio (até dois dias) e
`G` é grande (mais de dois dias ou envolve várias camadas/testes).

| Tarefa | Prioridade | Tamanho | Motivo resumido |
| --- | --- | --- | --- |
| T-01 | P0 | P | Contratos necessários para todo o fluxo. |
| T-02 | P0 | P | Erros e payloads necessários para integração segura. |
| T-03 | P0 | P | Bloqueia consultas inválidas antes da rede. |
| T-04 | P0 | M | Regras de unidade e códigos WMO reutilizadas na previsão/UI. |
| T-05 | P0 | M | Normalização central da previsão e dados parciais. |
| T-06 | P0 | M | Timeout, abortamento e classificação comuns aos services. |
| T-07 | P0 | M | Primeiro acesso funcional ao geocoding. |
| T-08 | P0 | M | Acesso e parsing do forecast. |
| T-09 | P0 | M | Orquestra a busca, loading, vazio e concorrência. |
| T-10 | P0 | G | Coordena seleção, forecast, retry e unidade. |
| T-11 | P0 | P | Entrada mínima para iniciar a busca. |
| T-12 | P0 | P | Feedback de loading, vazio e erro. |
| T-13 | P0 | M | Confirmação explícita da localidade. |
| T-14 | P0 | M | Exibição do valor principal da aplicação. |
| T-15 | P0 | P | Controle de unidade visível e acessível. |
| T-16 | P0 | G | Integra todas as camadas em `App`. |
| T-29 | P0 | P | Assets locais eliminam dependência externa para imagens climáticas. |
| T-30 | P0 | P | Mapeamento WMO visual puro mantém UI e domínio consistentes. |
| T-31 | P0 | P | Componente de imagem garante acessibilidade e layout estável. |
| T-32 | P0 | M | Aplicação dos cartões, divisores e hierarquia na experiência visível. |
| T-17 | P1 | P | Regressão da validação de entrada. |
| T-18 | P1 | M | Casos de timezone e previsão parcial. |
| T-19 | P1 | M | Cobertura de rede, timeout e geocoding com mocks. |
| T-20 | P1 | M | Cobertura do parsing e falhas do forecast. |
| T-21 | P1 | G | Concorrência, retry e transições do hook. |
| T-22 | P1 | M | Estados e acessibilidade dos componentes de entrada/status. |
| T-23 | P1 | M | Seleção e renderização da previsão. |
| T-27 | P1 | P | Conversões, arredondamento e códigos WMO. |
| T-28 | P1 | P | Interação acessível do controle de unidade. |
| T-33 | P1 | M | Regressão de assets, acessibilidade visual e screenshots responsivos. |
| T-24 | P1 | M | Fluxo principal integrado em navegador e mobile. |
| T-25 | P1 | M | Recuperação de vazio, erro, retry e concorrência no navegador. |
| T-26 | P0 | G | Gate final de lint, build, testes e release. |

## Entrega 1 — Tipos e contratos

### T-01 — Definir tipos de domínio
- ID: T-01
- Título: Definir tipos públicos do domínio meteorológico
- Descrição curta: Criar os contratos compartilhados para cidade, clima atual, previsão, unidade e dados meteorológicos.
- Critérios de aceite:
  - `src/types/weather.ts` expõe `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit`.
  - Os contratos não expõem payloads brutos da API.
  - Temperaturas são representadas canonicamente em Celsius.
- Dependências: Nenhuma
- Arquivos prováveis: `src/types/weather.ts`
- Tipo: Data
- Rastreabilidade: RF3, RF4, RF5 e contrato mínimo de dados.

### T-02 — Definir tipos de erro e API
- ID: T-02
- Título: Definir contratos de erro e payload externo
- Descrição curta: Centralizar códigos de erro da aplicação e os tipos mínimos necessários para interpretar respostas do Open-Meteo.
- Critérios de aceite:
  - `AppError` e `AppErrorCode` cobrem input inválido, vazio, timeout, limite, indisponibilidade e resposta inválida.
  - Os tipos externos ficam separados dos tipos de domínio.
  - Os contratos permitem representar campos diários ausentes sem usar `any`.
- Dependências: T-01
- Arquivos prováveis: `src/types/weather.ts`, `src/types/api.ts`
- Tipo: Data
- Rastreabilidade: RF8 e regras de integração/contrato mínimo de dados.

## Entrega 2 — Funções puras

### T-03 — Validar entrada da busca
- ID: T-03
- Título: Implementar validação de consulta de cidade
- Descrição curta: Criar função pura para rejeitar consultas vazias, somente com espaços ou acima de 100 caracteres.
- Critérios de aceite:
  - A função preserva acentos, hífens e apóstrofos válidos.
  - Retorna `invalid-input` para entrada vazia ou composta somente por espaços.
  - Retorna `too-long` para entrada com 101 ou mais caracteres.
  - Para entrada válida, retorna o texto normalizado sem espaços laterais e sem remover acentos, hífens ou apóstrofos.
  - Não executa efeitos colaterais nem acessa a API.
- Dependências: T-02
- Arquivos prováveis: `src/utils/validation.ts`
- Tipo: Data
- Rastreabilidade: RF9.

### T-04 — Implementar conversão e códigos meteorológicos
- ID: T-04
- Título: Criar utilitários de apresentação meteorológica
- Descrição curta: Implementar conversão Celsius/Fahrenheit e tradução dos códigos WMO para pt-BR.
- Critérios de aceite:
  - A conversão aplica as fórmulas da spec e arredonda para inteiro apenas no resultado apresentado, incluindo valores negativos e decimais.
  - Todos os agrupamentos WMO definidos na especificação retornam a descrição pt-BR correspondente.
  - Código desconhecido retorna exatamente `Condição indisponível` sem lançar erro.
- Dependências: T-01
- Arquivos prováveis: `src/utils/temperature.ts`, `src/utils/weatherCodes.ts`
- Tipo: Data
- Rastreabilidade: RF4, RF5 e contrato mínimo de códigos WMO.

### T-05 — Normalizar previsão diária
- ID: T-05
- Título: Associar datas e campos da previsão
- Descrição curta: Criar função pura para limitar a previsão a cinco períodos, aplicar o timezone recebido e marcar dados incompletos.
- Critérios de aceite:
  - A saída sempre contém exatamente cinco posições, correspondentes a hoje e aos quatro dias seguintes quando disponíveis.
  - Períodos ausentes e campos ausentes preenchem `missingFields` e `available` sem apagar os demais dados válidos.
  - Arrays diários ausentes, não-array ou incompatíveis entre si geram erro classificável como `invalid-response`.
  - A identificação de hoje usa o timezone da localidade, e não o timezone do navegador.
- Dependências: T-01, T-04
- Arquivos prováveis: `src/utils/forecast.ts`, `src/utils/dates.ts`
- Tipo: Data
- Rastreabilidade: RF4, RF8 e contrato mínimo de dados da previsão.

## Entrega 3 — Services

### T-06 — Implementar wrapper HTTP
- ID: T-06
- Título: Criar cliente HTTP com timeout e classificação
- Descrição curta: Encapsular `fetch`, timeout de 8 segundos, abortamento e classificação de falhas HTTP/rede.
- Critérios de aceite:
  - Uma requisição que não termina em 8 segundos é abortada e produz `timeout` com a mensagem definida na spec.
  - HTTP 429 produz `rate-limit`; HTTP 5xx e falha de rede produzem `service-unavailable`.
  - Abortamento externo é propagado sem ser convertido em erro visível de uma operação substituída.
  - O wrapper aceita `AbortSignal`, não acessa React e não expõe resposta HTTP bruta ao domínio.
- Dependências: T-02
- Arquivos prováveis: `src/services/http.ts`
- Tipo: Data
- Rastreabilidade: RF6, RF8 e regras de integração de timeout/classificação HTTP.

### T-07 — Implementar serviço de geocoding
- ID: T-07
- Título: Buscar e normalizar localidades
- Descrição curta: Consultar o endpoint de geocoding e converter seus resultados em `City`.
- Critérios de aceite:
  - A URL contém exatamente `name`, `count=10`, `language=pt` e `format=json`.
  - Cada `City` retornada possui nome, latitude, longitude e timezone; metadados de região e país são preservados quando presentes.
  - `results: []` retorna coleção vazia sem lançar erro de serviço.
  - Payload ausente ou incompatível é rejeitado antes de ser exposto ao hook.
- Dependências: T-03, T-06
- Arquivos prováveis: `src/services/geocodingService.ts`
- Tipo: Data
- Rastreabilidade: RF1, RF2, RF8 e regras de integração do geocoding.

### T-08 — Implementar serviço de previsão
- ID: T-08
- Título: Buscar e normalizar previsão meteorológica
- Descrição curta: Consultar o endpoint de forecast para uma cidade e entregar `WeatherData` validado.
- Critérios de aceite:
  - A URL contém latitude, longitude, `current=temperature_2m,weather_code`, `daily=temperature_2m_min,temperature_2m_max,weather_code`, `forecast_days=5` e `timezone=auto`.
  - Ausência de temperatura/código atuais ou da estrutura diária associável gera `invalid-response`.
  - A resposta válida produz cinco posições e dados diários parcialmente ausentes ficam marcados como indisponíveis.
  - A cidade selecionada e as temperaturas canônicas em Celsius são preservadas no `WeatherData`.
- Dependências: T-04, T-05, T-06
- Arquivos prováveis: `src/services/forecastService.ts`
- Tipo: Data
- Rastreabilidade: RF3, RF4, RF8 e regras de integração do forecast.

## Entrega 4 — Hook de orquestração

### T-09 — Orquestrar busca de localidades
- ID: T-09
- Título: Controlar estado e concorrência do geocoding
- Descrição curta: Adicionar ao hook o fluxo de validar consulta, cancelar busca anterior e expor resultados ou estado vazio.
- Critérios de aceite:
  - Consulta vazia, composta somente por espaços ou acima de 100 caracteres não chama o serviço e expõe a mensagem/código de validação correspondente.
  - Uma busca válida entra em `loading` antes da chamada e termina em `empty`, `error` ou estado de resultados de localização conforme o retorno.
  - Nova busca aborta a anterior e uma resposta tardia da anterior não altera o estado atual.
  - O estado distingue `idle`, `loading`, `empty` e `error`, sem apresentar previsão antiga durante nova tentativa.
- Dependências: T-03, T-07
- Arquivos prováveis: `src/hooks/useWeatherApp.ts`
- Tipo: Data
- Rastreabilidade: RF1, RF6, RF7, RF8, RF9 e RF10.

### T-10 — Orquestrar seleção e previsão
- ID: T-10
- Título: Controlar seleção, previsão, retry e unidade
- Descrição curta: Completar o hook com seleção explícita de cidade, consulta meteorológica, retry e alternância local de unidade.
- Critérios de aceite:
  - A previsão não é consultada antes da confirmação explícita de uma cidade, inclusive quando há apenas um resultado.
  - A seleção inicia `loading` de forecast e o sucesso exibe a cidade selecionada e cinco posições de previsão.
  - Retry repete a última busca ou forecast com os mesmos parâmetros, sem recarregar a página e sem manter dados antigos como resultado atual.
  - A unidade começa em Celsius, alterna para Fahrenheit e volta sem executar nova chamada de serviço.
  - Resposta tardia de forecast não substitui o resultado da operação mais recente.
- Dependências: T-08, T-09
- Arquivos prováveis: `src/hooks/useWeatherApp.ts`
- Tipo: Data
- Rastreabilidade: RF2, RF3, RF4, RF5, RF6, RF8 e RF10.

## Entrega 5 — Componentes de UI

### T-11 — Criar formulário de busca
- ID: T-11
- Título: Implementar `SearchForm`
- Descrição curta: Criar o formulário acessível de consulta de cidade, controlado por props e callbacks.
- Critérios de aceite:
  - Campo e botão têm labels acessíveis.
  - Submit envia o valor ao callback e permite teclado.
  - O componente não conhece serviços ou regras de parsing.
- Dependências: T-03, T-10
- Arquivos prováveis: `src/components/SearchForm.tsx`
- Tipo: UI
- Rastreabilidade: RF1, RF6 e RF9.

### T-12 — Criar mensagens de estado
- ID: T-12
- Título: Implementar `StatusMessage`
- Descrição curta: Renderizar loading, vazio, erro e ação de retry de forma acessível.
- Critérios de aceite:
  - Exibe exatamente as mensagens mínimas da spec para entrada inválida, vazio, timeout, falha/resposta inválida e limite/indisponibilidade.
  - Loading, vazio e erro usam regiões/roles acessíveis e o estado de loading é anunciado.
  - Exibe “Tentar novamente” apenas quando a operação registrada é retryable e emite retry por callback.
  - Não executa fetch nem contém regras de classificação de erro.
- Dependências: T-02, T-10
- Arquivos prováveis: `src/components/StatusMessage.tsx`
- Tipo: UI
- Rastreabilidade: RF6, RF7 e RF8.

### T-13 — Criar resultados de localização
- ID: T-13
- Título: Implementar `LocationResults`
- Descrição curta: Exibir localidades retornadas e permitir seleção explícita pelo usuário.
- Critérios de aceite:
  - Cada opção apresenta nome e, quando disponíveis, região/estado e país.
  - Clique e teclado selecionam uma cidade, e nenhuma seleção automática ocorre enquanto o usuário não confirmar.
  - A seleção emite exatamente a `City` correspondente ao item escolhido.
  - O componente recebe `City[]` normalizado e não faz fetch.
- Dependências: T-01, T-09, T-10
- Arquivos prováveis: `src/components/LocationResults.tsx`
- Tipo: UI
- Rastreabilidade: RF2 e regra de confirmação explícita.

### T-14 — Criar painel meteorológico
- ID: T-14
- Título: Implementar `WeatherPanel`
- Descrição curta: Exibir clima atual e cinco períodos de previsão, incluindo indisponibilidades parciais.
- Critérios de aceite:
  - Temperatura atual e condição meteorológica são exibidas com a unidade recebida.
  - A tela renderiza sempre cinco períodos, com data, mínima, máxima e condição quando disponíveis.
  - Períodos ou campos ausentes são identificados como indisponíveis sem ocultar períodos válidos.
  - O componente usa dados normalizados e não acessa payloads ou URLs da API.
- Dependências: T-01, T-04, T-05, T-10
- Arquivos prováveis: `src/components/WeatherPanel.tsx`
- Tipo: UI
- Rastreabilidade: RF3, RF4 e RF5.

### T-15 — Criar controle de unidade
- ID: T-15
- Título: Implementar `UnitToggle`
- Descrição curta: Criar controle acessível para alternar entre Celsius e Fahrenheit.
- Critérios de aceite:
  - As opções expõem seleção por `aria-pressed` ou semântica equivalente.
  - O callback recebe a unidade escolhida.
  - A troca não contém chamada de rede.
- Dependências: T-01, T-10
- Arquivos prováveis: `src/components/UnitToggle.tsx`
- Tipo: UI
- Rastreabilidade: RF5.

## Entrega 6 — Integração da aplicação

### T-16 — Compor a aplicação
- ID: T-16
- Título: Integrar hook e componentes em `App`
- Descrição curta: Montar o fluxo visual completo com formulário, resultados, painel, unidade e mensagens de estado.
- Critérios de aceite:
  - `App.tsx` apenas conecta props, callbacks e estados do hook, sem `fetch`, parsing ou regras de domínio.
  - O fluxo busca → confirma/seleciona → consulta → exibe previsão funciona para uma e várias localidades.
  - Loading de busca e forecast, vazio, erro com retry e sucesso têm regiões de renderização distintas.
  - Uma nova busca não mantém a previsão anterior como resultado atual enquanto carrega.
- Dependências: T-10, T-11, T-12, T-13, T-14, T-15
- Arquivos prováveis: `src/App.tsx`, `src/main.tsx`
- Tipo: Infra
- Rastreabilidade: RF1, RF2, RF3, RF4, RF5, RF6, RF7, RF8, RF9 e RF10.

## Entrega 7 — Direção visual meteorológica

### T-29 — Adicionar assets meteorológicos locais
- ID: T-29
- Título: Disponibilizar ilustrações locais para condições meteorológicas
- Descrição curta: Adicionar os assets raster locais definidos no plano, organizados por grupo WMO e com fallback de condição indisponível.
- Critérios de aceite:
  - Existem assets locais para céu limpo, parcialmente nublado, nevoeiro, garoa, chuva, neve, pancadas de chuva, pancadas de neve, tempestade e indisponibilidade.
  - Os assets não dependem de URL remota nem de dados da cidade consultada.
  - O formato e o tamanho dos arquivos são adequados à web e não introduzem dependência de build adicional.
- Dependências: Nenhuma
- Arquivos prováveis: `src/assets/weather/*.webp`, `src/assets/weather/*.png`
- Tipo: UI
- Rastreabilidade: RF3, RF4 e seção "Imagens e ícones meteorológicos" do plano.

### T-30 — Mapear WMO para visual meteorológico
- ID: T-30
- Título: Implementar `getWeatherVisual`
- Descrição curta: Criar função pura que converte um código WMO em origem e texto alternativo do asset meteorológico correspondente.
- Critérios de aceite:
  - Todos os grupos WMO definidos no plano retornam o asset local correto.
  - Código ausente ou desconhecido retorna o asset de indisponibilidade sem lançar erro.
  - O retorno é tipado por `WeatherVisual` e não depende de React, DOM ou descrição textual da condição.
- Dependências: T-04, T-29
- Arquivos prováveis: `src/utils/weatherVisuals.ts`, `src/types/weather.ts`
- Tipo: Data
- Rastreabilidade: RF3, RF4 e contrato adicional de apresentação.

### T-31 — Criar componente de visual meteorológico
- ID: T-31
- Título: Implementar `WeatherVisual`
- Descrição curta: Encapsular a renderização de imagens meteorológicas com proporção estável e comportamento acessível.
- Critérios de aceite:
  - O componente recebe código WMO e tamanho de apresentação sem duplicar regras de mapeamento.
  - A imagem declara dimensões estáveis ou usa contêiner com `aspect-ratio`, sem layout shift.
  - Imagens decorativas usam `alt=""`; imagens que forem a única representação usam alternativa descritiva.
  - O componente não realiza chamadas de rede nem altera o estado da aplicação.
- Dependências: T-29, T-30
- Arquivos prováveis: `src/components/WeatherVisual.tsx`
- Tipo: UI
- Rastreabilidade: RF3, RF4 e validação visual/acessível do plano.

### T-32 — Aplicar hierarquia, cartões e separações visuais
- ID: T-32
- Título: Estilizar superfícies, previsão e estados da aplicação
- Descrição curta: Aplicar o layout glassmorphism, divisores, cartões individuais e imagens meteorológicas aos componentes existentes.
- Critérios de aceite:
  - Busca, resultados, estados e previsão ocupam superfícies visualmente distintas, com bordas, espaçamento e foco visível.
  - `WeatherPanel` mostra resumo atual com visual de destaque e uma grade de cinco cartões em `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`.
  - Cada cartão diário apresenta data localizada, miniatura, condição e mínima/máxima rotuladas; indisponibilidades preservam posição e moldura.
  - `SearchForm`, `LocationResults`, `StatusMessage` e `UnitToggle` seguem a hierarquia e os controles definidos no plano, sem quebrar seus contratos acessíveis existentes.
  - O layout não cria rolagem horizontal em viewport `375x667` e não sobrepõe textos, controles ou imagens.
- Dependências: T-11, T-12, T-13, T-14, T-15, T-16, T-31
- Arquivos prováveis: `src/App.tsx`, `src/components/SearchForm.tsx`, `src/components/LocationResults.tsx`, `src/components/StatusMessage.tsx`, `src/components/UnitToggle.tsx`, `src/components/WeatherPanel.tsx`
- Tipo: UI
- Rastreabilidade: RF3, RF4, RF5, RF6, RF7 e RF8.

## Entrega 8 — Testes focados

### T-17 — Testar utilitários de domínio
- ID: T-17
- Título: Cobrir validação de entrada
- Descrição curta: Criar testes unitários para as funções puras de validação da consulta de cidade.
- Critérios de aceite:
  - Há casos para entrada vazia, longa e com caracteres válidos.
  - Os erros retornados têm os códigos esperados.
- Dependências: T-03
- Arquivos prováveis: `tests/unit/utils/validation.test.ts`
- Tipo: Test
- Rastreabilidade: RF9.

### T-18 — Testar normalização de previsão
- ID: T-18
- Título: Cobrir datas e dados diários incompletos
- Descrição curta: Testar associação dos arrays diários, timezone, limite de cinco dias e indisponibilidades parciais.
- Critérios de aceite:
  - Estrutura diária inválida é rejeitada.
  - Menos de cinco períodos e campos ausentes são marcados corretamente.
  - A data local da cidade é usada para identificar hoje.
- Dependências: T-05
- Arquivos prováveis: `tests/unit/utils/forecast.test.ts`, `tests/unit/utils/dates.test.ts`
- Tipo: Test
- Rastreabilidade: RF4 e RF8.

### T-19 — Testar HTTP e geocoding
- ID: T-19
- Título: Cobrir timeout, erros HTTP e busca de localidades
- Descrição curta: Testar o wrapper HTTP e o serviço de geocoding com `fetch` mockado.
- Critérios de aceite:
  - `globalThis.fetch` é substituído por mock e nenhum teste acessa a rede real.
  - Sucesso, vazio, 429, 5xx, rede e timeout são cobertos.
  - Parâmetros da URL e normalização dos resultados são verificados.
  - O mock confirma que o timeout e o `AbortSignal` são usados na requisição.
- Dependências: T-06, T-07
- Arquivos prováveis: `tests/unit/services/http.test.ts`, `tests/unit/services/geocodingService.test.ts`
- Tipo: Test
- Rastreabilidade: RF1, RF2, RF6 e RF8.

### T-20 — Testar serviço de previsão
- ID: T-20
- Título: Cobrir parsing e erros do forecast
- Descrição curta: Testar respostas válidas, estrutura inválida e dados diários parciais do serviço de previsão.
- Critérios de aceite:
  - `globalThis.fetch` é substituído por mock para respostas válidas, inválidas e parciais; nenhum teste acessa a rede real.
  - Parâmetros de coordenada, timezone e campos solicitados são verificados.
  - `current` ou estrutura diária ausente produz erro.
  - Dados parciais continuam representados conforme o contrato.
- Dependências: T-08
- Arquivos prováveis: `tests/unit/services/forecastService.test.ts`
- Tipo: Test
- Rastreabilidade: RF3, RF4 e RF8.

### T-21 — Testar hook de aplicação
- ID: T-21
- Título: Cobrir estados, retry e concorrência
- Descrição curta: Testar o hook com serviços substitutos para buscas, seleção, previsão, retry e respostas stale.
- Critérios de aceite:
  - Estados idle, loading, success, empty e error são verificados.
  - Retry repete a operação correta.
  - Resultado antigo não sobrescreve operação mais recente.
  - Mudança de unidade não chama serviço.
- Dependências: T-09, T-10
- Arquivos prováveis: `tests/unit/hooks/useWeatherApp.test.ts`
- Tipo: Test
- Rastreabilidade: RF2, RF5, RF6, RF7, RF8 e RF10.

### T-22 — Testar formulário e status
- ID: T-22
- Título: Validar interação de busca e mensagens
- Descrição curta: Testar `SearchForm` e `StatusMessage` com Testing Library, incluindo os estados loading, erro e vazio.
- Critérios de aceite:
  - `SearchForm` cobre submit por clique e teclado, labels acessíveis e bloqueio visual/funcional durante loading.
  - `StatusMessage` possui casos distintos para loading, estado vazio e erro, incluindo a mensagem e o retry aplicáveis.
  - Os testes usam roles e nomes acessíveis.
- Dependências: T-11, T-12
- Arquivos prováveis: `tests/components/SearchForm.test.tsx`, `tests/components/StatusMessage.test.tsx`
- Tipo: Test
- Rastreabilidade: RF1, RF6, RF7, RF8 e RF9.

### T-23 — Testar resultados, painel e unidade
- ID: T-23
- Título: Validar seleção e painel meteorológico
- Descrição curta: Testar seleção de cidade e renderização parcial da previsão.
- Critérios de aceite:
  - `LocationResults` seleciona uma opção por interação do usuário.
  - `WeatherPanel` renderiza atual, cinco dias e indisponibilidades.
- Dependências: T-13, T-14
- Arquivos prováveis: `tests/components/LocationResults.test.tsx`, `tests/components/WeatherPanel.test.tsx`
- Tipo: Test
- Rastreabilidade: RF2, RF3 e RF4.

### T-27 — Testar temperatura e códigos WMO
- ID: T-27
- Título: Validar conversão de unidade e descrição meteorológica
- Descrição curta: Criar testes unitários para conversão Celsius/Fahrenheit, arredondamento e tradução dos códigos WMO.
- Critérios de aceite:
  - A conversão Celsius → Fahrenheit e Fahrenheit → Celsius é verificada com zero, valores negativos, decimais e valores de referência como 0 °C = 32 °F.
  - O arredondamento ocorre no valor exibido, sem alterar o Celsius canônico nem acumular erro ao alternar unidades.
  - O teste da função pura não executa fetch nem depende de componente ou navegador.
  - Códigos conhecidos e desconhecidos são verificados.
- Dependências: T-04
- Arquivos prováveis: `tests/unit/utils/temperature.test.ts`, `tests/unit/utils/weatherCodes.test.ts`
- Tipo: Test
- Rastreabilidade: RF4, RF5 e contrato mínimo de códigos WMO.

### T-28 — Testar controle de unidade
- ID: T-28
- Título: Validar interação do `UnitToggle`
- Descrição curta: Testar seleção, semântica acessível e teclado do controle de unidade.
- Critérios de aceite:
  - `UnitToggle` expõe a opção ativa.
  - O controle responde à interação de teclado e emite a unidade selecionada.
- Dependências: T-15
- Arquivos prováveis: `tests/components/UnitToggle.test.tsx`
- Tipo: Test
- Rastreabilidade: RF5.

### T-24 — Validar fluxo E2E principal
- ID: T-24
- Título: Cobrir busca, seleção e previsão no navegador
- Descrição curta: Verificar o caminho principal da aplicação com Playwright e dados de rede controlados.
- Critérios de aceite:
  - Usuário busca, confirma/seleciona cidade e vê clima atual e cinco dias.
  - A alternância Celsius/Fahrenheit atualiza os valores sem nova requisição.
  - O fluxo é executado em viewport mobile `375x667` e em viewport desktop.
  - Na viewport mobile, os cinco períodos permanecem legíveis, os controles continuam utilizáveis e não há rolagem horizontal.
  - As respostas Open-Meteo são interceptadas com fixtures determinísticas; o teste não depende de disponibilidade externa imprevisível.
- Dependências: T-16
- Arquivos prováveis: `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`
- Tipo: Test
- Rastreabilidade: RF1, RF2, RF3, RF4 e RF5.

### T-25 — Validar falhas e recuperação no E2E
- ID: T-25
- Título: Cobrir estados vazio, erro e retry no navegador
- Descrição curta: Verificar as mensagens e ações de recuperação para consulta sem resultados, timeout e falha do serviço.
- Critérios de aceite:
  - Estado vazio exibe “Nenhuma cidade encontrada” e permite uma nova busca.
  - Timeout, rede, 429 e resposta inválida exibem a categoria/mensagem correspondente e “Tentar novamente” quando aplicável.
  - Retry recupera a busca ou forecast sem recarregar a página e sem mostrar o resultado anterior durante a tentativa.
  - Entradas vazias, acima de 100 caracteres e buscas concorrentes são cobertas com as regras da spec.
- Dependências: T-24
- Arquivos prováveis: `tests/e2e/weather-app-errors.spec.ts`
- Tipo: Test
- Rastreabilidade: RF6, RF7, RF8, RF9 e RF10.

### T-33 — Testar apresentação visual meteorológica
- ID: T-33
- Título: Cobrir assets, acessibilidade visual e responsividade
- Descrição curta: Criar testes unitários/componentes para o mapeamento visual e ampliar o E2E com screenshots dos estados principais.
- Critérios de aceite:
  - O teste unitário cobre cada grupo WMO e o fallback de `getWeatherVisual`.
  - O teste de componente verifica a imagem, dimensões estáveis e texto alternativo apropriado para uso decorativo e informativo.
  - O Playwright captura sucesso em mobile `375x667` e desktop, confirmando imagens renderizadas, cinco cartões legíveis, separações visíveis e ausência de rolagem horizontal.
  - Screenshots dos estados loading, vazio e erro confirmam que a mensagem contextual não se sobrepõe ao restante da interface.
- Dependências: T-24, T-25, T-30, T-31, T-32
- Arquivos prováveis: `tests/unit/utils/weatherVisuals.test.ts`, `tests/unit/components/WeatherVisual.test.tsx`, `tests/e2e/weather-app.spec.ts`
- Tipo: Test
- Rastreabilidade: RF3, RF4, RF6, RF7 e RF8.

## Entrega 9 — Hardening

### T-26 — Executar validação final
- ID: T-26
- Título: Validar lint, build e suíte completa
- Descrição curta: Executar as checagens finais do projeto e registrar qualquer falha remanescente.
- Critérios de aceite:
  - `pnpm lint` passa sem erros.
  - `pnpm build` gera a aplicação com sucesso.
  - `pnpm test` passa na suíte configurada.
  - `pnpm test:e2e` passa na matriz E2E configurada.
- Dependências: T-16, T-17, T-18, T-19, T-20, T-21, T-22, T-23, T-24, T-25, T-27, T-28, T-29, T-30, T-31, T-32, T-33
- Arquivos prováveis: `package.json`, `biome.json`
- Tipo: Infra
- Rastreabilidade: todos os requisitos funcionais RF1–RF10 e checklist de verificação do plano.

## Sequência de entrega em fatias verticais

As fatias abaixo atravessam as camadas necessárias para produzir um resultado
observável. A primeira pode usar fixture local enquanto os services reais ainda
estão sendo construídos; a fixture é substituída sem alterar o contrato dos
componentes.

1. **Fatia 1 — Shell navegável:** T-01, T-11, T-12, T-13, T-15 e a primeira passagem de T-16.
  - Saída visível: tela mobile com formulário, estados de loading/vazio/erro, lista de localidades e controle de unidade usando dados controlados.
  - Pronto quando: o fluxo pode ser percorrido por teclado e a estrutura visual está utilizável sem depender da API.
2. **Fatia 2 — Busca real de localidades:** T-02, T-03, T-06, T-07 e T-09, completando T-16.
  - Saída visível: usuário informa uma cidade, recebe loading, vê resultados reais do geocoding ou estado vazio e pode escolher uma localidade.
  - Pronto quando: entradas inválidas não chegam à rede e uma busca mais recente não é sobrescrita por resposta antiga.
3. **Fatia 3 — Forecast atual e cinco dias:** T-04, T-05, T-08, T-10 e T-14, completando o fluxo de T-16.
  - Saída visível: após confirmar uma cidade, a tela mostra clima atual, cinco períodos e campos parciais como indisponíveis.
  - Pronto quando: retry, timeout, unidade Celsius/Fahrenheit e timezone da localidade funcionam no fluxo principal.
4. **Fatia 4 — Interface meteorológica:** T-29, T-30, T-31 e T-32.
  - Saída visível: previsão organizada em cartões separados, com imagem local representando cada condição e estados visuais coerentes.
  - Pronto quando: a grade mantém cinco previsões legíveis, os assets têm dimensões estáveis e a navegação por teclado continua clara em mobile e desktop.
5. **Fatia 5 — Fluxos de navegador:** T-24 e T-25.
  - Saída visível: o caminho principal e a recuperação de falhas são validados em desktop e viewport mobile `375x667`.
  - Pronto quando: fixtures determinísticas cobrem busca, seleção, previsão, unidade, erro, vazio, retry e concorrência.
6. **Fatia 6 — Confiança automatizada:** T-17, T-18, T-19, T-20, T-21, T-22, T-23, T-27, T-28 e T-33.
  - Saída visível: nenhuma alteração funcional; regressões de domínio, services, hook e componentes passam a ser detectadas automaticamente.
  - Pronto quando: os testes unitários e de componentes cobrem mocks de fetch, conversão de unidade, mapeamento visual e loading/erro/vazio; screenshots validam a composição responsiva.
7. **Fatia 7 — Hardening e release:** T-26.
  - Saída visível: build publicável com validação completa.
  - Pronto quando: `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passam.

Essa sequência mantém os contratos formais entre camadas. A primeira passagem
de T-16 é deliberadamente limitada à composição visual com fixture; seu
critério completo de integração só é fechado na Fatia 3, após T-10. Assim, a
UI pode ser demonstrada cedo sem transformar a fixture em dependência de
produção.
