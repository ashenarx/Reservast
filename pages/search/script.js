let locationFilter = "Pilih Lokasi Anda";
let roomTypeFilter = "Pilih jenis ruangan";
let dateFilter = "Pilih tanggal";
let timeFilter = "Pilih waktu";

document.addEventListener('DOMContentLoaded', () => {
    fetch('../../src/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.innerHTML = html;
            } else {
                console.error('Navbar element not found');
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });

    const params = new URLSearchParams(window.location.search);
    locationFilter = params.get('location') || "Pilih Lokasi Anda";
    roomTypeFilter = params.get('roomType') || "Pilih jenis ruangan";
    dateFilter = params.get('date') || "Pilih tanggal";
    timeFilter = params.get('time') || "Pilih waktu";

    const locationFilterText = document.querySelector('.filter.location .filter-text');
    const roomTypeFilterText = document.querySelector('.filter.room-type .filter-text');
    const dateFilterText = document.querySelector('.filter.date .filter-text');
    const timeFilterText = document.querySelector('.filter.time .filter-text');

    if (!locationFilterText || !roomTypeFilterText || !dateFilterText || !timeFilterText) {
        console.error('One or more filter text elements not found');
        return;
    }

    locationFilterText.textContent = locationFilter;
    roomTypeFilterText.textContent = roomTypeFilter;
    dateFilterText.textContent = dateFilter;
    timeFilterText.textContent = timeFilter;

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
            tag: "Co-working space",
            image: "../../src/assets/images/orbitroom.png",
            title: "Orbit Room",
            location: "Jakarta Selatan, DKJ",
            rating: 4.4,
            reviews: 31,
            price: "Rp8.500.000/jam",
        },
        {
            tag: "Co-working space",
            image: "../../src/assets/images/pixelpoint.svg",
            title: "PixelPoint",
            location: "Jakarta Barat, DKJ",
            rating: 4.6,
            reviews: 89,
            price: "Rp9.500.000/jam",
        },
        {
            tag: "Event Space",
            image: "../../src/assets/images/quantumhall.svg",
            title: "Quantum Hall",
            location: "Jakarta Timur, DKJ",
            rating: 4.8,
            reviews: 150,
            price: "Rp15.000.000/jam",
        },
        {
            tag: "Private Office",
            image: "../../src/assets/images/sparkspace.svg",
            title: "Spark Space",
            location: "Jakarta Utara, DKJ",
            rating: 4.9,
            reviews: 200,
            price: "Rp20.000.000/jam",
        }
    ];

    function renderCards(filteredCards) {
        const cardGrid = document.querySelector(".card-grid");
        if (!cardGrid) {
            console.error('Card grid element not found');
            return;
        }

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
        return cards.filter(card => {
            const matchesLocation = locationFilter === "Pilih Lokasi Anda" || (locationFilter && card.location.includes(locationFilter));
            const matchesRoomType = roomTypeFilter === "Pilih jenis ruangan" || (roomTypeFilter && card.tag === roomTypeFilter);
            return matchesLocation && matchesRoomType;
        });
    }

    function updateFilters() {
        const queryParams = new URLSearchParams({
            location: locationFilter,
            roomType: roomTypeFilter,
        });

        window.history.replaceState({}, '', `?${queryParams.toString()}`);
        renderCards(filterCards());
    }

    const filters = document.querySelectorAll('.filter');
    if (filters.length === 0) {
        console.error('No filter elements found');
    }

    filters.forEach(filter => {
        const filterContent = filter.querySelector('.filter-text');
        const dropdown = filter.querySelector('.dropdown');
        const options = dropdown ? dropdown.querySelectorAll('li') : [];

        if (!filterContent || !dropdown || options.length === 0) {
            console.error('Filter setup incomplete for:', filter);
            return;
        }

        filter.addEventListener('click', (event) => {
            event.stopPropagation();
            filters.forEach(f => {
                if (f !== filter) f.classList.remove('active');
            });
            filter.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                const selectedText = option.textContent.trim();
                filterContent.textContent = selectedText;

                if (filter.classList.contains('location')) {
                    locationFilter = selectedText;
                } else if (filter.classList.contains('room-type')) {
                    roomTypeFilter = selectedText;
                }

                filter.classList.remove('active');
                updateFilters();
            });
        });
    });

    document.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
    });

    renderCards(filterCards());
});
