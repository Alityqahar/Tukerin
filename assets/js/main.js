// --- Navbar highlight on scroll ---
document.addEventListener('DOMContentLoaded', function() {
  const sections = [
    {id: 'beranda', nav: 'nav-beranda'},
    {id: 'kategori', nav: 'nav-kategori'},
    {id: 'leaderboard', nav: 'nav-leaderboard'}
  ];

  function onScroll() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    let found = false;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i].id);
      if (section && section.offsetTop - 80 <= scrollPos) {
        sections.forEach(s => {
          const nav = document.getElementById(s.nav);
          if (nav) nav.classList.remove('active');
        });
        const nav = document.getElementById(sections[i].nav);
        if (nav) nav.classList.add('active');
        found = true;
        break;
      }
    }
    
    if (!found) {
      sections.forEach(s => {
        const nav = document.getElementById(s.nav);
        if (nav) nav.classList.remove('active');
      });
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
});

// --- Produk filter & search ---
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  const productGroups = document.querySelectorAll('.product-group');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const cat = this.getAttribute('data-category');
      productGroups.forEach(group => {
        if (cat === 'all' || group.getAttribute('data-group') === cat) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
      
      document.getElementById('searchInput').value = '';
      document.querySelectorAll('.product-card').forEach(card => card.style.display = '');
    });
  });

  function searchProducts(keyword) {
    keyword = keyword.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';
      if (keyword === '' || title.toLowerCase().includes(keyword) || category.toLowerCase().includes(keyword)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', function() {
      searchProducts(searchInput.value);
    });
    
    searchInput.addEventListener('input', function() {
      searchProducts(searchInput.value);
    });
    
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        searchProducts(searchInput.value);
      }
    });
  }
});

// --- Smooth scroll navbar ---
document.querySelectorAll('.navbar-nav a.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Floating scroll to top ---
const btnScrollTop = document.getElementById('btnScrollTop');
if (btnScrollTop) {
  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Modal toggles ---
const btnDaftarkanSekolah = document.getElementById('btnDaftarkanSekolah');
const btnLihatDashboard = document.getElementById('btnLihatDashboard');
const btnLihatSemuaEcoChampions = document.getElementById('btnLihatSemuaEcoChampions');

if (btnDaftarkanSekolah) {
  btnDaftarkanSekolah.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalDaftarkanSekolah'));
    modal.show();
  });
}

if (btnLihatDashboard) {
  btnLihatDashboard.addEventListener('click', function(e) {
    e.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById('modalLihatDashboard'));
    modal.show();
  });
}

if (btnLihatSemuaEcoChampions) {
  btnLihatSemuaEcoChampions.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalEcoChampions'));
    modal.show();
  });
}

// --- Modal Login/Logout logic ---
const authBtn = document.getElementById('authBtn');
const modalLogin = document.getElementById('modalLogin');
const modalLogout = document.getElementById('modalLogout');
const confirmLoginBtn = document.getElementById('confirmLoginBtn');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

if (authBtn) {
  authBtn.onclick = function() {
    if (authBtn.textContent === 'Logout') {
      if (modalLogout) {
        const modal = new bootstrap.Modal(modalLogout);
        modal.show();
      }
    } else {
      if (modalLogin) {
        const modal = new bootstrap.Modal(modalLogin);
        modal.show();
      }
    }
  };
}

if (confirmLoginBtn) {
  confirmLoginBtn.onclick = function() {
    authBtn.textContent = 'Logout';
    authBtn.className = 'btn btn-danger btn-sm mt-2';
    bootstrap.Modal.getInstance(modalLogin).hide();
  };
}

if (confirmLogoutBtn) {
  confirmLogoutBtn.onclick = function() {
    authBtn.textContent = 'Login';
    authBtn.className = 'btn btn-success btn-sm mt-2';
    bootstrap.Modal.getInstance(modalLogout).hide();
  };
}

