import fs from 'fs'

const sql = fs.readFileSync('supabase/migrations/018_seed_aura_catalog.sql', 'utf8')

function splitTuples(valuesSql) {
  const tuples = []
  let depth = 0
  let start = -1
  for (let i = 0; i < valuesSql.length; i++) {
    const ch = valuesSql[i]
    if (ch === '(') {
      if (depth === 0) start = i
      depth++
    } else if (ch === ')') {
      depth--
      if (depth === 0 && start !== -1) {
        tuples.push(valuesSql.slice(start + 1, i))
        start = -1
      }
    }
  }
  return tuples
}

function unescapeSqlString(inner) {
  return inner.replace(/''/g, "'")
}

function parseTupleFields(tupleSql) {
  const fields = []
  const re =
    /NULL::[a-z]+|true::boolean|false::boolean|'(?:''|\\.|[^'])*'::[a-z]+|-?\d+(?:\.\d+)?::(?:numeric|integer)/g
  const matches = tupleSql.match(re) || []
  for (const raw of matches) {
    if (raw.startsWith('NULL::')) {
      fields.push(null)
      continue
    }
    if (raw === 'true::boolean') {
      fields.push(true)
      continue
    }
    if (raw === 'false::boolean') {
      fields.push(false)
      continue
    }
    const typed = raw.match(/^(.*)::([a-z]+)$/)
    if (!typed) continue
    const [, value, type] = typed
    if (value.startsWith("'") && value.endsWith("'")) {
      const inner = unescapeSqlString(value.slice(1, -1))
      if (type === 'jsonb') {
        try {
          fields.push(JSON.parse(inner))
        } catch {
          fields.push({})
        }
      } else {
        fields.push(inner)
      }
      continue
    }
    fields.push(type === 'integer' ? Number.parseInt(value, 10) : Number(value))
  }
  return fields
}

const catMatch = sql.match(/INSERT INTO categories[\s\S]*?VALUES\s*([\s\S]*?)\)\s*AS v\(name, slug/)
const prodMatch = sql.match(/INSERT INTO products[\s\S]*?VALUES\s*([\s\S]*?)\)\s*AS v\(/)
if (!catMatch || !prodMatch) {
  console.error('parse fail', Boolean(catMatch), Boolean(prodMatch))
  process.exit(1)
}

const categories = splitTuples(catMatch[1]).map((t) => {
  const f = parseTupleFields(t)
  return { name: f[0], slug: f[1], description: f[2], sort_order: f[3] }
})

const products = splitTuples(prodMatch[1]).map((t) => {
  const f = parseTupleFields(t)
  return {
    name: f[0],
    slug: f[1],
    category_slug: f[2],
    description: f[3],
    specifications: f[4] && typeof f[4] === 'object' ? f[4] : {},
    price: f[5],
    pieces: f[6],
    stock_quantity: f[7],
    stock_alert_limit: f[8],
    brand: f[9],
    tag: f[10],
    is_featured: Boolean(f[11]),
    sort_order: f[12],
  }
})

const bad = products.filter(
  (p) =>
    typeof p.name !== 'string' ||
    typeof p.slug !== 'string' ||
    typeof p.price !== 'number' ||
    typeof p.sort_order !== 'number' ||
    typeof p.is_featured !== 'boolean',
)

console.log('categories', categories.length)
console.log('products', products.length)
console.log('bad products', bad.length)
if (bad[0]) console.log('bad sample', bad[0])
console.log('first', JSON.stringify(products[0], null, 2))
console.log('product 25', JSON.stringify(products[24], null, 2))
console.log('last', JSON.stringify(products.at(-1), null, 2))

const ts = `export interface AuraCatalogCategory {
  name: string
  slug: string
  description: string
  sort_order: number
}

export interface AuraCatalogProduct {
  name: string
  slug: string
  category_slug: string
  description: string
  specifications: Record<string, string>
  price: number
  pieces: number
  stock_quantity: number
  stock_alert_limit: number
  brand: string
  tag: string | null
  is_featured: boolean
  sort_order: number
}

export const AURA_CATALOG_CATEGORIES: AuraCatalogCategory[] = ${JSON.stringify(categories, null, 2)}

export const AURA_CATALOG_PRODUCTS: AuraCatalogProduct[] = ${JSON.stringify(products, null, 2)}
`

fs.writeFileSync('src/data/auraCatalog.ts', ts)
console.log('wrote src/data/auraCatalog.ts')
