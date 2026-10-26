export default function BrandList({ items, selectedBrand, onSelect }) {
  return (
    <div className="list-group">
      {items.map((item) => {
        const active = item.brand === selectedBrand
        return (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action${active ? ' active' : ''}`}
            onClick={() => onSelect(item.brand)}
          >
            <span className="fw-semibold">{item.brand}</span>
            {item.name ? <span className={active ? '' : 'text-secondary'}>{` — ${item.name}`}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
