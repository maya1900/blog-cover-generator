import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CoverPreview } from '../components/CoverPreview'
import type { CoverOptions, RenderResult } from '../lib/cover/types'

vi.mock('../lib/cover/renderCover', () => ({
  createCompressedCanvasImageBlob: vi.fn(async () => new Blob(['preview'], { type: 'image/png' })),
  exportCanvasAsImage: vi.fn(),
  renderCoverToCanvas: vi.fn(() => ({
    seed: 42,
    width: 1200,
    height: 630,
    variant: 1,
  })),
}))

const options: CoverOptions = {
  title: '测试标题',
  style: 'tech',
  variant: 1,
}

const renderInfo: RenderResult = {
  seed: 42,
  width: 1200,
  height: 630,
  variant: 1,
}

describe('CoverPreview copy action', () => {
  const clipboardWrite = vi.fn()
  const originalClipboardItem = window.ClipboardItem

  beforeEach(() => {
    vi.useFakeTimers()
    clipboardWrite.mockReset()

    Object.assign(navigator, {
      clipboard: {
        write: clipboardWrite,
      },
    })

    Object.defineProperty(window, 'ClipboardItem', {
      configurable: true,
      writable: true,
      value: class ClipboardItem {
        readonly items: Record<string, Blob>

        constructor(items: Record<string, Blob>) {
          this.items = items
        }
      },
    })
  })

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
    vi.restoreAllMocks()
    Object.defineProperty(window, 'ClipboardItem', {
      configurable: true,
      writable: true,
      value: originalClipboardItem,
    })
  })

  it('copies preview image to clipboard', async () => {
    clipboardWrite.mockResolvedValue(undefined)

    render(<CoverPreview options={options} renderInfo={renderInfo} onRendered={vi.fn()} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '复制图片' }))
      await Promise.resolve()
    })
    expect(clipboardWrite).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: '已复制' })).toBeInTheDocument()
    expect(screen.getByText('已复制 PNG，约 1 KB')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1800)
    })

    expect(screen.getByRole('button', { name: '复制图片' })).toBeInTheDocument()
    expect(screen.getByText('复制时会自动压缩，尽量控制在 150KB 内')).toBeInTheDocument()
  })

  it('shows error state when clipboard write fails', async () => {
    clipboardWrite.mockRejectedValue(new Error('copy failed'))

    render(<CoverPreview options={options} renderInfo={renderInfo} onRendered={vi.fn()} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '复制图片' }))
      await Promise.resolve()
    })

    expect(screen.getByRole('button', { name: '复制失败' })).toBeInTheDocument()
    expect(screen.getByText('复制失败，请重试；不行就先下载')).toBeInTheDocument()
  })
})
