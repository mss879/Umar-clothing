import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string
  emptyState?: ReactNode
}

export function DataTable<T>({ data, columns, keyExtractor, emptyState = "No data found." }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 shadow-sm">
        {emptyState}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs uppercase font-semibold">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={cn("px-6 py-4", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-50 transition-colors group">
              {columns.map((col, i) => (
                <td key={i} className={cn("px-6 py-4 text-gray-900", col.className)}>
                  {typeof col.accessor === 'function' 
                    ? col.accessor(row) 
                    : String(row[col.accessor as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
