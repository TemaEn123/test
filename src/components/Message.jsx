export default function Message({ variant = 'secondary', children }) {
  return <div className={`alert alert-${variant} mb-0`}>{children}</div>
}
