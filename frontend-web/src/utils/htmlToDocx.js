import api from '@config/api';
import Endpoints from '@config/endpoint'

/**
 * Converts HTML content to DOCX and triggers download
 * Uses the docx package with full support for images, tables, and formatting
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} fileName - The name of the output file (without extension)
 * @param {Object} options - Additional options (kept for backward compatibility)
 * @returns {Promise<void>}
 */
export const convertHtmlToDocx = async (htmlContent, fileName = 'document', options = {}) => {
  try {
    const route = Endpoints.api.skripsi + "/html-to-docx/convert"
    const response = await api.post(
      route,
      {
        htmlContent,
        fileName
      },
      {
        responseType: 'blob'
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error converting HTML to DOCX:', error);
    throw error;
  }
};

/**
 * Converts HTML element to DOCX
 * @param {HTMLElement} element - The HTML element to convert
 * @param {string} fileName - The name of the output file (without extension)
 * @param {Object} options - Additional options for html-to-docx
 * @returns {Promise<void>}
 */
export const convertElementToDocx = async (element, fileName = 'document', options = {}) => {
  try {
    const htmlContent = element.innerHTML || element.outerHTML;
    return await convertHtmlToDocx(htmlContent, fileName, options);
  } catch (error) {
    console.error('Error converting element to DOCX:', error);
    throw error;
  }
};

/**
 * Converts HTML content to DOCX (alias for convertHtmlToDocx)
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} fileName - The name of the output file (without extension)
 * @param {Object} config - Configuration object (kept for backward compatibility)
 * @returns {Promise<void>}
 */
export const convertHtmlToDocxCustom = async (
  htmlContent,
  fileName = 'document',
  config = {}
) => {
  // All conversions now use the same reliable docx package implementation
  return convertHtmlToDocx(htmlContent, fileName, config);
};

/**
 * Converts HTML to DOCX (alias for convertHtmlToDocx)
 * All conversions now use the reliable docx package with full image support
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} fileName - The name of the output file (without extension)
 * @returns {Promise<void>}
 */
export const convertHtmlToDocxReliable = async (htmlContent, fileName = 'document') => {
  return convertHtmlToDocx(htmlContent, fileName);
};

export default {
  convertHtmlToDocx,
  convertElementToDocx,
  convertHtmlToDocxCustom,
  convertHtmlToDocxReliable,
};
