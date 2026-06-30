import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LegalPrivacy() {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-lanmac mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 1 de junio de 2025</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Responsable del Tratamiento</h2>
          <p><strong>Language Makers Academy, S.R.L. (LANMAC)</strong><br/>
          RNC: 132-705173<br/>
          Av. Lope de Vega 55, Edif. Robles, Suite 2-6, Ens. Naco, Santo Domingo 10119<br/>
          Email: info@lanmac.edu.do | Tel: 809-870-6555</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Datos Personales Recopilados</h2>
          <p>En esta plataforma de práctica recopilamos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Identificador del dispositivo (fingerprint):</strong> Código anónimo generado por tu navegador para identificar tu progreso sin necesidad de registro.</li>
            <li><strong>Datos voluntarios:</strong> Nombre, email y teléfono (solo si decides proporcionarlos al registrarte).</li>
            <li><strong>Datos de práctica:</strong> Nivel detectado, respuestas, puntuación, racha, tiempo de sesión.</li>
            <li><strong>Datos técnicos:</strong> Tipo de dispositivo, navegador, dirección IP (para seguridad).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Finalidad del Tratamiento</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personalizar los ejercicios según tu nivel de inglés.</li>
            <li>Guardar tu progreso y racha de práctica.</li>
            <li>Mejorar la experiencia de aprendizaje y el contenido.</li>
            <li>Enviarte tu plan de estudio personalizado (solo si proporcionas tu email).</li>
            <li>Análisis estadísticos agregados para mejorar el servicio.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Base Legal</h2>
          <p>El tratamiento se fundamenta en:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Consentimiento expreso:</strong> Al utilizar la plataforma y/o proporcionar tus datos.</li>
            <li><strong>Interés legítimo:</strong> Mejora del servicio educativo.</li>
            <li><strong>Obligación legal:</strong> Cumplimiento de normativa dominicana aplicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Cookies y Tecnologías</h2>
          <p>Utilizamos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento de la plataforma.</li>
            <li><strong>FingerprintJS:</strong> Genera un identificador anónimo del navegador para guardar tu progreso sin login.</li>
            <li><strong>Almacenamiento local:</strong> Para preferencias de cookies y estado de sesión.</li>
          </ul>
          <p>Para más detalles, consulta nuestra <a href="/legal/cookies" className="text-lanmac hover:underline">Política de Cookies</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Compartir Datos con Terceros</h2>
          <p>No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines comerciales. Los datos se comparten únicamente con:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase:</strong> Proveedor de base de datos (infraestructura).</li>
            <li><strong>Autoridades competentes:</strong> Cuando la ley lo requiera.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Seguridad</h2>
          <p>Protegemos tus datos mediante cifrado SSL/TLS, control de acceso basado en roles, copias de seguridad regulares y revisiones periódicas de seguridad.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. Retención de Datos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Usuarios anónimos (fingerprint):</strong> 1 año desde la última interacción.</li>
            <li><strong>Usuarios registrados:</strong> 5 años desde la última interacción.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">9. Tus Derechos</h2>
          <p>Tienes derecho a acceder, rectificar, eliminar, oponerte y solicitar la portabilidad de tus datos. Para ejercer estos derechos, contacta a info@lanmac.edu.do. Responderemos en un máximo de 15 días hábiles.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">10. Menores</h2>
          <p>El uso de esta plataforma por menores de edad requiere consentimiento de un padre o tutor. Los padres pueden ejercer los derechos de privacidad en nombre de los menores.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">11. Contacto</h2>
          <p>Para preguntas sobre esta política:<br/>
          Email: info@lanmac.edu.do<br/>
          WhatsApp: 809-870-6555<br/>
          Dirección: Av. Lope de Vega 55, Edif. Robles, Suite 2-6, Ens. Naco, Santo Domingo</p>
        </section>
      </div>
    </div>
  )
}
