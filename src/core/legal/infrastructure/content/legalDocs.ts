/**
 * LEGAL DOCUMENTS · full text as issued by Voltop's legal team
 * See docs/MASTER-PROJECT-DEFINITION.md §38.
 *
 * ── WHY THIS IS NOT `Localized` ──────────────────────────────────────────
 * The rest of the site's content is `Localized` with all three languages
 * mandatory. These two documents are NOT: they are plain Spanish text.
 *
 * That is neither an oversight nor a pending translation. A legal instrument
 * translated by someone other than its issuer stops being the same
 * instrument: it changes obligations, deadlines and definitions without
 * anyone having approved the change. §38 is explicit —"legal text is issued
 * by Voltop's legal team: it is neither drafted nor approximated"— and
 * translating it is approximating it.
 *
 * The English and Portuguese pages show the Spanish document with a notice
 * that that is the binding version. When the legal team issues translated
 * versions, they get added as documents of their own.
 *
 * The same rule applies to the text BELOW: only the comments in this file are
 * in English. Not one character of the documents themselves is touched.
 *
 * ── GENERATED, NOT TRANSCRIBED ───────────────────────────────────────────
 * Extracted from the original .docx files delivered on 2026-09-02.
 * Transcribing 250 paragraphs by hand would have introduced typos into a text
 * where a typo is a legal problem.
 */

import type { LegalDoc, LegalSection } from '~/core/legal/domain/entities/LegalDoc'

/** Official title, as issued:
 *  TÉRMINOS Y CONDICIONES DE USO PLATAFORMA, APLICACIÓN, SITIO WEB Y
 *  ESTACIONES DE CARGA VOLTOP */
