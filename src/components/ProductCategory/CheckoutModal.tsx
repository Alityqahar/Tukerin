import React from 'react';
import styles from './ProductCategory.module.css';
import type { CartItem } from './types';

const CheckoutModal: React.FC<{
	cart: CartItem[];
	totalPrice: number;
	paymentMethod: string;
	shippingMethod: string;
	onPaymentMethodChange: (method: string) => void;
	onShippingMethodChange: (method: string) => void;
	onConfirm: () => void;
	onClose: () => void;
}> = ({ totalPrice, paymentMethod, shippingMethod, onPaymentMethodChange, onShippingMethodChange, onConfirm, onClose }) => {
	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={`${styles.modal} ${styles.checkoutModal}`} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h5 className={styles.modalTitle}>
						<i className="fas fa-credit-card"></i> Checkout
					</h5>
					<button className={styles.closeBtn} onClick={onClose}>×</button>
				</div>
				<div className={styles.modalBody}>
					{/* Payment Method */}
					<div className={styles.checkoutSection}>
						<h6 className={styles.sectionTitle}>Pilih Metode Pembayaran:</h6>
						<div className={styles.optionsGrid}>
							<label className={styles.paymentOption}>
								<input
									type="radio"
									name="payment"
									value="Bank"
									checked={paymentMethod === 'Bank'}
									onChange={(e) => onPaymentMethodChange(e.target.value)}
								/>
								<div className={styles.optionCard}>
									<i className="fas fa-university"></i>
									<div>Bank Transfer</div>
									<small>Mandiri, BCA, BRI</small>
								</div>
							</label>
							<label className={styles.paymentOption}>
								<input
									type="radio"
									name="payment"
									value="E-Wallet"
									checked={paymentMethod === 'E-Wallet'}
									onChange={(e) => onPaymentMethodChange(e.target.value)}
								/>
								<div className={styles.optionCard}>
									<i className="fas fa-wallet"></i>
									<div>E-Wallet</div>
									<small>GoPay, OVO, Dana</small>
								</div>
							</label>
						</div>
					</div>

					{/* Shipping Method */}
					<div className={styles.checkoutSection}>
						<h6 className={styles.sectionTitle}>Pilih Opsi Pengiriman:</h6>
						<div className={styles.optionsGrid}>
							<label className={styles.shippingOption}>
								<input
									type="radio"
									name="shipping"
									value="Ambil di Sekolah"
									checked={shippingMethod === 'Ambil di Sekolah'}
									onChange={(e) => onShippingMethodChange(e.target.value)}
								/>
								<div className={styles.optionCard}>
									<i className="fas fa-school"></i>
									<div>Ambil di Sekolah</div>
									<small>Koperasi/Perpustakaan</small>
								</div>
							</label>
							<label className={styles.shippingOption}>
								<input
									type="radio"
									name="shipping"
									value="Kirim ke Rumah"
									checked={shippingMethod === 'Kirim ke Rumah'}
									onChange={(e) => onShippingMethodChange(e.target.value)}
								/>
								<div className={styles.optionCard}>
									<i className="fas fa-home"></i>
									<div>Kirim ke Rumah</div>
									<small>JNE, J&T, SiCepat</small>
								</div>
							</label>
						</div>
					</div>

					{/* Total */}
					<div className={styles.checkoutTotal}>
						<div className={styles.totalLabel}>Total Pembayaran:</div>
						<div className={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</div>
					</div>
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.btnSecondary} onClick={onClose}>Batal</button>
					<button className={styles.btnSuccess} onClick={onConfirm}>
						<i className="fas fa-check"></i> Konfirmasi Pembayaran
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckoutModal;
