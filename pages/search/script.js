document.addEventListener('DOMContentLoaded', () => {
    fetch('../../src/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });

    const cards = [
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/hotelbidakara.svg",
            title: "Hotel Bidakara Meeting Room",
            location: "Jakarta Selatan, DKJ",
            rating: 4.5,
            reviews: 67,
            price: "Rp10.000.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/thesummitroom.svg",
            title: "The Summit Room",
            location: "Jakarta Pusat, DKJ",
            rating: 4.7,
            reviews: 124,
            price: "Rp12.000.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/orbitroom.png",
            title: "Orbit Room",
            location: "Jakarta Selatan, DKJ",
            rating: 4.4,
            reviews: 31,
            price: "Rp8.500.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/pixelpoint.svg",
            title: "PixelPoint",
            location: "Jakarta Barat, DKJ",
            rating: 4.6,
            reviews: 89,
            price: "Rp9.500.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/sparkspace.svg",
            title: "Spark Space",
            location: "Jakarta Timur, DKJ",
            rating: 4.3,
            reviews: 45,
            price: "Rp7.800.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/quantumhall.svg",
            title: "Quantum Hall",
            location: "Jakarta Utara, DKJ",
            rating: 4.5,
            reviews: 72,
            price: "Rp11.000.000/jam",
        },
    ];

    function renderCards(filteredCards) {
        const cardGrid = document.querySelector(".card-grid");
        cardGrid.innerHTML = "";

        if (filteredCards.length === 0) {
            cardGrid.innerHTML = "<p>No results found.</p>";
            return;
        }

        filteredCards.forEach((card) => {
            const cardElement = `
                <div class="card">
                    <span class="card-tag">${card.tag}</span>
                    <img src="${card.image}" alt="${card.title}" class="card-image">
                    <div class="card-content">
                        <h2>${card.title}</h2>
                        <div class="card-location">
                            <img src="../../src/assets/icons/location.svg" alt="Location Icon" class="icon">
                            <span>${card.location}</span>
                        </div>
                        <div class="card-rating">
                            <img src="../../src/assets/icons/star.svg" alt="Star Icon" class="icon">
                            <span>${card.rating} (${card.reviews} Ulasan)</span>
                        </div>
                        <div class="card-price">${card.price}</div>
                    </div>
                </div>
            `;
            cardGrid.innerHTML += cardElement;
        });
    }

    function filterCards() {
        const locationFilter = document.querySelector('.filter.location .filter-text').textContent.trim();
        const roomTypeFilter = document.querySelector('.filter.room-type .filter-text').textContent.trim();

        return cards.filter(card => {
            const matchesLocation = locationFilter === "Pilih Lokasi Anda" || card.location.includes(locationFilter);
            const matchesRoomType = roomTypeFilter === "Pilih jenis ruangan" || card.tag === roomTypeFilter;
            return matchesLocation && matchesRoomType;
        });
    }

    document.querySelectorAll('.filter').forEach(filter => {
        const filterContent = filter.querySelector('.filter-text');
        const dropdown = filter.querySelector('.dropdown');
        const options = dropdown.querySelectorAll('li');

        filter.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.filter').forEach(f => {
                if (f !== filter) f.classList.remove('active');
            });
            filter.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                filterContent.textContent = option.textContent.trim();
                filter.classList.remove('active');
                renderCards(filterCards());
            });
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    });

    renderCards(cards);
});
