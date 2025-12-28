import React, { useState } from 'react';
import styles from './ProductCategory.module.css';
import type { Product } from './types';

const ProductCard: React.FC<{
	product: Product;
	onAddToCart: (product: Product) => void;
}> = ({ product, onAddToCart }) => {
	const [isAdded, setIsAdded] = useState(false);

	const handleAddToCart = () => {
		onAddToCart(product);
		setIsAdded(true);
		setTimeout(() => setIsAdded(false), 2000);
	};

	return (
		<div className={styles.productCard}>
			{product.trendingBadge && (
				<div className={styles.trendingBadge}>{product.trendingBadge}</div>
			)}
			<div className={styles.productImage}>
				<img src={product.image} alt={product.title} />
			</div>
			<div className={styles.productContent}>
				<h5 className={styles.productTitle}>{product.title}</h5>
				<p className={styles.productDescription}>{product.description}</p>
				<div className={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</div>
				<div className={styles.productSeller}>
					<i className="fas fa-school"></i> {product.seller}
				</div>
				<div className={styles.productStock}>
					<span className={styles.badge}>Stok: {product.stock}</span>
				</div>
				<button
					disabled={product.stock <= 0}
					className={`${styles.addToCart} ${isAdded ? styles.added : ''}`}
					onClick={handleAddToCart}
					>
					<i className={`fas ${isAdded ? 'fa-check' : 'fa-cart-plus'}`}></i>
					{product.stock <= 0 ? 'Stok Habis' : isAdded ? 'Ditambahkan' : 'Tambah ke Keranjang'}
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
