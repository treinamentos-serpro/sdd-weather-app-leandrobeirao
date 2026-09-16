# Especificação do Produto — Weather App

## Overview

### Visão geral

O Weather App é uma aplicação web responsiva para consulta rápida de previsão
do tempo. O usuário informa uma cidade, seleciona a localidade correta quando
necessário e visualiza as condições atuais e a previsão de cinco dias,
considerando hoje e os quatro dias seguintes.

A primeira versão será voltada ao público geral, com foco em uso pessoal e
recorrente, especialmente em dispositivos móveis. A interface será oferecida
em pt-BR, usará Celsius como unidade inicial e consumirá dados públicos do
Open-Meteo, sem exigir autenticação do usuário ou chave de API.

### Objetivos

- Permitir que uma pessoa encontre o clima de uma cidade com poucos passos.
- Apresentar a condição atual de forma clara e imediatamente compreensível.
- Dar visibilidade à tendência dos próximos cinco dias.
- Permitir alternância entre Celsius e Fahrenheit sem perder o contexto da
  consulta.
- Comunicar carregamento, ausência de resultados e falhas de forma clara e
  recuperável.

### Indicadores de sucesso

- O usuário consegue localizar uma cidade e consultar sua previsão em menos de
  10 segundos em uma conexão funcional.
- O usuário cotidiano consegue entender o clima atual e a previsão de cinco
  dias em menos de 1 minuto.
- A troca de unidade atualiza consistentemente todos os valores de temperatura
  apresentados.

## Functional Requirements

### RF1 — Buscar cidade por nome

O sistema deve permitir que o usuário informe o nome completo ou parcial de uma
cidade e inicie uma busca. A busca deve aceitar entrada de texto e apresentar
resultados compatíveis com a consulta.

### RF2 — Desambiguar resultados de localização

Quando houver mais de uma localidade compatível, o sistema deve apresentar
opções distinguíveis por cidade e, quando disponíveis, estado/região e país. O
usuário deve selecionar uma opção antes da consulta meteorológica.

### RF3 — Exibir clima atual

Após uma cidade válida ser selecionada e os dados serem obtidos, o sistema deve
exibir a temperatura atual e a condição meteorológica atual. Temperatura e
condição são os únicos campos obrigatórios da tela atual; vento, umidade,
sensação térmica, pressão e precipitação não fazem parte da v1.

### RF4 — Exibir previsão de cinco dias

O sistema deve exibir a previsão de hoje e dos quatro dias seguintes. Cada dia
deve apresentar a data, a temperatura e a condição meteorológica
correspondentes, incluindo temperatura mínima e máxima. “Hoje” deve ser
determinado pelo fuso horário da localidade selecionada. A interface deve
reservar cinco períodos; se a fonte retornar menos de cinco datas, os períodos
ausentes devem ser identificados como indisponíveis.
Se faltar um campo obrigatório de apenas um período diário, somente esse campo
ou período deve ser identificado como indisponível e os demais períodos válidos
devem continuar visíveis. Se a resposta não fornecer a estrutura diária
necessária para associar datas, mínimas, máximas e condições, a resposta inteira
deve ser considerada inválida.

### RF5 — Alternar unidade de temperatura

O usuário deve poder alternar entre Celsius e Fahrenheit. A unidade inicial
deve ser Celsius, e todos os valores de temperatura visíveis devem ser
atualizados de forma consistente após a alteração. Os valores devem ser
arredondados para o número inteiro mais próximo e devem usar as fórmulas
$F = (C \times 9/5) + 32$ e $C = (F - 32) \times 5/9$.

### RF6 — Indicar estado de carregamento

Durante a busca da localidade ou dos dados meteorológicos, o sistema deve
indicar que a operação está em andamento e evitar que o usuário interprete a
interface como concluída ou travada. Uma operação idêntica em andamento não
deve ser submetida novamente. Uma nova operação com consulta diferente pode
substituir a anterior, que deve deixar de poder atualizar a interface.

### RF7 — Tratar estado vazio

Quando a busca não retornar resultados, o sistema deve apresentar uma mensagem
clara informando que nenhuma cidade foi encontrada e permitir que o usuário
faça uma nova busca.

### RF8 — Tratar erro e indisponibilidade

