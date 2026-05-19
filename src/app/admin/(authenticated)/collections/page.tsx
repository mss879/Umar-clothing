import { createClient } from '@/lib/supabase/server'
import { CollectionsClient } from '@/components/admin/CollectionsClient'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  const supabase = await createClient()

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  return <CollectionsClient initialCollections={collections || []} />
}
