// Chrome Extension Yüklendiğinde
chrome.runtime.onInstalled.addListener(function () {
    console.log("Chrome Extension Yüklendi");
});

// Sekme güncelleme veya etkinleşme durumlarında tetiklenir
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        handleTabUpdate(tab.url, tabId);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            handleTabUpdate(tab.url, activeInfo.tabId);
        }
    });
});

function handleTabUpdate(url, tabId) {
    if (url.startsWith("https://test.ikmap.com.tr") && url.includes("?")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const userId = urlParams.get("userId");
        const companyId = urlParams.get("companyId");
        const urlType = urlParams.get("type");

        if (userId && companyId && urlType) {
            let targetUrl;

            if (urlType.toLowerCase() === "v2") {
                targetUrl = `https://ebildirge.sgk.gov.tr/EBildirgeV2`;
            } else if (urlType.toLowerCase() === "v3") {
                targetUrl = `https://uyg.sgk.gov.tr/IsverenSistemi`;
            } else if (urlType.toLocaleLowerCase() === "v1") {
                targetUrl = `https://ebildirge.sgk.gov.tr/WPEB/amp/loginldap`;
            } else if (urlType.toLocaleLowerCase() === "v4") {
                targetUrl = `https://uyg.sgk.gov.tr/vizite/welcome.do`;
            }else if (urlType.toLocaleLowerCase() === "v5"){
                targetUrl = `https://uyg.sgk.gov.tr/IsvBildirimFormu/gooKullaniciLogin.do`
            }
            console.log("Yönlendirme yapılacak URL:", targetUrl);

            chrome.tabs.update(tabId, { url: targetUrl }, () => {
                console.log("Yönlendirme tamamlandı. Token kontrol ediliyor...");
                chrome.storage.local.get("authToken", function (result) {
                    const token = result.authToken;
                    if (token) {
                        console.log("Token bulundu, API çağrısı yapılıyor...");
                        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
                            if (updatedTabId === tabId && changeInfo.status === "complete") {
                                chrome.tabs.onUpdated.removeListener(listener);
                                fetchDataAndFillForm(token, userId, companyId, urlType, tabId);
                            }
                        });
                    } else {
                        console.error("Token bulunamadı!");
                    }
                });
            });
        } else {
            console.error("URL'de gerekli parametreler bulunamadı!");
        }
    }
}

function fetchDataAndFillForm(token, userId, companyId, urlType, tabId) {
    const apiUrl = `https://developer.ikmap.com.tr/api/v1/hr/admin/sgkrole/${userId}/${companyId}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("API isteği başarısız oldu");
            }
            return response.json();
        })
        .then((data) => {
            console.log("API yanıtı alındı:", data);
            if (data && data.data) {
                // URL tipi doğrultusunda uygun formu seç
                let action;
                if (urlType.toLowerCase() === "v2") {
                    action = "fillForm";
                } else if (urlType.toLowerCase() === "v3") {
                    action = "fillFormV3";  
                } else if (urlType.toLowerCase() === "v1"){
                    action = "fillFormLoginLdap";
                }else if(urlType.toLowerCase() === "v4"){
                    action = 'fillFormVizite'
                }else if(urlType.toLowerCase() === "v5"){
                    action = 'fillIsKazasi'
                }else{
                    action = 'hata'
                }

                chrome.tabs.sendMessage(tabId, {
                    action: action,
                    payload: data.data,
                });
            }
        })
        .catch((error) => {
            console.error("API hatası:", error);
        }); 
}









