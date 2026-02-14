import { Instagram } from "lucide-react";

function Header() {
  return (
    <header className="aera-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo-aera.png"
              alt="A-ERA Logo"
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div
              className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg"
              style={{ display: "none" }}
            >
              <span className="text-2xl font-bold">A-ERA</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sorteos</h1>
              <p className="text-white/90 text-sm">
                Sistema profesional de sorteos para Instagram
              </p>
            </div>
          </div>
          <Instagram className="w-10 h-10 opacity-90" />
        </div>
      </div>
    </header>
  );
}

export default Header;
