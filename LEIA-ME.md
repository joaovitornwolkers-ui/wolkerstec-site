# Wolkerstec — Site para GitHub e Render

Este pacote contém o site institucional com a identidade visual da central de chamados, formulário de orçamento para envio manual e acesso à central existente.

## 1. Preparar o GitHub

1. Extraia o ZIP no computador.
2. Crie um novo repositório chamado `wolkerstec-site` no GitHub. Ele pode ser privado; permita que o Render acesse esse repositório ao conectá-lo.
3. Use **Add file > Upload files** (ou a opção de enviar arquivos da página do repositório vazio).
4. Envie o conteúdo extraído: a pasta `dist`, `render.yaml` e este guia. Envie os arquivos extraídos, e não o ZIP.
5. Confirme o envio com **Commit changes** na branch `main`.

A pasta `dist` deve aparecer diretamente na raiz do repositório. Ela contém `index.html`, `central.html`, scripts, estilos e a pasta `assets`.

## 2. Criar o site no Render

Crie um **novo Static Site** para o site da empresa. A central de chamados continua no serviço atual.

No painel do Render, escolha **New > Static Site**, conecte o novo repositório e configure:

| Campo | Valor |
| --- | --- |
| Name | `wolkerstec-site` (ou outro nome disponível) |
| Branch | `main` |
| Root Directory | Deixe em branco |
| Build Command | `true` |
| Publish Directory | `dist` |
| Environment Variables | Nenhuma necessária para este site |
| Auto-Deploy | Desativado / Off, para manter atualizações manuais |

O comando `true` termina com sucesso sem compilar: os arquivos HTML, CSS e JavaScript já estão prontos.

Quando quiser tornar o site acessível pela internet, clique **Create Static Site** ou **Deploy Static Site**, conforme a tela. Essa ação publica o site. Após a conclusão, o Render apresenta o endereço HTTPS em `onrender.com`; use exatamente o endereço mostrado no painel.

O arquivo `render.yaml` também contém as configurações para implantação por Blueprint. O caminho manual acima é suficiente.

## 3. Papel do Supabase e da central

Este site institucional não exige nova conexão com o Supabase, senhas ou variáveis de banco. A central existente continua responsável por registrar e armazenar os chamados no sistema já configurado.

A aba **Central de chamados** abre estes acessos em outra aba:

- Abrir chamado: https://wolkerstech-chamados.onrender.com/
- Acompanhar protocolo: https://wolkerstech-chamados.onrender.com/acompanhar
- Área administrativa: https://wolkerstech-chamados.onrender.com/admin/login

O formulário de orçamento permite escolher o serviço, informar os detalhes, revisar, copiar e baixar um resumo. O cliente faz o envio manual; o site não registra esse orçamento no banco e não envia mensagens automaticamente.

## 4. Conferir depois da publicação

Abra o URL entregue pelo Render em computador e celular:

1. Confira a logo, o menu e os serviços.
2. Escolha um serviço e prepare um orçamento com dados de exemplo. Revise o resumo, copie ou baixe o arquivo. Isso não envia solicitações.
3. Teste **Editar detalhes** e **Novo pedido**.
4. Abra a aba da central e confira os três acessos. Não é necessário registrar um chamado de teste para conferir os links.

Se os arquivos forem atualizados no GitHub com Auto-Deploy desativado, use **Manual Deploy > Deploy latest commit** no serviço do site quando quiser publicar a nova versão.

## Documentação

- Render: https://render.com/docs/static-sites
- Configuração de implantação: https://render.com/docs/your-first-deploy
- Referência do `render.yaml`: https://render.com/docs/blueprint-spec
- Envio de arquivos ao GitHub: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
