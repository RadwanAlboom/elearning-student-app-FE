import React, { useState } from 'react';
import Loader from './Loader';
import ControlPanel from './ControlPanel';
import { Document, Page } from 'react-pdf';

import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import { pdfjsworker } from 'pdfjs-dist/es5/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsworker;

const PDFReader = ({ pdf }) => {
    const [scale, setScale] = useState(1.0);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setIsLoading(false);
    }

    return (
        <div>
            <Loader isLoading={isLoading} />
            <section
                id="pdf-section"
                className="d-flex flex-column align-items-center w-100"
            >
                <ControlPanel
                    scale={scale}
                    setScale={setScale}
                    numPages={numPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    file={pdf}
                />
                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </section>
        </div>
    );
};

export default PDFReader;
