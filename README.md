# ConvertHub - Universal File Converter

ConvertHub is a powerful, modern, and high-performance file conversion SaaS platform. It allows users to convert between hundreds of file formats across categories like Documents, Images, Audio, Video, Archives, and Data.

![ConvertHub Banner](https://img.shields.io/badge/ConvertHub-Universal--File--Converter-blue?style=for-the-badge)

## 🚀 Key Features

-   **Universal Support**: Convert between 200+ formats (PDF, DOCX, PNG, JPG, MP4, MP3, ZIP, etc.).
-   **Batch Processing**: Upload and convert multiple files simultaneously.
-   **High Speed**: Optimized backend processing for fast conversions.
-   **Modern UI**: Sleek, responsive design with dark mode support and smooth animations.
-   **Real-time Progress**: Track your conversion status with live progress bars.
-   **Safe & Secure**: Files are automatically deleted after conversion and download.
-   **Dedicated Landing Pages**: Optimized pages for Home, Conversion, About, Pricing, and Contact.

## 🛠️ Technology Stack

### Frontend
-   **React 19**: Modern UI component architecture.
-   **Vite**: Lightning-fast build tool.
-   **Tailwind CSS 4**: Utility-first styling for a premium look.
-   **Framer Motion**: Smooth micro-animations and transitions.
-   **Lucide React**: Beautiful, consistent iconography.
-   **React Helmet Async**: SEO optimization for dynamic pages.

### Backend
-   **ASP.NET Core 9**: High-performance API framework.
-   **FFmpeg**: Professional-grade audio and video processing.
-   **Magick.NET & ImageSharp**: Comprehensive image manipulation.
-   **iText7**: Advanced PDF generation and editing.
-   **OpenXML**: Native support for Microsoft Office documents.
-   **Docker**: Containerized deployment for consistency.

## 📂 Project Structure

```text
Files converter/
├── frontend/             # React + Vite application
│   ├── src/              # Components, Hooks, Pages, Styles
│   ├── public/           # Static assets
│   └── netlify.toml      # Netlify deployment config
├── backend/              # .NET 9 Web API
│   ├── Controllers/      # API Endpoints
│   ├── Services/         # Conversion Logic (PDF, Image, Media, etc.)
│   ├── Models/           # Data Transfer Objects
│   └── Dockerfile        # Container configuration
└── README.md             # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18+)
-   [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
-   [FFmpeg](https://ffmpeg.org/download.html) (Installed and added to PATH)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dani-mughal/File-Converter.git
   cd File-Converter
   ```

2. **Setup Backend**
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📄 Documentation
For a detailed technical explanation of how the system works, please refer to the [working_of_project.txt](working_of_project.txt) file in the root directory.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.
