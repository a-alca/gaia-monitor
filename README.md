# Gaia Monitor

Painel ambiental moderno para monitoramento territorial e ambiental em tempo real.

## 🌍 Sobre

Gaia Monitor é uma aplicação desktop/webview moderna para monitoramento ambiental e territorial em tempo real. A aplicação oferece uma interface elegante e futurista para monitorar:

- Clima e condições meteorológicas
- Queimadas e focos de incêndio
- Qualidade do ar (AQI)
- Chuvas e precipitação
- Alertas ambientais
- Desmatamento
- Notícias ambientais
- Eventos agroflorestais
- Dados territoriais
- Monitoramento rural

## 🚀 Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **Shadcn/UI**
- **Zustand** (gerenciamento de estado)
- **Framer Motion** (animações)
- **Recharts** (gráficos)
- **Leaflet** (mapas)
- **SQLite** (persistência local)
- **Docker** (ambiente de desenvolvimento)

## 📋 Pré-requisitos

- **Node.js 20.9.0 ou superior** (importante: Next.js 16 requer Node.js >=20.9.0)
- npm ou yarn
- Docker (opcional)

### Gerenciando versões do Node.js

Se você tiver o NVM (Node Version Manager) instalado, pode usar o arquivo `.nvmrc` incluído no projeto:

```bash
nvm use
```

Ou instalar a versão requerida manualmente:

```bash
nvm install 20
nvm use 20
```

## 🔧 Instalação

### Instalação Local

1. Clone o repositório:
```bash
git clone <repository-url>
cd gaia-monitor
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Instalação com Docker

1. Construa a imagem Docker:
```bash
docker-compose build
```

2. Execute os containers:
```bash
docker-compose up
```

Para modo de desenvolvimento:
```bash
docker-compose --profile dev up
```

## 🏗️ Estrutura do Projeto

```
gaia-monitor/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/         # Página do dashboard
│   │   ├── clima/             # Página de clima
│   │   ├── queimadas/         # Página de queimadas
│   │   └── ...
│   ├── components/
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── widgets/           # Widgets do dashboard
│   │   │   ├── ClimateWidget.tsx
│   │   │   ├── WildfireWidget.tsx
│   │   │   ├── AirQualityWidget.tsx
│   │   │   ├── EventsWidget.tsx
│   │   │   ├── NewsWidget.tsx
│   │   │   └── MapWidget.tsx
│   │   ├── dashboard/         # Componentes do dashboard
│   │   └── ui/                # Componentes UI base
│   ├── stores/                # Zustand stores
│   │   ├── uiStore.ts
│   │   ├── environmentStore.ts
│   │   └── locationStore.ts
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Serviços de API
│   ├── types/                 # TypeScript types
│   └── lib/                   # Utilitários
├── public/                    # Arquivos estáticos
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🎨 Tema e Design

A aplicação utiliza um tema dark nativo com:

- Fundo preto profundo (#050505)
- Tons de verde floresta, musgo e oliva
- Cinza grafite para elementos neutros
- Detalhes em âmbar suave para destaques
- Transparências suaves e blur discreto
- Animações lentas e fluidas

## 📱 Funcionalidades

### Dashboard Principal
- Hero section com status ambiental geral
- Métricas em tempo real
- Mapa interativo com camadas múltiplas
- Widgets de clima, queimadas, qualidade do ar
- Feed de eventos e notícias

### Widgets Disponíveis
- **Widget de Clima**: Temperatura, umidade, vento, previsão
- **Widget de Queimadas**: Focos ativos, mapa térmico, regiões críticas
- **Widget de Qualidade do Ar**: AQI, partículas, classificação visual
- **Widget de Eventos**: Palestras, encontros agroflorestais, workshops
- **Widget de Notícias**: Notícias ambientais recentes com resumos
- **Widget de Mapas**: Mapa interativo com múltiplas camadas

## 🔮 Funcionalidades Futuras

- IA local para análise preditiva
- Alertas automáticos personalizados
- Scraping ambiental automatizado
- Sincronização offline
- Integração com sensores IoT
- Ingestão de APIs públicas ambientais
- Sistema de notificações push
- Relatórios automáticos exportáveis

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run type-check   # Verificação de tipos TypeScript
```

## 📝 Desenvolvimento

### Adicionando Novos Widgets

1. Crie o componente em `src/components/widgets/`
2. Siga o padrão dos widgets existentes
3. Importe e use no dashboard ou páginas específicas

### Adicionando Novas Páginas

1. Crie uma nova pasta em `src/app/`
2. Adicione um arquivo `page.tsx`
3. Atualize a navegação na Sidebar

### Gerenciamento de Estado

Use os stores do Zustand em `src/stores/`:
- `uiStore.ts`: Estado da interface
- `environmentStore.ts`: Dados ambientais
- `locationStore.ts`: Dados de localização

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- Equipe Gaia Monitor

## 🙏 Agradecimentos

- Next.js team pelo excelente framework
- Comunidade open-source pelas bibliotecas utilizadas
