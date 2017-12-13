const app = {};

app.baseURL = 'https://api.themoviedb.org/3';
app.apiKey = 'ffc2ae10fa0d16e386282d69ac2a4346';

app.categoryMovies = (category) => {
    $.ajax({
        url: `${app.baseURL}/movie/${category}`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.apiKey,
            language: "en-US",
            page: 1
        }      
    })
    .then((res) => {
        let topMovies = res.results
        app.displayMovies(topMovies)
    });
};

app.events = () => {
    $('form').on('submit', (e) => {
        e.preventDefault();
        let movie = $('#movieName').val();
        app.searchMovies(movie);
        $('#movieName').val('');        
    });

    $('.topRatedMovies').on('click', () => {
        app.categoryMovies('top_rated')
    })

    $('.popularMovies').on('click', () => {
        app.categoryMovies('popular')
    })

    $('.upcomingMovies').on('click', () => {
        app.categoryMovies('upcoming')
    })
};

app.searchMovies = (movie) => {
        $.ajax({
        url: `${app.baseURL}/search/movie`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.apiKey,
            query: movie,
            include_adult: false
        }      
    })
    .then((res) => {
        let movieResultArr = res.results
        app.displayMovies(movieResultArr)
        app.showModal(movieResultArr)        
    });
};

app.displayMovies = (movieResultArr) => {
    $('.movieSearchResult').empty();
    movieResultArr.filter((eachMovie) => {
        return eachMovie.poster_path != null;
    })
    .forEach((movieItem) => {
        const template = `
            <li>
                <figure>
                    <img src="https://image.tmdb.org/t/p/w500/${movieItem.poster_path}">
                    <figcaption>
                        <h2>${movieItem.original_title}</h2>
                    </figcaption>
                </figure>
            </li>`

        $('.movieSearchResult').append(template);
    });
};

app.showModal = function (movieResultArr) {
    $('.movieSearchResult').on('click','figcaption', function () {	
		const imgSrc = ($(this).prev().attr('src'));
        const modalImg = `<img src='${imgSrc}'/>`;
		$('.modal .modalImg').append(modalImg);
		$('.modal').fadeIn('slow');		
	});
}

app.closeModal = function () {
    $('.closeModal').on('click', function () {
        $('.modal').fadeOut('slow')
    })
}

app.init = () => {
    app.categoryMovies('popular');
    app.events();
    app.showModal();
    app.closeModal();
}

$(app.init)