// --- Animate eco-score progress bar & value ---
document.addEventListener('DOMContentLoaded', function() {
  const progressFill = document.querySelector('.progress-fill');
  const ecoScoreValue = document.getElementById('ecoScoreValue');
  let progress = 0;
  let score = 0;
  const targetProgress = 75;
  const targetScore = 24750;

  function animateProgress() {
    if (progressFill && progress < targetProgress) {
      progress++;
      progressFill.style.width = progress + '%';
      requestAnimationFrame(animateProgress);
    }
  }

  function animateScore() {
    if (ecoScoreValue && score < targetScore) {
      score += Math.ceil(targetScore / 100);
      if (score > targetScore) score = targetScore;
      ecoScoreValue.textContent = score.toLocaleString('id-ID');
      requestAnimationFrame(animateScore);
    }
  }

  animateProgress();
  animateScore();
});

// --- Fitur Keranjang ---
document.addEventListener('DOMContentLoaded', function() {
  window.cart = [];
  
  function updateCartBadge() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = window.cart.length;
      cartCount.classList.toggle('animate__bounce', window.cart.length > 0);
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.disabled = window.cart.length === 0;
    }
  }

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (window.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-4">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <p class="text-muted">Keranjang belanja masih kosong</p>
          <small class="text-muted">Yuk, mulai belanja produk berkualitas dengan harga terjangkau!</small>
        </div>
      `;
      return;
    }
    
    let html = '<ul class="list-group mb-3">';
    let total = 0;
    
    window.cart.forEach((item, idx) => {
      total += item.price;
      html += `
        <li class="list-group-item d-flex align-items-center justify-content-between">
          <img src="${item.img}" alt="${item.title}" 
               style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
          <div class="flex-grow-1 ms-2">
            <div class="fw-bold">${item.title}</div>
            <div class="text-success">Rp ${item.price.toLocaleString('id-ID')}</div>
          </div>
          <button class="btn btn-sm btn-danger remove-item" data-idx="${idx}">
            <i class="fas fa-trash"></i>
          </button>
        </li>
      `;
    });
    
    html += '</ul>';
    html += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="fw-bold">Total:</div>
        <div class="fw-bold text-success fs-5">Rp ${total.toLocaleString('id-ID')}</div>
      </div>
    `;
    
    cartItems.innerHTML = html;
    
    cartItems.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        window.cart.splice(idx, 1);
        updateCartBadge();
        renderCart();
      });
    });
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.product-card');
      const item = {
        id: card.getAttribute('data-id'),
        title: card.getAttribute('data-title'),
        price: parseInt(card.getAttribute('data-price')),
        img: card.getAttribute('data-img')
      };
      
      // Feedback visual
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check me-2"></i>Ditambahkan';
      this.classList.add('btn-success');
      this.classList.remove('btn-primary');
      
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.classList.remove('btn-success');
        this.classList.add('btn-primary');
      }, 2000);
      
      window.cart.push(item);
      updateCartBadge();
    });
  });

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', function() {
      renderCart();
      const modal = new bootstrap.Modal(document.getElementById('cartModal'));
      modal.show();
    });
  }

  const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');
  if (confirmCheckoutBtn) {
    confirmCheckoutBtn.addEventListener('click', function() {
      const metode = document.querySelector('input[name="metodePembayaran"]:checked');
      const pengiriman = document.querySelector('input[name="metodePengiriman"]:checked');
      
      let metodeText = metode ? metode.value : 'Bank';
      let pengirimanText = pengiriman ? pengiriman.value : 'Ambil di Sekolah';
      
      if (typeof window.cart !== 'undefined') {
        window.cart = [];
        updateCartBadge();
        renderCart();
      }
      
      alert(
        'Checkout berhasil!\n' +
        'Metode pembayaran: ' + metodeText +
        '\nOpsi pengiriman: ' + pengirimanText
      );
      
      bootstrap.Modal.getInstance(document.getElementById('modalCheckout')).hide();
      bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    });
  }

  updateCartBadge();
});

