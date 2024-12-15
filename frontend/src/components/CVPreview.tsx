import { Button, Space } from 'antd';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CVPreviewProps {
  cvUrl?: string;
}

const CVPreview = ({ cvUrl }: CVPreviewProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  if (!cvUrl) return <div>Aucun CV disponible</div>;

  return (
    <div style={{ textAlign: 'center' }}>
      <Document
        file={cvUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <Space style={{ marginTop: '20px' }}>
        <Button 
          disabled={pageNumber <= 1} 
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Précédent
        </Button>
        <span>Page {pageNumber} sur {numPages}</span>
        <Button 
          disabled={pageNumber >= (numPages || 0)} 
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Suivant
        </Button>
      </Space>
    </div>
  );
};

export default CVPreview; 