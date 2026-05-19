export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          role: 'admin' | 'customer' | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'admin' | 'customer' | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'admin' | 'customer' | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          price: number
          status: 'draft' | 'active' | 'out_of_stock' | 'archived' | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          price: number
          status?: 'draft' | 'active' | 'out_of_stock' | 'archived' | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          price?: number
          status?: 'draft' | 'active' | 'out_of_stock' | 'archived' | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_primary: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          is_primary?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          is_primary?: boolean | null
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          stock_quantity: number
          low_stock_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color?: string | null
          stock_quantity?: number
          low_stock_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string | null
          color?: string | null
          stock_quantity?: number
          low_stock_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          total_amount: number
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal_code: string
          delivery_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          total_amount: number
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal_code: string
          delivery_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          total_amount?: number
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_postal_code?: string
          delivery_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          size: string | null
          color: string | null
          quantity: number
          price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          size?: string | null
          color?: string | null
          quantity: number
          price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          size?: string | null
          color?: string | null
          quantity?: number
          price?: number
          subtotal?: number
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          title: string
          code: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date: string | null
          status: 'active' | 'inactive' | 'expired' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          code: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date?: string | null
          status?: 'active' | 'inactive' | 'expired' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          code?: string
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'inactive' | 'expired' | null
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          image_url: string | null
          collection_type: 'manual' | 'smart' | null
          smart_rule_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          image_url?: string | null
          collection_type?: 'manual' | 'smart' | null
          smart_rule_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          collection_type?: 'manual' | 'smart' | null
          smart_rule_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collection_products: {
        Row: {
          collection_id: string
          product_id: string
          position: number | null
          created_at: string
        }
        Insert: {
          collection_id: string
          product_id: string
          position?: number | null
          created_at?: string
        }
        Update: {
          collection_id?: string
          product_id?: string
          position?: number | null
          created_at?: string
        }
      }
    }
  }
}