// --- Inisialisasi Leaflet map ---
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('mapid')) {
    var map = L.map('mapid', {
      zoomControl: false,
      scrollWheelZoom: false
    }).setView([-2.5, 118], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    L.control.zoom({
      position: 'topright'
    }).addTo(map);
    
    // Perbaikan responsivitas
    setTimeout(() => map.invalidateSize(), 0);
    window.addEventListener('resize', () => setTimeout(() => map.invalidateSize(), 0));
    
    var schools = [
      { name: 'MAN Insan Cendekia OKI', lat: -3.385, lng: 104.830, score: 5000, students: 800 },
      { name: 'SMAN 1 Jakarta', lat: -6.2, lng: 106.8, score: 4852, students: 1247 },
      { name: 'SMPN 5 Surabaya', lat: -7.3, lng: 112.7, score: 4203, students: 987 },
      { name: 'SMAN 3 Bandung', lat: -6.9, lng: 107.6, score: 3987, students: 1156 },
      { name: 'SMPN 2 Yogyakarta', lat: -7.8, lng: 110.4, score: 3654, students: 897 },
      { name: 'SMAN 1 Medan', lat: 3.6, lng: 98.7, score: 3421, students: 1089 },
      { name: 'SMPN 4 Makassar', lat: -5.1, lng: 119.4, score: 2987, students: 756 },
      { name: 'SMAN 2 Denpasar', lat: -8.7, lng: 115.2, score: 2654, students: 834 }
    ];
    
    schools.forEach(function(school) {
      L.marker([school.lat, school.lng])
        .addTo(map)
        .bindPopup(`<b>${school.name}</b><br>Eco-Score: ${school.score}`)
        .on('mouseover', function(e) {
          this.openPopup();
        });
    });
  }
});

