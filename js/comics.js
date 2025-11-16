/**
 * ComicVerse Hub - Comics Data
 * 
 * This file contains all comic book data for the static website.
 * All comic information is stored here as a JavaScript array.
 */

const COMICS_DATA = [
    {
        id: '001',
        title: 'The Amazing Spider-Man #1',
        publisher: 'Marvel',
        price: 414.17,
        releaseDate: '2024-01-15',
        genre: 'Superhero',
        characters: ['Spider-Man', 'Peter Parker'],
        coverImage: '../images/spiderman-1.jpg',
        synopsis: 'The iconic web-slinger returns in this thrilling new adventure! Peter Parker faces his greatest challenge yet as new villains emerge from the shadows.',
        creators: {
            writer: 'Stan Lee',
            artist: 'Steve Ditko',
            colorist: 'Frank D\'Armata'
        },
        featured: true,
        popular: true
    },
    {
        id: '002',
        title: 'Batman: The Dark Knight Returns',
        publisher: 'DC',
        price: 1078.17,
        releaseDate: '2024-02-01',
        genre: 'Superhero',
        characters: ['Batman', 'Bruce Wayne'],
        coverImage: '../images/batman-dark-knight.jpg',
        synopsis: 'An aging Bruce Wayne comes out of retirement to fight crime once more in a dystopian Gotham City. A masterpiece of graphic storytelling.',
        creators: {
            writer: 'Frank Miller',
            artist: 'Frank Miller',
            colorist: 'Lynn Varley'
        },
        featured: true,
        popular: true
    },
    {
        id: '003',
        title: 'The Walking Dead #1',
        publisher: 'Image',
        price: 331.17,
        releaseDate: '2024-01-20',
        genre: 'Horror',
        characters: ['Rick Grimes'],
        coverImage: '../images/walking-dead-1.jpg',
        synopsis: 'Follow Rick Grimes as he awakens from a coma into a world overrun by zombies. The beginning of an epic survival story.',
        creators: {
            writer: 'Robert Kirkman',
            artist: 'Tony Moore',
            colorist: 'Tony Moore'
        },
        featured: false,
        popular: true
    },
    {
        id: '004',
        title: 'X-Men: Days of Future Past',
        publisher: 'Marvel',
        price: 829.17,
        releaseDate: '2024-02-10',
        genre: 'Superhero',
        characters: ['Wolverine', 'Professor X', 'Kitty Pryde'],
        coverImage: '../images/xmen-future-past.jpg',
        synopsis: 'In a dystopian future, the X-Men send Kitty Pryde back in time to prevent a catastrophic event that leads to mutant genocide.',
        creators: {
            writer: 'Chris Claremont',
            artist: 'John Byrne',
            colorist: 'Glynis Wein'
        },
        featured: true,
        popular: false
    },
    {
        id: '005',
        title: 'Watchmen',
        publisher: 'DC',
        price: 419.99,
        releaseDate: '2024-01-05',
        genre: 'Superhero',
        characters: ['Rorschach', 'Dr. Manhattan', 'Ozymandias'],
        coverImage: '../images/watchman.jpg',
        synopsis: 'A deconstruction of the superhero genre, exploring what happens when costumed vigilantes exist in a world on the brink of nuclear war.',
        creators: {
            writer: 'Alan Moore',
            artist: 'Dave Gibbons',
            colorist: 'John Higgins'
        },
        featured: false,
        popular: true
    },
    {
        id: '006',
        title: 'Saga #1',
        publisher: 'Image',
        price: 122.99,
        releaseDate: '2024-02-15',
        genre: 'Sci-Fi',
        characters: ['Alana', 'Marko'],
        coverImage: '../images/saga-1.jpg',
        synopsis: 'Two soldiers from opposite sides of an intergalactic war fall in love and risk everything to raise their child together.',
        creators: {
            writer: 'Brian K. Vaughan',
            artist: 'Fiona Staples',
            colorist: 'Fiona Staples'
        },
        featured: true,
        popular: true
    },
    {
        id: '007',
        title: 'Iron Man: Extremis',
        publisher: 'Marvel',
        price: 514.99,
        releaseDate: '2024-01-25',
        genre: 'Superhero',
        characters: ['Iron Man', 'Tony Stark'],
        coverImage: '../images/iron-man-extremis.jpg',
        synopsis: 'Tony Stark faces a new threat that forces him to upgrade his armor with revolutionary nanotechnology.',
        creators: {
            writer: 'Warren Ellis',
            artist: 'Adi Granov',
            colorist: 'Adi Granov'
        },
        featured: false,
        popular: false
    },
    {
        id: '008',
        title: 'Superman: All-Star',
        publisher: 'DC',
        price: 311.99,
        releaseDate: '2024-02-05',
        genre: 'Superhero',
        characters: ['Superman', 'Clark Kent'],
        coverImage: '../images/superman-allstar.jpg',
        synopsis: 'A modern retelling of Superman\'s origin story, capturing the essence of the Man of Steel in a fresh, compelling way.',
        creators: {
            writer: 'Grant Morrison',
            artist: 'Frank Quitely',
            colorist: 'Jamie Grant'
        },
        featured: false,
        popular: true
    },
    {
        id: '009',
        title: 'Invincible #1',
        publisher: 'Image',
        price: 331.17,
        releaseDate: '2024-01-30',
        genre: 'Superhero',
        characters: ['Invincible', 'Mark Grayson'],
        coverImage: '../images/invincible-1.jpg',
        synopsis: 'Mark Grayson is just like most everyone else his age, except his father is the most powerful superhero on the planet.',
        creators: {
            writer: 'Robert Kirkman',
            artist: 'Cory Walker',
            colorist: 'Bill Crabtree'
        },
        featured: false,
        popular: true
    },
    {
        id: '010',
        title: 'The Avengers: Infinity War',
        publisher: 'Marvel',
        price: 185.99,
        releaseDate: '2024-02-20',
        genre: 'Superhero',
        characters: ['Avengers', 'Thanos'],
        coverImage: '../images/avengers-infinity.jpg',
        synopsis: 'The Avengers face their greatest threat yet as Thanos seeks to collect all six Infinity Stones.',
        creators: {
            writer: 'Jim Starlin',
            artist: 'George Pérez',
            colorist: 'Tom Smith'
        },
        featured: true,
        popular: true
    },
    {
        id: '011',
        title: 'The Flash: Rebirth',
        publisher: 'DC',
        price: 205.99,
        releaseDate: '2024-02-12',
        genre: 'Superhero',
        characters: ['The Flash', 'Barry Allen'],
        coverImage: '../images/flash-rebirth.jpg',
        synopsis: 'Barry Allen returns from the Speed Force to reclaim his role as the Fastest Man Alive.',
        creators: {
            writer: 'Geoff Johns',
            artist: 'Ethan Van Sciver',
            colorist: 'Alex Sinclair'
        },
        featured: false,
        popular: false
    },
    {
        id: '012',
        title: 'Deadpool: The Good, The Bad, and The Ugly',
        publisher: 'Marvel',
        price: 414.17,
        releaseDate: '2024-01-18',
        genre: 'Superhero',
        characters: ['Deadpool', 'Wolverine'],
        coverImage: '../images/deadpool-good-bad.jpg',
        synopsis: 'Deadpool teams up with Wolverine and Captain America in a hilarious and action-packed adventure.',
        creators: {
            writer: 'Gerry Duggan',
            artist: 'Mike Hawthorne',
            colorist: 'Val Staples'
        },
        featured: false,
        popular: true
    }
];

