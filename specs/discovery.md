# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação web de previsão do tempo com foco em rapidez, simplicidade e usabilidade em dispositivos móveis. O produto deve atender ao caso principal de uso: permitir que o usuário consulte o clima de uma cidade, entenda a condição atual e tenha visibilidade da previsão para os próximos dias.

No entanto, o briefing ainda deixa diversas decisões críticas sem definição. Isso significa que o produto pode ser construído funcionalmente, mas continuar ambíguo em termos de público, alcance, experiência e operação. O objetivo desta análise é identificar lacunas, riscos e pontos de decisão que precisam ser resolvidos antes da implementação.

## Requisitos Funcionais

- RF1 — Buscar cidade por nome: o usuário deve conseguir localizar uma cidade informando o nome ou parte do nome.
- RF2 — Exibir clima atual: a aplicação deve mostrar a temperatura atual, a condição meteorológica e indicadores relevantes, quando disponíveis.
- RF3 — Exibir previsão de 5 dias: a interface deve apresentar a previsão para os próximos 5 dias com informações de temperatura e condição climática.
- RF4 — Alternar entre Celsius e Fahrenheit: o usuário deve poder mudar a unidade de temperatura e verificar a atualização de todos os valores exibidos.
- RF5 — Estado de carregamento: a interface deve indicar que os dados estão sendo carregados.
- RF6 — Estado de erro: em caso de falha na busca ou de indisponibilidade da API, a aplicação deve informar ao usuário de forma clara.
- RF7 — Estado vazio: quando não houver resultado, a aplicação deve mostrar uma mensagem adequada em vez de uma tela inconsistente.

## Requisitos Não-Funcionais

- RNF1 — Performance: a busca e a renderização dos dados devem ser rápidas, especialmente em celular.
- RNF2 — Responsividade: a interface deve funcionar bem em diferentes tamanhos de tela e priorizar mobile-first.
- RNF3 — Acessibilidade: a aplicação deve considerar contraste adequado, navegação por teclado e uso semântico de elementos.
- RNF4 — Disponibilidade: a aplicação deve tratar falhas de rede e indisponibilidade do serviço com comportamento resiliente, mantendo mensagens claras ao usuário.
- RNF5 — Compatibilidade: a aplicação deve funcionar em navegadores modernos e em dispositivos móveis comuns.
- RNF6 — Confiabilidade de dados: a conversão de temperatura e a apresentação das previsões devem ser consistentes e confiáveis.
- RNF7 — Simplicidade de uso: o fluxo de consulta deve ser direto, com poucos passos até a informação desejada.
- RNF8 — Manutenibilidade: a estrutura deve permitir evolução futura sem comprometer clareza e organização da lógica.
- RNF9 — Segurança: a aplicação deve operar em ambiente seguro, com uso de HTTPS e sem exposição de dados sensíveis ou chaves de API.
- RNF10 — Observabilidade: o sistema deve registrar erros e falhas de integração para facilitar diagnóstico e manutenção.

## Ambiguidades e Lacunas do Briefing

### 1. Definição do público-alvo
- Pergunta em aberto: o produto é para usuários casuais, viajantes, pessoas no dia a dia ou qualquer pessoa com necessidade de consultar clima?
- Impacto de seguir sem resposta: a experiência pode ser desenhada para o público errado, com excesso ou falta de detalhes, tornando a interface pouco útil para o usuário real.

### 2. Escopo do produto
- Pergunta em aberto: a solução é uma aplicação web simples ou também deve contemplar app mobile nativo ou PWA?
- Impacto de seguir sem resposta: há risco de arquitetura, UX e testes incompatíveis com o canal de uso real esperado.

### 3. Objetivo principal do uso
- Pergunta em aberto: a aplicação deve servir para consulta rápida de hoje, planejamento de viagem ou acompanhamento de tendências climáticas por vários dias?
- Impacto de seguir sem resposta: o produto pode priorizar o tipo errado de informação e entregar uma tela pouco útil para a necessidade principal.

### 4. Busca por localização
- Pergunta em aberto: a busca aceita apenas cidade, ou também estados, países e regiões?
- Impacto de seguir sem resposta: o sistema pode frustrar usuários ao limitar o tipo de busca ou gerar resultados imprecisos.

### 5. Ambiguidade de nomes de cidades
- Pergunta em aberto: quando houver cidades com o mesmo nome em diferentes localidades, a aplicação deve exibir opções de desambiguação?
- Impacto de seguir sem resposta: pode mostrar clima da cidade errada para o usuário, causando perda de confiança e erros práticos.

### 6. Interpretação de “5 dias”
- Pergunta em aberto: esse período inclui hoje ou apenas os próximos 5 dias completos?
- Impacto de seguir sem resposta: o layout e a lógica de dados podem ficar inconsistentes, e a expectativa do usuário será atendida de forma diferente do imaginado.

### 7. Dados meteorológicos essenciais
- Pergunta em aberto: além da temperatura, o app precisa mostrar umidade, vento, sensação térmica, pressão, precipitação e outros indicadores?
- Impacto de seguir sem resposta: há risco de interface incompleta para alguns usuários ou excesso de informação para outros.

### 8. Unidade padrão inicial
- Pergunta em aberto: a aplicação deve abrir por padrão em Celsius ou Fahrenheit?
- Impacto de seguir sem resposta: a primeira impressão do usuário pode ser confusa e a experiência pode variar conforme a sessão.

### 9. Geolocalização automática
- Pergunta em aberto: a funcionalidade deve usar a localização do usuário automaticamente ou exigirá busca manual?
- Impacto de seguir sem resposta: a experiência em mobile pode ser pior do que o esperado, e a app pode parecer menos útil ou invasivo.