Em caso de falha de rede, timeout, erro da fonte de dados ou resposta inválida,
o sistema deve informar a categoria do problema em linguagem compreensível e
oferecer uma forma de tentar novamente. Uma resposta sem os campos estruturais
obrigatórios deve gerar erro; uma resposta com dados ausentes em apenas um
período diário pode ser exibida parcialmente, identificando o período ou campo
indisponível. Dados antigos não devem ser apresentados como resultado da nova
consulta sem indicação de que estão desatualizados.

As mensagens mínimas são: “Informe o nome de uma cidade” para entrada inválida;
“Nenhuma cidade encontrada” para geocoding sem resultados; “A consulta demorou
mais que o esperado” para timeout; “Não foi possível consultar o serviço” para
falha de rede ou resposta inválida; e “Serviço temporariamente indisponível”
para limite de requisições ou indisponibilidade do provedor. Todas as mensagens
de erro devem oferecer a ação “Tentar novamente” quando uma nova consulta for
possível.

### RF9 — Validar entrada da busca

O sistema deve impedir consultas vazias ou compostas somente por espaços e
orientar o usuário a informar o nome de uma cidade. Deve preservar caracteres
válidos de nomes de localidades, incluindo acentos, hífens e apóstrofos. A
entrada deve aceitar no máximo 100 caracteres; valores maiores devem ser
rejeitados com orientação ao usuário e não enviados à API.

### RF10 — Controlar consultas concorrentes

Quando uma nova busca for iniciada antes da conclusão da anterior, o sistema
deve considerar somente o resultado da busca mais recente. A resposta de uma
busca anterior não pode substituir os resultados ou a previsão associados à
consulta mais nova. Essa regra se aplica a buscas diferentes; a repetição da
mesma operação enquanto ela está em andamento deve ser impedida.

### Contrato mínimo de dados

- A busca de localidade deve usar o serviço de geocoding do Open-Meteo e
  considerar como resultado válido uma localidade com nome, latitude,
  longitude e fuso horário. Região/estado e país devem ser usados quando
  retornados.
- A previsão deve usar a localidade selecionada, suas coordenadas e seu fuso
  horário. Os dados obrigatórios são temperatura atual, condição atual, cinco
  datas diárias, temperatura mínima e máxima por data e condição por data.
- A ausência da estrutura de dados atual ou diária obrigatória invalida a
  resposta da previsão. Dentro de uma estrutura diária válida, a ausência de
  dados de um período invalida somente esse período ou campo, que deve ser
  identificado como indisponível. A ausência de região, país ou outros
  metadados de localização não invalida a resposta se a localidade puder ser
  identificada.
- O sistema deve solicitar ao Open-Meteo os códigos meteorológicos WMO e
  convertê-los para pt-BR com este agrupamento: `0` céu limpo; `1` a `3`
  parcialmente nublado; `45` e `48` nevoeiro; `51` a `57` garoa; `61` a `67`
  chuva; `71` a `77` neve; `80` a `82` pancadas de chuva; `85` e `86` pancadas
  de neve; `95`, `96` e `99` tempestade.
- Um código meteorológico fora da tabela deve ser exibido como “Condição
  indisponível” e não deve causar uma condição inventada. O código desconhecido
  não invalida a resposta se os demais campos obrigatórios estiverem válidos.

### Regras de integração

- O geocoding deve usar `https://geocoding-api.open-meteo.com/v1/search` com
  `name`, `count=10`, `language=pt` e `format=json`.
- A previsão deve usar `https://api.open-meteo.com/v1/forecast` com latitude,
  longitude, `current=temperature_2m,weather_code`,
  `daily=temperature_2m_min,temperature_2m_max,weather_code`,
  `forecast_days=5` e `timezone=auto`.
- A consulta de localidade deve retornar no máximo 10 resultados ordenados pela
  relevância informada pela fonte.
- Um único resultado deve ser apresentado para confirmação do usuário antes
  da consulta meteorológica. Com múltiplos resultados, a previsão somente pode
  ser solicitada após seleção explícita.
- Cada requisição ao serviço externo deve terminar por timeout em 8 segundos.
  A busca de cidade e a consulta meteorológica são operações distintas para
  fins de medição; o limite de 10 segundos aplica-se a cada operação iniciada
  pelo usuário, não à soma das duas operações.
