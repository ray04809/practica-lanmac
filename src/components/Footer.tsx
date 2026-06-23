export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white font-semibold">LANMAC</span>
          <span className="text-xs bg-lanmac/20 text-lanmac-light px-2 py-0.5 rounded-full">
            SPEAK360
          </span>
        </div>
        <p className="text-sm">
          C. Lope de Vega 55, Edif. Robles, Suite 2-6, Ens. Naco, Santo Domingo
        </p>
        <p className="text-xs">
          &copy; {new Date().getFullYear()} LANMAC. Todos los derechos reservados.
        </p>
        <div className="flex justify-center gap-4 text-xs">
          <a href="https://lanmac.edu.do" className="hover:text-white transition-colors">
            Sitio Web
          </a>
          <a href="https://portal.lanmac.edu.do" className="hover:text-white transition-colors">
            Portal
          </a>
          <a href="https://wa.me/18098706555" className="hover:text-white transition-colors">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
