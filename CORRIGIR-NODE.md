# Como Corrigir Node.js e npm no PATH

## Problema
O Node.js foi instalado, mas o `npm` não é reconhecido no terminal.

## Soluções

### Solução 1: Reinstalar Node.js (Mais Fácil)

1. **Desinstale o Node.js atual:**
   - Vá em "Configurações" > "Aplicativos" > "Aplicativos e recursos"
   - Procure por "Node.js" e desinstale

2. **Baixe e instale novamente:**
   - Acesse: https://nodejs.org/
   - Baixe a versão **LTS** (Long Term Support)
   - Execute o instalador
   - **IMPORTANTE:** Durante a instalação, marque:
     - ✅ "Add to PATH"
     - ✅ "Automatically install the necessary tools"
   - Complete a instalação

3. **Reinicie o terminal/PowerShell completamente**
   - Feche TODOS os terminais abertos
   - Abra um novo terminal
   - Teste: `node --version` e `npm --version`

---

### Solução 2: Adicionar ao PATH Manualmente

Se o Node.js está instalado mas não está no PATH:

1. **Encontrar onde está instalado:**
   - Abra o Explorador de Arquivos
   - Vá para: `C:\Program Files\nodejs`
   - Se não estiver lá, procure em:
     - `C:\Program Files (x86)\nodejs`
     - `%LOCALAPPDATA%\Programs\nodejs`

2. **Adicionar ao PATH:**
   - Pressione `Win + R`
   - Digite: `sysdm.cpl` e pressione Enter
   - Vá na aba **"Avançado"**
   - Clique em **"Variáveis de Ambiente"**
   - Em **"Variáveis do sistema"**, encontre **"Path"**
   - Clique em **"Editar"**
   - Clique em **"Novo"**
   - Cole o caminho do Node.js (ex: `C:\Program Files\nodejs`)
   - Clique em **"OK"** em todas as janelas

3. **Reinicie o terminal/PowerShell**

---

### Solução 3: Via PowerShell (Temporário)

Para testar sem reiniciar (só funciona nesta sessão):

```powershell
# Adicione temporariamente ao PATH desta sessão
$env:PATH += ";C:\Program Files\nodejs"

# Teste
node --version
npm --version
```

**Nota:** Isso só funciona nesta sessão do terminal. Ao fechar, volta ao normal.

---

### Solução 4: Via PowerShell (Permanente - Requer Admin)

Execute o PowerShell **como Administrador**:

```powershell
# Substitua pelo caminho real do Node.js
$nodePath = "C:\Program Files\nodejs"

# Adiciona ao PATH do sistema
[Environment]::SetEnvironmentVariable('Path', $env:Path + ";$nodePath", 'Machine')
```

Depois **reinicie o terminal**.

---

## Verificar se Funcionou

Após aplicar uma das soluções, abra um **NOVO terminal** e execute:

```powershell
node --version
npm --version
```

Se ambos mostrarem versões, está funcionando! ✅

---

## Se Nada Funcionar

1. Execute o script de verificação:
   ```powershell
   .\verificar-node.ps1
   ```

2. Verifique se o Node.js realmente está instalado:
   - Abra o Explorador
   - Vá para `C:\Program Files\nodejs`
   - Veja se existem os arquivos:
     - `node.exe`
     - `npm.cmd`
     - `npx.cmd`

3. Se os arquivos existem mas não funcionam no terminal:
   - O problema é o PATH
   - Use a Solução 2 ou 4 acima

4. Se os arquivos NÃO existem:
   - O Node.js não foi instalado corretamente
   - Use a Solução 1 (reinstalar)

---

## Dica Final

O npm **sempre vem junto** com o Node.js. Se o Node.js está instalado mas o npm não funciona, é problema de PATH, não de instalação.



