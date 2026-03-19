const API_URL = window.location.origin === 'http://localhost:5000' || window.location.origin.includes('127.0.0.1') ? 'http://localhost:3000' : ''; 
let token = localStorage.getItem('ne-admin-token');

if (token) {
  showDashboard();
}

async function login() {
  const username = document.getElementById('admUser').value;
  const password = document.getElementById('admPass').value;
  const err = document.getElementById('loginErr');
  
  try {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      token = data.token;
      localStorage.setItem('ne-admin-token', token);
      showDashboard();
    } else {
      err.textContent = data.error || 'Erreur de connexion';
    }
  } catch (e) {
    err.textContent = 'Impossible de contacter le serveur';
  }
}

function logout() {
  localStorage.removeItem('ne-admin-token');
  window.location.reload();
}

function showDashboard() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  loadStats();
}

async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.status === 401 || res.status === 403) {
      logout();
      return;
    }
    
    const data = await res.json();
    document.getElementById('statVisits').textContent = data.totalVisits.toLocaleString();
    document.getElementById('statOrders').textContent = data.totalOrders.toLocaleString();
    document.getElementById('statRevenue').textContent = data.totalRevenue.toLocaleString() + ' CFA';
    
    renderOrders(data.recentOrders);
  } catch (e) {
    console.error('Erreur chargement stats:', e);
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('orderTable');
  if (!orders || orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#555;">Aucune commande pour le moment</td></tr>';
    return;
  }
  
  tbody.innerHTML = orders.map(order => {
    const date = new Date(order.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const items = JSON.parse(order.items);
    const itemsList = items.map(i => `${i.prod.name} (${i.size}) x${i.qty}`).join('<br>');
    
    return `
      <tr>
        <td>${date}</td>
        <td><strong>${order.customer_name}</strong><br><span style="color:#777; font-size:11px;">${order.customer_phone}</span></td>
        <td>${order.customer_region}</td>
        <td style="font-size:11px; line-height:1.4;">${itemsList}</td>
        <td><span class="badge badge-pay">${order.payment_method}</span></td>
        <td style="font-weight:700; color:var(--red);">${order.total_amount.toLocaleString()} CFA</td>
      </tr>
    `;
  }).join('');
}