const termsSections: LegalSection[] = [
  {
    id: 'quienes-somos-y-objeto',
    heading: '1. Quiénes somos y objeto',
    body: [
      {
        type: 'paragraph',
        text: 'Somos VOLTOP S.A.S. (en adelante, «VOLTOP» o «la Compañía»), sociedad comercial constituida y existente conforme a las leyes de la República de Colombia, identificada con NIT 901.723.964-6, con domicilio principal en la ciudad de Bogotá D.C., República de Colombia. La operación, administración y dispersión de los valores derivados del servicio es realizada por VOLTOP S.A.S.',
      },
      {
        type: 'paragraph',
        text: 'En VOLTOP valoramos la comunicación directa y transparente con nuestros Usuarios. Por esta razón hemos definido un conjunto de reglas claras que regulan el acceso, la descarga y el uso de nuestra plataforma tecnológica y de nuestras estaciones de carga, incluyendo nuestra aplicación móvil, nuestro sitio web y las Estaciones de Carga (en conjunto, los «presentes Términos y Condiciones»).',
      },
      {
        type: 'paragraph',
        text: 'Al ingresar, navegar, registrarse, acceder a la Plataforma o utilizar una Estación de Carga, el Usuario declara que ha leído, comprendido y aceptado estos Términos y Condiciones. Si el Usuario no está de acuerdo con ellos, deberá abstenerse de utilizar la Plataforma y las Estaciones de Carga.',
      },
      {
        type: 'paragraph',
        text: 'VOLTOP podrá actualizar o modificar estos Términos y Condiciones en cualquier momento, conforme a la cláusula de modificaciones. La versión vigente estará siempre disponible para consulta en el Sitio Web y en la Aplicación.',
      },
    ],
  },
  {
    id: 'ambito-de-aplicacion-y-relacion-con-otras-condic',
    heading: '2. Ámbito de aplicación y relación con otras condiciones',
    body: [
      {
        type: 'paragraph',
        text: 'Estos Términos y Condiciones aplican al uso del servicio de carga eléctrica de VOLTOP a través de todos sus canales, incluyendo la Aplicación, el Sitio Web y las Estaciones de Carga físicas. La referencia a estos Términos y Condiciones en la señalización de las Estaciones de Carga, en la Aplicación, en el Sitio Web o en los contratos celebrados con clientes constituye notificación suficiente de su contenido y disponibilidad.',
      },
      {
        type: 'paragraph',
        text: 'Cuando un Usuario o cliente suscriba con VOLTOP un contrato específico, tales como contratos de flota, de concesión, de alianza comercial, de servicios corporativos o condiciones particulares para funcionalidades determinadas, dicho contrato o condiciones particulares prevalecerán sobre estos Términos y Condiciones en aquello que regulen de manera expresa, y los presentes Términos y Condiciones aplicarán de manera supletoria e integradora en todo lo no previsto. Las condiciones particulares forman parte integral de estos Términos y Condiciones.',
      },
    ],
  },
  {
    id: 'definiciones',
    heading: '3. Definiciones',
    body: [
      {
        type: 'paragraph',
        text: 'Para efectos de los presentes Términos y Condiciones, los siguientes términos tendrán el significado que se indica a continuación:',
      },
      {
        type: 'paragraph',
        text: 'Aplicación: Plataforma móvil de propiedad de VOLTOP, incluyendo su infraestructura, redes, sistemas operativos, bases de datos y software, mediante la cual el Usuario puede consultar y activar Estaciones de Carga, disponible para los sistemas operativos iOS y Android.',
      },
      {
        type: 'paragraph',
        text: 'Sitio Web: Portal de internet de propiedad de VOLTOP, cuya dirección es https://www.voltop.co, incluyendo sus subdominios, contenidos y funcionalidades.',
      },
      {
        type: 'paragraph',
        text: 'Plataforma: De manera conjunta, la Aplicación, el Sitio Web y cualquier otro canal digital de VOLTOP a través del cual se presten los Servicios.',
      },
      {
        type: 'paragraph',
        text: 'Estación de Carga: Equipo o infraestructura de recarga de vehículos eléctricos habilitado por VOLTOP o por sus aliados, cuyo acceso o activación se gestiona a través de la Plataforma.',
      },
      {
        type: 'paragraph',
        text: 'Sesión de Carga: Operación de suministro de energía a un vehículo eléctrico iniciada y gestionada por el Usuario a través de la Plataforma.',
      },
      {
        type: 'paragraph',
        text: 'Servicios: Los productos y servicios ofrecidos por VOLTOP, incluyendo, sin limitarse a ello, la consulta y activación de Estaciones de Carga, el suministro de energía a través de estas y los servicios de soporte asociados.',
      },
      {
        type: 'paragraph',
        text: 'Tarifa: Valor que el Usuario debe pagar por el uso del Servicio, expresado en pesos colombianos, que puede comprender cargos por energía o por sesión, por reserva, por ocupación o permanencia y por servicios adicionales, según se informe previamente.',
      },
      {
        type: 'paragraph',
        text: 'Saldo: Fondos que el Usuario precarga en la Plataforma, cuando esta funcionalidad esté habilitada, para el pago de las Sesiones de Carga.',
      },
      {
        type: 'paragraph',
        text: 'Proveedores de Pago: Entidades financieras y proveedores externos de servicios de pago debidamente habilitados que procesan las transacciones del Usuario.',
      },
      {
        type: 'paragraph',
        text: 'Usuario: Toda persona natural o jurídica que acceda, navegue, se registre o utilice la Plataforma o las Estaciones de Carga.',
      },
      {
        type: 'paragraph',
        text: 'Usuario Consumidor: Usuario, persona natural o jurídica, que adquiere o utiliza el Servicio para la satisfacción de una necesidad propia, privada, familiar o doméstica, y no ligada intrínsecamente a su actividad económica.',
      },
      {
        type: 'paragraph',
        text: 'Usuario Empresarial: Usuario que utiliza el Servicio en el marco de su actividad económica, comercial o profesional, incluyendo, entre otros, empresas y operadores de flotas.',
      },
      {
        type: 'paragraph',
        text: 'Política de Tratamiento de Datos: La Política de Tratamiento de Datos Personales y Aviso de Privacidad de VOLTOP, disponible en el Sitio Web y en la Aplicación, que forma parte integral de estos Términos y Condiciones.',
      },
      {
        type: 'paragraph',
        text: 'Contenido: Todo texto, imagen, marca, logotipo, diseño, software, base de datos y demás material disponible en la Plataforma.',
      },
    ],
  },
  {
    id: 'servicios',
    heading: '4. Servicios',
    body: [
      {
        type: 'paragraph',
        text: 'La Plataforma redefine la experiencia de carga de vehículos eléctricos, al ofrecer un servicio de consulta, activación y gestión de Sesiones de Carga en Estaciones de Carga estratégicamente distribuidas, contribuyendo al impulso de la movilidad sostenible. A través de la Plataforma, VOLTOP pone a disposición del Usuario una herramienta tecnológica que permite, entre otras funcionalidades:',
      },
      {
        type: 'list',
        items: [
          'Consultar la ubicación y disponibilidad de las Estaciones de Carga en las ciudades donde el Servicio se encuentre habilitado.',
          'Activar las Estaciones de Carga mediante la lectura de códigos QR u otros mecanismos tecnológicos dispuestos en la Plataforma.',
          'Gestionar las Sesiones de Carga, consultar su historial y los cargos asociados.',
          'Acceder a información de soporte y atención al usuario, incluyendo preguntas frecuentes y los canales de contacto habilitados.',
        ],
      },
      {
        type: 'paragraph',
        text: 'El Usuario reconoce que la Plataforma constituye una herramienta tecnológica para la gestión del servicio de carga eléctrica, y que su disponibilidad y funcionamiento pueden verse afectados por factores técnicos, de conectividad, de mantenimiento de las Estaciones de Carga o por causas atribuibles a terceros ajenos al control de VOLTOP. VOLTOP podrá modificar, ampliar, restringir, suspender o descontinuar, total o parcialmente, las funcionalidades de la Plataforma y la cobertura geográfica del Servicio, por razones operativas, técnicas, comerciales o de seguridad, procurando informar oportunamente cuando ello afecte de manera sustancial la prestación del Servicio.',
      },
    ],
  },
  {
    id: 'aceptacion-y-capacidad-legal',
    heading: '5. Aceptación y capacidad legal',
    body: [
      {
        type: 'paragraph',
        text: 'Al ingresar a la Plataforma y, cuando corresponda, registrar una cuenta de Usuario, el Usuario acepta de manera expresa, libre, informada e inequívoca los presentes Términos y Condiciones. El Usuario declara contar con la capacidad legal necesaria para obligarse. Los Servicios están disponibles exclusivamente para personas con capacidad legal para contratar; no podrán utilizarlos los menores de edad ni las personas cuya cuenta haya sido suspendida o cancelada por VOLTOP.',
      },
      {
        type: 'paragraph',
        text: 'El Usuario reconoce expresamente que la aceptación de estos Términos y Condiciones no constituye ni genera contrato de sociedad, mandato, agencia, ni relación laboral, de dependencia o de subordinación de ninguna naturaleza entre VOLTOP y el Usuario. En caso de desacuerdo, el Usuario deberá abstenerse de registrarse y de utilizar el Servicio.',
      },
    ],
  },
  {
    id: 'registro-y-cuenta-de-usuario',
    heading: '6. Registro y cuenta de Usuario',
    body: [
      {
        type: 'paragraph',
        text: 'Para utilizar determinados Servicios, el Usuario deberá completar el formulario de registro en la Plataforma, suministrando datos como nombre completo, documento de identificación, correo electrónico y número de teléfono móvil. El Usuario garantiza que la información suministrada es correcta, veraz, completa y actualizada, y se abstiene de proporcionar datos de terceros o de suplantar la identidad de cualquier persona.',
      },
      {
        type: 'paragraph',
        text: 'Tras el registro, VOLTOP podrá enviar al correo o teléfono móvil del Usuario un código de confirmación. Completado el proceso, el Usuario generará su contraseña, siendo el único responsable de su custodia y confidencialidad. El Usuario acepta que: (i) solo podrá crear una (1) cuenta personal; (ii) notificará de inmediato a VOLTOP cualquier uso no autorizado de su cuenta o credenciales, o cualquier vulneración de seguridad; y (iii) cerrará su sesión al finalizar el uso de la Plataforma.',
      },
      {
        type: 'paragraph',
        text: 'El Usuario es responsable de todas las actividades realizadas desde su cuenta. VOLTOP no será responsable por pérdidas o daños derivados del incumplimiento de las obligaciones de custodia y confidencialidad a cargo del Usuario. En caso de detectar cuentas duplicadas, con datos coincidentes o presuntamente fraudulentas, VOLTOP podrá cancelarlas, suspenderlas o inhabilitarlas, sin que ello genere derecho a indemnización a favor del Usuario.',
      },
    ],
  },
  {
    id: 'acceso-y-requisitos-tecnicos',
    heading: '7. Acceso y requisitos técnicos',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario es responsable de contar con el acceso a la red de datos necesario para utilizar la Plataforma. Podrán aplicarse tarifas de datos y mensajes por parte de su operador móvil, costos que asumirá íntegramente. Igualmente, el Usuario es responsable de adquirir y mantener actualizado el hardware, los dispositivos y el software compatibles necesarios para acceder y utilizar la Plataforma, incluyendo sus actualizaciones.',
      },
    ],
  },
  {
    id: 'seguridad-en-el-uso-de-las-estaciones-de-carga',
    heading: '8. Seguridad en el uso de las Estaciones de Carga',
    body: [
      {
        type: 'paragraph',
        text: 'La carga de vehículos eléctricos implica el manejo de energía de alta potencia. Por la seguridad del Usuario, de terceros y de los equipos, el Usuario se obliga a observar las siguientes reglas y reconoce las siguientes condiciones:',
      },
      {
        type: 'list',
        items: [
          'Seguir en todo momento las instrucciones de uso indicadas en la Estación de Carga, en la Aplicación y en la señalización del sitio, así como las indicaciones del fabricante del vehículo.',
          'Verificar, antes de iniciar la Sesión de Carga, la compatibilidad del conector y del vehículo. VOLTOP no será responsable por daños derivados del uso de conectores o vehículos incompatibles o por configuraciones inadecuadas del vehículo del Usuario.',
          'Abstenerse de utilizar cables, conectores o Estaciones de Carga que presenten daño visible, sobrecalentamiento, humedad anormal, chispas u otra anomalía, y reportar de inmediato dicha situación a través de los canales de atención.',
          'Supervisar de manera razonable la Sesión de Carga y retirar el vehículo y el conector una vez finalizada, dejando la Estación de Carga en condiciones adecuadas para el siguiente Usuario.',
          'Abstenerse de manipular, intervenir, abrir, modificar o reparar las Estaciones de Carga, así como de utilizarlas para fines distintos a la carga de vehículos eléctricos autorizados.',
          'En caso de emergencia, tales como humo, fuego, olor a quemado, descarga eléctrica o ruido anormal, suspender de inmediato el uso, mantener distancia, y contactar a las líneas de emergencia y a VOLTOP.',
          'Respetar las normas de tránsito, de estacionamiento y de seguridad del sitio donde se ubica la Estación de Carga.',
        ],
      },
      {
        type: 'paragraph',
        text: 'El Usuario reconoce y acepta que la velocidad de carga y la potencia efectivamente entregada (medida en kW) dependen de factores como el vehículo, su estado de carga, la temperatura ambiente, las condiciones de la red eléctrica y las especificaciones de la Estación de Carga. En consecuencia, VOLTOP no garantiza una velocidad, potencia o tiempo de carga determinados.',
      },
      {
        type: 'paragraph',
        text: 'Dentro de los límites permitidos por la ley, VOLTOP no será responsable por daños derivados del incumplimiento de las instrucciones de uso y seguridad, del uso indebido de las Estaciones de Carga, de defectos o fallas del vehículo del Usuario, o de la inobservancia de las advertencias señaladas, sin perjuicio de la garantía legal y de la responsabilidad por dolo o culpa grave imputable a VOLTOP.',
      },
    ],
  },
  {
    id: 'costos-tarifas-iva-y-facturacion',
    heading: '9. Costos, tarifas, IVA y facturación',
    body: [
      {
        type: 'paragraph',
        text: 'La descarga, el registro y el uso de la Plataforma no generan costo alguno para el Usuario. Los cargos únicamente se causarán por el uso del Servicio, conforme a la Tarifa informada y aceptada por el Usuario antes del inicio de cada Sesión de Carga. Las Tarifas se expresan en pesos colombianos (COP) e incluyen o discriminan el impuesto sobre las ventas (IVA) y demás tributos aplicables, conforme a la normativa vigente.',
      },
      {
        type: 'paragraph',
        text: 'VOLTOP podrá aplicar distintos tipos de cargos, siempre informados de manera previa, incluyendo cargos por energía o por sesión, cargos por reserva, cargos por ocupación o permanencia (cuando el vehículo permanezca conectado tras finalizar la carga) y cargos por servicios adicionales, cuando apliquen.',
      },
      {
        type: 'paragraph',
        text: 'En caso de interrupciones, fallas técnicas o terminación anticipada de la Sesión de Carga, el cobro se efectuará conforme a la energía efectivamente suministrada, cuando ello sea técnicamente posible, o será objeto de revisión a solicitud del Usuario. Las solicitudes de cobros, reversos, ajustes o aclaraciones deberán presentarse dentro de un plazo máximo de diez (10) días calendario, contados desde la Sesión de Carga o el cobro correspondiente, a través de los canales de atención, sin perjuicio de los derechos que la ley reconoce al Usuario.',
      },
      {
        type: 'paragraph',
        text: 'Para la gestión de los pagos, la Plataforma utiliza Proveedores de Pago debidamente habilitados, responsables del procesamiento de las transacciones, la validación de los medios de pago y la aplicación de sus propias políticas de seguridad y prevención de fraude. VOLTOP no almacena ni conserva información financiera sensible, como los datos completos de tarjetas de crédito o débito. VOLTOP actúa exclusivamente como facilitador tecnológico del servicio y no es una entidad financiera ni presta servicios bancarios; en consecuencia, no será responsable por rechazos, bloqueos, retenciones, cargos, reversos o validaciones derivados de las políticas o sistemas de las entidades financieras o de los Proveedores de Pago.',
      },
    ],
  },
  {
    id: 'saldo-recargas-y-reembolsos',
    heading: '10. Saldo, recargas y reembolsos',
    body: [
      {
        type: 'paragraph',
        text: 'Cuando la Plataforma habilite la funcionalidad de Saldo o monedero, el Usuario podrá precargar fondos para el pago de las Sesiones de Carga. Las recargas de Saldo no constituyen depósitos, no devengan intereses ni rendimientos, y no podrán ser utilizadas para fines distintos al pago de los Servicios.',
      },
      {
        type: 'paragraph',
        text: 'Los reembolsos de Saldo no consumido procederán conforme a la ley y a las condiciones informadas al Usuario al momento de la recarga. VOLTOP podrá establecer una vigencia para el Saldo y condiciones de uso, las cuales serán informadas de manera previa y clara. En ningún caso VOLTOP aplicará cargos o vencimientos que vulneren los derechos que la ley reconoce al Usuario Consumidor.',
      },
    ],
  },
  {
    id: 'reservas-ocupacion-y-penalidades',
    heading: '11. Reservas, ocupación y penalidades',
    body: [
      {
        type: 'paragraph',
        text: 'Cuando la Plataforma habilite la reserva de Estaciones de Carga, el Usuario acepta las condiciones específicas de la reserva, incluyendo los eventuales cargos por no presentación o por cancelación tardía, los cuales serán informados de manera previa. Con el fin de promover la rotación y la disponibilidad de las Estaciones de Carga, VOLTOP podrá aplicar un cargo por ocupación o permanencia cuando el vehículo permanezca conectado tras finalizar la carga, informado previamente al Usuario.',
      },
    ],
  },
  {
    id: 'promociones-codigos-y-referidos',
    heading: '12. Promociones, códigos y referidos',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP podrá ofrecer promociones, descuentos, códigos o programas de referidos, sujetos a términos específicos, condiciones de elegibilidad y vigencia, que serán informados al momento de su oferta. VOLTOP podrá modificar, suspender o cancelar dichas promociones por razones operativas, técnicas o comerciales. Queda prohibido el uso fraudulento, abusivo o no autorizado de promociones, códigos o programas de referidos; VOLTOP podrá anular los beneficios indebidamente obtenidos y suspender o cancelar las cuentas involucradas.',
      },
    ],
  },
  {
    id: 'interoperabilidad-y-redes-aliadas',
    heading: '13. Interoperabilidad y redes aliadas',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP podrá permitir, mediante acuerdos de interoperabilidad o roaming, el uso de Estaciones de Carga operadas por aliados o terceros. El uso de Estaciones de Carga de terceros podrá regirse adicionalmente por las condiciones, tarifas y políticas del operador correspondiente, las cuales serán informadas cuando resulte aplicable. VOLTOP no será responsable por la disponibilidad, funcionamiento o condiciones de las Estaciones de Carga operadas por terceros.',
      },
    ],
  },
  {
    id: 'derecho-de-retracto-y-reversion-del-pago',
    heading: '14. Derecho de retracto y reversión del pago',
    body: [
      {
        type: 'paragraph',
        text: 'De conformidad con la Ley 1480 de 2011, el derecho de retracto no resulta aplicable a los servicios cuya prestación se inicia, con el consentimiento del Usuario, antes del vencimiento del plazo de retracto, ni a los servicios de consumo o ejecución inmediata. Dado que la Sesión de Carga constituye un servicio de ejecución inmediata que se presta y consume en el momento de su activación, el derecho de retracto no aplica una vez iniciada la Sesión de Carga. Sin perjuicio de lo anterior, el Usuario podrá ejercer el mecanismo de reversión del pago en los términos del artículo 51 de la Ley 1480 de 2011 y sus normas reglamentarias, presentando la solicitud ante VOLTOP y ante el emisor de su instrumento de pago dentro de los plazos legales.',
      },
    ],
  },
  {
    id: 'obligaciones-del-usuario',
    heading: '15. Obligaciones del Usuario',
    body: [
      { type: 'paragraph', text: 'El Usuario se obliga a:' },
      {
        type: 'list',
        items: [
          'Utilizar la Plataforma y las Estaciones de Carga conforme a estos Términos y Condiciones, la ley aplicable y las instrucciones operativas y de seguridad informadas.',
          'Proporcionar información veraz, completa y actualizada, y abstenerse de suplantar a terceros o utilizar datos que no le pertenezcan.',
          'Custodiar de manera diligente sus credenciales de acceso, siendo responsable por todas las actividades realizadas desde su cuenta.',
          'Utilizar de forma adecuada y segura las Estaciones de Carga, absteniéndose de maniobras indebidas, manipulaciones no autorizadas o usos contrarios a las instrucciones técnicas.',
          'Contar con un medio de pago válido y autorizado, y asumir los cargos derivados del uso del Servicio conforme a las Tarifas informadas y aceptadas.',
          'Reportar oportunamente cualquier falla, inconsistencia o situación anómala relacionada con el Servicio, las Estaciones de Carga o los cobros efectuados.',
          'Abstenerse de utilizar la Plataforma o las Estaciones de Carga para fines ilícitos, fraudulentos o contrarios a la buena fe, o que puedan afectar la operación, seguridad o disponibilidad del Servicio.',
          'Indemnizar y mantener indemne a VOLTOP en los términos previstos en estos Términos y Condiciones.',
        ],
      },
      {
        type: 'paragraph',
        text: 'El incumplimiento de estas obligaciones podrá dar lugar a la suspensión o cancelación del acceso del Usuario, sin perjuicio de las demás acciones legales a que haya lugar.',
      },
    ],
  },
  {
    id: 'conductas-prohibidas-y-seguridad-de-la-cuenta',
    heading: '16. Conductas prohibidas y seguridad de la cuenta',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario se abstendrá, en todo momento, de:',
      },
      {
        type: 'list',
        items: [
          'Introducir en la Plataforma virus o códigos maliciosos de cualquier tipo.',
          'Solicitar información de inicio de sesión o acceder a una cuenta perteneciente a otro Usuario.',
          'Utilizar la Plataforma o las Estaciones de Carga para cometer actos contrarios a la ley.',
          'Realizar cualquier acción que pueda afectar el correcto funcionamiento, el diseño o la apariencia de la Plataforma.',
          'Proporcionar datos o información personal falsa.',
          'Crear cuentas para terceros sin su autorización, o crear más de una cuenta personal.',
          'Utilizar los Servicios sin contar con la capacidad legal para obligarse.',
          'Transferir o ceder su cuenta de Usuario.',
          'Publicar contenido o realizar acciones que infrinjan los derechos de terceros o que violen cualquier norma.',
          'Utilizar marcas, signos distintivos, nombres comerciales o derechos de propiedad intelectual o industrial de VOLTOP sin autorización.',
          'Intentar descompilar, realizar ingeniería inversa o decodificar el código fuente o el software de la Plataforma.',
          'Utilizar mecanismos automatizados (bots, scrapers o similares) para acceder, extraer o reproducir el Contenido sin autorización expresa de VOLTOP.',
        ],
      },
    ],
  },
  {
    id: 'suspension-y-cancelacion-de-cuentas',
    heading: '17. Suspensión y cancelación de cuentas',
    body: [
      {
        type: 'paragraph',
        text: 'Sin perjuicio de otras medidas, VOLTOP se reserva el derecho de suspender, temporal o permanentemente, o de cancelar la cuenta de cualquier Usuario, en caso de verificar: la violación de la normativa colombiana; el incumplimiento de estos Términos y Condiciones; la participación en conductas que perjudiquen a VOLTOP, sus afiliadas, subsidiarias, matriz o a terceros; el suministro de información falsa o engañosa que impida la verificación de la identidad; o la detección de actividad fraudulenta, abusiva o que comprometa la seguridad del Servicio. La suspensión o cancelación no generará a favor del Usuario derecho a reparación alguna, sin perjuicio de los derechos que la ley le reconoce respecto de las Sesiones de Carga efectivamente pagadas.',
      },
    ],
  },
  {
    id: 'propiedad-intelectual',
    heading: '18. Propiedad intelectual',
    body: [
      {
        type: 'paragraph',
        text: 'La Plataforma y el Contenido son de propiedad exclusiva de VOLTOP. Todos los contenidos, incluyendo, sin limitarse a ello, el código fuente, el software, la propiedad industrial, las imágenes y los diseños, están protegidos por derechos de autor, marcas registradas y demás derechos de propiedad intelectual e industrial de VOLTOP, conforme a la normativa aplicable. El acceso a la Plataforma no otorga autorización o licencia sobre dichos contenidos y derechos, salvo la licencia limitada de uso prevista en estos Términos y Condiciones.',
      },
      {
        type: 'paragraph',
        text: 'Queda estrictamente prohibida cualquier reproducción, distribución, transformación, comunicación pública o cesión, total o parcial, del Contenido, así como cualquier otro acto de explotación no autorizado. VOLTOP se reserva el derecho de emprender las acciones civiles, administrativas y penales a que haya lugar por el incumplimiento de esta cláusula.',
      },
    ],
  },
  {
    id: 'licencia-de-uso-de-la-aplicacion',
    heading: '19. Licencia de uso de la Aplicación',
    body: [
      {
        type: 'paragraph',
        text: 'Con estricto apego a estos Términos y Condiciones, VOLTOP otorga al Usuario una licencia limitada, no exclusiva, intransferible, revocable y temporal para descargar, instalar y ejecutar una copia de la Aplicación, exclusivamente para su uso personal en su dispositivo. El Usuario acepta cumplir con los términos y avisos de privacidad de las tiendas de aplicaciones (iOS y Android) respecto de la obtención, descarga y actualización de la Aplicación. En caso de no realizar las actualizaciones, el Usuario asume las fallas o perjuicios que de ello se deriven.',
      },
    ],
  },
  {
    id: 'tratamiento-de-datos-personales',
    heading: '20. Tratamiento de datos personales',
    body: [
      {
        type: 'paragraph',
        text: 'Toda la información suministrada por el Usuario será tratada conforme a la Política de Tratamiento de Datos Personales y Aviso de Privacidad de VOLTOP, expedida en cumplimiento de la Ley 1581 de 2012 y sus normas reglamentarias, disponible en https://www.voltop.co. Al aceptar estos Términos y Condiciones, el Usuario declara conocer dicha política, que forma parte integral del presente documento, y autoriza el tratamiento de sus datos personales en los términos allí previstos.',
      },
    ],
  },
  {
    id: 'cookies-y-tecnologias-similares',
    heading: '21. Cookies y tecnologías similares',
    body: [
      {
        type: 'paragraph',
        text: 'El Sitio Web y la Aplicación pueden utilizar cookies y tecnologías similares para su correcto funcionamiento, para recordar las preferencias del Usuario, para fines analíticos y, cuando corresponda, para fines publicitarios. El Usuario podrá gestionar o deshabilitar las cookies a través de la configuración de su navegador o dispositivo o del gestor de consentimiento dispuesto en el Sitio Web, teniendo en cuenta que su deshabilitación puede afectar algunas funcionalidades. El uso de cookies se rige por la Política de Tratamiento de Datos Personales y Aviso de Privacidad.',
      },
    ],
  },
  {
    id: 'limitacion-de-responsabilidad',
    heading: '22. Limitación de responsabilidad',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP no garantiza la disponibilidad continua ni el funcionamiento ininterrumpido de la Plataforma ni de las Estaciones de Carga. Dentro de los límites permitidos por la ley, VOLTOP no asumirá responsabilidad por daños o perjuicios que puedan surgir como consecuencia de:',
      },
      {
        type: 'list',
        items: [
          'La falta de disponibilidad o accesibilidad a la Plataforma o a una Estación de Carga.',
          'Interrupciones, fallos informáticos, desconexiones, retrasos o bloqueos por deficiencias o sobrecargas en centros de datos, redes de internet, redes de telecomunicaciones u otros sistemas electrónicos.',
          'Problemas de velocidad, errores o anomalías originados en la red de internet, en las redes de telecomunicaciones, en casos fortuitos, de fuerza mayor o en cualquier otra contingencia imprevisible ajena a VOLTOP.',
          'Pérdidas o daños provocados por virus, ataques informáticos u otras intrusiones de terceros ajenos al control de VOLTOP.',
          'Órdenes de autoridades gubernamentales que afecten la prestación del Servicio y no sean imputables a VOLTOP.',
          'La culpa exclusiva del Usuario o de un tercero, incluido el uso indebido de las Estaciones de Carga o los defectos del vehículo del Usuario.',
          'La pérdida de información durante el mantenimiento o actualización de la Plataforma.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Dentro de los límites permitidos por la ley, VOLTOP no será responsable por daños indirectos, incidentales, especiales, punitivos o consecuenciales, ni por lucro cesante o pérdida de datos. En la medida permitida por la ley aplicable, la responsabilidad total y acumulada de VOLTOP frente al Usuario, por cualquier concepto, se limitará al mayor valor entre las Sesiones de Carga efectivamente pagadas por el Usuario durante los tres (3) meses anteriores al hecho que originó la reclamación.',
      },
      {
        type: 'paragraph',
        text: 'Las limitaciones y exclusiones de esta cláusula no aplican respecto de la responsabilidad que no puede limitarse ni excluirse conforme a la ley, incluyendo la derivada de dolo o culpa grave de VOLTOP, ni respecto de los derechos que el Estatuto del Consumidor (Ley 1480 de 2011) reconoce al Usuario Consumidor. VOLTOP empleará esfuerzos razonables para resolver las incidencias y brindar el soporte necesario.',
      },
    ],
  },
  {
    id: 'garantia-legal-y-derechos-del-consumidor',
    heading: '23. Garantía legal y derechos del consumidor',
    body: [
      {
        type: 'paragraph',
        text: 'Nada de lo previsto en estos Términos y Condiciones restringe, menoscaba o limita los derechos que la Ley 1480 de 2011 (Estatuto del Consumidor) y demás normas de protección al consumidor reconocen a los Usuarios que tengan la calidad de Usuario Consumidor, incluyendo el derecho a la garantía legal del Servicio prestado. Cualquier cláusula que resulte contraria a dichas normas se entenderá no escrita en lo que las contraríe, sin afectar la validez de las demás disposiciones.',
      },
    ],
  },
  {
    id: 'usuarios-empresariales-no-consumidores',
    heading: '24. Usuarios Empresariales (no consumidores)',
    body: [
      {
        type: 'paragraph',
        text: 'Cuando el Usuario actúe como Usuario Empresarial, es decir, utilice el Servicio en el marco de su actividad económica, comercial o profesional, no tendrá la calidad de consumidor y, en consecuencia, no le serán aplicables las protecciones especiales del Estatuto del Consumidor. Respecto de los Usuarios Empresariales, las limitaciones y exclusiones de responsabilidad, las cláusulas de indemnidad y las demás disposiciones de estos Términos y Condiciones aplicarán en su máxima extensión permitida por la ley. Cuando exista un contrato específico entre VOLTOP y el Usuario Empresarial, dicho contrato prevalecerá conforme a la cláusula de ámbito de aplicación.',
      },
    ],
  },
  {
    id: 'indemnidad',
    heading: '25. Indemnidad',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario se obliga a indemnizar, defender y mantener indemne a VOLTOP, sus sociedades matrices, subsidiarias, afiliadas, accionistas, administradores, empleados, aliados y representantes, frente a cualquier reclamación, demanda, sanción, multa, pérdida, daño, perjuicio, costo o gasto, incluidos los honorarios razonables de abogados, que se deriven de: (i) el uso indebido o no autorizado de la Plataforma o de las Estaciones de Carga; (ii) el incumplimiento de estos Términos y Condiciones o de la ley aplicable; (iii) la infracción de derechos de terceros, incluidos los de propiedad intelectual; o (iv) la información falsa, inexacta o desactualizada suministrada por el Usuario. Esta obligación subsistirá a la terminación de la relación entre el Usuario y VOLTOP.',
      },
    ],
  },
  {
    id: 'servicios-contenidos-y-enlaces-de-terceros',
    heading: '26. Servicios, contenidos y enlaces de terceros',
    body: [
      {
        type: 'paragraph',
        text: 'La Plataforma puede contener enlaces, integraciones o referencias a sitios, servicios o contenidos de terceros, incluidos los Proveedores de Pago y los operadores de Estaciones de Carga aliados. VOLTOP no controla ni es responsable por la disponibilidad, exactitud, contenidos, políticas o prácticas de dichos terceros. El acceso del Usuario a tales servicios o contenidos se realiza bajo su propia responsabilidad y se rige por los términos y políticas de los respectivos terceros.',
      },
    ],
  },
  {
    id: 'fuerza-mayor-y-caso-fortuito',
    heading: '27. Fuerza mayor y caso fortuito',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP no será responsable por el incumplimiento o el cumplimiento defectuoso o tardío de sus obligaciones cuando ello obedezca a eventos de fuerza mayor o caso fortuito, en los términos de la legislación colombiana, incluyendo, sin limitarse a ello, fallas generalizadas en el suministro de energía o de telecomunicaciones, desastres naturales, actos de autoridad, conmoción interna, ciberataques de gran escala o cualquier otro evento imprevisible e irresistible ajeno a su control.',
      },
    ],
  },
  {
    id: 'independencia-de-las-partes',
    heading: '28. Independencia de las partes',
    body: [
      {
        type: 'paragraph',
        text: 'Estos Términos y Condiciones regulan la prestación de los Servicios entre la Compañía, como prestador, y el Usuario, como destinatario del Servicio. En ningún momento la relación entre las partes podrá considerarse como una relación de dependencia, subordinación, sociedad, mandato o agencia.',
      },
    ],
  },
  {
    id: 'obligaciones-legales-y-tributarias-del-usuario',
    heading: '29. Obligaciones legales y tributarias del Usuario',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario asume la total responsabilidad por el cumplimiento de las obligaciones fiscales y cargas impositivas que se deriven de las operaciones que realice a través de la Plataforma. VOLTOP no será responsable por el cumplimiento de las obligaciones fiscales a cargo del Usuario, ni por cualquier otra obligación derivada de actividades propias de este.',
      },
    ],
  },
  {
    id: 'modificaciones-a-los-terminos-y-condiciones',
    heading: '30. Modificaciones a los Términos y Condiciones',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP podrá modificar estos Términos y Condiciones en cualquier momento, por razones operativas, técnicas, comerciales, de seguridad o por cambios normativos. Las modificaciones que afecten de manera sustancial los derechos u obligaciones del Usuario, incluidas las relacionadas con precios o limitaciones relevantes del servicio, serán notificadas a través de la Plataforma y, cuando corresponda, mediante el correo electrónico registrado, con antelación razonable a su entrada en vigencia. Las modificaciones de carácter operativo, técnico, de seguridad o correctivo podrán entrar en vigor de manera inmediata, previa publicación.',
      },
      {
        type: 'paragraph',
        text: 'El uso de la Plataforma o de las Estaciones de Carga con posterioridad a la publicación de las modificaciones se entenderá como aceptación de las mismas. En caso de no estar de acuerdo, el Usuario deberá abstenerse de continuar utilizando el Servicio. La versión vigente será la publicada en la Plataforma y sustituirá cualquier versión anterior.',
      },
    ],
  },
  {
    id: 'duracion-y-terminacion',
    heading: '31. Duración y terminación',
    body: [
      {
        type: 'paragraph',
        text: 'La prestación del Servicio y el uso de la Plataforma tienen, en principio, duración indefinida. La Compañía podrá dar por terminada o suspender la prestación de los Servicios en cualquier momento, conforme a la ley, sin que ello dé lugar a indemnización a favor del Usuario, salvo respecto de las Sesiones de Carga efectivamente pagadas y no prestadas o del Saldo no consumido. El Usuario podrá dejar de usar la Plataforma en cualquier momento.',
      },
    ],
  },
  {
    id: 'cesion',
    heading: '32. Cesión',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario no podrá ceder ni transferir, total o parcialmente, sus derechos u obligaciones derivados de estos Términos y Condiciones, ni cualquier reclamación contra VOLTOP, sin la autorización previa y escrita de la Compañía. VOLTOP podrá ceder su posición contractual, derechos u obligaciones a cualquier sociedad de su grupo empresarial o a un tercero, en el marco de operaciones de reorganización empresarial, garantizando los derechos del Usuario.',
      },
    ],
  },
  {
    id: 'notificaciones-y-comunicaciones-electronicas',
    heading: '33. Notificaciones y comunicaciones electrónicas',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario acepta que VOLTOP pueda enviarle comunicaciones y notificaciones relacionadas con el Servicio a través de medios electrónicos, incluyendo el correo electrónico registrado y las notificaciones dentro de la Plataforma, las cuales se entenderán válidas y eficaces.',
      },
      {
        type: 'paragraph',
        text: 'Para efectos de notificaciones, VOLTOP tiene su domicilio principal en la ciudad de Bogotá D.C., en la dirección Cra. 15 # 80-90, y atenderá comunicaciones a través del correo electrónico soporte@voltop.co.',
      },
    ],
  },
  {
    id: 'divisibilidad-integralidad-y-no-renuncia',
    heading: '34. Divisibilidad, integralidad y no renuncia',
    body: [
      {
        type: 'paragraph',
        text: 'Si alguna disposición de estos Términos y Condiciones es declarada inválida, ilegal o inexigible por autoridad competente, dicha disposición se entenderá separada del resto, y las demás conservarán plena validez y exigibilidad. Estos Términos y Condiciones, junto con la Política de Tratamiento de Datos Personales y las condiciones particulares aplicables, constituyen el acuerdo íntegro entre las partes respecto de su objeto. El hecho de que VOLTOP no exija el cumplimiento de alguna disposición no constituirá renuncia a su derecho de exigirlo posteriormente.',
      },
    ],
  },
  {
    id: 'atencion-al-usuario-pqrs-y-autoridad-de-control',
    heading: '35. Atención al usuario, PQRS y autoridad de control',
    body: [
      {
        type: 'paragraph',
        text: 'El Usuario podrá presentar peticiones, quejas, reclamos y sugerencias (PQRS) a través de los canales de atención habilitados en la Plataforma o mediante el correo electrónico soporte@voltop.co. Sin perjuicio de lo anterior, el Usuario que tenga la calidad de consumidor podrá acudir a la Superintendencia de Industria y Comercio (SIC) en ejercicio de los derechos que le reconoce el Estatuto del Consumidor.',
      },
    ],
  },
  {
    id: 'ley-aplicable-y-jurisdiccion',
    heading: '36. Ley aplicable y jurisdicción',
    body: [
      {
        type: 'paragraph',
        text: 'Estos Términos y Condiciones, la Plataforma, las Estaciones de Carga, sus contenidos y servicios, así como las relaciones entre los Usuarios y la Compañía, se regirán e interpretarán conforme a las leyes de la República de Colombia. Salvo que la normativa aplicable disponga un fuero diferente, cualquier controversia se someterá a los jueces de la jurisdicción ordinaria de la República de Colombia, con domicilio en la ciudad de Bogotá D.C. Las partes procurarán resolver de manera directa y de buena fe cualquier diferencia antes de acudir a las instancias judiciales. El idioma de los presentes Términos y Condiciones es el español, que prevalecerá sobre cualquier traducción.',
      },
    ],
  },
  {
    id: 'aviso-legal',
    heading: '37. Aviso legal',
    body: [
      {
        type: 'paragraph',
        text: 'La información disponible en la Plataforma tiene carácter informativo y operativo. VOLTOP realiza esfuerzos razonables para mantener la información actualizada y correcta; sin embargo, no garantiza que se encuentre libre de errores, interrupciones o imprecisiones derivadas de causas técnicas, operativas o de terceros. La Plataforma puede estar expuesta a riesgos inherentes al uso de tecnologías de la información, incluyendo accesos no autorizados o vulneraciones ocasionadas por terceros ajenos al control de VOLTOP, quien implementa medidas razonables de seguridad sin que ello implique una garantía absoluta. El Usuario es responsable de adoptar las medidas necesarias para la protección de sus dispositivos, credenciales y entornos digitales.',
      },
    ],
  },
  {
    id: 'vigencia',
    heading: '38. Vigencia',
    body: [
      {
        type: 'paragraph',
        text: 'Los presentes Términos y Condiciones entran en vigencia a partir de su publicación y son aplicables a todos los Usuarios desde el momento de su aceptación. La versión vigente será aquella publicada y disponible en la Plataforma en cada momento, sin perjuicio de las modificaciones que puedan realizarse conforme a lo establecido en este documento.',
      },
    ],
  },
]

