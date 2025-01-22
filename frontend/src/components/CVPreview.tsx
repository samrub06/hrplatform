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
    <section style={{ textAlign: 'center' }} aria-label="Preview CV">
      <Document
        file={cvUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        aria-label="Document CV"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <nav aria-label="Navigation des pages du CV">
      <Space style={{ marginTop: '20px' }}>
        <Button 
          disabled={pageNumber <= 1} 
          onClick={() => setPageNumber(pageNumber - 1)}
          aria-label="Previous Page "
        >
          Previous
        </Button>
        <span aria-live="polite">Page {pageNumber} sur {numPages}</span>
        <Button 
          disabled={pageNumber >= (numPages || 0)} 
          onClick={() => setPageNumber(pageNumber + 1)}
          aria-label="Next Page"
        >
          Next
        </Button>
      </Space>
      </nav>
    </section>
  );
};

export default CVPreview; 