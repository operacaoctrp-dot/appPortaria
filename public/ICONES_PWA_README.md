# Ícones PWA

Para completar a configuração PWA, você precisa adicionar os seguintes ícones na pasta `public/`:

## Ícones Necessários

### 1. icon-192.png

- **Tamanho**: 192x192 pixels
- **Formato**: PNG
- **Uso**: Ícone principal da aplicação

### 2. icon-512.png

- **Tamanho**: 512x512 pixels
- **Formato**: PNG
- **Uso**: Ícone de alta resolução

### 3. favicon.ico (opcional)

- **Tamanho**: 32x32 pixels
- **Formato**: ICO
- **Uso**: Ícone da aba do navegador

## Como Criar os Ícones

### Opção 1: Ferramenta Online

1. Acesse: https://realfavicongenerator.net/
2. Faça upload de uma imagem quadrada (mínimo 512x512px)
3. Configure as opções PWA
4. Baixe os ícones gerados

### Opção 2: Design Manual

1. Crie um logo/ícone quadrado representando o sistema de portaria
2. Sugestões de elementos:
   - Ícone de prédio/edifício
   - Porta ou entrada
   - Símbolo de segurança
   - Cores: Azul (#3B82F6) como principal

### Opção 3: Ícone Temporário

Para fins de desenvolvimento, você pode usar qualquer imagem quadrada e redimensioná-la:

```bash
# Usando ImageMagick (se instalado)
convert imagem-original.png -resize 192x192 icon-192.png
convert imagem-original.png -resize 512x512 icon-512.png
```

## Estrutura Final

Após adicionar os ícones, a pasta public deve ter:

```
public/
├── icon-192.png
├── icon-512.png
└── favicon.ico (opcional)
```

## Verificação

Para testar se a PWA está funcionando:

1. Abra o site no Chrome/Edge
2. Acesse DevTools > Application > Manifest
3. Verifique se os ícones aparecem corretamente
4. Teste a instalação: Menu > Instalar aplicativo

## Configurações Adicionais

O manifest já está configurado em `nuxt.config.ts` com:

- Nome: "Sistema de Portaria"
- Nome curto: "Portaria"
- Tema: Azul (#3B82F6)
- Modo: Standalone
- Orientação: Portrait

## Próximos Passos

Após adicionar os ícones:

1. Reinicie o servidor de desenvolvimento
2. Teste a instalação da PWA
3. Configure notificações push (se necessário)
4. Configure sincronização offline
