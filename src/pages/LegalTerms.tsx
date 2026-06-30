import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LegalTerms() {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-lanmac mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 1 de junio de 2025</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Identificación</h2>
          <p><strong>Language Makers Academy, S.R.L. (LANMAC)</strong><br/>
          RNC: 132-705173<br/>
          Av. Lope de Vega 55, Edif. Robles, Suite 2-6, Ens. Naco, Santo Domingo 10119<br/>
          Email: info@lanmac.edu.do | Tel: 809-870-6555</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Descripción del Servicio</h2>
          <p>Esta plataforma ofrece ejercicios de práctica de inglés adaptativos basados en la metodología SPEAK360 de LANMAC. Los servicios incluyen:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Test de nivel adaptativo para determinar tu nivel CEFR.</li>
            <li>Ejercicios diarios personalizados según tu nivel.</li>
            <li>Seguimiento de progreso, rachas y estadísticas.</li>
            <li>Modo de conversación con inteligencia artificial.</li>
            <li>Juegos educativos de vocabulario.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Acceso y Registro</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>La plataforma es de <strong>acceso gratuito</strong>.</li>
            <li>No se requiere registro obligatorio; tu progreso se guarda automáticamente mediante un identificador de navegador.</li>
            <li>Puedes registrarte opcionalmente con nombre y email para recibir tu plan de estudio y recuperar tu progreso en otros dispositivos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Uso Aceptable</h2>
          <p>Al usar esta plataforma, te comprometes a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usar el servicio exclusivamente con fines educativos.</li>
            <li>No intentar acceder a datos de otros usuarios.</li>
            <li>No utilizar bots, scripts o herramientas automatizadas.</li>
            <li>No reproducir, distribuir o modificar el contenido sin autorización.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Propiedad Intelectual</h2>
          <p>Todo el contenido de esta plataforma — ejercicios, metodología SPEAK360, textos, diseño, código y marca LANMAC — es propiedad de Language Makers Academy, S.R.L. y está protegido por las leyes dominicanas de propiedad intelectual.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Limitación de Responsabilidad</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>La plataforma se ofrece "tal cual" sin garantías de disponibilidad continua.</li>
            <li>Los resultados del test de nivel son orientativos y no constituyen una certificación oficial.</li>
            <li>LANMAC no se responsabiliza por interrupciones del servicio, pérdida de datos por factores externos, ni por el uso que terceros hagan de la información.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Privacidad</h2>
          <p>El tratamiento de datos personales se rige por nuestra <a href="/legal/privacidad" className="text-lanmac hover:underline">Política de Privacidad</a>. Al usar la plataforma, aceptas el tratamiento descrito en dicha política.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. Modificaciones</h2>
          <p>LANMAC se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización. El uso continuado de la plataforma implica la aceptación de los términos vigentes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">9. Legislación Aplicable</h2>
          <p>Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa será sometida a los tribunales del Distrito Nacional, Santo Domingo.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">10. Contacto</h2>
          <p>Para preguntas sobre estos términos:<br/>
          Email: info@lanmac.edu.do<br/>
          WhatsApp: 809-870-6555</p>
        </section>
      </div>
    </div>
  )
}
