# 🏢 Sistema de Portaria

Sistema completo de controle de acesso e gestão de colaboradores desenvolvido com Nuxt 3, Vue 3 e Supabase.

## 🚀 Tecnologias

- **Frontend**: Nuxt 3.14.1592, Vue 3.5.12
- **UI**: TailwindCSS 3.4.1, HeadlessUI
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: Pinia 2.3.0
- **Charts**: Chart.js 4.4.7
- **PWA**: @vite-pwa/nuxt 0.10.5
- **Validação**: Zod 3.24.1
- **Testes**: Vitest 2.1.8

## ✨ Funcionalidades

### ✅ Autenticação e Autorização

- Login/Logout com Supabase Auth
- Recuperação de senha por e-mail
- Sistema de roles (admin, porteiro, visualizador)
- Middleware de autenticação e autorização
- Sessão persistente

### 📊 Dashboard Analítico

- Gráficos em tempo real com Chart.js
- Estatísticas de entrada/saída
- Análise por período (dia, semana, mês)
- Horários de pico
- Ranking de colaboradores mais frequentes
- Sistema de cache inteligente (TTL 5 minutos)

### 👥 Gestão de Colaboradores

- Cadastro completo de colaboradores
- Registro de múltiplas entradas/saídas por dia (até 5)
- Histórico completo de movimentações
- Busca e filtros avançados
- Validação de dados com Zod

### 📱 PWA (Progressive Web App)

- Instalável em dispositivos móveis e desktop
- Funciona offline (modo básico)
- Ícones e splash screens personalizados
- Notificações push (futuro)

### 🎨 Interface

- Design moderno e responsivo
- Modo escuro/claro
- Componentes reutilizáveis
- Animações suaves
- Acessibilidade (ARIA)

## 📁 Estrutura do Projeto

```
app/
├── components/          # Componentes Vue reutilizáveis
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   └── charts/         # Componentes de gráficos
├── composables/        # Composables Vue
│   ├── useAuth.ts
│   ├── useColaboradores.ts
│   ├── useHistorico.ts
│   ├── useAnalyticsData.ts  # Queries de analytics
│   ├── useCache.ts          # Sistema de cache
│   └── useDebounce.ts       # Utilidades de performance
├── layouts/            # Layouts do Nuxt
│   └── default.vue
├── middleware/         # Middleware de rotas
│   ├── auth.ts
│   └── guest.ts
├── pages/              # Páginas (rotas automáticas)
│   ├── index.vue
│   ├── login.vue
│   ├── novaEntrada.vue
│   └── redefinir-senha.vue
├── plugins/            # Plugins do Nuxt
│   └── auth-init.client.ts
├── stores/             # Pinia stores
│   ├── analytics.ts
│   ├── auth.ts
│   └── colaboradores.ts
└── types/              # TypeScript types
    ├── colaborador.ts
    └── database.types.ts

database/               # Scripts SQL
├── create_historico_table.sql
└── verificar_tabela.sql

docs/                   # Documentação
├── README.md
├── IMPLEMENTACAO_DASHBOARD_DADOS_REAIS.md
├── RESUMO_MELHORIAS_DASHBOARD.md
├── MELHORIAS_SISTEMA_COMPLETO.md
└── PWA_COMPLETO.md
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Setup

1. **Clone o repositório**

```bash
git clone <repo-url>
cd appPortaria
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:

```env
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=sua-chave-publica
```

4. **Configure o banco de dados**

Execute os scripts SQL da pasta `database/` no Supabase:

- `create_historico_table.sql` - Cria tabelas necessárias

5. **Configure as URLs de redirecionamento no Supabase**

No Supabase Dashboard:

- Authentication → URL Configuration
- Adicione: `http://localhost:3000` e `http://localhost:3001`

6. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📊 Performance

### Cache Inteligente

- TTL de 5 minutos para queries de analytics
- TTL de 2 minutos para dados do dia
- Cache hit rate esperado: 60-70%
- Ganho: ~10x mais rápido em cache hits

### Debounce

- Buscas: 300ms de delay
- Scroll: 100ms de throttle
- Redução de ~50% em queries desnecessárias

## 🔐 Segurança

- RLS (Row Level Security) habilitado no Supabase
- Autenticação JWT
- Middleware de autorização
- Validação de dados no frontend e backend
- Sanitização de inputs

## 🧪 Testes

```bash
# Rodar todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas

Suporta qualquer plataforma que rode Node.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- DigitalOcean App Platform

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run test         # Rodar testes
npm run generate     # Gerar site estático
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Lint do código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando Nuxt 3 e Supabase**