- Respostas HTTP `429` devem ser tratadas como limite de requisições; respostas
  `5xx`, falhas de rede e respostas incompatíveis com o contrato devem ser
  tratadas como indisponibilidade do serviço.
- Ao tentar novamente, o sistema deve repetir a operação que falhou usando a
  consulta e a localidade já selecionadas, quando aplicável, sem recarregar a
  página. Dados da tentativa anterior não devem ser reapresentados como
  resultado da nova tentativa.

## User Stories

### US1 — Consulta rápida por cidade (RF1)

Como usuário cotidiano, quero buscar uma cidade pelo nome para consultar o
clima sem percorrer etapas desnecessárias.

### US2 — Escolha de localidade correta (RF2)

Como viajante em trânsito, quero distinguir cidades com o mesmo nome por região
e país para consultar o clima do destino correto.

### US3 — Consulta das condições atuais (RF3)

Como usuário cotidiano, quero visualizar a temperatura e a condição
meteorológica atuais para decidir como me vestir e organizar minha rotina.

### US4 — Planejamento dos próximos dias (RF4)

Como planejador de agenda, quero visualizar a previsão de cinco dias para
organizar deslocamentos, visitas e atividades.

### US5 — Preferência de unidade (RF5)

Como planejador de agenda, quero alternar entre Celsius e Fahrenheit para
interpretar as temperaturas sem fazer conversões mentalmente.

### US6 — Feedback durante a consulta (RF6)

Como viajante em trânsito, quero visualizar o estado de carregamento para saber
que minha solicitação foi recebida mesmo em uma rede móvel.

### US7 — Recuperação de problemas e busca sem resultados (RF7, RF8 e RF9)

Como usuário cotidiano, quero receber orientações claras quando minha busca for
inválida, não encontrar resultados ou falhar para corrigir a consulta e tentar
novamente.

### US8 — Resultado da busca mais recente (RF10)

Como usuário cotidiano, quero que somente o resultado da minha busca mais
recente seja exibido para consultar a cidade que solicitei por último.

## Acceptance Criteria

### Critérios da US1 e RF1 — Busca por cidade

- Dado que o usuário informa o nome completo de uma cidade, Quando inicia a
  busca, Então o sistema solicita e exibe resultados compatíveis com o texto
  informado.
- Dado que o usuário informa parte do nome de uma cidade, Quando inicia a busca,
  Então o sistema exibe os resultados compatíveis disponibilizados pela fonte de
  geocodificação.
- Dado que a busca retorna exatamente uma localidade compatível, Quando os
  resultados são processados, Então o sistema permite confirmar essa localidade
  e inicia a consulta meteorológica para ela.

### Critérios da US2 e RF2 — Desambiguação

- Dado que existem várias localidades compatíveis, Quando os resultados são
  exibidos, Então cada opção apresenta cidade e, quando disponíveis, região ou
  estado e país.
- Dado que existem várias localidades compatíveis, Quando o usuário seleciona
  uma opção, Então a previsão solicitada corresponde à localidade selecionada.
- Dado que existem várias localidades compatíveis, Quando nenhuma opção é
  selecionada, Então o sistema não exibe a previsão de uma localidade arbitrária
  como resultado definitivo.

### Critérios da US3 e RF3 — Clima atual

- Dado que uma localidade válida foi selecionada e a resposta é válida, Quando a
  consulta é concluída, Então a interface exibe a temperatura atual com sua
  unidade.
- Dado que uma localidade válida foi selecionada e a resposta é válida, Quando a
  consulta é concluída, Então a interface exibe uma descrição ou representação
  compreensível da condição meteorológica atual.
- Dado que a resposta não contém temperatura ou condição meteorológica, Quando a
  consulta é concluída, Então a interface exibe o estado de erro e não apresenta
  a resposta como previsão válida.

### Critérios da US4 e RF4 — Previsão de cinco dias

- Dado que uma consulta foi concluída com sucesso, Quando a previsão é exibida,
  Então a interface apresenta os períodos de hoje e dos quatro dias seguintes,
  identificando como indisponível qualquer data que não tenha sido retornada.
- Dado que os dados diários estão disponíveis, Quando a previsão é exibida,
  Então cada período retornado apresenta data, temperatura mínima, temperatura
  máxima e condição meteorológica.
