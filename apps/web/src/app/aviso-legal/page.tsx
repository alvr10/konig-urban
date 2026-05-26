import fs from 'fs';
import path from 'path';
import { LegalLayout } from '../../components/legal-layout';
import { renderMarkdown } from '../../lib/markdown';

export const metadata = {
  title: 'Aviso Legal | KÖNIG URBAN',
  description: 'Información legal, propiedad intelectual y condiciones de uso del sitio web KÖNIG URBAN.',
};

export default function AvisoLegalPage() {
  const filePath = path.join(process.cwd(), 'src/data/legal/aviso-legal.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <LegalLayout>
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(fileContent)}
      </div>
    </LegalLayout>
  );
}
