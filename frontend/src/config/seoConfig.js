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
      title: 'PDF to Word Converter - Edit PDF Documents Free | ConverterHub.tech',
      description: 'Transform PDF files into editable Microsoft Word (DOCX) documents instantly. Our high-precision PDF to Word converter maintains original fonts, layouts, and tables using advanced OCR technology. 100% free and secure.',
      h1: 'Professional PDF to Word Converter',
      h2: 'How to Convert PDF to Word with Industry-Grade Precision',
      faq: [
        {
          q: 'Will my document layout and tables be preserved?',
          a: 'Yes. Our engine is specifically optimized to recognize grid structures, nested tables, and complex multi-column layouts, rebuilding them as native Microsoft Word elements.'
        },
        {
          q: 'Can I convert scanned PDF documents to editable Word files?',
          a: 'Absolutely. We utilize advanced Optical Character Recognition (OCR) to translate image-based text from scans into editable character data, allowing you to edit the text immediately.'
        },
        {
          q: 'Is it free to use, and is there a file size limit?',
          a: 'ConverterHub provides professional-grade conversion for free. We support files up to 50MB for most users, ensuring high performance for even the most detailed reports.'
        },
        {
          q: 'Are my sensitive documents secure?',
          a: 'Security is at the heart of our service. All file transfers use 256-bit SSL encryption, and every document is automatically and permanently shredded from our servers 30 minutes after processing.'
        }
      ],
      steps: [
        'Upload your PDF document to our secure workstation.',
        'Choose whether to apply advanced OCR for scanned or image-based files.',
        'Our cloud-based engine rebuilds the document structure in seconds.',
        'Download your fully editable and accurately formatted Word (DOCX) document.'
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
      h2: 'How to Merge Multiple PDFs into One Document',
      faq: [
        {
          q: 'Is there a limit to how many PDFs I can merge?',
          a: 'No, you can combine as many PDF files as you need, provided the total size stays within our generous cloud limits.'
        },
        {
          q: 'Will combining PDFs affect the quality?',
          a: 'Not at all. Our tool merges binary streams directly, ensuring that images and text quality remain untouched.'
        }
      ],
      steps: [
        'Upload all the PDF files you wish to combine.',
        'Rearrange the order if necessary.',
        'Click "Merge" and download your consolidated document.'
      ]
    },
    'jpg-to-png': {
      title: 'Convert JPG to PNG Online - Preserve Image Quality | ConverterHub',
      description: 'Easily transform JPG images into PNG format. Best for web designers needing lossless quality and transparency support.',
      h1: 'JPG to PNG Converter',
      h2: 'Why Convert JPG to PNG?',
      faq: [
        {
          q: 'Why should I convert JPG to PNG?',
          a: 'PNG is a lossless format, meaning it won\'t lose quality every time you save it. It also supports transparency, which is essential for logos and web graphics.'
        }
      ],
      steps: [
        'Select your JPG images from your device.',
        'Our engine converts the compression algorithm to lossless PNG.',
        'Save your new high-quality PNG images.'
      ]
    },
    'heic-to-jpg': {
      title: 'HEIC to JPG Converter - Make iPhone Photos Compatible | ConverterHub',
      description: 'Convert Apple HEIC photos to standard JPG format for free. View your iPhone photos on any device without compatibility issues.',
      h1: 'HEIC to JPG Converter',
      h2: 'Transform iPhone Photos Instantly',
      faq: [
        {
          q: 'What is a HEIC file?',
          a: 'HEIC is a high-efficiency format used by Apple. While it saves space, it isn\'t supported by all Windows or Android devices. Converting to JPG makes your photos universal.'
        }
      ],
      steps: [
        'Drag and drop your .heic files into the converter.',
        'Download the converted .jpg files in seconds.',
        'Share them anywhere without worrying about compatibility.'
      ]
    },
    'pdf-to-xlsx': {
      title: 'PDF to Excel Converter - Extract Data to Spreadsheets | ConverterHub',
      description: 'Convert PDF tables into editable Microsoft Excel (XLSX) spreadsheets. Our tool accurately extracts data while maintaining cell structure and formatting.',
      h1: 'PDF to Excel Converter',
      h2: 'How to Extract PDF data to Excel',
      faq: [
        {
          q: 'Will the data stay in the same columns?',
          a: 'Yes, our AI-powered engine recognizes table borders and column alignments, ensuring data is placed in the correct Excel cells.'
        }
      ]
    },
    'mp4-to-mp3': {
      title: 'MP4 to MP3 Converter - Extract Audio from Video | ConverterHub',
      description: 'Quickly extract high-quality audio from MP4 videos. Best for creating podcasts or saving music from video clips.',
      h1: 'MP4 to MP3 Audio Extractor',
      h2: 'High-Fidelity Audio Extraction',
      faq: [
        {
          q: 'What bitrate is the audio saved at?',
          a: 'We use high-bitrate encoding (up to 320kbps) to ensure no significant loss in audio quality during extraction.'
        }
      ]
    },
    'json-to-csv': {
      title: 'JSON to CSV Converter - Simplify Data Analysis | ConverterHub',
      description: 'Transform complex JSON data into flat CSV structural files. Perfect for importing data into Excel or Google Sheets.',
      h1: 'JSON to CSV Converter',
      h2: 'Flatten Your Data Instantly',
      faq: [
        {
          q: 'Does it support nested JSON?',
          a: 'Yes, our converter can flatten nested JSON structures into a relational CSV format.'
        }
      ]
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
    image: tool.image || `https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200`,
  };
};
