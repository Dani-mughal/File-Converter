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
    id: 'document',
    title: 'Documents',
    icon: HiOutlineDocumentText,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    links: [
      { label: 'PDF to Word', id: 'pdf-to-docx' },
      { label: 'PDF to Excel', id: 'pdf-to-xlsx' },
      { label: 'Word to PDF', id: 'docx-to-pdf' },
      { label: 'Excel to PDF', id: 'xlsx-to-pdf' },
      { label: 'PPT to PDF', id: 'pptx-to-pdf' },
      { label: 'PPT to JPG', id: 'ppt-to-jpg' },
      { label: 'PPT to PNG', id: 'ppt-to-png' },
      { label: 'PDF to JPG', id: 'pdf-to-jpg' },
      { label: 'TXT to PDF', id: 'txt-to-pdf' },
      { label: 'HTML to PDF', id: 'html-to-pdf' }
    ]
  },
  {
    id: 'image',
    title: 'Images & Design',
    icon: HiOutlinePhoto,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    links: [
      { label: 'JPG to PNG', id: 'jpg-to-png' },
      { label: 'PNG to JPG', id: 'png-to-jpg' },
      { label: 'SVG to PNG', id: 'svg-to-png' },
      { label: 'SVG to JPG', id: 'svg-to-jpg' },
      { label: 'SVG to PDF', id: 'svg-to-pdf' },
      { label: 'HEIC to JPG', id: 'heic-to-jpg' },
      { label: 'WEBP to PNG', id: 'webp-to-png' },
      { label: 'PSD to JPG', id: 'psd-to-jpg' },
      { label: 'AI to SVG', id: 'ai-to-svg' },
      { label: 'EPS to PDF', id: 'eps-to-pdf' }
    ]
  },
  {
    id: 'video',
    title: 'Video & Audio',
    icon: HiOutlineVideoCamera,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-500/10',
    links: [
      { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
      { label: 'Video to GIF', id: 'video-to-gif' },
      { label: 'MOV to MP4', id: 'mov-to-mp4' },
      { label: 'AVI to MP4', id: 'avi-to-mp4' },
      { label: 'WAV to MP3', id: 'wav-to-mp3' },
      { label: 'MP3 to OGG', id: 'mp3-to-ogg' },
      { label: 'MKV to MP4', id: 'mkv-to-mp4' },
      { label: 'FLAC to MP3', id: 'flac-to-mp3' }
    ]
  },
  {
    id: 'archive',
    title: 'Archive & Ebooks',
    icon: HiOutlineArchiveBox,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-500/10',
    links: [
      { label: 'ZIP to RAR', id: 'zip-to-rar' },
      { label: 'RAR to ZIP', id: 'rar-to-zip' },
      { label: '7Z to ZIP', id: '7z-to-zip' },
      { label: 'EPUB to PDF', id: 'epub-to-pdf' },
      { label: 'MOBI to EPUB', id: 'mobi-to-epub' },
      { label: 'AZW3 to PDF', id: 'azw3-to-pdf' },
      { label: 'DJVU to PDF', id: 'djvu-to-pdf' },
      { label: 'TAR to GZ', id: 'tar-to-gz' }
    ]
  },
  {
    id: 'code',
    title: 'Code & Data',
    icon: HiOutlineCodeBracket,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    links: [
      { label: 'JSON to CSV', id: 'json-to-csv' },
      { label: 'CSV to JSON', id: 'csv-to-json' },
      { label: 'XML to JSON', id: 'xml-to-json' },
      { label: 'YAML to JSON', id: 'yaml-to-json' },
      { label: 'Markdown to HTML', id: 'markdown-to-html' },
      { label: 'SQL to CSV', id: 'sql-to-csv' },
      { label: 'JSON to YAML', id: 'json-to-yaml' },
      { label: 'CSV to SQL', id: 'csv-to-sql' }
    ]
  },
  {
    id: 'cad',
    title: 'CAD & 3D',
    icon: HiOutlineCube,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-500/10',
    links: [
      { label: 'STL to OBJ', id: 'stl-to-obj' },
      { label: 'OBJ to GLTF', id: 'obj-to-gltf' },
      { label: 'DWG to DXF', id: 'dwg-to-dxf' },
      { label: 'DXF to SVG', id: 'dxf-to-svg' },
      { label: 'STL to FBX', id: 'stl-to-fbx' },
      { label: 'GLB to GLTF', id: 'glb-to-gltf' },
      { label: 'STEP to IGES', id: 'step-to-iges' },
      { label: 'OBJ to STL', id: 'obj-to-stl' }
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
