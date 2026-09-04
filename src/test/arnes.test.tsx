import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { t, defaultLocale } from '~/core/common/domain/i18n/config'
import { home } from '@/content/copy/home'

describe('arnes de test', () => {
  it('resuelve los alias de tsconfig', () => {
    expect(t(home.hero.title, defaultLocale)).toContain('Colombia')
  })

  it('renderiza JSX con jsdom y jest-dom', () => {
    render(<h1>{t(home.hero.title, 'en')}</h1>)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
