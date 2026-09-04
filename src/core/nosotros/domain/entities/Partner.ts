export type Partner = {
  name: string
  type: 'partner' | 'host' | 'cliente'
  logo: string | null
  url: string | null
}

/** Vacío hasta recibir los logos con permiso de uso. La UI omite la franja si no hay registros. */
