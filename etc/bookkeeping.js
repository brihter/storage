import fs from 'node:fs/promises'

// finish the implementation
// the output should be a markdown document
// the document should be written like so await fs.writeFile('./bookkeeping.md', content, 'utf-8')

// the document should include:
// - overview table (columns: income, expenses, balance)
// - projection table (columns: month, starting balance, income, expenses, net change, ending balance)
// - a breakdown by provider (a table with provider, total columns, all providers should be listed even if total is 0)
// - a breakdown by year (a table with year, total columns)
// - a table of transactions (columns: date, description, amount, provider)

// details:
// - generate transactions first and use the list as the source of truth for the calculations
// - project for the next 12 months
// - projections can be negative (can start/end with negative balance)
// - bill all services on the 1st of every month
// - if a service is billed in the middle of the month, prorate the bill on the first of the next month
// - bill services for the usage of the previous month (e.g. if a service usage started on the 20th of March, bill those 11 days on the 1st of April)
// - Rendered transactions should only be up to the current month
// - Transactions hsould be sorted by date descending
// - All reports (apart from projections) should take into account transaction up until the current date
// - Projections should be from the next month + 11 months
// - starting balance of the projections (first projected month) should be the income - expenses up to this point
// - money spent should be visualized as negative amount, income should be visualized as a positive amount (e.g. there's an error in the breakdown by provider)
// - amounts should be rendered with a dollar (e.g. +$1.2, -$2.4, zero should without a prefix)

