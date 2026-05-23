import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi2';
import { Helmet } from 'react-helmet-async';

const Breadcrumbs = ({ toolId, toolName, darkMode }) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://converterhub.tech/"
      },
      ...(toolId ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Converters",
          "item": "https://converterhub.tech/convert"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": toolName || toolId,
          "item": `https://converterhub.tech/${toolId}`
        }
      ] : [])
    ]
  };

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={`inline-flex items-center text-xs font-semibold uppercase tracking-wider ${
              darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'
            }`}
          >
            <HiOutlineHome className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {toolId && (
          <li>
            <div className="flex items-center">
              <HiOutlineChevronRight className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <Link
                to="/convert"
                className={`ml-1 md:ml-2 text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'
                }`}
              >
                Converters
              </Link>
            </div>
          </li>
        )}
        {toolId && (
          <li aria-current="page">
            <div className="flex items-center">
              <HiOutlineChevronRight className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <span className={`ml-1 md:ml-2 text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>
                {toolName || toolId.replace(/-/g, ' ')}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
