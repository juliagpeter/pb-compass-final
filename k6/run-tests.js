const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Caminho para a pasta de scripts
const scriptsDir = './scripts';

// Lista de arquivos na pasta
const scripts = fs.readdirSync(scriptsDir);

// Criar uma pasta para armazenar os relatórios, se não existir
if (!fs.existsSync('./reports')) {
  fs.mkdirSync('./reports');
}

// Executar todos os testes
scripts.forEach(script => {
  const scriptPath = path.join(scriptsDir, script);
  
  console.log(`\n=== Executando ${script} ===`);
  
  try {
    // Passa o nome do script como variável de ambiente TEST_NAME
    execSync(`k6 run ${scriptPath} -e TEST_NAME=${script.replace('.js', '')}`, { stdio: 'inherit' });
    console.log(`✓ ${script} finalizado com sucesso`);
  } catch (error) {
    console.error(`✗ Erro ao executar ${script}:`, error.message);
  }
});
