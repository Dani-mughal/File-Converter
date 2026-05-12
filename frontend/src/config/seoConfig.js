/**
 * SEO Configuration for all conversion tools.
 * Focuses on semantic keywords, user intent, and rich snippets.
 */
export const seoConfig = {
  // Default metadata for generic pages
  default: {
    title: 'ConverterHub | Fast & Free Online File Converter (PDF, Video)',
    description: 'Convert PDF, Word, images, and video online with ConverterHub. Fast, secure, and free tool supporting 1000+ formats. No installation or registration needed!',
    h1: 'Universal File Converter: Convert Any File Online for Free',
    h2: 'Why Choose ConverterHub?',
  },

  // Tool-specific configurations
  tools: {
    'pdf-to-docx': {
      title: 'Convert PDF to Word Online (Free & Accurate) | ConverterHub',
      description: 'Easily convert PDF to Word (DOCX) online for free. Maintain formatting and layout with our high-precision OCR technology. No installation required.',
      h1: 'Convert PDF to Word Online',
      h2: 'How to convert PDF to Word without losing formatting',
      faq: [
        {
          q: 'Is it free to convert PDF to Word?',
          a: 'Yes, ConverterHub offers free PDF to Word conversion for all users. No registration is required for basic conversions.'
        },
        {
          q: 'Will my document layout be preserved?',
          a: 'Our advanced conversion engine ensures that your Word document looks exactly like the original PDF, including fonts, images, and tables.'
        },
        {
          q: 'Is it safe to upload my files?',
          a: 'Absolutely. We use 256-bit SSL encryption for all transfers and automatically delete your files from our servers after 30 minutes.'
        }
      ],
      steps: [
        'Upload your PDF file by dragging and dropping it into the box.',
        'Wait for the conversion process to complete.',
        'Download your converted Word (DOCX) file instantly.'
      ]
    },
    'docx-to-pdf': {
      title: 'Convert Word to PDF Online - Fast & Free | ConverterHub',
      description: 'Create PDF documents from Microsoft Word (DOCX/DOC) files instantly. High-quality conversion with preserved formatting and links.',
      h1: 'Convert Word to PDF Online',
      h2: 'Professional Word to PDF Converter',
      faq: [
        {
          q: 'Can I convert DOCX to PDF on mobile?',
          a: 'Yes, ConverterHub works perfectly on all mobile devices and tablets through your browser.'
        },
        {
          q: 'Does it support old .doc files?',
          a: 'Yes, we support both .docx and the older .doc file formats.'
        }
      ],
      steps: [
        'Select your Word document from your computer or cloud storage.',
        'Click the "Convert" button to start the process.',
        'Save the high-quality PDF to your device.'
      ]
    },
    'jpg-to-pdf': {
      title: 'Convert JPG to PDF Online - Merge Images into PDF | ConverterHub',
      description: 'Convert JPG, JPEG, and PNG images to PDF documents. Combine multiple images into a single PDF file easily.',
      h1: 'Convert JPG to PDF Online',
      h2: 'The easiest way to turn images into PDF',
      faq: [
        {
          q: 'Can I combine multiple JPGs into one PDF?',
          a: 'Yes! You can upload multiple images and our tool will merge them into a single PDF document.'
        }
      ],
      steps: [
        'Upload one or more JPG images.',
        'Rearrange the order of images if needed.',
        'Download your merged PDF document.'
      ]
    },
    'pdf-to-jpg': {
      title: 'Convert PDF to JPG Online - High Quality Images | ConverterHub',
      description: 'Extract pages from your PDF as high-quality JPG images. Fast, free, and secure online PDF to image converter.',
      h1: 'Convert PDF to JPG Online',
      h2: 'Extract Images from PDF Pages',
      faq: [
        {
          q: 'What is the quality of the resulting JPG?',
          a: 'We provide high-resolution JPG images to ensure your text and graphics remain sharp.'
        }
      ],
      steps: [
        'Upload your PDF document.',
        'Our system will convert each page into a separate JPG image.',
        'Download the images as a ZIP archive.'
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