### 10. Fonte de dados
- Pergunta em aberto: qual API será utilizada e ela é gratuita, pública e estável?
- Impacto de seguir sem resposta: o projeto pode depender de uma fonte instável, com custos, limitações ou indisponibilidade que afetam o produto.

### 11. Tratamento de falhas e indisponibilidade
- Pergunta em aberto: o que acontecerá se a API falhar, demorar ou retornar dados incompletos?
- Impacto de seguir sem resposta: a aplicação pode quebrar visualmente ou deixar o usuário sem informação útil em casos reais de falha.

### 12. Suporte offline
- Pergunta em aberto: o app precisa usar cache ou exibir dados recentes sem internet?
- Impacto de seguir sem resposta: o produto pode falhar em contexto real de baixa conectividade, especialmente em redes móveis instáveis.

### 13. Requisitos de mobile
- Pergunta em aberto: a experiência deve ser otimizada para smartphone, tablet ou ambos?
- Impacto de seguir sem resposta: a UI pode ser inadequada para os principais dispositivos de uso e comprometer a usabilidade.

### 14. Acessibilidade
- Pergunta em aberto: o app precisa atender a critérios de acessibilidade específicos, como contraste e navegação por teclado?
- Impacto de seguir sem resposta: a interface pode excluir parte dos usuários e impactar a qualidade e a conformidade do produto.

### 15. Disponibilidade operacional
- Pergunta em aberto: qual é a disponibilidade mínima aceitável da aplicação?
- Impacto de seguir sem resposta: o time pode implementar algo funcional, mas sem critérios de resiliência e estabilidade.

### 16. Histórico e favoritos
- Pergunta em aberto: a aplicação precisa salvar buscas recentes ou cidades favoritas?
- Impacto de seguir sem resposta: pode haver falta de funcionalidade esperada por usuários recorrentes, ou excesso de escopo sem necessidade.

### 17. Internacionalização
- Pergunta em aberto: a aplicação deve ser entregue apenas em português ou também em inglês e outros idiomas?
- Impacto de seguir sem resposta: a UX e as decisões de linguagem podem ficar incoerentes, especialmente para públicos globais.

### 18. Critérios de qualidade
- Pergunta em aberto: há definição de testes de usabilidade, regressão e compatibilidade para busca, clima e conversão de unidade?
- Impacto de seguir sem resposta: o produto pode entrar em produção com bugs recorrentes e baixa confiabilidade.

### 19. Métricas de desempenho
- Pergunta em aberto: qual é o tempo máximo aceitável para carregamento inicial e busca de cidade?
- Impacto de seguir sem resposta: a aplicação pode funcionar, mas ser muito lenta para uso real em mobile.

### 20. Estratégia de segurança
- Pergunta em aberto: quais regras de segurança e privacidade são exigidas para a aplicação?
- Impacto de seguir sem resposta: o app pode expor dados indevidamente ou falhar em políticas mínimas de proteção e conformidade.

## Riscos

- Dependência de API externa: o serviço de clima pode falhar ou ficar lento, afetando o produto principal.
- Busca ambígua: cidades com nomes repetidos podem gerar dados incorretos para o usuário.
- Regression de dados: conversão entre Celsius e Fahrenheit pode produzir inconsistência visual e erros conceituais.
- Experiência ruim em mobile: a aplicação pode ser pouco amigável em smartphones e tablets.
- Falhas de rede: conexão instável pode resultar em dados ausentes ou frustração no uso.
- Qualidade da informação: previsões incompletas ou pouco confiáveis podem diminuir a credibilidade do produto.

## Perguntas em Aberto

1. Quem é o público-alvo principal da aplicação?
2. O produto deve ser apenas web ou também deve ter suporte mobile nativo/PWA?
3. O objetivo principal é consulta rápida, planejamento de viagem ou acompanhamento de clima ao longo do tempo?
4. A busca deve aceitar apenas cidades ou também países, estados e regiões?
5. Como a aplicação deve lidar com cidades com nomes duplicados?
6. O período de 5 dias inclui hoje ou considera apenas os próximos 5 dias completos?
7. Quais dados meteorológicos devem ser exibidos além da temperatura?
8. Qual unidade deve ser padrão inicial: Celsius ou Fahrenheit?
9. A geolocalização automática deve ser implementada?
10. Qual será a fonte de dados da aplicação?
11. Como a aplicação deve se comportar quando a API falha ou responde incompleta?
12. O app precisa funcionar offline ou com cache local?
13. A interface deve priorizar smartphones, tablets ou ambos?
14. Quais critérios de acessibilidade devem ser atendidos?
15. Qual é a disponibilidade mínima aceitável do serviço?
16. A aplicação deve salvar histórico de buscas ou cidades favoritas?
17. A interface deve suportar vários idiomas?
18. Quais critérios de qualidade e testes devem ser atendidos antes do lançamento?
19. Quais métricas de performance são aceitáveis para carregamento e busca?
20. Quais exigências de segurança e privacidade devem ser observadas?

## Suposições

- A aplicação será usada para consulta rápida e individual, sem necessidade de login.
- O público-alvo é geral, com foco em uso pessoal e recorrente.
- O acesso será realizado em navegador moderno e com conexão à internet.
- A fonte de dados será uma API pública e sem necessidade de chave complexa.
- O produto prioriza simplicidade e usabilidade em mobile.
- A primeira versão não incluirá autenticação, geolocalização obrigatória nem histórico persistente.

## Conclusão

O briefing descreve uma aplicação funcionalmente simples, mas ainda carrega múltiplas ambiguidades críticas. Sem resolver as perguntas acima, a equipe corre o risco de desenvolver um produto que funcione tecnicamente, mas não atenda às reais necessidades dos usuários nem às expectativas de qualidade e confiabilidade do negócio.
