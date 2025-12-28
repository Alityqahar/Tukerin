import { supabase } from '../lib/supabase'
import type { Product } from '../components/ProductCategory/types'

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data.map(p => ({
        ...p,
        trendingBadge: p.trending_badge
    }))
}
