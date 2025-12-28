import { useEffect, useState } from 'react';
import styles from './ProductCategory.module.css';
import type { Product, CartItem } from './types';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import EcoBuddyChatbot from '../EcoBuddy/EcoBuddyChatbot'; // Tambah import

const ProductCategory = () => {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

const [activeCategory, setActiveCategory] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
const [cart, setCart] = useState<CartItem[]>([]);
const [showCartModal, setShowCartModal] = useState(false);
const [showCheckoutModal, setShowCheckoutModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('Bank');
const [shippingMethod, setShippingMethod] = useState('Ambil di Sekolah');
const [showEcoBuddy, setShowEcoBuddy] = useState(false); // State untuk EcoBuddy
// const [showSuccessModal, setShowSuccessModal] = useState(false); // modal sukses

/* ================= FETCH PRODUCTS ================= */
useEffect(() => {
	const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Gagal memuat produk:', error);
	} else {
		const mapped = data.map(p => ({
		...p,
		trendingBadge: p.trending_badge
		}));
		setProducts(mapped);
	}

	setLoading(false);
	};

	fetchProducts();
}, []);


/* ================= REALTIME SUBSCRIPTION ================= */

useEffect(() => {
	const channel = supabase
		.channel('products-realtime')
		.on(
		'postgres_changes',
		{
			event: 'UPDATE',
			schema: 'public',
			table: 'products',
		},
		payload => {
			const updatedProduct = payload.new as Product;

			setProducts(prev =>
			prev.map(p =>
				p.id === updatedProduct.id
				? {
					...updatedProduct,
					trendingBadge: updatedProduct.trendingBadge
					}
				: p
			)
			);
		}
		)
		.subscribe();

	return () => {
		supabase.removeChannel(channel);
	};
}, []);


/* ================= FILTERING ================= */
const filteredProducts = products.filter(product => {
	const matchCategory =
	activeCategory === 'all' || product.category === activeCategory;

	const matchSearch =
	product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
	product.category.toLowerCase().includes(searchQuery.toLowerCase());

	return matchCategory && matchSearch;
});

const trendingProducts = products.filter(p => p.trending);
const regularProducts = filteredProducts.filter(p => !p.trending);

/* ================= CART LOGIC ================= */
const addToCart = (product: Product) => {
	const existingItem = cart.find(item => item.id === product.id);

	if (existingItem) {
	setCart(cart.map(item =>
		item.id === product.id
		? { ...item, quantity: item.quantity + 1 }
		: item
	));
	} else {
	setCart([...cart, { ...product, quantity: 1 }]);
	}
};

const removeFromCart = (id: string) => {
	setCart(cart.filter(item => item.id !== id));
};

const updateQuantity = (id: string, quantity: number) => {
	if (quantity <= 0) {
	removeFromCart(id);
	} else {
	setCart(cart.map(item =>
		item.id === id ? { ...item, quantity } : item
	));
	}
};

const getTotalPrice = () =>
	cart.reduce((total, item) => total + item.price * item.quantity, 0);

const handleCheckout = () => {
	setShowCartModal(false);
	setShowCheckoutModal(true);
};

const confirmCheckout = async () => {
	let hasError = false;
	const updatedProducts: Product[] = [];

	for (const item of cart) {
		const newStock = item.stock - item.quantity;
		if (newStock < 0) continue;
		const { error } = await supabase
			.from('products')
			.update({ stock: newStock })
			.eq('id', item.id);
		if (error) {
			console.error('Gagal update stok:', error);
			hasError = true;
		} else {
			updatedProducts.push({ ...item, stock: newStock });
		}
	}
	if (hasError) {
		// Ganti alert dengan SweetAlert
		Swal.fire({
			icon: 'error',
			title: 'Checkout Gagal',
			text: 'Gagal update stok pada satu atau lebih produk.',
			timer: 2500,
			showConfirmButton: false,
		});
		return;
	}

	setProducts(prev =>
		prev.map(p => {
			const updated = updatedProducts.find(u => u.id === p.id);
			return updated ? { ...p, stock: updated.stock } : p;
		})
	);

	setCart([]);
	setShowCheckoutModal(false);

	// SweetAlert2 modal sukses
	Swal.fire({
		icon: 'success',
		title: 'Checkout Berhasil!',
		text: 'Terima kasih telah berbelanja. Stok produk telah diperbarui.',
		timer: 2000,
		showConfirmButton: false,
	});
};

