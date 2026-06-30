import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LegalCookies() {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-lanmac mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 28 de junio de 2026</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. ¿Qué son las cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo. Permiten que la plataforma recuerde tu información y preferencias para mejorar tu experiencia.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Cookies que utilizamos</h2>

          <h3 className="text-lg font-medium text-gray-800 mt-4">Cookies estrictamente necesarias</h3>
          <p>Imprescindibles para el funcionamiento de la plataforma. No pueden desactivarse.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="font-medium">sb-*-auth-token</span><span className="text-gray-400">Sesión de Supabase</span></div>
            <div className="flex justify-between"><span className="font-medium">cookie-consent</span><span className="text-gray-400">Tu preferencia de cookies</span></div>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mt-4">Cookies funcionales</h3>
          <p>Permiten guardar tu progreso y personalizar la experiencia.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="font-medium">FingerprintJS</span><span className="text-gray-400">Identificación anónima del navegador</span></div>
          </div>
          <p className="text-sm text-gray-500">FingerprintJS genera un identificador único de tu navegador para guardar tu nivel y progreso sin necesidad de login. No recopila datos personales identificables.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Gestión de Cookies</h2>
          <p>Al visitar la plataforma por primera vez, te pedimos tu consentimiento para las cookies funcionales. Puedes cambiar tus preferencias en cualquier momento desde la configuración de tu navegador.</p>
          <p>Ten en cuenta que desactivar las cookies funcionales puede impedir que se guarde tu progreso de práctica.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Cookies de terceros</h2>
          <p>Actualmente no utilizamos cookies de terceros para publicidad ni análisis en esta plataforma de práctica.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Contacto</h2>
          <p>Para preguntas sobre el uso de cookies:<br/>
          Email: info@lanmac.edu.do<br/>
          WhatsApp: 809-870-6555</p>
        </section>
      </div>
    </div>
  )
}
