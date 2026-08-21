export default function CartSkeleton() {
  return (
    <div className="cart-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="cart-skeleton-item">
          <div className="cart-sk-thumb skel" />
          <div className="cart-sk-body">
            <div className="skel cart-sk-title" />
            <div className="skel cart-sk-sub" />
            <div className="skel cart-sk-meta" />
          </div>
          <div className="cart-sk-price">
            <div className="skel cart-sk-price-val" />
          </div>
        </div>
      ))}
    </div>
  )
}