- Dado que os dados diários estão disponíveis, Quando a previsão é exibida,
  Então cada período apresenta a data correspondente ao fuso horário da
  localidade selecionada.
- Dado que um campo obrigatório de um período diário não está disponível, Quando
  a previsão é exibida, Então o campo é identificado como indisponível e os
  demais períodos continuam visíveis.

### Critérios da US5 e RF5 — Unidade de temperatura

- Dado que o usuário acessa a aplicação sem uma unidade previamente definida,
  Quando a primeira consulta é exibida, Então todas as temperaturas são
  apresentadas em Celsius.
- Dado que a unidade atual é Celsius, Quando o usuário seleciona Fahrenheit,
  Então a temperatura atual e todas as temperaturas da previsão são convertidas
  e exibidas em Fahrenheit.
- Dado que a unidade atual é Fahrenheit, Quando o usuário seleciona Celsius,
  Então a temperatura atual e todas as temperaturas da previsão são convertidas
  e exibidas em Celsius.
- Dado que uma previsão está visível, Quando o usuário consulta qualquer valor
  de temperatura, Então o valor apresenta o símbolo ou rótulo da unidade ativa
  e não mistura escalas na mesma visualização.
- Dado que uma temperatura de referência é convertida, Quando a unidade é
  alterada, Então a conversão segue a fórmula da unidade selecionada e o valor é
  arredondado para o número inteiro mais próximo.

### Critérios da US6 e RF6 — Carregamento

- Dado que o usuário iniciou uma busca de cidade ou previsão, Quando a resposta
  ainda não foi concluída, Então a interface exibe um indicador de carregamento.
- Dado que uma busca de cidade ou previsão está em andamento, Quando o usuário
  tenta iniciar a mesma operação novamente, Então o sistema impede a submissão
  duplicada.
- Dado que uma busca está em andamento, Quando a operação termina com sucesso ou
  erro, Então o indicador de carregamento deixa de ser exibido.
- Dado que uma operação diferente está em andamento, Quando o usuário inicia uma
  nova operação, Então a operação anterior deixa de controlar o carregamento e
  não pode atualizar resultados, erros ou mensagens da interface.

### Critérios da US7 e RF7 — Estado vazio

- Dado que a fonte não encontrou localidades compatíveis, Quando a busca é
  concluída, Então a interface exibe uma mensagem informando que nenhuma cidade
  foi encontrada.
- Dado que a mensagem de nenhum resultado está visível, Quando o usuário inicia
  uma nova busca, Então o sistema permite a consulta sem exigir recarregamento
  manual da página.

### Critérios da US7 e RF8 — Erro e indisponibilidade

- Dado que ocorre timeout, falha de rede, erro da API ou resposta inválida,
  Quando a operação termina, Então a interface exibe uma mensagem de erro
  compreensível.
- Dado que a fonte não responde em até 8 segundos, Quando o timeout é atingido,
  Então a interface encerra o carregamento e exibe uma mensagem específica de
  tempo excedido com opção de nova tentativa.
- Dado que a resposta não contém temperatura ou condição meteorológica, Quando
  a operação termina, Então a interface exibe erro e não apresenta a resposta
  como previsão válida.
- Dado que a resposta contém a estrutura obrigatória, mas não contém um campo
  de um período diário, Quando a operação termina, Então a interface exibe os
  dados válidos e identifica o campo ou período como indisponível.
- Dado que uma consulta anterior possui dados válidos e a nova consulta falha,
  Quando a interface exibe o erro, Então os dados anteriores são identificados
  como desatualizados ou deixam de ser exibidos, sem serem apresentados como
  resultado da nova consulta.
- Dado que uma mensagem de erro está visível, Quando o usuário aciona a opção de
  tentar novamente, Então o sistema repete a operação que falhou, preserva a
  consulta e a localidade selecionadas quando aplicável e não reapresenta os
  dados da tentativa anterior como resultado atual.

### Critérios da US8 e RF10 — Consultas concorrentes

- Dado que uma busca anterior ainda está em andamento, Quando o usuário inicia
  uma nova busca, Então a interface passa a associar o carregamento à busca mais
  recente.