// --- Sidebar Chat Penjual ---
document.addEventListener('DOMContentLoaded', function() {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatSidebarSeller = document.getElementById('chatSidebarSeller');
  const chatSidebarMessages = document.getElementById('chatSidebarMessages');
  const chatSidebarInput = document.getElementById('chatSidebarInput');
  const chatSidebarSend = document.getElementById('chatSidebarSend');
  const closeChatSidebar = document.getElementById('closeChatSidebar');
  const floatingChatBtn = document.getElementById('floatingChatBtn');
  const chatSellerHistory = document.getElementById('chatSellerHistory');

  window._chatHistory = window._chatHistory || {};
  window._sellerHistory = window._sellerHistory || [];

  function openChatSidebar(seller) {
    chatSidebarSeller.textContent = seller;
    chatSidebarMessages.innerHTML = '';
    
    if (window._chatHistory[seller]) {
      window._chatHistory[seller].forEach(msg => {
        chatSidebarMessages.appendChild(msg);
      });
    }
    
    chatSidebar.classList.add('active');
    chatSidebar.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      if (chatSidebarInput) chatSidebarInput.focus();
      if (chatSidebarMessages) chatSidebarMessages.scrollTop = chatSidebarMessages.scrollHeight;
    }, 200);
    
    if (seller && !window._sellerHistory.includes(seller)) {
      window._sellerHistory.push(seller);
      renderSellerHistory();
    }
  }

  function renderSellerHistory() {
    if (!chatSellerHistory) return;
    
    if (window._sellerHistory.length === 0) {
      chatSellerHistory.innerHTML = '';
      return;
    }
    
    let html = '<div class="seller-history-title px-3">History Chat:</div>';
    html += '<div class="seller-history-list">';
    
    window._sellerHistory.forEach(seller => {
      let lastMsg = '';
      if (window._chatHistory[seller] && window._chatHistory[seller].length > 0) {
        const last = window._chatHistory[seller][window._chatHistory[seller].length - 1];
        const bubble = last.querySelector('.bubble');
        lastMsg = bubble ? bubble.textContent : '';
      }
      
      let avatarText = seller.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
      
      html += `
        <div class="seller-history-row px-3" data-seller="${seller}">
          <div class="seller-history-avatar">${avatarText}</div>
          <div class="seller-history-info">
            <div class="seller-history-name">${seller}</div>
            <div class="seller-history-lastmsg">${lastMsg}</div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    chatSellerHistory.innerHTML = html;
    
    chatSellerHistory.querySelectorAll('.seller-history-row').forEach(row => {
      row.addEventListener('click', function() {
        openChatSidebar(this.getAttribute('data-seller'));
      });
    });
  }

  document.querySelectorAll('.chat-seller-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const seller = this.getAttribute('data-seller') || 'Penjual';
      openChatSidebar(seller);
    });
  });

  if (floatingChatBtn) {
    floatingChatBtn.addEventListener('click', function() {
      openChatSidebar('MAN Insan Cendekia OKI');
    });
  }

  function sendChatMessage() {
    const seller = chatSidebarSeller.textContent;
    const text = chatSidebarInput.value.trim();
    
    if (!text) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message me';
    msgDiv.innerHTML = `<div class="bubble">${text}</div><div class="meta">Anda</div>`;
    
    chatSidebarMessages.appendChild(msgDiv);
    chatSidebarInput.value = '';
    chatSidebarMessages.scrollTop = chatSidebarMessages.scrollHeight;
    
    if (!window._chatHistory[seller]) window._chatHistory[seller] = [];
    window._chatHistory[seller].push(msgDiv);
    
    setTimeout(() => {
      const replyDiv = document.createElement('div');
      replyDiv.className = 'chat-message';
      replyDiv.innerHTML = `<div class="bubble">Terima kasih, pesan Anda sudah diterima oleh ${seller}.</div><div class="meta">${seller}</div>`;
      
      chatSidebarMessages.appendChild(replyDiv);
      chatSidebarMessages.scrollTop = chatSidebarMessages.scrollHeight;
      window._chatHistory[seller].push(replyDiv);
    }, 1200);
    
    if (seller && !window._sellerHistory.includes(seller)) {
      window._sellerHistory.push(seller);
      renderSellerHistory();
    }
  }

  if (chatSidebarSend) {
    chatSidebarSend.addEventListener('click', sendChatMessage);
  }
  
  if (chatSidebarInput) {
    chatSidebarInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
  
  if (closeChatSidebar) {
    closeChatSidebar.addEventListener('click', function() {
      chatSidebar.classList.remove('active');
      chatSidebar.setAttribute('aria-hidden', 'true');
    });
  }
  
  document.addEventListener('mousedown', function(e) {
    if (chatSidebar.classList.contains('active') &&
        !chatSidebar.contains(e.target) &&
        !e.target.classList.contains('chat-seller-btn') &&
        e.target !== floatingChatBtn) {
      chatSidebar.classList.remove('active');
      chatSidebar.setAttribute('aria-hidden', 'true');
    }
  });

  renderSellerHistory();
});

// --- EcoBuddy Chat ---
document.addEventListener('DOMContentLoaded', function() {
  const ecobuddyBtn = document.getElementById('ecobuddyBtn');
  const ecobuddyPanel = document.getElementById('ecobuddyPanel');
  const closeEcobuddyBtn = document.getElementById('closeEcobuddyBtn');
  const ecobuddySend = document.getElementById('ecobuddySend');
  const ecobuddyInput = document.getElementById('ecobuddyInput');
  const ecobuddyMessages = document.getElementById('ecobuddyMessages');
  
  if (ecobuddyBtn && ecobuddyPanel) {
    ecobuddyBtn.addEventListener('click', function() {
      ecobuddyPanel.classList.toggle('active');
    });
    
    closeEcobuddyBtn.addEventListener('click', function() {
      ecobuddyPanel.classList.remove('active');
    });
    
    function sendMessage() {
      const message = ecobuddyInput.value.trim();
      if (message) {
        addMessage(message, 'user');
        ecobuddyInput.value = '';
        
        setTimeout(() => {
          const responses = [
            "Saya bisa membantu Anda menemukan barang bekas sekolah yang sesuai kebutuhan.",
            "Setiap pembelian di Tuker.in akan menyumbang 1 bibit pohon untuk penghijauan.",
            "Anda bisa mencari barang berdasarkan kategori di halaman pencarian.",
            "Eco-Score menunjukkan kontribusi sekolah Anda terhadap lingkungan.",
            "Untuk bertanya tentang barang tertentu, sebutkan nama barangnya."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'bot');
        }, 1000);
      }
    }
    
    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ecobuddy-message ecobuddy-${sender}`;
      
      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'ecobuddy-bubble';
      bubbleDiv.textContent = text;
      
      messageDiv.appendChild(bubbleDiv);
      ecobuddyMessages.appendChild(messageDiv);
      ecobuddyMessages.scrollTop = ecobuddyMessages.scrollHeight;
    }
    
    ecobuddySend.addEventListener('click', sendMessage);
    ecobuddyInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
    
    setTimeout(() => {
      addMessage("Selamat datang di Tuker.in! Saya EcoBuddy, asisten digital Anda. Bagaimana saya bisa membantu?", 'bot');
    }, 500);
  }
});

