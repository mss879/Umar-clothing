import { createClient } from '@/lib/supabase/server'
import { PromotionsClient } from '@/components/admin/PromotionsClient'

export default async function PromotionsPage() {
  const supabase = await createClient()

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <PromotionsClient initialPromotions={promotions || []} />
  )
}
