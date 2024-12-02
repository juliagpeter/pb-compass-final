const { execSync } = require('child_process');
const fs = require('fs');

// Caminho para a pasta de scripts
const scriptsDir = './scripts';

// Lista de arquivos na pasta
const scripts = fs.readdirSync(scriptsDir);

// Executar todos os testes
scripts.forEach(script => {
    console.log(`\n=== Executando ${script} ===`);
    try {
        execSync(`k6 run ${scriptsDir}/${script}`, { stdio: 'inherit' });
        console.log(`✓ ${script} finalizado com sucesso`);
    } catch (error) {
        console.error(`✗ Erro ao executar ${script}:`, error.message);
    }
});