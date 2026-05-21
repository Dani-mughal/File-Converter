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
        'Download your secure ZIP archive.']
  },
    'svg-to-png': {
      title: 'SVG to PNG Converter - High Resolution Online | ConverterHub',
      description: 'Convert SVG vector graphics to high-resolution PNG images instantly. Perfect for web design and standard image viewing. Transparent background preserved.',
      h1: 'SVG to PNG Converter',
      keywords: 'svg to png, convert svg to png high res, vector to png',
      faq: [
        {
          q: 'Will the PNG have a transparent background?',
          a: 'Yes, our converter maintains the transparency of your original SVG file.'
        }
      ]
    },
    'merge-pdf': {
      title: 'Merge PDF Online - Combine PDF Files Instantly | ConverterHub',
      description: 'Combine multiple PDF documents into a single file in seconds. Simple, fast, and secure PDF merger for professional use.',
      h1: 'Merge PDF Online',
      keywords: 'merge pdf, combine pdf online, pdf joiner',
    }
  },
};

/**
 * Helper to get SEO config for a tool ID, with fallback to generic generation.
 */
export const getSeoConfig = (toolId) => {
  const defaults = seoConfig.default;
  const tool = seoConfig.tools[toolId] || {};

  // Generic generator for tools not explicitly defined
  const parts = toolId.split('-to-');
  let generated = {};
  
  if (parts.length === 2) {
    const src = parts[0].toUpperCase();
    const tgt = parts[1].toUpperCase();
    generated = {
      title: `Convert ${src} to ${tgt} Online - Free & High Quality | ConverterHub`,
      description: `Professional-grade ${src} to ${tgt} conversion online. Fastest ${src} file processing with maximum security. Convert your files to ${tgt} instantly.`,
      keywords: `${src} to ${tgt}, convert ${src} to ${tgt}, free online converter, ${src} file converter`,
      h1: `Convert ${src} to ${tgt} Online`,
      h2: `Why use our ${src} to ${tgt} Converter?`,
      faq: [
        {
          q: `Is it safe to convert ${src} to ${tgt}?`,
          a: `Yes, we prioritize your privacy. All files are encrypted using SSL and deleted automatically after 30 minutes.`
        },
        {
          q: `Can I convert large ${src} files?`,
          a: `Yes, ConverterHub supports large file uploads up to 500MB depending on the format.`
        }
      ],
      steps: [
        `Upload your ${src} file.`,
        `Wait for our high-speed engine to process the conversion.`,
        `Download your high-fidelity ${tgt} file.`
      ]
    };
  } else if (toolId.includes('-')) {
    const [action, format] = toolId.split('-');
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    const capitalizedFormat = format.toUpperCase();
    generated = {
      title: `${capitalizedAction} ${capitalizedFormat} Online - Free & Fast | ConverterHub`,
      description: `Need to ${action} ${capitalizedFormat} files? Use our free online tool to ${action} ${capitalizedFormat} efficiently and securely.`,
      keywords: `${action} ${format}, free ${action} ${format}, online ${format} tool`,
      h1: `${capitalizedAction} ${capitalizedFormat} Online`,
      h2: `Professional ${capitalizedFormat} ${capitalizedAction} Utility`,
    };
  }

  // Merge: Priority = Manual Tool Config > Generated > Defaults
  return {
    ...defaults,
    ...generated,
    ...tool,
    url: `https://converterhub.tech/${toolId}`,
    image: `https://converterhub.tech/og/${toolId || 'default'}.jpg`,
  };
};
