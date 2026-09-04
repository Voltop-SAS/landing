import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · Legal
 *
 * ⚠️ CONTENT PENDING. The legal text of the data-processing policy must be
 * drafted by Voltop's legal team in accordance with Ley 1581 de 2012 and
 * Decreto 1074 de 2015. It is neither drafted nor approximated here: an
 * invented legal text is worse than none.
 *
 * This page exists because the lead form links to it (a requirement of
 * informed authorisation). The structure is ready to receive the text: once it
 * is pasted into `sections`, the page stops showing the pending notice.
 */

export const legal = {
  privacy: {
    meta: {
      title: {
        es: 'Política de tratamiento de datos',
        en: 'Data processing policy',
        pt: 'Política de tratamento de dados',
      } satisfies Localized,
      description: {
        es: 'Política de tratamiento de datos personales de Voltop conforme a la normativa colombiana de protección de datos.',
        en: "Voltop's personal data processing policy under Colombian data protection regulations.",
        pt: 'Política de tratamento de dados pessoais da Voltop conforme a regulamentação colombiana de proteção de dados.',
      } satisfies Localized,
    },
    eyebrow: { es: 'Legal', en: 'Legal', pt: 'Legal' } satisfies Localized,
    title: {
      es: 'Política de tratamiento de datos personales',
      en: 'Personal data processing policy',
      pt: 'Política de tratamento de dados pessoais',
    } satisfies Localized,

    pendingTag: {
      es: 'Texto legal pendiente',
      en: 'Legal text pending',
      pt: 'Texto jurídico pendente',
    } satisfies Localized,
    pendingBody: {
      es: 'El texto definitivo de esta política debe ser emitido por el área legal de Voltop conforme a la Ley 1581 de 2012 y sus decretos reglamentarios. No se publica una versión aproximada.',
      en: "The final text of this policy must be issued by Voltop's legal team in accordance with Colombian Law 1581 of 2012 and its implementing decrees. No approximate version is published.",
      pt: 'O texto final desta política deve ser emitido pela área jurídica da Voltop conforme a Lei colombiana 1581 de 2012 e seus decretos regulamentadores. Nenhuma versão aproximada é publicada.',
    } satisfies Localized,

    /** What the final text must cover. It doubles as a brief for the legal team. */
    requiredContents: [
      {
        es: 'Identificación del responsable del tratamiento y sus datos de contacto',
        en: 'Identification of the data controller and its contact details',
        pt: 'Identificação do responsável pelo tratamento e seus dados de contato',
      },
      {
        es: 'Finalidades del tratamiento de los datos recogidos',
        en: 'Purposes of the processing of collected data',
        pt: 'Finalidades do tratamento dos dados coletados',
      },
      {
        es: 'Derechos del titular: conocer, actualizar, rectificar y suprimir',
        en: 'Data subject rights: to access, update, rectify and delete',
        pt: 'Direitos do titular: acessar, atualizar, retificar e excluir',
      },
      {
        es: 'Procedimiento para ejercer esos derechos',
        en: 'Procedure to exercise those rights',
        pt: 'Procedimento para exercer esses direitos',
      },
      {
        es: 'Área responsable de atender consultas y reclamos',
        en: 'Department responsible for handling queries and complaints',
        pt: 'Área responsável pelo atendimento de dúvidas e reclamações',
      },
      {
        es: 'Vigencia de la política y de las bases de datos',
        en: 'Validity of the policy and of the databases',
        pt: 'Vigência da política e dos bancos de dados',
      },
    ] satisfies Localized[],
    requiredContentsTitle: {
      es: 'Contenidos que debe cubrir',
      en: 'Contents to be covered',
      pt: 'Conteúdos a serem cobertos',
    } satisfies Localized,

    /** Final text: empty until the legal team delivers it. */
    sections: [] as { heading: Localized; body: Localized[] }[],
  },
}

/**
 * Wrapper around the legal documents. The TEXT itself lives in
 * `~/core/legal/infrastructure/content/legalDocs` and is plain Spanish; only
 * what surrounds the document lives here, and that is translated.
 */
export const legalDoc = {
  eyebrow: { es: 'Legal', en: 'Legal', pt: 'Legal' } satisfies Localized,
  tocTitle: { es: 'Contenido', en: 'Contents', pt: 'Conteúdo' } satisfies Localized,
  updatedLabel: {
    es: 'Última actualización',
    en: 'Last updated',
    pt: 'Última atualização',
  } satisfies Localized,
  /**
   * Shown in English and Portuguese only. It says what needs saying: the
   * document exists in Spanish and that is the binding version. Promising a
   * translation nobody has issued would be worse than showing the original.
   */
  spanishOnly: {
    es: '',
    en: "This document is issued in Spanish, and the Spanish version is the binding one. An official English version will be published when Voltop's legal team issues it.",
    pt: 'Este documento é emitido em espanhol, e a versão em espanhol é a que tem valor legal. Uma versão oficial em português será publicada quando a área jurídica da Voltop a emitir.',
  } satisfies Localized,
  terms: {
    meta: {
      title: {
        es: 'Términos y condiciones',
        en: 'Terms and conditions',
        pt: 'Termos e condições',
      } satisfies Localized,
      description: {
        es: 'Términos y condiciones de uso de la plataforma, la aplicación, el sitio web y las estaciones de carga de Voltop.',
        en: "Terms and conditions for the use of Voltop's platform, app, website and charging stations.",
        pt: 'Termos e condições de uso da plataforma, do aplicativo, do site e das estações de carga da Voltop.',
      } satisfies Localized,
    },
    title: {
      es: 'Términos y condiciones',
      en: 'Terms and conditions',
      pt: 'Termos e condições',
    } satisfies Localized,
  },
}
