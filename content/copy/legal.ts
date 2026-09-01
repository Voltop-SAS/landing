import type { Localized } from "@/lib/i18n/config";

/**
 * COPY · Legal
 *
 * ⚠️ CONTENIDO PENDIENTE. El texto legal de la política de tratamiento de datos
 * debe redactarlo el área legal de Voltop conforme a la Ley 1581 de 2012 y al
 * Decreto 1074 de 2015. No se redacta aquí ni se aproxima: un texto legal
 * inventado es peor que ninguno.
 *
 * Esta página existe porque el formulario de leads enlaza a ella (requisito de
 * la autorización informada). La estructura queda lista para recibir el texto:
 * al pegarlo en `sections` la página deja de mostrar el aviso de pendiente.
 */

export const legal = {
  privacy: {
    meta: {
      title: { es: "Política de tratamiento de datos", en: "Data processing policy", pt: "Política de tratamento de dados", } satisfies Localized,
      description: {
        es: "Política de tratamiento de datos personales de Voltop conforme a la normativa colombiana de protección de datos.",
        en: "Voltop's personal data processing policy under Colombian data protection regulations.",
        pt: "Política de tratamento de dados pessoais da Voltop conforme a regulamentação colombiana de proteção de dados.",
      } satisfies Localized,
    },
    eyebrow: { es: "Legal", en: "Legal", pt: "Legal", } satisfies Localized,
    title: { es: "Política de tratamiento de datos personales", en: "Personal data processing policy", pt: "Política de tratamento de dados pessoais", } satisfies Localized,

    pendingTag: { es: "Texto legal pendiente", en: "Legal text pending", pt: "Texto jurídico pendente", } satisfies Localized,
    pendingBody: {
      es: "El texto definitivo de esta política debe ser emitido por el área legal de Voltop conforme a la Ley 1581 de 2012 y sus decretos reglamentarios. No se publica una versión aproximada.",
      en: "The final text of this policy must be issued by Voltop's legal team in accordance with Colombian Law 1581 of 2012 and its implementing decrees. No approximate version is published.",
      pt: "O texto final desta política deve ser emitido pela área jurídica da Voltop conforme a Lei colombiana 1581 de 2012 e seus decretos regulamentadores. Nenhuma versão aproximada é publicada.",
    } satisfies Localized,

    /** Qué debe cubrir el texto final. Sirve de brief para el área legal. */
    requiredContents: [
      { es: "Identificación del responsable del tratamiento y sus datos de contacto", en: "Identification of the data controller and its contact details", pt: "Identificação do responsável pelo tratamento e seus dados de contato", },
      { es: "Finalidades del tratamiento de los datos recogidos", en: "Purposes of the processing of collected data", pt: "Finalidades do tratamento dos dados coletados", },
      { es: "Derechos del titular: conocer, actualizar, rectificar y suprimir", en: "Data subject rights: to access, update, rectify and delete", pt: "Direitos do titular: acessar, atualizar, retificar e excluir", },
      { es: "Procedimiento para ejercer esos derechos", en: "Procedure to exercise those rights", pt: "Procedimento para exercer esses direitos", },
      { es: "Área responsable de atender consultas y reclamos", en: "Department responsible for handling queries and complaints", pt: "Área responsável pelo atendimento de dúvidas e reclamações", },
      { es: "Vigencia de la política y de las bases de datos", en: "Validity of the policy and of the databases", pt: "Vigência da política e dos bancos de dados", },
    ] satisfies Localized[],
    requiredContentsTitle: { es: "Contenidos que debe cubrir", en: "Contents to be covered", pt: "Conteúdos a serem cobertos", } satisfies Localized,

    /** Texto final: vacío hasta recibirlo del área legal. */
    sections: [] as { heading: Localized; body: Localized[] }[],
  },
};
