import fs from 'fs';
import path from 'path';
import { LegalLayout } from '../../components/legal-layout';
import { renderMarkdown } from '../../lib/markdown';

export const metadata = {
  title: 'Términos y Condiciones | KÖNIG URBAN',
  description: 'Términos y condiciones de compra, precios, formas de pago, plazos de entrega y política de devoluciones en KÖNIG URBAN.',
};

export default function TerminosCondicionesPage() {
  const filePath = path.join(process.cwd(), 'src/data/legal/terminos-condiciones.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <LegalLayout>
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(fileContent)}
      </div>
    </LegalLayout>
  );
}
