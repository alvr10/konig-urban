import fs from 'fs';
import path from 'path';
import { LegalLayout } from '../../components/legal-layout';
import { renderMarkdown } from '../../lib/markdown';

export const metadata = {
  title: 'Política de Privacidad | KÖNIG URBAN',
  description: 'Política de privacidad de KÖNIG URBAN CORP. S.L. Responsable del tratamiento, datos recogidos, base legal y derechos del usuario.',
};

export default function PoliticaPrivacidadPage() {
  const filePath = path.join(process.cwd(), 'src/data/legal/politica-privacidad.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <LegalLayout>
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(fileContent)}
      </div>
    </LegalLayout>
  );
}
