namespace ConvertHub.Api.Models
{
    public enum ConversionType
    {
        Unknown = 0,
        // Legacy Support
        PdfToWord, PdfToExcel, WordToPdf, ImageToPdf, DocumentToPdf, EbookToPdf, PdfToCsv, ImageConverter, VideoConverter, AudioConverter, Mp4Converter,
        VideoToGif, ApngToGif, GifToMp4, ImageToGif, MovToGif, AviToGif, CssMin, JsBeautify, JfifToPng, JfifToJpg, VideoToMp3, Mp4ToMp3, JpgToPdf, ExcelToPdf, EpubToPdf, HeicToPdf,

        // Documents
        PdfToDocx, PdfToTxt, PdfToHtml, PdfToEpub, PdfToPptx, PdfToXlsx,
        DocToPdf, DocxToPdf, DocToTxt, DocToHtml, DocToOdt, DocToRtf,
        TxtToPdf, TxtToDocx, TxtToHtml, TxtToEpub,
        PptToPdf, PptxToPdf, PptToJpg, PptToPng, PptToMp4,
        XlsToCsv, XlsxToCsv, XlsToPdf, XlsxToPdf, XlsToJson, XlsxToJson,
        CsvToXlsx, CsvToJson, JsonToCsv, JsonToXml, XmlToJson,

        // Images
        JpgToPng, PngToJpg, JpgToWebp, WebpToJpg, PngToWebp, JpgToBmp, BmpToJpg,
        JpgToTiff, TiffToJpg, JpgToGif, GifToJpg, PngToSvg, SvgToPng,
        PngToIco, IcoToPng, PngToPdf, WebpToPng, TiffToPdf, BmpToPng,
        HeicToJpg, HeicToPng, AvifToPng, RawToJpg, RawToPng, RawToTiff, PdfToJpg,

        // Vector/Design
        SvgToJpg, SvgToPdf, SvgToWebp, SvgToIco, SvgToEps,
        AiToSvg, AiToPdf, AiToPng, PsdToJpg, PsdToPng, PsdToWebp, PsdToPdf,
        EpsToSvg, EpsToPdf, EpsToPng,

        // Audio
        Mp3ToWav, WavToMp3, Mp3ToAac, AacToMp3, Mp3ToOgg, OggToMp3,
        Mp3ToFlac, FlacToMp3, WavToFlac, WavToAac, M4aToMp3, FlacToAlac, WmaToMp3,

        // Video
        Mp4ToAvi, Mp4ToMov, Mp4ToMkv, Mp4ToWebm, Mp4ToGif, WebmToGif,
        AviToMp4, MovToMp4, MkvToMp4, WebmToMp4, FlvToMp4, WmvToMp4, ThreeGpToMp4, M4vToMp4,

        // Subtitles
        SrtToVtt, VttToSrt, SrtToAss, AssToSrt, SrtToSub, SubToSrt, VttToTxt,

        // Ebooks
        EpubToMobi, MobiToEpub, EpubToTxt, EpubToDocx,
        MobiToAzw3, Fb2ToEpub, DjvuToPdf,

        // Archive
        Zip, Unzip, Archive,
        ZipToRar, RarToZip, ZipTo7z, SevenZipToZip, ZipToTar, TarToGz, TarGzToZip,
        CabToZip, IsoToZip,

        // Code/Data
        JsonToYaml, YamlToJson, JsonToXmlCode, YamlToToml, CsvToSql, SqlToCsv, SqlToJson,
        MarkdownToHtml, HtmlToMarkdown, HtmlToPdf, HtmlToDocx, UrlToPdf,

        // Fonts
        TtfToOtf, OtfToTtf, TtfToWoff, TtfToWoff2, OtfToWoff2, EotToTtf,

        // CAD/3D
        StlToObj, ObjToStl, StlToFbx, ObjToGltf, GlbToGltf, StepToIges, DwgToDxf, DxfToSvg,

        // Utilities
        QrGenerator, BarcodeGenerator, Base64Encode, Base64Decode, TimestampConverter,
        UnitConverter, ColorConverter, Unit, Time
    }
}
