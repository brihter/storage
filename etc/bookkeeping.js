import fs from 'node:fs/promises'

const formatDate = date => date.toISOString().split('T')[0]

const formatAmount = (amount, isExpense = false) => {
  const value = Math.abs(amount).toFixed(2)
  if (amount === 0) return `${value}`
  return isExpense ? `-${value}` : `+${value}`
}

const calculateProration = (startDate, amount) => {
  const date = new Date(startDate)
  const year = date.getFullYear()
  const month = date.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
  const remainingDays = lastDayOfMonth - date.getDate() + 1
  return (amount * remainingDays) / lastDayOfMonth
}

const generateTransactions = (records, type = 'expense') => {
  const now = new Date()
  const isExpense = type === 'expense'
  
  return records.flatMap(record => {
    const transactions = []
    const { date, period, amount, desc, provider } = record
    
    if (period === 'once') {
      return [{
        ...record,
        amount: isExpense ? -amount : amount
      }]
    }

    const startDate = new Date(date)
    let currentDate = new Date(startDate)
    
    if (startDate.getDate() !== 1) {
      const proratedAmount = calculateProration(startDate, amount)
      transactions.push({
        date: new Date(startDate),
        amount: isExpense ? -proratedAmount : proratedAmount,
        desc: `${desc} (Prorated ${startDate.getDate()}-${new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()})`,
        provider,
        period
      })
      
      currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)
    }

    while (currentDate <= now) {
      const billingDate = new Date(currentDate)
      const usagePeriod = new Date(currentDate)
      usagePeriod.setMonth(usagePeriod.getMonth() - 1)
      
      transactions.push({
        date: billingDate,
        amount: isExpense ? -amount : amount,
        desc: `${desc} (${formatDate(usagePeriod).slice(0, 7)})`,
        provider,
        period
      })
      
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
    
    return transactions
  })
}

const generateTransactionTable = transactions => {
  const header = '| Date | Description | Amount | Provider |\n| --- | --- | --- | --- |'
  const rows = transactions
    .sort((a, b) => b.date - a.date)
    .map(({ desc, amount, date, provider }) =>
      `| ${formatDate(date)} | ${desc} | ${formatAmount(amount, amount < 0)} | ${provider} |`
    )
  return [header, ...rows].join('\n')
}

const groupBy = (array, key) =>
  array.reduce((acc, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    return { ...acc, [groupKey]: [...(acc[groupKey] || []), item] }
  }, {})

const calculateTotal = transactions =>
  transactions.reduce((sum, { amount }) => sum + amount, 0)

const generateBreakdown = (transactions, groupingKey, title) => {
  const grouped = groupBy(transactions, groupingKey)
  const breakdown = Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => ({
      key,
      total: calculateTotal(items)
    }))

  const header = `\n## ${title}\n\n| ${title} | Total |\n| --- | --- |`
  const rows = breakdown.map(({ key, total }) =>
    `| ${key} | ${formatAmount(total, total < 0)} |`
  )
  return [header, ...rows].join('\n')
}

const generateBookkeeping = async (income, expenses) => {
  const allTransactions = [
    ...generateTransactions(income, 'income'),
    ...generateTransactions(expenses, 'expense')
  ]

  const totalIncome = calculateTotal(allTransactions.filter(t => t.amount > 0))
  const totalExpenses = calculateTotal(allTransactions.filter(t => t.amount < 0))
  const balance = totalIncome + totalExpenses

  const content = [
    '# Bookkeeping',
    '\n## Overview',
    '\n| Category | Amount |',
    '| --- | --- |',
    `| Income | ${formatAmount(totalIncome)} |`,
    `| Expenses | ${formatAmount(totalExpenses, true)} |`,
    `| Balance | ${formatAmount(balance, balance < 0)} |`,
    generateBreakdown(allTransactions, 'provider', 'By Provider'),
    generateBreakdown(allTransactions, item => formatDate(item.date).slice(0, 4), 'By Year'),
    '\n## Transactions',
    generateTransactionTable(allTransactions)
  ].join('\n')

  await fs.writeFile('./bookkeeping.md', content, 'utf-8')
}

const income = [
  { provider: 'Hetzner', desc: 'Hetzner Cloud Credits', amount: 60, date: new Date('2025-02-10'), period: 'once' }
]

const expenses = [
  { provider: 'AWS', desc: 'AWS S3 Billing', amount: 0.28, date: new Date('2023-02-01'), period: 'monthly' },
  { provider: 'Cloudflare', desc: 'Cloudflare R2 Billing', amount: 0.0, date: new Date('2023-02-01'), period: 'monthly' },
  { provider: 'Hetzner', desc: 'Hetzner Object Storage Billing', amount: 5.99, date: new Date('2025-02-12'), period: 'monthly' },
  { provider: 'Backblaze', desc: 'Backblaze B2 Billing', amount: 0.0, date: new Date('2025-02-12'), period: 'monthly' },
]

generateBookkeeping(income, expenses)