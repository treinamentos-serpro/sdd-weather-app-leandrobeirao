# Riscos — Weather App

| Risco | Tipo | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- | --- |
| Falha ou indisponibilidade da API de clima | Técnico | Média | Alto | Implementar tratamento de erro, fallback visual, retry limitado e mensagem clara para o usuário. Também validar a API antes de produção e considerar cache leve. |
| Limitação de rate limit / quota da API | Técnico | Média | Médio | Monitorar uso, reduzir chamadas redundantes, cache de respostas e paginação/tempo de expiração de dados. |
| Dados meteorológicos inconsistentes ou incompletos | Técnico | Média | Alto | Validar campos obrigatórios, tratar valores ausentes com estado seguro e documentar fallback para dados parciais. |
| Cidade ambígua ou sem resultado preciso | Produto | Alta | Médio | Oferecer sugestões com país/estado e permitir seleção manual quando houver múltiplos resultados. |
| Conversão incorreta entre Celsius e Fahrenheit | Técnico | Baixa | Alto | Centralizar a lógica de conversão em função pura e testar casos de borda com testes unitários. |
| Experiência frágil em dispositivos móveis | Produto | Média | Alto | Priorizar mobile-first, testar em tamanhos reais de tela e validar legibilidade, espaçamento e interações. |
| Falha de rede do usuário | Técnico | Média | Médio | Exibir estado de erro claro, permitir retry e manter a interface funcional mesmo com dados não atualizados. |
| Tempo de resposta lento ou interface travada | Técnico | Média | Alto | Reduzir chamadas desnecessárias, priorizar carregamento incremental e monitorar latência em produção. |
| Busca com nomes duplicados ou pouco específicos | Produto | Alta | Médio | Usar busca com sugestões e mostrar contexto geográfico na lista de resultados. |
| Usuário não entende a informação apresentada | Produto | Média | Médio | Simplificar a UI, priorizar leitura rápida e validar com testes de usabilidade e feedback real. |

## Observações

- A combinação de risco técnico e risco de produto exige atenção simultânea à qualidade dos dados e à compreensão da experiência do usuário.
- Os riscos mais críticos são os relacionados à dependência externa de dados e à experiência em dispositivos móveis, porque afetam diretamente a utilidade do produto.
