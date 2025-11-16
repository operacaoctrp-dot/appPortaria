# 📚 Documentação do Sistema

Esta pasta contém toda a documentação técnica do projeto.

## 📄 Arquivos Disponíveis

### 1. **README.md** (Raiz do projeto)

Documentação principal do projeto com:

- Visão geral das tecnologias
- Instruções de instalação
- Estrutura do projeto
- Scripts disponíveis
- Guia de deploy

### 2. **IMPLEMENTACAO_DASHBOARD_DADOS_REAIS.md**

Documentação técnica sobre a implementação do dashboard com dados reais:

- Composable `useAnalyticsData.ts`
- Integração com Supabase
- Queries otimizadas
- Processamento de dados
- Formato de retorno

### 3. **RESUMO_MELHORIAS_DASHBOARD.md**

Resumo executivo das melhorias implementadas:

- Sistema de cache com TTL
- Debounce e throttle
- Métricas de performance
- Como testar
- Checklist de implementação

### 4. **MELHORIAS_SISTEMA_COMPLETO.md**

Documento completo sobre todas as melhorias do sistema:

- Reorganização do projeto
- Implementação de Pinia
- Validações com Zod
- Testes com Vitest
- Sistema de roles
- Responsividade mobile

### 5. **PWA_COMPLETO.md**

Guia completo sobre a implementação PWA:

- Configuração do @vite-pwa/nuxt
- Ícones e splash screens
- Service worker
- Modo offline
- Como instalar o app

---

## 🗂️ Organização Anterior

**Antes** tínhamos 50+ arquivos `.md` na raiz, incluindo:

- Múltiplos documentos de correção (CORRECAO\_\*.md)
- Documentos duplicados de resumo
- Troubleshooting temporários
- Debug logs

**Depois** mantivemos apenas:

- ✅ 1 README.md principal (raiz)
- ✅ 4 documentos técnicos importantes (docs/)
- ✅ Estrutura organizada e fácil de navegar

**Deletados**: ~45 arquivos de documentação temporária, correções pontuais e duplicatas.

---

## 📖 Como Usar Esta Documentação

### Para Desenvolvedores Novos:

1. Leia o **README.md** (raiz) para visão geral
2. Siga as instruções de instalação
3. Consulte **MELHORIAS_SISTEMA_COMPLETO.md** para entender a arquitetura

### Para Features Específicas:

- **Dashboard**: Leia **IMPLEMENTACAO_DASHBOARD_DADOS_REAIS.md**
- **Performance**: Leia **RESUMO_MELHORIAS_DASHBOARD.md**
- **PWA**: Leia **PWA_COMPLETO.md**

### Para Troubleshooting:

- Verifique os logs do servidor
- Consulte a seção de "Testes" no README
- Abra uma issue se necessário

---

## 🔄 Atualizações

Esta documentação é atualizada conforme novas features são implementadas.

**Última atualização**: 24/10/2025  
**Versão**: 1.0.0  
**Status**: ✅ Organizado e atualizado
