import { formatPrice, formatStock } from '../format'

export default function OffersTable({ rows }) {
  return (
    <div className="table-responsive offers-scroll border rounded">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-light sticky-top">
          <tr>
            <th>Название</th>
            <th>Производитель</th>
            <th>Артикул</th>
            <th>Цена</th>
            <th>Остаток</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.brand}</td>
              <td>{row.number || '—'}</td>
              <td>{formatPrice(row.price)}</td>
              <td>{formatStock(row.stock)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