/* ================= LOADING ================= */
if (loading) {
	return (
	<section className={styles.categorySection}>
		<div className={styles.container}>
		<p>Memuat produk...</p>
		</div>
	</section>
	);
}

/* ================= RENDER ================= */
return (
	<section id="kategori" className={styles.categorySection}>
	<div className={styles.container}>
		{/* Search */}
		<div className={styles.searchContainer}>
		<div className={styles.searchHeader}>
			<h2 className={styles.searchTitle}>Temukan Barang Impianmu</h2>
			<p className={styles.searchSubtitle}>
			Cari dari ribuan barang berkualitas dengan harga terjangkau
			</p>
		</div>
		<div className={styles.searchBox}>
			<input
			className={styles.searchInput}
			placeholder="Cari produk..."
			value={searchQuery}
			onChange={e => setSearchQuery(e.target.value)}
			/>
			<button className={styles.searchBtn}>
			<i className="fas fa-search"></i>
			</button>
		</div>
		</div>

		{/* Trending */}
		{trendingProducts.length > 0 && (
		<div className={styles.trendingSection}>
			<div className={styles.trendingTitle}>
			<div className={styles.trendingIcon}>
				<i className="fas fa-fire"></i>
			</div>
			<div>
				<h3 className={styles.trendingHeading}>Produk Terlaris</h3>
				<p className={styles.trendingSubtitle}>
				Barang paling banyak dicari
				</p>
			</div>
			</div>
			<div className={styles.productGrid}>
			{trendingProducts.map(p => (
				<ProductCard key={p.id} product={p} onAddToCart={addToCart} />
			))}
			</div>
		</div>
		)}

		{/* Category Filter */}
		<div className={styles.categoryFilter}>
		{['all', 'akademis', 'seragam', 'ekstrakurikuler'].map(cat => (
			<button
			key={cat}
			className={`${styles.categoryFilterBtn} ${
				activeCategory === cat ? styles.active : ''
			}`}
			onClick={() => setActiveCategory(cat)}
			>
			<span>{cat.toUpperCase()}</span>
			</button>
		))}
		</div>

		<div className={styles.sectionDivider}></div>

		{/* Products */}
		<div className={styles.productGrid}>
		{regularProducts.map(p => (
			<ProductCard key={p.id} product={p} onAddToCart={addToCart} />
		))}
		</div>

		{/* Cart Button */}
		<button
		className={styles.floatingCartBtn}
		onClick={() => setShowCartModal(true)}
		>
		<i className="fas fa-shopping-cart"></i>
		{cart.length > 0 && (
			<span className={styles.cartBadge}>{cart.length}</span>
		)}
		</button>

		{/* === Floating EcoBuddy Button === */}
		<button
			type="button"
			className={styles.floatingEcoBuddyBtn}
			onClick={() => setShowEcoBuddy(true)}
			aria-label="Buka EcoBuddy Chatbot"
		>
			<i className="fas fa-robot"></i>
		</button>

		{/* === EcoBuddy Chatbot Modal === */}
		{showEcoBuddy && (
			<EcoBuddyChatbot onClose={() => setShowEcoBuddy(false)} />
		)}

		{showCartModal && (
		<CartModal
			cart={cart}
			onClose={() => setShowCartModal(false)}
			onUpdateQuantity={updateQuantity}
			onRemove={removeFromCart}
			onCheckout={handleCheckout}
			totalPrice={getTotalPrice()}
		/>
		)}

		{showCheckoutModal && (
		<CheckoutModal
			cart={cart}
			totalPrice={getTotalPrice()}
			paymentMethod={paymentMethod}
			shippingMethod={shippingMethod}
			onPaymentMethodChange={setPaymentMethod}
			onShippingMethodChange={setShippingMethod}
			onConfirm={confirmCheckout}
			onClose={() => setShowCheckoutModal(false)}
		/>
		)}

		{/* Hapus blok modal sukses manual */}
		{/* {showSuccessModal && (
			<div className={styles.modalOverlay} style={{ zIndex: 3000 }}>
				<div className={styles.modal} style={{ display:'flex', justifyContent:'center',alignContent:'center', padding: 40 }}>
					<i className="fas fa-check-circle" style={{ color: '#4caf50', fontSize: 60, marginBottom: 16,  }}></i>
					<h2 style={{ margin: '16px 0 8px' }}>Checkout Berhasil!</h2>
					<p style={{ color: '#555' }}>Terima kasih telah berbelanja.<br />Stok produk telah diperbarui.</p>
				</div>
			</div>
		)} */}
	</div>
	</section>
);
};

export default ProductCategory;
