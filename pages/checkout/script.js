fetch('../../src/components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });

const splitSwitch = document.getElementById('split-switch');
const splitSection = document.getElementById('split-bill-section');
const splitInput = document.getElementById('split-bill-count');
const splitPerPerson = document.getElementById('split-bill-perperson');
const splitLinks = document.getElementById('split-bill-links');
const splitTimer = document.getElementById('split-bill-timer');
const totalBill = 30000000;

let splitMode = false;
let splitCount = 0;
let splitPaid = [];
let timerInterval = null;
let timeLeft = 3600;
let currentParticipant = 0;

function formatRupiah(num) {
    return "Rp" + num.toLocaleString('id-ID');
}

function resetSplit() {
    splitLinks.innerHTML = '';
    splitTimer.innerHTML = '';
    splitPaid = [];
    splitCount = 0;
    clearInterval(timerInterval);
    timeLeft = 3600;
    payBtn.disabled = false;
    payBtn.textContent = "Bayar";
}

splitSwitch.onclick = function() {
    splitMode = !splitMode;
    splitSwitch.classList.toggle('active', splitMode);
    splitSection.style.display = splitMode ? 'block' : 'none';
    resetSplit();
    if (!splitMode) {
        splitInput.value = '';
    }
};

const dpCheckbox = document.getElementById('use-dp');

function getCurrentBill() {
    return dpCheckbox && dpCheckbox.checked ? totalBill / 2 : totalBill;
}

function showSplitPaymentPopup(idx, perPerson) {
    currentParticipant = idx;
    updateSplitPaymentModal(idx, perPerson);
    showPaymentModal(
        document.getElementById('payment-modal-desc').innerHTML,
        null,
        { title: "Split Bill Pembayaran", showNav: true }
    );
    document.getElementById('payment-modal').classList.add('active');
}

function updateSplitPaymentModal(idx, perPerson) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PAYMENT_LINK_${idx+1}`;
    const paymentLink = `https://example.com/pay/${idx+1}`;
    const status = splitPaid[idx] ? "<span style='color:green;font-weight:600;'>Sudah bayar</span>" : "<span style='color:#d32f2f;font-weight:600;'>Belum bayar</span>";
    document.getElementById('payment-modal-desc').innerHTML = `
        <div style="margin-bottom:0.5rem;">Peserta ${idx+1} dari ${splitCount} ${dpCheckbox && dpCheckbox.checked ? "(DP 50%)" : ""}</div>
        <img src="${qrUrl}" alt="QR Pembayaran" style="margin:12px auto;display:block;width:120px;height:120px;">
        <div style="margin-bottom:0.5rem;">
            <a href="${paymentLink}" target="_blank" style="color:#219EBC;font-weight:600;">Klik di sini untuk melakukan pembayaran</a>
        </div>
        <div>Tagihan: <b>${formatRupiah(perPerson)}</b></div>
        <div>Status: ${status}</div>
    `;
    const payBtn = document.getElementById('pay-simulate-btn');
    payBtn.disabled = splitPaid[idx];
    payBtn.textContent = splitPaid[idx] ? "Sudah Dibayar" : "Simulasi Bayar";
    document.getElementById('prev-participant').disabled = idx === 0;
    document.getElementById('next-participant').disabled = idx === splitCount - 1;
}

document.getElementById('prev-participant').onclick = function() {
    if (currentParticipant > 0) {
        let perPerson = Math.ceil(totalBill / splitCount);
        showSplitPaymentPopup(currentParticipant - 1, perPerson);
    }
};
document.getElementById('next-participant').onclick = function() {
    if (currentParticipant < splitCount - 1) {
        let perPerson = Math.ceil(totalBill / splitCount);
        showSplitPaymentPopup(currentParticipant + 1, perPerson);
    }
};
document.getElementById('pay-simulate-btn').onclick = function() {
    if (!splitPaid[currentParticipant]) {
        splitPaid[currentParticipant] = true;
        let perPerson = Math.ceil(totalBill / splitCount);
        updateSplitPaymentModal(currentParticipant, perPerson);
        if (splitPaid.every(Boolean)) {
            setTimeout(() => {
                document.getElementById('payment-modal').classList.remove('active');
                showSuccessModal();
            }, 400);
        }
    }
};

function updateTimer() {
    if (!splitMode || splitCount < 2) return;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    splitTimer.textContent = `Batas pembayaran: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        splitTimer.textContent = "Waktu habis. Pemesanan dibatalkan oleh sistem.";
        splitLinks.innerHTML = '';
    }
    timeLeft--;
}

window.paySplit = function(idx) {
    let perPerson = Math.ceil(totalBill / splitCount);
    showPaymentModal(
        `Peserta ${idx+1}, silakan lakukan pembayaran sebesar <b>Rp${perPerson.toLocaleString('id-ID')}</b>.<br><br>Simulasi QR/Link pembayaran di sini.`,
        function() {
            splitPaid[idx] = true;
            document.querySelector(`#split-link-${idx} .status`).innerHTML = "<span class='paid'>Sudah bayar</span>";
            document.querySelector(`#split-link-${idx} button`).disabled = true;
            if (splitPaid.every(Boolean)) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    showPaymentModal(
                        "Semua peserta sudah membayar. Pemesanan terkonfirmasi!",
                        function() {}
                    );
                }, 300);
            }
        }
    );
};

