import fs from 'node:fs/promises'

const formatDate = date => date.toISOString().split('T')[0]

const formatAmount = (amount, isExpense = false) => {
  const value = Math.abs(amount).toFixed(2)
  return isExpense ? `-$${value}` : `+$${value}`
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

    let currentDate = new Date(date)
    while (currentDate <= now) {
      transactions.push({
        date: new Date(currentDate),
        amount: isExpense ? -amount : amount,
        desc,
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
  { provider: 'Backblaze', desc: 'Backblaze B@ Billing', amount: 0.0, date: new Date('2023-02-12'), period: 'monthly' },
]

generateBookkeeping(income, expenses)
