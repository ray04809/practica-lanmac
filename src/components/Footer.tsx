import { MapPin, Phone, Mail } from 'lucide-react'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.35 29 29 0 00-.46-5.33z" />
      <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer
      className="mt-auto text-white"
      style={{ background: 'linear-gradient(135deg, #1a365d 0%, #0a2a52 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <img
            src="/logo-lanmac-blanco.png"
            alt="LANMAC"
            className="h-10 w-auto mb-2"
          />
          <p className="text-xs text-white/50 mb-4">Language Makers Academy</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              C. Lope de Vega 55, Edif. Robles, Suite 2-6, Ens. Naco, Santo Domingo
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              809-870-6555
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              info@lanmac.edu.do
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-white">Enlaces</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="https://lanmac.edu.do" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Sitio Web</a></li>
            <li><a href="https://portal.lanmac.edu.do" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Portal</a></li>
            <li><a href="https://practica.lanmac.edu.do" className="hover:text-blue-300 transition-colors">Practica</a></li>
            <li><a href="https://wa.me/18098706555" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">WhatsApp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-white">Legal</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="/legal/privacidad" className="hover:text-blue-300 transition-colors">Política de Privacidad</a></li>
            <li><a href="/legal/terminos" className="hover:text-blue-300 transition-colors">Términos y Condiciones</a></li>
            <li><a href="/legal/cookies" className="hover:text-blue-300 transition-colors">Política de Cookies</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-white">Redes Sociales</h4>
          <div className="flex flex-wrap gap-3">
            <a href="https://facebook.com/lanmacrd" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 hover:bg-blue-500 transition p-2.5">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/lanmacrd" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 hover:bg-pink-500 transition p-2.5">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com/company/language-makers-academy-lanmac" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 hover:bg-blue-600 transition p-2.5">
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a href="https://www.youtube.com/@lanmacrd" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 hover:bg-red-600 transition p-2.5">
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-white/70">
          &copy; 2026 Language Makers Academy, S.R.L. RNC: 132-705173. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
