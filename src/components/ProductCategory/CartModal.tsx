import React from 'react';
import styles from './ProductCategory.module.css';
import type { CartItem } from './types';

const CartModal: React.FC<{
	cart: CartItem[];
	onClose: () => void;
	onUpdateQuantity: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
	onCheckout: () => void;
	totalPrice: number;
}> = ({ cart, onClose, onUpdateQuantity, onRemove, onCheckout, totalPrice }) => {
	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h5 className={styles.modalTitle}>
						<i className="fas fa-shopping-cart"></i> Keranjang Belanja
					</h5>
					<button className={styles.closeBtn} onClick={onClose}>×</button>
				</div>
				<div className={styles.modalBody}>
					{cart.length === 0 ? (
						<div className={styles.emptyCart}>
							<i className="fas fa-shopping-cart"></i>
							<p>Keranjang belanja masih kosong</p>
							<small>Yuk, mulai belanja produk berkualitas dengan harga terjangkau!</small>
						</div>
					) : (
						<>
							<div className={styles.cartItems}>
								{cart.map(item => (
									<div key={item.id} className={styles.cartItem}>
										<img src={item.image} alt={item.title} className={styles.cartItemImage} />
										<div className={styles.cartItemInfo}>
											<div className={styles.cartItemTitle}>{item.title}</div>
											<div className={styles.cartItemPrice}>Rp {item.price.toLocaleString('id-ID')}</div>
										</div>
										<div className={styles.cartItemActions}>
											<div className={styles.quantityControl}>
												<button onClick={() => onUpdateQuantity(String(item.id), item.quantity - 1)}>-</button>
												<span>{item.quantity}</span>
												<button onClick={() => onUpdateQuantity(String(item.id), item.quantity + 1)}>+</button>
											</div>
											<button className={styles.removeBtn} onClick={() => onRemove(String(item.id))}>
												<i className="fas fa-trash"></i>
											</button>
										</div>
									</div>
								))}
							</div>
							<div className={styles.cartTotal}>
								<div className={styles.totalLabel}>Total:</div>
								<div className={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</div>
							</div>
						</>
					)}
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.btnSecondary} onClick={onClose}>Batal</button>
					<button
						className={styles.btnPrimary}
						onClick={onCheckout}
						disabled={cart.length === 0}
					>
						<i className="fas fa-credit-card"></i> Checkout
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartModal;
