export interface HistoryItem {
  id: string
  prompt: string
  imageUrl: string
  timestamp: Date
  size: string
  style: string
  taskId?: string
}

class StorageService {
  private readonly HISTORY_KEY = 'ai-image-history'
  private readonly MAX_HISTORY_ITEMS = 100

  // 保存历史记录到本地存储
  saveHistory(items: HistoryItem[]): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save history to localStorage:', error)
    }
  }

  // 从本地存储读取历史记录
  loadHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY)
      if (!stored) return []

      const items = JSON.parse(stored)
      // 转换日期字符串回Date对象
      return items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
      return []
    }
  }

  // 添加单个历史记录
  addHistoryItem(item: HistoryItem): void {
    const history = this.loadHistory()
    
    // 检查是否已存在相同ID的记录
    const existingIndex = history.findIndex(h => h.id === item.id)
    if (existingIndex !== -1) {
      // 更新现有记录
      history[existingIndex] = item
    } else {
      // 添加新记录到开头
      history.unshift(item)
    }

    // 限制历史记录数量
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history.splice(this.MAX_HISTORY_ITEMS)
    }

    this.saveHistory(history)
  }

  // 删除历史记录项
  removeHistoryItem(id: string): void {
    const history = this.loadHistory()
    const filteredHistory = history.filter(item => item.id !== id)
    this.saveHistory(filteredHistory)
  }

  // 清空所有历史记录
  clearHistory(): void {
    try {
      localStorage.removeItem(this.HISTORY_KEY)
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error)
    }
  }

  // 获取历史记录统计
  getHistoryStats(): { total: number; today: number; thisWeek: number } {
    const history = this.loadHistory()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const todayCount = history.filter(item => 
      new Date(item.timestamp) >= today
    ).length

    const weekCount = history.filter(item => 
      new Date(item.timestamp) >= weekAgo
    ).length

    return {
      total: history.length,
      today: todayCount,
      thisWeek: weekCount
    }
  }

  // 导出历史记录
  exportHistory(): string {
    const history = this.loadHistory()
    return JSON.stringify(history, null, 2)
  }

  // 导入历史记录
  importHistory(jsonData: string): { success: boolean; imported: number; error?: string } {
    try {
      const items = JSON.parse(jsonData)
      if (!Array.isArray(items)) {
        throw new Error('Invalid data format')
      }

      // 验证数据格式
      const validItems = items.filter(item => 
        item.id && 
        item.prompt && 
        item.imageUrl && 
        item.timestamp && 
        item.size && 
        item.style
      )

      if (validItems.length === 0) {
        throw new Error('No valid history items found')
      }

      // 合并现有历史记录
      const existingHistory = this.loadHistory()
      const mergedHistory = [...validItems, ...existingHistory]
        .filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index)
        .slice(0, this.MAX_HISTORY_ITEMS)

      this.saveHistory(mergedHistory)
      return { success: true, imported: validItems.length }
    } catch (error) {
      return { 
        success: false, 
        imported: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

export const storageService = new StorageService()
