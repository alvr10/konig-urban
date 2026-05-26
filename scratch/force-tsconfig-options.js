const fs = require('fs');
const path = require('path');

const packages = [
  'packages/database',
  'packages/core-backend',
  'services/catalog-service',
  'services/customers-service',
  'services/finance-service',
  'services/hr-service',
  'services/marketing-service',
  'services/orders-service',
  'services/production-service',
  'apps/api-gateway'
];

const rootDir = '/home/alvaro/ugr/sie/konig-urban';

packages.forEach(pkgDir => {
  const fullPkgDir = path.join(rootDir, pkgDir);
  if (!fs.existsSync(fullPkgDir)) return;

  const tsconfigPath = path.join(fullPkgDir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const content = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(content);
      
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.module = "NodeNext";
      tsconfig.compilerOptions.moduleResolution = "NodeNext";

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
      console.log(`Explicitly forced NodeNext options in tsconfig.json for ${pkgDir}`);
    } catch (e) {
      console.error(`Failed to process ${pkgDir}:`, e.message);
    }
  }
});