// --- Dashboard Panel logic ---
document.addEventListener('DOMContentLoaded', function() {
  const profileDashboardBtn = document.getElementById('profileDashboardBtn');
  const dashboardPanel = document.getElementById('dashboardPanel');
  const closeDashboardBtn = document.getElementById('closeDashboardBtn');
  const authBtn = document.getElementById('authBtn');
  let loggedIn = false;

  if (profileDashboardBtn && dashboardPanel && closeDashboardBtn) {
    profileDashboardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dashboardPanel.classList.add('active');
      dashboardPanel.setAttribute('aria-hidden', 'false');
    });
    
    closeDashboardBtn.addEventListener('click', () => {
      dashboardPanel.classList.remove('active');
      dashboardPanel.setAttribute('aria-hidden', 'true');
    });
    
    document.addEventListener('click', (e) => {
      if (!dashboardPanel.contains(e.target) && e.target !== profileDashboardBtn && !profileDashboardBtn.contains(e.target)) {
        dashboardPanel.classList.remove('active');
        dashboardPanel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (window.Chart && document.getElementById('ecoStatsChart')) {
    new Chart(document.getElementById('ecoStatsChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Barang Didaur Ulang', 'CO₂ Dikurangi', 'Pohon Terselamatkan'],
        datasets: [{
          label: 'Statistik',
          data: [156, 89.2, 12],
          backgroundColor: ['#8bc34a', '#2196f3', '#ffeb3b']
        }]
      },
      options: {
        plugins: { legend: { display: true, position: 'bottom' } },
        cutout: '70%',
      }
    });
  }

  function updateAuthBtn() {
    authBtn.textContent = loggedIn ? 'Logout' : 'Login';
    authBtn.className = loggedIn ? 'btn btn-danger btn-sm mt-2' : 'btn btn-success btn-sm mt-2';
  }
  
  updateAuthBtn();
  
  authBtn.onclick = function() {
    loggedIn = !loggedIn;
    updateAuthBtn();
    if (loggedIn) {
      const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
      modalLogin.show();
    } else {
      const modalLogout = new bootstrap.Modal(document.getElementById('modalLogout'));
      modalLogout.show();
    }
  };

  function growTreeSVG(score) {
    const percent = Math.min(score / 5000, 1);
    document.getElementById('tree-leaf-1').setAttribute('ry', 22 + percent * 8);
    document.getElementById('tree-leaf-2').setAttribute('ry', 14 + percent * 5);
    document.getElementById('tree-leaf-3').setAttribute('ry', 8 + percent * 4);
  }
  
  growTreeSVG(5000);
});

// --- Modal backdrop fix ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('hidden.bs.modal', function() {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    });
  });
});