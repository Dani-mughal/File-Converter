import { 
  HiOutlineVideoCamera, 
  HiOutlinePhoto, 
  HiOutlineDocumentText, 
  HiOutlineSquares2X2,
  HiOutlineArchiveBox,
  HiOutlineCodeBracket,
  HiOutlineCube
} from 'react-icons/hi2';

export const CATEGORIES = [
  {
    id: 'pdf',
    title: 'PDF Tools',
    icon: HiOutlineDocumentText,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-500/10',
    links: [
      { label: 'PDF to Word', id: 'pdf-to-docx' },
      { label: 'PDF to Excel', id: 'pdf-to-xlsx' },
      { label: 'PDF to JPG', id: 'pdf-to-jpg' },
      { label: 'PDF to HTML', id: 'pdf-to-html' },
      { label: 'Word to PDF', id: 'docx-to-pdf' },
      { label: 'Excel to PDF', id: 'xlsx-to-pdf' },
      { label: 'PPT to PDF', id: 'pptx-to-pdf' },
      { label: 'Merge PDF', id: 'merge-pdf' },
      { label: 'Split PDF', id: 'split-pdf' },
      { label: 'Compress PDF', id: 'compress-pdf' },
      { label: 'Image to PDF', id: 'image-to-pdf' }
    ]
  },
  {
    id: 'image',
    title: 'Image Tools',
    icon: HiOutlinePhoto,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    links: [
      { label: 'JPG to PNG', id: 'jpg-to-png' },
      { label: 'PNG to JPG', id: 'png-to-jpg' },
      { label: 'WEBP to PNG', id: 'webp-to-png' },
      { label: 'WEBP to JPG', id: 'webp-to-jpg' },
      { label: 'SVG to PNG', id: 'svg-to-png' },
      { label: 'SVG to JPG', id: 'svg-to-jpg' },
      { label: 'SVG to PDF', id: 'svg-to-pdf' },
      { label: 'HEIC to JPG', id: 'heic-to-jpg' },
      { label: 'HEIC to PNG', id: 'heic-to-png' },
      { label: 'PNG to SVG', id: 'png-to-svg' }
    ]
  },
  {
    id: 'media',
    title: 'Media Tools',
    icon: HiOutlineVideoCamera,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-500/10',
    links: [
      { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
      { label: 'Video to GIF', id: 'video-to-gif' },
      { label: 'MOV to MP4', id: 'mov-to-mp4' },
      { label: 'MKV to MP4', id: 'mkv-to-mp4' },
      { label: 'AVI to MP4', id: 'avi-to-mp4' },
      { label: 'WAV to MP3', id: 'wav-to-mp3' },
      { label: 'MP3 to WAV', id: 'mp3-to-wav' },
      { label: 'MP4 to GIF', id: 'mp4-to-gif' }
    ]
  },
  {
    id: 'archive',
    title: 'Archive & Data',
    icon: HiOutlineArchiveBox,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    links: [
      { label: 'ZIP Folder', id: 'zip-folder' },
      { label: 'ZIP File', id: 'zip-file' },
      { label: 'Extract ZIP', id: 'unzip' },
      { label: 'Excel to CSV', id: 'xlsx-to-csv' },
      { label: 'CSV to JSON', id: 'csv-to-json' },
      { label: 'JSON to CSV', id: 'json-to-csv' },
      { label: 'XML to JSON', id: 'xml-to-json' },
      { label: 'JSON to XML', id: 'json-to-xml' },
      { label: 'Markdown to HTML', id: 'markdown-to-html' },
      { label: 'JSON to YAML', id: 'json-to-yaml' }
    ]
  }
];

export const getCategoryByToolId = (toolId) => {
  return CATEGORIES.find(cat => cat.links.some(link => link.id === toolId));
};

export const getRelatedTools = (toolId, limit = 6) => {
  const category = getCategoryByToolId(toolId);
  if (!category) {
    // Return a mix of popular tools if no category is found
    return [
      { label: 'PDF to Word', id: 'pdf-to-docx' },
      { label: 'JPG to PNG', id: 'jpg-to-png' },
      { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
      { label: 'Word to PDF', id: 'docx-to-pdf' },
      { label: 'JSON to CSV', id: 'json-to-csv' },
      { label: 'Video to GIF', id: 'video-to-gif' }
    ].slice(0, limit);
  }
  return category.links.filter(link => link.id !== toolId).slice(0, limit);
};