- Dado que duas buscas foram iniciadas em sequência, Quando a resposta da busca
  anterior chega depois da resposta da busca mais recente, Então o sistema
  ignora a resposta anterior e mantém os dados da busca mais recente.
- Dado que duas buscas foram iniciadas em sequência, Quando a resposta da busca
  mais recente falha, Então o sistema exibe o erro da busca mais recente e não
  substitui o estado por uma resposta antiga.

### Critérios da US7 e RF9 — Validação da entrada

- Dado que o campo de cidade está vazio, Quando o usuário tenta iniciar a busca,
  Então o sistema exibe uma orientação para informar o nome de uma cidade e não
  inicia a consulta.
- Dado que o campo de cidade contém somente espaços, Quando o usuário tenta
  iniciar a busca, Então o sistema exibe uma orientação para informar o nome de
  uma cidade e não inicia a consulta.
- Dado que o campo contém acentos, hífens ou apóstrofos válidos de um nome de
  localidade, Quando o usuário inicia a busca, Então o sistema preserva esses
  caracteres e envia a consulta sem alterar o texto de forma inválida.
- Dado que o campo contém mais de 100 caracteres, Quando o usuário tenta iniciar
  a busca, Então o sistema informa o limite e não envia a consulta à API.

### Critérios adicionais de estado

- Dado que a previsão está carregando, Quando o usuário altera a unidade,
  Então a unidade selecionada fica registrada e é aplicada a todos os valores
  assim que a previsão válida for exibida.
- Dado que o usuário recarrega a página durante uma consulta, Quando a página
  termina de carregar, Então a consulta é cancelada, a interface retorna ao
  estado inicial e a unidade volta para Celsius.

## Non-Functional Requirements

### Performance

- O campo e o controle de busca devem responder à interação do usuário sem
  bloquear a interface e devem apresentar feedback visual em até 100 ms.
- Em uma conexão de teste com pelo menos 10 Mbps e latência de até 100 ms, pelo
  menos 95% de cada conjunto de 20 buscas de cidade e de 20 buscas de previsão
  devem apresentar resultado ou erro em até 10 segundos após o início da
  operação. O cronômetro começa na submissão do formulário e termina quando o
  estado de sucesso, vazio ou erro é apresentado.
- Chamadas redundantes devem ser evitadas quando uma busca idêntica ainda está
  em andamento.

### Responsividade e compatibilidade

- A experiência deve ser mobile-first e funcionar em smartphones, tablets e
  desktops.
- Conteúdo, controles e previsão devem permanecer legíveis e utilizáveis em
  diferentes larguras de tela, sem depender de rolagem horizontal.
- A aplicação deve funcionar na versão estável disponível na data do release e
  na versão principal anterior de Chrome, Edge, Firefox e Safari, além da
  versão estável e anterior de Chrome no Android e Safari no iOS.

### Acessibilidade

- A aplicação deve atender ao nível AA da WCAG 2.2 para os fluxos de busca,
  seleção, consulta, alternância de unidade e recuperação de erro.
- Controles, campos e mensagens devem ter nomes acessíveis e relações
  semânticas compreensíveis por tecnologias assistivas.
- O fluxo completo deve ser operável por teclado, incluindo busca, seleção de
  resultado, alternância de unidade e tentativa novamente.
- Texto e controles devem manter contraste suficiente e estados de foco
  perceptíveis, atendendo aos limiares de contraste aplicáveis da WCAG 2.2 AA.
- Mensagens de carregamento, vazio e erro devem ser comunicadas de forma que
  usuários de tecnologias assistivas possam percebê-las.

### Confiabilidade e dados

- Conversões de temperatura devem ser consistentes em toda a interface.
- Campos essenciais devem ser validados antes da apresentação.
- Respostas incompletas ou inválidas devem ser tratadas de forma explícita.
- Cada requisição à fonte externa deve ser encerrada por timeout após 8 segundos;
  a interface deve sair do carregamento e exibir o estado correspondente.
- A aplicação publicada deve atingir disponibilidade mensal de 99,5%,
  medida por monitoramento externo a cada 5 minutos, excluindo manutenções
  programadas comunicadas com antecedência. Indisponibilidade do Open-Meteo
  deve ser contabilizada como erro de dependência, não como dado válido.