/**
 * Helper function to get a comic by ID
 * @param {string} id - The comic ID
 * @returns {Object|null} - The comic object or null if not found
 */
function getComicById(id) {
    return COMICS_DATA.find(comic => comic.id === id) || null;
}

/**
 * Helper function to get featured comics
 * @returns {Array} - Array of featured comics
 */
function getFeaturedComics() {
    return COMICS_DATA.filter(comic => comic.featured);
}

/**
 * Helper function to get popular comics
 * @returns {Array} - Array of popular comics
 */
function getPopularComics() {
    return COMICS_DATA.filter(comic => comic.popular);
}

/**
 * Helper function to get comics by publisher
 * @param {string} publisher - The publisher name
 * @returns {Array} - Array of comics from that publisher
 */
function getComicsByPublisher(publisher) {
    return COMICS_DATA.filter(comic => comic.publisher === publisher);
}

/**
 * Helper function to get all unique publishers
 * @returns {Array} - Array of unique publisher names
 */
function getAllPublishers() {
    return [...new Set(COMICS_DATA.map(comic => comic.publisher))];
}

/**
 * Helper function to get all unique genres
 * @returns {Array} - Array of unique genre names
 */
function getAllGenres() {
    return [...new Set(COMICS_DATA.map(comic => comic.genre))];
}

