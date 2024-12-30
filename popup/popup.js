const form = document.querySelector('#loginForm');
const errorMessage = document.getElementById('error-message');
const loginPage = document.getElementById('loginPage');
const secondPage = document.getElementById('secondPage');
const logoutBtn = document.getElementById('logoutBtn');
const usernameElement = document.getElementById('username');
const destekElement = document.getElementById('destek');

// Token'i decode eden fonksiyon
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1]; // Tokenin payload kısmını al
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64 formatına çevir
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload); // JSON objesine çevir
    } catch (error) {
        console.error('Token çözme hatası:', error);
        return null;
    }
}

// Token kontrolü ve ikinci sayfayı gösterme
chrome.storage.local.get('authToken', function(result) {
    const token = result.authToken;
    if (token) {
        loginPage.style.display = 'none'; // Giriş sayfasını gizle
        secondPage.style.display = 'block'; // İkinci sayfayı göster

        // Tokeni decode et ve bilgileri göster
        const decoded = decodeToken(token);
        if (decoded) {
            usernameElement.textContent = `Hoşgeldiniz, ${decoded.name} ${decoded.surname}!`; // İsim ve soyisim
            destekElement.textContent = 'Bir hata olursa serhat@dveb.com.tr adresine mail atabilirsiniz.';
        }

        // Resim ve butonu görünür yap
        const photo = document.getElementById('photoId');
        photo.src = '../images/e1.png'; // Resim URL'sini buraya ekle
        photo.style.display = 'block'; // Resmi göster
        logoutBtn.style.display = 'block'; // Çıkış yap butonunu göster
    }
});

// Giriş işlemi
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        mail: email,
        password: password
    };

    try {
        const response = await fetch('https://developer.ikmap.com.tr/api/v1/hr/personel/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            const token = result.data;
            chrome.storage.local.set({ authToken: token }, function() {
                console.log('Token saklandı.');
            });

            // Login sayfasını gizle, ikinci sayfayı göster
            loginPage.style.display = 'none';
            secondPage.style.display = 'block';

            // Tokeni decode et ve bilgileri göster
            const decoded = decodeToken(token);
            if (decoded) {
                usernameElement.textContent = `Hoşgeldiniz, ${decoded.name} ${decoded.surname}!`; // İsim ve soyisim
                destekElement.textContent = 'Teknik destek için "serhat@dveb.com.tr" .';
            }

            // Resim ve butonu görünür yap
            const photo = document.getElementById('photoId');
            photo.src = '../images/e1.png'; // Resim URL'sini buraya ekle
            photo.style.display = 'block'; // Resmi göster
            logoutBtn.style.display = 'block'; // Çıkış yap butonunu göster

            alert('Giriş başarılı!');
        } else {
            const error = await response.json();
            errorMessage.textContent = error.message || 'Giriş başarısız, lütfen tekrar deneyin.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Bir hata oluştu, lütfen tekrar deneyin.';
        errorMessage.style.display = 'block';
    }
});

// Çıkış yapma
logoutBtn.addEventListener('click', function() {
    chrome.storage.local.remove('authToken', function() {
        loginPage.style.display = 'block'; // Giriş sayfasını göster
        secondPage.style.display = 'none'; // İkinci sayfayı gizle
        usernameElement.textContent = ''; // Kullanıcı adını temizle
        destekElement.textContent = ''; // Destek mesajını temizle

        // Resim ve butonu gizle
        const photo = document.getElementById('photoId');
        photo.style.display = 'none';
        photo.src = ''; // Resmi temizle
        logoutBtn.style.display = 'none';
        alert('Çıkış yapıldı!');
    });
});
