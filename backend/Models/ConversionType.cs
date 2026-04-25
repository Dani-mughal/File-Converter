namespace ConvertHub.Api.Models
{
    public enum ConversionType
    {
        Unknown = 0,
        // Documents
        PdfToWord,
        PdfToExcel,
        WordToPdf,
        PdfToJpg,
        PdfToEpub,
        EpubToPdf,
        HeicToPdf,
        DocxToPdf,
        JpgToPdf,
        DocumentToPdf,
        EbookToPdf,
        
        // Images
        ImageToPdf, // Already partially supported
        WebpToPng,
        JfifToPng,
        PngToSvg,
        HeicToJpg,
        HeicToPng,
        WebpToJpg,
        SvgToPng,
        ImageConverter,
        
        // Video & Audio
        Mp4ToMp3,
        VideoToMp3,
        Mp3ToOgg,
        VideoConverter,
        AudioConverter,
        Mp4Converter,
        MovToMp4,
        
        // GIF
        VideoToGif,
        Mp4ToGif,
        WebmToGif,
        ApngToGif,
        GifToMp4,
        GifToApng,
        ImageToGif,
        MovToGif,
        AviToGif,

        // Archives
        Zip,
        Unzip
    }
}