- A indisponibilidade da rede ou da API não deve causar uma tela inconsistente
  ou um erro não tratado para o usuário.

### Segurança e privacidade

- A aplicação deve operar em ambiente HTTPS quando publicada.
- Não deve exigir autenticação nem expor chaves ou dados sensíveis no cliente.
- A primeira versão não deve coletar ou persistir dados pessoais do usuário.

### Manutenibilidade e observabilidade

- Regras de domínio, como conversão de unidades e interpretação dos dados,
  devem permanecer claras e testáveis.
- Falhas de geocoding, previsão, timeout, rede, resposta inválida e limite de
  requisições devem ser registráveis com categoria, operação e horário, sem
  registrar dados pessoais desnecessários.
- Os registros operacionais devem ser retidos por 30 dias e devem permitir
  correlacionar uma falha entre geocoding e previsão por um identificador de
  requisição não pessoal.
- A observabilidade deve enviar registros para armazenamento centralizado e
  gerar alerta quando a taxa de erro ultrapassar 5% em uma janela de 15 minutos
  ou quando o timeout ocorrer em duas verificações consecutivas.

### Critérios de liberação

- Todos os critérios de aceite de RF1 a RF10 devem passar nos navegadores da
  matriz de compatibilidade.
- Nenhum defeito crítico de busca, seleção de localidade, exibição de previsão,
  conversão ou recuperação de erro pode permanecer aberto.
- Os fluxos principais devem passar pela verificação de teclado, leitor de tela
  e contraste exigida pela WCAG 2.2 AA.
- O teste de performance deve confirmar o limite de 95% em até 10 segundos sob
  as condições definidas nesta especificação.

## Edge Cases

- **Cidade inexistente:** quando a busca não corresponder a nenhuma localidade,
  a aplicação deve exibir uma mensagem informando que nenhuma cidade foi
  encontrada, manter o campo disponível e permitir uma nova busca.
- **Input vazio:** quando o campo estiver vazio ou contiver somente espaços, a
  aplicação deve orientar o usuário a informar o nome de uma cidade e não deve
  enviar uma requisição à API.
- **Caracteres especiais:** quando o nome contiver acentos, hífens, apóstrofos
  ou outros caracteres válidos de nomes de localidades, a aplicação deve
  preservar o texto e buscar normalmente; entradas sem correspondência devem
  seguir o estado de cidade inexistente, sem quebrar a interface.
- **Falha de API:** quando a API retornar erro, estiver indisponível ou devolver
  uma resposta sem a estrutura obrigatória, a aplicação deve exibir uma
  mensagem de erro clara, não apresentar a resposta como previsão válida e
  oferecer uma nova tentativa.
- **Timeout:** quando a API não responder dentro do tempo limite, a aplicação
  deve encerrar o carregamento, informar que a consulta demorou além do
  esperado e permitir que o usuário tente novamente.
- **Geocoding sem resultados:** quando o serviço de geocodificação não retornar
  localidades para a consulta, a aplicação deve exibir o estado vazio sem
  solicitar previsão meteorológica para uma localidade arbitrária.
- **Resposta parcial:** quando a API retornar a estrutura obrigatória, mas faltar
  um campo de um dia previsto, a aplicação deve exibir os dados válidos,
  identificar o campo ou período ausente como indisponível e não inventar
  valores.
- Nome parcial que retorna muitas cidades.
- Cidades homônimas em estados, regiões ou países diferentes.
- Usuário inicia várias buscas rapidamente.
- Usuário altera a unidade enquanto a previsão está carregando.
- Falha de rede, timeout ou indisponibilidade temporária do Open-Meteo.
- Resposta HTTP com erro ou resposta em formato inesperado.
- Resposta sem temperatura, condição ou um dos dias previstos.
- Fuso horário ou mudança de data que afete a identificação de “hoje”.
- Temperaturas negativas, zero, muito altas ou com casas decimais.
- Dispositivo com viewport estreita, orientação alterada ou zoom aumentado.
- Usuário navega por teclado ou utiliza leitor de tela.
- Usuário recarrega a página antes de uma consulta terminar.

## Assumptions

- O produto será uma aplicação web; não haverá aplicativo mobile nativo na
  primeira versão.
- O público principal é geral, com foco em consultas pessoais rápidas e
  recorrentes.
