/**
 * SEO Configuration for all conversion tools.
 * Focuses on semantic keywords, user intent, and rich snippets.
 */
export const seoConfig = {
  // Default metadata for generic pages
  default: {
    title: 'ConverterHub | Professional File Conversion Utility (PDF, Image, Media)',
    description: 'The definitive online file converter. Convert PDF to Word, Images, Video, and Archives with production-grade fidelity. Fast, secure, and professional-grade.',
    h1: 'Universal File Converter: Professional Grade File Processing',
    h2: 'Why Choose ConverterHub?',
  },

  // Tool-specific configurations
  tools: {
    'pdf-to-docx': {
      title: 'Convert PDF to Word Online (High Fidelity) | ConverterHub',
      description: 'Professional-grade PDF to Word (DOCX) conversion. Maintain perfect formatting and layout using our advanced conversion engine. Secure and private.',
      h1: 'Convert PDF to Word Online',
      h2: 'How to convert PDF to Word with 100% layout preservation',
      faq: [
        {
          q: 'Is it free to convert PDF to Word?',
          a: 'Yes, ConverterHub offers professional-grade PDF to Word conversion for free.'
        },
        {
          q: 'Will my document layout be preserved?',
          a: 'Our high-fidelity engine ensures that fonts, tables, and images remain exactly where they belong.'
        }
      ],
      steps: [
        'Upload your PDF document.',
        'Our engine processes it with high-precision OCR and layout analysis.',
        'Download your editable Word document.'
      ]
    },
    'zip-folder': {
      title: 'ZIP Folder Online - Recursive Folder Compression | ConverterHub',
      description: 'Compress entire folders into ZIP archives while preserving directory structure. Support for batch file zipping online.',
      h1: 'ZIP Folder Online',
      h2: 'Professional Recursive ZIP Utility',
      faq: [
        {
          q: 'Can I ZIP multiple files at once?',
          a: 'Yes, you can upload a whole folder or multiple files and we will ZIP them into a single archive.'
        }
      ],
      steps: [
        'Select the folder or files you want to compress.',
        'Wait for our server to recursively package your files.',
        'Download your secure ZIP archive.'
      ]
    }
  }
};

/**
 * Helper to get SEO config for a tool ID, with fallback to generic generation.
 */
export const getSeoConfig = (toolId) => {
  if (seoConfig.tools[toolId]) {
    return seoConfig.tools[toolId];
  }

  // Generic generator for tools not explicitly defined
  const parts = toolId.split('-to-');
  if (parts.length === 2) {
    const src = parts[0].toUpperCase();
    const tgt = parts[1].toUpperCase();
    return {
      title: `Convert ${src} to ${tgt} Online - Free & Fast | ConverterHub`,
      description: `Easily convert ${src} files to ${tgt} format online for free. Fast, secure, and no installation required. Try our universal file converter today.`,
      h1: `Convert ${src} to ${tgt} Online`,
      h2: `High-Quality ${src} to ${tgt} Conversion`,
      faq: [
        {
          q: `Is it safe to convert ${src} to ${tgt}?`,
          a: `Yes, we prioritize your privacy. All files are encrypted during transfer and deleted automatically after 30 minutes.`
        }
      ],
      steps: [
        `Upload your ${src} file.`,
        `Wait for the system to process the conversion.`,
        `Download your new ${tgt} file.`
      ]
    };
  }

  // Action-based generator (e.g. compress-pdf)
  if (toolId.includes('-')) {
    const [action, format] = toolId.split('-');
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    const capitalizedFormat = format.toUpperCase();
    return {
      title: `${capitalizedAction} ${capitalizedFormat} Online - Free Tool | ConverterHub`,
      description: `Free online tool to ${action} ${capitalizedFormat} files. Fast, secure, and easy to use with no software installation.`,
      h1: `${capitalizedAction} ${capitalizedFormat} Online`,
      h2: `Professional ${capitalizedFormat} ${capitalizedAction} Tool`,
    };
  }

  return seoConfig.default;
};
