import type { Localized } from '~/core/common/domain/i18n/config'

export type Person = { name: string; role: Localized; photo: string | null; quote?: Localized }