/** Official title, as issued:
 *  POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES Y AVISO DE PRIVACIDAD - VOLTOP */
const privacySections: LegalSection[] = [
  {
    id: 'identificacion-del-responsable-del-tratamiento',
    heading: '1. Identificación del Responsable del Tratamiento',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP S.A.S. (en adelante, «VOLTOP»), sociedad comercial constituida conforme a las leyes de la República de Colombia, identificada con NIT 901.723.964-6, con domicilio principal en la ciudad de Bogotá D.C., República de Colombia, actúa como Responsable del Tratamiento de los datos personales recolectados a través de la aplicación móvil, el sitio web y las estaciones de carga de VOLTOP (en adelante, la «Plataforma»).',
      },
      {
        type: 'paragraph',
        text: 'Datos de contacto: Dirección: Cra. 15 # 80-90, Bogotá D.C. Correo electrónico: soporte@voltop.co. Sitio web: https://www.voltop.co.',
      },
    ],
  },
  {
    id: 'marco-legal-y-ambito-de-aplicacion',
    heading: '2. Marco legal y ámbito de aplicación',
    body: [
      {
        type: 'paragraph',
        text: 'La presente Política de Tratamiento de Datos Personales y Aviso de Privacidad (en adelante, la «Política») se expide en cumplimiento de la Constitución Política de Colombia, la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único Reglamentario 1074 de 2015) y demás normas que las modifiquen, complementen o sustituyan. La Política aplica a todos los Usuarios (en adelante, el «Titular») cuyos datos personales sean tratados por VOLTOP a través de la Plataforma.',
      },
    ],
  },
  {
    id: 'definiciones',
    heading: '3. Definiciones',
    body: [
      {
        type: 'paragraph',
        text: 'Autorización: Consentimiento previo, expreso e informado del Titular para llevar a cabo el tratamiento de sus datos personales.',
      },
      {
        type: 'paragraph',
        text: 'Dato personal: Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.',
      },
      {
        type: 'paragraph',
        text: 'Dato sensible: Dato que afecta la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como los relacionados con salud, datos biométricos, origen racial o étnico, orientación política, convicciones religiosas u orientación sexual.',
      },
      {
        type: 'paragraph',
        text: 'Encargado del Tratamiento: Persona natural o jurídica que realiza el tratamiento de datos personales por cuenta del Responsable.',
      },
      {
        type: 'paragraph',
        text: 'Responsable del Tratamiento: VOLTOP S.A.S., quien decide sobre la base de datos y el tratamiento de los datos.',
      },
      {
        type: 'paragraph',
        text: 'Titular: Persona natural cuyos datos personales son objeto de tratamiento.',
      },
      {
        type: 'paragraph',
        text: 'Tratamiento: Cualquier operación sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.',
      },
      {
        type: 'paragraph',
        text: 'Transferencia: Envío de datos por el Responsable o Encargado, ubicado en Colombia, a un receptor que es Responsable y se encuentra dentro o fuera del país.',
      },
      {
        type: 'paragraph',
        text: 'Transmisión: Tratamiento de datos que implica su comunicación a un Encargado, dentro o fuera del territorio nacional, para que realice el tratamiento por cuenta del Responsable.',
      },
    ],
  },
  {
    id: 'datos-personales-que-recolectamos',
    heading: '4. Datos personales que recolectamos',
    body: [
      {
        type: 'paragraph',
        text: 'A través de la Plataforma, VOLTOP podrá recolectar y tratar los siguientes datos personales:',
      },
      {
        type: 'list',
        items: [
          'Datos de identificación y contacto: nombre y apellidos, documento de identificación, dirección de correo electrónico y número de teléfono.',
          'Información asociada al uso de la Plataforma y a las Sesiones de Carga: historial de uso, estaciones utilizadas, energía consumida, duración y horarios de las sesiones.',
          'Datos técnicos del vehículo y de la carga, tales como modelo del vehículo, estado de carga, potencia y energía suministrada, cuando el vehículo o la Estación de Carga los reporten.',
          'Datos asociados a transacciones y facturación del servicio, sin incluir información financiera sensible, como los números completos de tarjetas de crédito o débito.',
          'Datos técnicos y de navegación: tipo de dispositivo, identificadores del dispositivo, dirección IP, datos de cookies y registros de actividad, según los permisos otorgados.',
          'Datos de geolocalización, cuando el Titular los autorice, para mostrar las Estaciones de Carga cercanas y mejorar el servicio.',
        ],
      },
    ],
  },
  {
    id: 'datos-sensibles-y-datos-de-menores-de-edad',
    heading: '5. Datos sensibles y datos de menores de edad',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP no recolecta datos sensibles de manera necesaria para la prestación del servicio. En caso de requerir el tratamiento de algún dato sensible, lo hará únicamente con la autorización previa, expresa e informada del Titular, advirtiéndole que no está obligado a autorizar su tratamiento. El Titular podrá negarse a suministrar datos sensibles sin que ello afecte el acceso a los servicios que no los requieran.',
      },
      {
        type: 'paragraph',
        text: 'La Plataforma está dirigida a personas mayores de edad con capacidad legal para contratar. VOLTOP no recolecta de manera consciente datos de menores de edad. En caso de identificar que se han recolectado datos de un menor sin la autorización de su representante legal, VOLTOP procederá a su supresión.',
      },
    ],
  },
  {
    id: 'finalidades-del-tratamiento',
    heading: '6. Finalidades del tratamiento',
    body: [
      {
        type: 'paragraph',
        text: 'Los datos personales recolectados serán tratados para las siguientes finalidades:',
      },
      {
        type: 'list',
        items: [
          'Permitir el registro, la autenticación y la administración del Titular en la Plataforma.',
          'Gestionar la activación, el control y el seguimiento de las Sesiones de Carga eléctrica.',
          'Facilitar la facturación, el cobro y la gestión de pagos del servicio.',
          'Atender peticiones, consultas, quejas y reclamos del Titular.',
          'Enviar comunicaciones operativas y de servicio relacionadas con el funcionamiento de la Plataforma.',
          'Enviar, cuando el Titular lo autorice, comunicaciones comerciales, promocionales y de mercadeo sobre productos y servicios de VOLTOP.',
          'Realizar análisis estadísticos, técnicos, de calidad y de mejora continua de la Plataforma y del servicio.',
          'Prevenir, detectar y gestionar fraudes, usos indebidos e incidentes de seguridad.',
          'Compartir y transmitir datos a Encargados y aliados estrictamente necesarios para la prestación del servicio, conforme a esta Política.',
          'Dar cumplimiento a las obligaciones legales, regulatorias y a los requerimientos de autoridades competentes.',
        ],
      },
    ],
  },
  {
    id: 'autorizacion-del-titular',
    heading: '7. Autorización del Titular',
    body: [
      {
        type: 'paragraph',
        text: 'La autorización para el tratamiento de los datos personales será obtenida del Titular por medios que permitan su posterior consulta, tales como la aceptación expresa al momento del registro, la marcación de casillas de aceptación o cualquier otra conducta inequívoca que permita concluir de forma razonable que otorgó su autorización. El suministro de los datos es voluntario; no obstante, determinados datos son necesarios para la prestación del servicio, por lo que su no suministro puede impedir el acceso a ciertas funcionalidades.',
      },
    ],
  },
  {
    id: 'tratamiento-de-datos-relacionados-con-pagos',
    heading: '8. Tratamiento de datos relacionados con pagos',
    body: [
      {
        type: 'paragraph',
        text: 'La gestión de los pagos se realiza a través de proveedores externos de servicios de pago y entidades financieras debidamente habilitadas. VOLTOP no almacena ni conserva información financiera sensible, la cual es tratada directamente por dichos terceros conforme a sus propias políticas de seguridad, privacidad y prevención de fraude. VOLTOP actúa exclusivamente como facilitador tecnológico del servicio y no es una entidad financiera ni presta servicios bancarios.',
      },
    ],
  },
  {
    id: 'cookies-y-tecnologias-de-seguimiento',
    heading: '9. Cookies y tecnologías de seguimiento',
    body: [
      {
        type: 'paragraph',
        text: 'El sitio web y la aplicación de VOLTOP pueden utilizar cookies y tecnologías similares, que se clasifican en las siguientes categorías:',
      },
      {
        type: 'list',
        items: [
          'Cookies necesarias o técnicas: indispensables para el funcionamiento de la Plataforma y la prestación del servicio.',
          'Cookies funcionales o de preferencias: permiten recordar las elecciones del Titular y personalizar la experiencia.',
          'Cookies analíticas o de desempeño: permiten medir y analizar el uso de la Plataforma para mejorar el servicio.',
          'Cookies publicitarias o de mercadeo: permiten mostrar contenidos y publicidad relevantes, cuando el Titular lo autorice.',
        ],
      },
      {
        type: 'paragraph',
        text: 'El Titular puede gestionar o deshabilitar las cookies a través de la configuración de su navegador o dispositivo, o del gestor de consentimiento dispuesto en el sitio web, teniendo en cuenta que ello puede afectar el funcionamiento de algunas funcionalidades.',
      },
    ],
  },
  {
    id: 'categorias-de-destinatarios-y-encargados',
    heading: '10. Categorías de destinatarios y Encargados',
    body: [
      {
        type: 'paragraph',
        text: 'Para el cumplimiento de las finalidades descritas, VOLTOP podrá compartir, transmitir o transferir datos personales, en lo estrictamente necesario, a las siguientes categorías de destinatarios:',
      },
      {
        type: 'list',
        items: [
          'Proveedores de procesamiento de pagos y entidades financieras habilitadas.',
          'Proveedores de infraestructura tecnológica, alojamiento en la nube, almacenamiento y soporte técnico.',
          'Proveedores de analítica, mensajería, comunicaciones y atención al cliente.',
          'Operadores de Estaciones de Carga aliados y socios de interoperabilidad.',
          'Sociedades del grupo empresarial de VOLTOP, para fines administrativos y de prestación del servicio.',
          'Autoridades públicas, administrativas o judiciales, cuando exista una obligación legal o un requerimiento válido.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Estos destinatarios actúan como Encargados del Tratamiento bajo las instrucciones de VOLTOP o como Responsables independientes, según el caso, y están obligados a cumplir niveles de protección equivalentes a los previstos en esta Política y en la normativa aplicable.',
      },
    ],
  },
  {
    id: 'transferencia-y-transmision-nacional-e-internaci',
    heading: '11. Transferencia y transmisión nacional e internacional de datos',
    body: [
      {
        type: 'paragraph',
        text: 'Algunos de los destinatarios, Encargados y proveedores de VOLTOP pueden encontrarse fuera del territorio colombiano, por ejemplo, en Estados Unidos, Brasil, Islas Caimán o en los países donde operen los proveedores de servicios tecnológicos y de alojamiento en la nube. En consecuencia, los datos personales podrán ser objeto de transferencia o transmisión internacional para el cumplimiento de las finalidades descritas en esta Política.',
      },
      {
        type: 'paragraph',
        text: 'Cuando dichas transferencias o transmisiones impliquen el envío de datos a países que no garanticen un nivel adecuado de protección conforme a los estándares de la Superintendencia de Industria y Comercio, VOLTOP adoptará las medidas necesarias para garantizar la protección de los datos, tales como la suscripción de contratos de transmisión de datos personales y la exigencia de estándares de seguridad y confidencialidad equivalentes a los previstos en la normativa colombiana. Con la aceptación de esta Política, el Titular autoriza dichas transferencias y transmisiones en los términos aquí señalados.',
      },
    ],
  },
  {
    id: 'conservacion-de-la-informacion',
    heading: '12. Conservación de la información',
    body: [
      {
        type: 'paragraph',
        text: 'Los datos personales serán conservados durante el tiempo necesario para cumplir las finalidades del tratamiento y mientras subsistan las obligaciones legales aplicables, atendiendo, de manera enunciativa, los siguientes criterios:',
      },
      {
        type: 'list',
        items: [
          'Datos de la cuenta: mientras la cuenta del Titular se encuentre activa y por el tiempo adicional necesario para atender obligaciones legales o reclamaciones.',
          'Datos de transacciones y facturación: durante el término exigido por las normas contables y tributarias, que en Colombia es, por regla general, de diez (10) años.',
          'Datos para la atención de peticiones, consultas y reclamos: durante el tiempo necesario para su gestión y para atender eventuales reclamaciones derivadas.',
          'Datos tratados con fines de mercadeo: hasta que el Titular revoque su autorización o solicite su supresión.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Cumplidas las finalidades y vencidos los plazos legales, los datos serán suprimidos o anonimizados, salvo que su conservación sea exigida por disposición legal.',
      },
    ],
  },
  {
    id: 'derechos-del-titular',
    heading: '13. Derechos del Titular',
    body: [
      {
        type: 'paragraph',
        text: 'El Titular de los datos personales tiene derecho a:',
      },
      {
        type: 'list',
        items: [
          'Conocer, actualizar y rectificar sus datos personales.',
          'Solicitar prueba de la autorización otorgada para el tratamiento.',
          'Ser informado sobre el uso que se ha dado a sus datos personales.',
          'Presentar consultas y reclamos relacionados con el tratamiento de sus datos.',
          'Revocar la autorización o solicitar la supresión de sus datos, cuando ello sea procedente conforme a la ley.',
          'Acceder de forma gratuita a sus datos personales.',
          'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la normativa de protección de datos, una vez agotado el trámite de consulta o reclamo ante VOLTOP.',
        ],
      },
    ],
  },
  {
    id: 'procedimiento-para-el-ejercicio-de-derechos',
    heading: '14. Procedimiento para el ejercicio de derechos',
    body: [
      {
        type: 'paragraph',
        text: 'El Titular podrá ejercer sus derechos presentando una consulta o reclamo a través del correo electrónico soporte@voltop.co o de los canales de atención habilitados en la Plataforma, indicando su identificación, la descripción de los hechos y los datos de contacto.',
      },
      {
        type: 'paragraph',
        text: 'Consultas: serán atendidas en un término máximo de diez (10) días hábiles contados desde su recibo. Cuando no fuere posible atenderla dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá, que no superará los cinco (5) días hábiles siguientes al vencimiento del primer plazo.',
      },
      {
        type: 'paragraph',
        text: 'Reclamos: serán atendidos en un término máximo de quince (15) días hábiles contados desde el día siguiente a su recibo. Cuando no fuere posible atenderlo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá, que no superará los ocho (8) días hábiles siguientes al vencimiento del primer plazo. Si el reclamo resulta incompleto, se requerirá al interesado para que subsane las fallas dentro de los cinco (5) días siguientes.',
      },
    ],
  },
  {
    id: 'area-responsable-de-la-atencion',
    heading: '15. Área responsable de la atención',
    body: [
      {
        type: 'paragraph',
        text: 'El área encargada de atender las peticiones, consultas y reclamos relacionados con el tratamiento de datos personales es el área de atención al usuario de VOLTOP, a través del correo electrónico soporte@voltop.co y de los canales dispuestos en la Plataforma.',
      },
    ],
  },
  {
    id: 'medidas-de-seguridad',
    heading: '16. Medidas de seguridad',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP implementa medidas administrativas, técnicas y organizacionales razonables orientadas a proteger los datos personales contra accesos no autorizados, pérdida, alteración, uso indebido o consulta no autorizada, sin que ello implique una garantía absoluta de seguridad. VOLTOP exige a sus Encargados la adopción de medidas de seguridad equivalentes.',
      },
    ],
  },
  {
    id: 'registro-nacional-de-bases-de-datos',
    heading: '17. Registro Nacional de Bases de Datos',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP cumple con la inscripción de sus bases de datos que contienen datos personales en el Registro Nacional de Bases de Datos (RNBD) administrado por la Superintendencia de Industria y Comercio, en los casos y términos en que ello resulte legalmente exigible.',
      },
    ],
  },
  {
    id: 'vigencia-de-la-politica-y-de-las-bases-de-datos',
    heading: '18. Vigencia de la Política y de las bases de datos',
    body: [
      {
        type: 'paragraph',
        text: 'La presente Política entra en vigencia a partir de su publicación en la Plataforma. Las bases de datos administradas por VOLTOP tendrán vigencia durante el tiempo necesario para cumplir las finalidades del tratamiento y mientras subsistan las obligaciones legales aplicables.',
      },
    ],
  },
  {
    id: 'modificaciones',
    heading: '19. Modificaciones',
    body: [
      {
        type: 'paragraph',
        text: 'VOLTOP podrá modificar esta Política en cualquier momento. Cualquier actualización será informada a los Titulares a través de la Plataforma o de los canales habituales de comunicación. El uso de la Plataforma con posterioridad a la publicación de las modificaciones se entenderá como aceptación de las mismas.',
      },
    ],
  },
  {
    id: 'aceptacion',
    heading: '20. Aceptación',
    body: [
      {
        type: 'paragraph',
        text: 'El Titular reconoce que ha leído y comprendido la presente Política de Tratamiento de Datos Personales y Aviso de Privacidad, y autoriza de manera libre, previa, expresa e informada el tratamiento de sus datos personales conforme a lo aquí establecido.',
      },
    ],
  },
]

export const legalDocs = {
  terms: {
    title:
      'TÉRMINOS Y CONDICIONES DE USO PLATAFORMA, APLICACIÓN, SITIO WEB Y ESTACIONES DE CARGA VOLTOP',
    updated: '29 de mayo de 2026',
    updatedISO: '2026-05-29',
    sections: termsSections,
  },
  privacy: {
    title: 'POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES Y AVISO DE PRIVACIDAD - VOLTOP',
    updated: '29 de mayo de 2026',
    updatedISO: '2026-05-29',
    sections: privacySections,
  },
} satisfies Record<string, LegalDoc>