function showPaymentModal(desc, onConfirm, options = {}) {
    const paymentModal = document.getElementById('payment-modal');
    const paymentModalDesc = document.getElementById('payment-modal-desc');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const modalTitle = paymentModal.querySelector('h3');
    const navDiv = paymentModal.querySelector('div[style*="margin:1rem 0"]');

    modalTitle.textContent = options.title || "Pembayaran";

    if (navDiv) navDiv.style.display = options.showNav ? "block" : "none";

    paymentModalDesc.innerHTML = desc;
    paymentModal.classList.add('active');
    confirmPaymentBtn.onclick = function() {
        paymentModal.classList.remove('active');
        if (onConfirm) onConfirm();
    };
}
document.getElementById('close-payment-modal').onclick = () => document.getElementById('payment-modal').classList.remove('active');
document.getElementById('payment-modal').onclick = (e) => { if (e.target === document.getElementById('payment-modal')) document.getElementById('payment-modal').classList.remove('active'); };

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const detail = document.getElementById('success-modal-detail');
    detail.innerHTML = `
        <b>Venue:</b> Hotel Bidakara Meeting Room<br>
        <b>Tanggal:</b> 22 September 2025<br>
        <b>Waktu:</b> 13.00 - 16.00<br>
        <b>Durasi:</b> 3 Jam<br>
        <b>Total biaya:</b> Rp30.000.000
    `;
    modal.classList.add('active');
}
document.getElementById('close-success-modal').onclick = function() {
    document.getElementById('success-modal').classList.remove('active');
    window.location.href = '../home/home.html';
};

const payBtn = document.getElementById('pay-btn');

splitInput.oninput = function() {
    let val = parseInt(splitInput.value);
    if (isNaN(val) || val < 2) {
        splitPerPerson.innerHTML = `<span style="color:#d32f2f;font-weight:600;">Minimal peserta split bill adalah 2 orang</span>`;
        payBtn.disabled = true;
        return;
    }
    splitCount = val;
    let perPerson = Math.ceil(getCurrentBill() / splitCount);
    splitPerPerson.innerHTML = `Biaya per orang: <b>${formatRupiah(perPerson)}</b>`;
    payBtn.disabled = false;
    splitLinks.innerHTML = '';
    splitTimer.innerHTML = '';
};

payBtn.onclick = function() {
    const bill = getCurrentBill();
    if (!splitMode) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PAYMENT_LINK_FULL`;
        const paymentLink = `https://example.com/pay/full`;
        showPaymentModal(
            `
            <div style="margin-bottom:0.5rem;">${dpCheckbox && dpCheckbox.checked ? " (DP 50%)" : ""}</div>
            <img src="${qrUrl}" alt="QR Pembayaran" style="margin:12px auto;display:block;width:120px;height:120px;">
            <div style="margin-bottom:0.5rem;">
                <a href="${paymentLink}" target="_blank" style="color:#219EBC;font-weight:600;">Klik di sini untuk melakukan pembayaran</a>
            </div>
            <div>Tagihan: <b>${formatRupiah(bill)}</b></div>
            <div>Status: <span style='color:#d32f2f;font-weight:600;'>Belum bayar</span></div>
            `,
            function() {
                showSuccessModal();
            }
        );
    } else {
        let val = parseInt(splitInput.value);
        if (isNaN(val) || val < 2 || val > 20) {
            alert('Masukkan jumlah peserta split bill minimal 2.');
            return;
        }
        splitCount = val;
        let perPerson = Math.ceil(getCurrentBill() / splitCount);
        splitPaid = Array(splitCount).fill(false);
        currentParticipant = 0;
        showSplitPaymentPopup(currentParticipant, perPerson);
    }
};

function showSplitPaymentPopup(idx, perPerson) {
    currentParticipant = idx;
    updateSplitPaymentModal(idx, perPerson);
    showPaymentModal(
        document.getElementById('payment-modal-desc').innerHTML,
        null,
        { title: "Split Bill Pembayaran", showNav: true }
    );
    document.getElementById('payment-modal').classList.add('active');
}

function updateSplitPaymentModal(idx, perPerson) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PAYMENT_LINK_${idx+1}`;
    const paymentLink = `https://example.com/pay/${idx+1}`;
    const status = splitPaid[idx] ? "<span style='color:green;font-weight:600;'>Sudah bayar</span>" : "<span style='color:#d32f2f;font-weight:600;'>Belum bayar</span>";
    document.getElementById('payment-modal-desc').innerHTML = `
        <div style="margin-bottom:0.5rem;">Peserta ${idx+1} dari ${splitCount} ${dpCheckbox && dpCheckbox.checked ? "(DP 50%)" : ""}</div>
        <img src="${qrUrl}" alt="QR Pembayaran" style="margin:12px auto;display:block;width:120px;height:120px;">
        <div style="margin-bottom:0.5rem;">
            <a href="${paymentLink}" target="_blank" style="color:#219EBC;font-weight:600;">Klik di sini untuk melakukan pembayaran</a>
        </div>
        <div>Tagihan: <b>${formatRupiah(perPerson)}</b></div>
        <div>Status: ${status}</div>
    `;
    const payBtn = document.getElementById('pay-simulate-btn');
    payBtn.disabled = splitPaid[idx];
    payBtn.textContent = splitPaid[idx] ? "Sudah Dibayar" : "Simulasi Bayar";
    document.getElementById('prev-participant').disabled = idx === 0;
    document.getElementById('next-participant').disabled = idx === splitCount - 1;
}

if (dpCheckbox) {
    dpCheckbox.addEventListener('change', function() {
        if (splitMode && splitInput.value >= 2) {
            let perPerson = Math.ceil(getCurrentBill() / splitCount);
            splitPerPerson.innerHTML = `Biaya per orang: <b>${formatRupiah(perPerson)}</b>`;
        }
    });
}