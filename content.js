chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillForm") {
        console.log("V2 form doldurma için veri alındı:", message.payload);
        fillForm(message.payload);
    } else if (message.action === "fillFormLoginLdap") {
        console.log("V1 form doldurma için veri alındı:", message.payload);
        fillFormLoginLdap(message.payload);
    } else if (message.action === "fillFormV3") {
        console.log("V3 doldurma", message.payload);
        fillFormEBildirgeV3(message.payload);
    } else if (message.action === "fillFormVizite") {
        console.log("V4 vizite doldurma");
        fillFormViziteV4(message.payload);
    }else if(message.action === "fillIsKazasi"){
        fillIsKazasiV5(message.payload)
    }
});




function fillFormViziteV4(userData) {
    const usernameField = document.querySelector('input[name="kullaniciAdi"]');
    const isyeriKodField = document.querySelector('input[name="isyeriKodu"]'); // İş yeri Kodu
    const passwordField = document.querySelector('input[name="isyeriSifresi"]'); // Sistem Şifresi

    if (usernameField) usernameField.value = userData.kullaniciAdi || '';
    if (isyeriKodField) isyeriKodField.value = userData.isyeriKodu || '';
    if (passwordField) passwordField.value = userData.isyeriSifresi || '';
}


function fillForm(userData) {
    console.log("Form dolduruluyor:", userData);

    const kullaniciAdiInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_username"]');
    const isyeriKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_kod"]');
    const passwordInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_password"]');
    const isyeriSifreInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_sifre"]');
    const guvenlikKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_guvenlik"]');

    if (kullaniciAdiInput) kullaniciAdiInput.value = userData.kullaniciAdi || userData;
    if (isyeriKoduInput) isyeriKoduInput.value = userData.isyeriKodu || '';
    if (passwordInput) passwordInput.value = userData.sistemSifresi || '';
    if (isyeriSifreInput) isyeriSifreInput.value = userData.isyeriSifresi || '';
    if (guvenlikKoduInput) guvenlikKoduInput.value = userData.guvenlikKodu || 'Güvenlik Kodu Burada';
}




function fillIsKazasiV5(userData) {
    console.log("11312321124");
    const kullaniciAdiInput = document.querySelector('input[name="kullaniciAdi"]');
    const isyeriKoduInput = document.querySelector('input[name="isyeriKodu"]');
    const isyeriSifreInput = document.querySelector('input[name="isyeriSifresi"]');

    if (kullaniciAdiInput) kullaniciAdiInput.value = userData.kullaniciAdi || '';
    if (isyeriKoduInput) isyeriKoduInput.value = userData.isyeriKodu || '';
    if (isyeriSifreInput) isyeriSifreInput.value = userData.isyeriSifresi || '';
}


function fillFormEBildirgeV2(userData) {
    console.log("EBildirgeV2 formu dolduruluyor");

    const kullaniciAdiInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_username"]');
    const isyeriKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_kod"]');
    const passwordInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_password"]');
    const isyeriSifreInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_sifre"]');
    const guvenlikKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_guvenlik"]');

    // Verileri input'lara doldur
    if (kullaniciAdiInput) kullaniciAdiInput.value = userData.kullaniciAdi || '';
    if (isyeriKoduInput) isyeriKoduInput.value = userData.isyeriKodu || '';
    if (passwordInput) passwordInput.value = userData.sistemSifresi || '';
    if (isyeriSifreInput) isyeriSifreInput.value = userData.isyeriSifresi || '';
    if (guvenlikKoduInput) guvenlikKoduInput.value = userData.guvenlikKodu || '';
}


function fillFormEBildirgeV3(userData) {
    console.log("EBildirgeV3 formu dolduruluyor");

    const kullaniciAdiInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_username"]');
    const isyeriKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_kod"]');
    const passwordInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_password"]');
    const isyeriSifreInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_sifre"]');
    const guvenlikKoduInput = document.querySelector('input[id="kullaniciIlkKontrollerGiris_isyeri_guvenlik"]');

    if (kullaniciAdiInput) kullaniciAdiInput.value = userData.kullaniciAdi || '';
    if (isyeriKoduInput) isyeriKoduInput.value = userData.isyeriKodu || '';
    if (passwordInput) passwordInput.value = userData.sistemSifresi || '';
    if (isyeriSifreInput) isyeriSifreInput.value = userData.isyeriSifresi || '';
    if (guvenlikKoduInput) guvenlikKoduInput.value = userData.guvenlikKodu || '';
}


function fillFormLoginLdap(userData) {
    console.log("LoginLDAP formu dolduruluyor...");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            fillFormFields(userData);
        });
    } else {
        fillFormFields(userData);
    }
}

function fillFormFields(userData) {
    const usernameField = document.querySelector('input[name="j_username"]')
    const isyeriKodField = document.querySelector('input[name="isyeri_kod"]'); // İş yeri Kodu
    const passwordField = document.querySelector('input[name="j_password"]'); // Sistem Şifresi
    const isyeriSifreField = document.querySelector('input[name="isyeri_sifre"]'); // İş yeri Şifresi
    const guvenlikKoduField = document.querySelector('input[name="isyeri_guvenlik"]'); // Güvenlik Anahtarı

    // Alanları doldur
    if (usernameField) usernameField.value = userData.kullaniciAdi || '';
    if (isyeriKodField) isyeriKodField.value = userData.isyeriKodu || '';
    if (passwordField) passwordField.value = userData.sistemSifresi || '';
    if (isyeriSifreField) isyeriSifreField.value = userData.isyeriSifresi || '';
    if (guvenlikKoduField) guvenlikKoduField.value = userData.guvenlikKodu || '';
    
    console.log("Form başarıyla dolduruldu.");
}
