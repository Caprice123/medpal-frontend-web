import { useState, useRef } from 'react';
import { convertHtmlToDocx, convertElementToDocx, convertHtmlToDocxCustom, convertHtmlToDocxReliable } from '../../utils/htmlToDocx';
import { toast } from 'react-toastify';

const HtmlToDocxExample = () => {
  const [htmlContent, setHtmlContent] = useState(`
    <h1>Sample Document</h1>
    <p>This is a <strong>sample document</strong> with <em>formatted text</em>.</p>

    <h2>Image Example</h2>
    <p>Images are supported! You can use external URLs or base64 data URIs:</p>
    <img src="https://j0o6.sg01.idrivee2-79.com/curio-mediko-id-dev/skripsi-images/0df6546cdf008ad9874cadb66361236d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YdEPEiADqqFm4vsX3RZA%2F20251226%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20251226T081702Z&X-Amz-Expires=604800&X-Amz-Signature=771f0af1030df7440f5f1c60ab05121ff84856e0d87d54cbb22fb0c24614b970&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Sample" style="max-width: 400px;" />
<img src="data:image/png;base64,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" alt="Sample" style="max-width: 400px;" />
    
    <h2>Features</h2>
    <ul>
      <li>Convert HTML to DOCX</li>
      <li>Support for tables, lists, and formatting</li>
      <li>Custom margins and orientation</li>
      <li>Images (URLs and base64)</li>
    </ul>

    <h2>Table Example</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>City</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>30</td>
          <td>New York</td>
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>25</td>
          <td>Los Angeles</td>
        </tr>
      </tbody>
    </table>

    <h2>Table Example</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>HTML to DOCX</td>
          <td>Convert HTML content to Microsoft Word documents</td>
        </tr>
        <tr>
          <td>Image Support</td>
          <td>Supports both external URLs and base64 encoded images</td>
        </tr>
      </tbody>
    </table>
  `);

  const contentRef = useRef(null);

  const handleConvert = async () => {
    try {
      await convertHtmlToDocx(htmlContent, 'my-document');
      toast.success('Document downloaded successfully!');
    } catch (error) {
      toast.error('Failed to convert HTML to DOCX');
      console.error(error);
    }
  };

  const handleConvertElement = async () => {
    try {
      if (contentRef.current) {
        await convertElementToDocx(contentRef.current, 'element-document');
        toast.success('Document downloaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to convert element to DOCX');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>HTML to DOCX Converter Example</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="htmlInput" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Enter HTML Content:
        </label>
        <textarea
          id="htmlInput"
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Preview:</h3>
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
        <strong>✅ All Export Options Updated!</strong>
        <p style={{ margin: '10px 0' }}>
          All export functions now use the <code>docx</code> package which properly handles:
        </p>
        <ul style={{ margin: '5px 0 5px 20px' }}>
          <li>✅ Images (S3 URLs, external URLs, base64)</li>
          <li>✅ Tables (proper structure with borders)</li>
          <li>✅ Headings, lists, and formatting</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleConvert}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          📄 Download as DOCX
        </button>

        <button
          onClick={handleConvertElement}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🎯 Download Element as DOCX
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h3>Usage Examples:</h3>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`// Basic usage
import { convertHtmlToDocx } from './utils/htmlToDocx';

const handleExport = async () => {
  const html = '<h1>Hello World</h1><p>Content here</p>';
  await convertHtmlToDocx(html, 'my-document');
};

// With images (automatically supported - S3 URLs, external URLs, base64)
const handleExportWithImages = async () => {
  const html = '<h1>Report</h1><img src="https://example.com/image.jpg" />';
  await convertHtmlToDocx(html, 'report');
};

// Convert DOM element
import { convertElementToDocx } from './utils/htmlToDocx';

const handleExport = async () => {
  const element = document.getElementById('content');
  await convertElementToDocx(element, 'element-export');
};

// All functions now use the reliable docx package with full support for:
// - Images (S3 presigned URLs, external URLs, base64)
// - Tables with proper borders and structure
// - Headings, lists, bold, italic, underline
// - Proper font sizing (Times New Roman, 12pt)`}
        </pre>
      </div>
    </div>
  );
};

export default HtmlToDocxExample;