- O idioma da interface será pt-BR.
- Celsius será a unidade inicial.
- “Previsão de cinco dias” significa hoje mais os quatro dias seguintes.
- Open-Meteo será a fonte pública de geocodificação e previsão, sem chave de
  API.
- O usuário terá acesso à internet durante a consulta.
- Não haverá autenticação, conta de usuário ou persistência em servidor.
- Não haverá cache local de previsão na v1; quando a fonte estiver indisponível,
  a aplicação exibirá o estado de erro.
- Geolocalização automática não é obrigatória para a primeira versão.
- O uso principal será em smartphones, mas tablets e desktops também serão
  suportados.
- A unidade selecionada vale somente para a sessão atual e volta para Celsius
  ao iniciar uma nova sessão.
- A data será apresentada em pt-BR, com dia e mês; o rótulo “Hoje” será usado
  para o primeiro período quando ele corresponder à data local da cidade.
- A interface exibirá somente os campos definidos em RF3 e RF4; indicadores
  meteorológicos adicionais ficam fora da v1.
- Mensagens e nomes de localidades exibidos na interface serão tratados em
  pt-BR; nomes próprios retornados pela fonte podem manter sua grafia original.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Indisponibilidade ou lentidão da API externa | Média | Alto | Tratar timeout e falhas, oferecer nova tentativa e evitar chamadas redundantes. |
| Resultado incorreto por cidades homônimas | Alta | Alto | Exibir opções com região e país e exigir seleção explícita quando houver ambiguidade. |
| Inconsistência na conversão de temperatura | Baixa | Alto | Manter uma regra única de conversão e validar Celsius/Fahrenheit com testes. |
| Dados meteorológicos incompletos | Média | Alto | Validar campos essenciais, apresentar indisponibilidade explicitamente e não inventar valores. |
| Experiência ruim em dispositivos móveis | Média | Alto | Priorizar mobile-first, testar larguras e orientações variadas e garantir controles acessíveis. |
| Conexão instável durante uma consulta | Média | Médio | Exibir estados claros, permitir tentativa novamente e evitar deixar a interface em carregamento infinito. |
| Previsão interpretada com data incorreta | Média | Alto | Definir claramente hoje + quatro dias e considerar o fuso horário associado à localidade consultada. |
| Falhas não diagnosticáveis em produção | Média | Médio | Registrar erros de integração e falhas relevantes sem incluir dados pessoais desnecessários. |

## Out of Scope

- Aplicativo mobile nativo para Android ou iOS.
- Obrigatoriedade de PWA, instalação offline ou funcionamento completo sem
  conexão.
- Cache local ou remoto de previsões e uso de dados antigos durante falha da
  fonte.
- Autenticação, criação de contas e perfis de usuário.
- Histórico persistente de buscas e cidades favoritas.
- Geolocalização automática obrigatória ou solicitação automática de permissão
  de localização.
- Alertas, notificações push e avisos meteorológicos personalizados.
- Previsão horária detalhada, radar, mapas meteorológicos ou imagens de
  satélite.
- Comparação simultânea de várias cidades em uma mesma tela.
- Dados históricos, tendências climáticas de longo prazo ou climatologia.
- Indicadores adicionais como vento, umidade, sensação térmica, pressão e
  precipitação.
- Suporte a idiomas além de pt-BR na primeira versão.
- Persistência da unidade de temperatura entre sessões.
- Integração com calendário, transporte, viagens ou outros serviços externos.
- Atualização automática ou em segundo plano da previsão; uma nova previsão
  somente será obtida após uma nova busca ou tentativa explícita.
- Coleta de dados pessoais para publicidade ou perfil comportamental.
- Garantia de funcionamento quando a fonte externa estiver indisponível sem
  dados previamente armazenados.
- Backend próprio, proxy de API, painel administrativo, analytics de produto e
  operação de infraestrutura de observabilidade além dos registros necessários
  para diagnosticar as integrações da aplicação.

## Open Questions

Não há perguntas bloqueadoras para o escopo da v1. Alterações como cache
offline, novos indicadores meteorológicos, persistência da unidade,
geolocalização automática e suporte a outros idiomas devem gerar uma nova
revisão de escopo, requisitos e critérios de aceite.