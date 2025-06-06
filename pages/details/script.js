fetch('../../src/components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.reserve-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Reservasi berhasil! Silakan cek email Anda untuk konfirmasi.');
        });
    }

    const images = [
        "../../src/assets/images/hotelbidakara.svg",
        "../../src/assets/images/hotelbidakara2.webp",
        "../../src/assets/images/hotelbidakara3.webp"
    ];
    let currentImg = 0;

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');

    function showModal(idx, direction = null) {
        if (direction) {
            modalImg.classList.remove('fade-in');
            modalImg.classList.add('fade-out');
            setTimeout(() => {
                modalImg.src = images[idx];
                modalImg.classList.remove('fade-out');
                modalImg.classList.add('fade-in');
            }, 180);
        } else {
            modalImg.src = images[idx];
            modalImg.classList.add('fade-in');
        }
        modal.classList.add('active');
        modalImg.classList.remove('zoomed');
    }

    document.querySelectorAll('.main-image, .gallery-thumb').forEach((img, idx) => {
        img.addEventListener('click', () => {
            currentImg = img.classList.contains('main-image') ? 0 : idx;
            showModal(currentImg);
        });
    });

    closeModal.onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

    prevBtn.onclick = (e) => {
        e.stopPropagation();
        currentImg = (currentImg + images.length - 1) % images.length;
        showModal(currentImg, 'prev');
    };
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        currentImg = (currentImg + 1) % images.length;
        showModal(currentImg, 'next');
    };

    modalImg.onclick = (e) => {
        e.stopPropagation();
        modalImg.classList.toggle('zoomed');
    };

    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') closeModal.click();
    });

    let startX = null;
    let isTouch = false;

    function onTouchStart(e) {
        isTouch = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    function onTouchMove(e) {
        if (startX === null) return;
        let x = e.touches ? e.touches[0].clientX : e.clientX;
        let diff = x - startX;
    }
    function onTouchEnd(e) {
        if (startX === null) return;
        let endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        let diff = endX - startX;
        if (Math.abs(diff) > 60) {
            if (diff > 0) {
                prevBtn.click();
            } else {
                nextBtn.click();
            }
        }
        startX = null;
        isTouch = false;
    }

    modalImg.addEventListener('touchstart', onTouchStart);
    modalImg.addEventListener('touchmove', onTouchMove);
    modalImg.addEventListener('touchend', onTouchEnd);

    modalImg.addEventListener('mousedown', onTouchStart);
    modalImg.addEventListener('mousemove', onTouchMove);
    modalImg.addEventListener('mouseup', onTouchEnd);
    modalImg.addEventListener('mouseleave', () => { startX = null; });

    const allReviews = [
        {name: "Qimid", date: "25/05/2025", stars: 5, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."},
        {name: "Ritonga", date: "04/05/2025", stars: 4, text: "Keren, cepat dan bersih..."},
        {name: "Ghaffar", date: "01/05/2025", stars: 5, text: "Pelayanan ramah, ruangan nyaman, recommended!"},
        {name: "Gama", date: "28/04/2025", stars: 3, text: "Cukup baik, hanya saja AC kurang dingin."},
        {name: "Shataya", date: "20/04/2025", stars: 2, text: "Kurang bersih, perlu ditingkatkan lagi."},
        {name: "Dewi", date: "15/04/2025", stars: 5, text: "Sangat puas, fasilitas lengkap dan lokasi strategis."},
        {name: "Budi", date: "10/04/2025", stars: 4, text: "Bagus, tapi parkir agak susah."},
        {name: "Sinta", date: "05/04/2025", stars: 1, text: "Kurang memuaskan, pelayanan lambat."}
    ];
    const reviewPerPage = 3;
    let currentReviewPage = 1;
    let currentStarFilter = "all";

    function renderReviews() {
        const list = document.getElementById('review-list');
        let filtered = allReviews;
        if (currentStarFilter !== "all") {
            filtered = allReviews.filter(r => r.stars == currentStarFilter);
        }
        const start = 0;
        const end = reviewPerPage * currentReviewPage;
        const show = filtered.slice(start, end);

        list.innerHTML = show.map(r => `
            <div class="review-item">
                <div class="review-avatar">${r.name[0]}</div>
                <div class="review-content">
                    <div class="review-name">${r.name} <span class="review-date">${r.date}</span></div>
                    <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
                    <div class="review-text">${r.text}</div>
                </div>
            </div>
        `).join('');

        const btn = document.getElementById('load-more-review');
        if (filtered.length > end) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    }

    document.getElementById('star-filter').addEventListener('change', function() {
        currentStarFilter = this.value;
        currentReviewPage = 1;
        renderReviews();
    });

    document.getElementById('load-more-review').addEventListener('click', function() {
        currentReviewPage++;
        renderReviews();
    });

    renderReviews();
});