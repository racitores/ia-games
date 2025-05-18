import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                🤖 AI Games
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/racitores/ia-games"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Github className="w-6 h-6" />
              <span>Ver en GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
