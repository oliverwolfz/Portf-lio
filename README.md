# Portfólio Tecnológico Animado

Um portfólio web moderno e interativo desenvolvido com HTML5, CSS3 e JavaScript vanilla, focado em tecnologia com design futurista e animações avançadas.

## Características Principais

O portfólio apresenta um design tecnológico sofisticado com fundo animado de partículas conectadas, esquema de cores preto e azul escuro, e múltiplas seções organizadas para demonstrar expertise profissional de forma impactante.

### Funcionalidades Implementadas

**Sistema de Partículas Animadas**: Fundo dinâmico com partículas conectadas por linhas, criando um ambiente tecnológico imersivo com cores neon azul e roxo que respondem à interação do mouse.

**Animações Avançadas**: Efeitos de digitação em tempo real, animações de scroll reveal, transições suaves entre seções, micro-interações em elementos hover, e sistema de loading com barra de progresso animada.

**Seções Organizadas**: Hero section com apresentação dinâmica, seção sobre com timeline de carreira e estatísticas animadas, conhecimentos com barras de progresso e grid de tecnologias, portfólio com sistema de filtros funcionais, certificados com cards interativos, e formulário de contato com validação.

**Interatividade Completa**: Navegação suave entre seções com indicadores visuais, filtros de portfólio por categoria, formulário de contato com validação em tempo real, modal para detalhes de projetos, e easter egg com código Konami.

**Design Responsivo**: Layout adaptativo para desktop, tablet e mobile, tipografia escalável com fontes Inter e JetBrains Mono, e otimização de performance para diferentes dispositivos.

## Estrutura de Arquivos

```
tech-portfolio/
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos CSS com animações
├── script.js           # Funcionalidades JavaScript
├── README.md           # Documentação do projeto
└── test_report.md      # Relatório de testes
```

## Tecnologias Utilizadas

**Frontend**: HTML5 semântico, CSS3 com Grid e Flexbox, JavaScript ES6+ vanilla, Font Awesome para ícones, e Google Fonts (Inter + JetBrains Mono).

**Recursos Avançados**: Canvas API para sistema de partículas, Intersection Observer para animações de scroll, CSS Custom Properties para temas, e animações CSS3 com keyframes.

## Como Executar

Para visualizar o portfólio localmente, navegue até o diretório do projeto e inicie um servidor HTTP simples:

```bash
cd tech-portfolio
python3 -m http.server 8080
```

Em seguida, acesse `http://localhost:8080` no seu navegador.

Alternativamente, você pode abrir o arquivo `index.html` diretamente no navegador, embora algumas funcionalidades possam ter limitações devido às políticas de CORS.

## Personalização

### Cores e Temas

As cores principais estão definidas como variáveis CSS no arquivo `styles.css`. Para personalizar o esquema de cores, modifique as variáveis no início do arquivo:

```css
:root {
  --primary-black: #0a0a0a;
  --dark-blue: #1a1a2e;
  --neon-blue: #00d4ff;
  /* ... outras variáveis */
}
```

### Conteúdo

Para personalizar o conteúdo do portfólio, edite as seções correspondentes no arquivo `index.html`. Os dados dos projetos e certificados estão organizados de forma estruturada para facilitar a manutenção.

### Animações

As configurações das animações podem ser ajustadas no arquivo `script.js`, incluindo velocidade de digitação, quantidade de partículas, e timing das transições.

## Funcionalidades Especiais

**Easter Egg**: Digite a sequência do código Konami (↑↑↓↓←→←→BA) para ativar um efeito especial nas partículas.

**Performance**: O sistema inclui otimizações automáticas para dispositivos com menor poder de processamento e pausa animações quando a aba não está visível.

**Acessibilidade**: Estrutura semântica HTML5, navegação por teclado, e contraste adequado de cores para melhor acessibilidade.

## Compatibilidade

O portfólio é compatível com todos os navegadores modernos que suportam ES6+, incluindo Chrome 60+, Firefox 55+, Safari 12+, e Edge 79+.

## Licença

Este projeto foi desenvolvido como demonstração de habilidades em desenvolvimento web frontend e pode ser usado como base para portfólios pessoais ou profissionais.