// coding rules:
// - no comments, no semi-colons, use modern javascript
const generateBookkeeping = (income = [], expenses = []) => {
  const now = new Date('2025-02-16')
  const zeroPad = v => v.toString().padStart(2, '0')
  const formatDate = d => `${d.getFullYear()}-${zeroPad(d.getMonth()+1)}-${zeroPad(d.getDate())}`
  const daysInMonth = (y, m) => new Date(y, m+1, 0).getDate()
  const toMoney = v => {
    const sign = v > 0 ? '+' : v < 0 ? '-' : ''
    return sign
      ? `${sign}$${Math.abs(v).toFixed(2)}`
      : `$${Math.abs(v).toFixed(2)}`
  }
  const getMonthStart = (y, m) => new Date(y, m, 1)
  const addMonths = (d, n) => {
    const nd = new Date(d.getTime())
    nd.setMonth(nd.getMonth()+n)
    return nd
  }
  const nextMonthFirst = d => {
    const nd = new Date(d.getFullYear(), d.getMonth(), 1)
    nd.setMonth(nd.getMonth()+1)
    return nd
  }

  const transactions = []

  income.forEach(i => {
    if (i.period === 'once') {
      if (i.date <= now) {
        transactions.push({
          date: new Date(i.date),
          desc: i.desc,
          amount: i.amount,
          provider: i.provider
        })
      }
    }
    if (i.period === 'monthly') {
      let usageStart = new Date(i.date)
      let billDate = nextMonthFirst(usageStart)
      while (billDate <= now) {
        const y = usageStart.getFullYear()
        const m = usageStart.getMonth()
        const dim = daysInMonth(y, m)
        const day = usageStart.getDate()
        const fraction = day === 1 ? 1 : (dim - day + 1) / dim
        const amt = i.amount * fraction
        transactions.push({
          date: new Date(billDate),
          desc: i.desc,
          amount: +amt.toFixed(2),
          provider: i.provider
        })
        usageStart = getMonthStart(billDate.getFullYear(), billDate.getMonth())
        billDate = addMonths(billDate, 1)
      }
    }
  })

  expenses.forEach(e => {
    if (e.period === 'once') {
      if (e.date <= now) {
        transactions.push({
          date: new Date(e.date),
          desc: e.desc,
          amount: -Math.abs(e.amount),
          provider: e.provider
        })
      }
    }
    if (e.period === 'monthly') {
      let usageStart = new Date(e.date)
      let billDate = nextMonthFirst(usageStart)
      while (billDate <= now) {
        const y = usageStart.getFullYear()
        const m = usageStart.getMonth()
        const dim = daysInMonth(y, m)
        const day = usageStart.getDate()
        const fraction = day === 1 ? 1 : (dim - day + 1) / dim
        const amt = e.amount * fraction
        transactions.push({
          date: new Date(billDate),
          desc: e.desc,
          amount: -Math.abs(+amt.toFixed(2)),
          provider: e.provider
        })
        usageStart = getMonthStart(billDate.getFullYear(), billDate.getMonth())
        billDate = addMonths(billDate, 1)
      }
    }
  })

  transactions.sort((a, b) => b.date - a.date)

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0)
  const balance = totalIncome + totalExpenses

  const overviewTable = `| income | expenses | balance |
| --- | --- | --- |
| ${toMoney(totalIncome)} | ${toMoney(totalExpenses)} | ${toMoney(balance)} |`

  const providers = [...new Set([...income.map(i => i.provider), ...expenses.map(e => e.provider)])]
  const providerTotals = providers.map(p => {
    const sum = transactions
      .filter(t => t.provider === p)
      .reduce((acc, t) => acc + t.amount, 0)
    return { provider: p, total: sum }
  })
  const breakdownByProvider = `| provider | total |
| --- | --- |
${providerTotals.map(pt => `| ${pt.provider} | ${pt.total === 0 ? `$0.00` : toMoney(pt.total)} |`).join('\n')}`

  const years = [...new Set(transactions.map(t => t.date.getFullYear()))].sort((a,b) => a-b)
  const yearRows = years.map(y => {
    const sum = transactions
      .filter(t => t.date.getFullYear() === y)
      .reduce((acc, t) => acc + t.amount, 0)
    return { year: y, total: sum }
  })
  const breakdownByYear = `| year | total |
| --- | --- |
${yearRows.map(r => `| ${r.year} | ${r.total === 0 ? `$0.00` : toMoney(r.total)} |`).join('\n')}`

  const transactionTable = `| date | description | amount | provider |
| --- | --- | --- | --- |
${transactions.map(t => `| ${formatDate(t.date)} | ${t.desc} | ${t.amount === 0 ? '$0.00' : toMoney(t.amount)} | ${t.provider} |`).join('\n')}`

  const currentBalance = balance

  const next12Months = []
  const startDate = new Date(now.getFullYear(), now.getMonth()+1, 1)
  let runningBalance = currentBalance
  for (let i=0; i<12; i++) {
    const ymDate = addMonths(startDate, i)
    const y = ymDate.getFullYear()
    const m = ymDate.getMonth()
    const monthlyIncomes = 0
    let monthlyExpenses = 0
    expenses.forEach(e => {
      if (e.period === 'monthly') {
        const start = new Date(e.date)
        const usageYear = i === 0 ? now.getFullYear() : addMonths(startDate, i-1).getFullYear()
        const usageMonth = i === 0 ? now.getMonth() : addMonths(startDate, i-1).getMonth()
        if (start <= getMonthStart(usageYear, usageMonth)) {
          const dim = daysInMonth(usageYear, usageMonth)
          const d = start > getMonthStart(usageYear, usageMonth) ? start.getDate() : 1
          const fraction = d === 1 ? 1 : (dim - d + 1)/dim
          if (i === 0) {
            monthlyExpenses += (e.amount * fraction)
          } else {
            monthlyExpenses += e.amount
          }
        }
      }
    })
    const finalExpense = i === 0 ? +(monthlyExpenses.toFixed(2)) : monthlyExpenses
    const inc = 0
    const exp = finalExpense === 0 ? 0 : -Math.abs(finalExpense)
    const startBal = runningBalance
    const netChange = inc + exp
    const endBal = startBal + netChange
    next12Months.push({
      month: `${y}-${zeroPad(m+1)}`,
      startBal,
      inc,
      exp,
      netChange,
      endBal
    })
    runningBalance = endBal
  }

  const projectionTable = `| month | starting balance | income | expenses | net change | ending balance |
| --- | --- | --- | --- | --- | --- |
${next12Months.map(row => {
  const sb = toMoney(row.startBal)
  const i = row.inc === 0 ? '$0.00' : toMoney(row.inc)
  const e = row.exp === 0 ? '$0.00' : toMoney(row.exp)
  const n = row.netChange === 0 ? '$0.00' : toMoney(row.netChange)
  const eb = toMoney(row.endBal)
  return `| ${row.month} | ${sb} | ${i} | ${e} | ${n} | ${eb} |`
}).join('\n')}`

  return [
    '# Bookkeeping',
    '## Overview',
    overviewTable,
    '## Projection (Next 12 Months)',
    projectionTable,
    '## Breakdown by Provider',
    breakdownByProvider,
    '## Breakdown by Year',
    breakdownByYear,
    '## Transactions',
    transactionTable
  ].join('\n\n')
}

const income = [
  { provider: 'Hetzner', desc: 'Hetzner Cloud Credits', amount: 60, date: new Date('2025-02-10'), period: 'once' }
]

const expenses = [
  { provider: 'AWS', desc: 'AWS S3 Billing', amount: 0.28, date: new Date('2023-02-01'), period: 'monthly' },
  { provider: 'Cloudflare', desc: 'Cloudflare R2 Billing', amount: 0.0, date: new Date('2023-02-01'), period: 'monthly' },
  { provider: 'Hetzner', desc: 'Hetzner Object Storage Billing', amount: 5.99, date: new Date('2025-02-12'), period: 'monthly' },
  { provider: 'Backblaze', desc: 'Backblaze B2 Billing', amount: 0.0, date: new Date('2025-02-12'), period: 'monthly' }
]

;(async () => {
  const content = generateBookkeeping(income, expenses)
  await fs.writeFile('./bookkeeping.md', content, 'utf-8')
})()
