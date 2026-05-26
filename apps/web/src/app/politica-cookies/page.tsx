import fs from 'fs';
import path from 'path';
import { LegalLayout } from '../../components/legal-layout';
import { renderMarkdown } from '../../lib/markdown';

export const metadata = {
  title: 'Política de Cookies | KÖNIG URBAN',
  description: 'Detalles sobre las cookies y tecnologías similares utilizadas en el portal KÖNIG URBAN, tipos y cómo gestionarlas.',
};

export default function PoliticaCookiesPage() {
  const filePath = path.join(process.cwd(), 'src/data/legal/politica-cookies.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <LegalLayout>
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(fileContent)}
      </div>
    </LegalLayout>
  );
}
