let currentPage = 1;

const form = document.querySelector('.js-search-form');
form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault(); // Prevent page from reloading when the form is submitted

    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim(); // Remove whitespace from the input
    console.log(searchQuery);

    const loadMoreButton = document.querySelector('.js-loadMore');

    const loadingIndicator = document.querySelector('.js-spinner')
    loadingIndicator.classList.remove('hidden'); // Display the loading spinner when submitting a search query

    try {
        const results = await searchWikipedia(searchQuery);
        if (results.query.searchinfo.totalhits === 0) { // Display an alert when there are no results
            alert('No results found. Try different keywords');
            return;
        }

        displayResults(results);

    } catch(err) {
        console.log(err)
        alert('Failed to fetch data')
    } finally {
        loadingIndicator.classList.add('hidden'); // Hide the loading spinner when the results are displayed
        
        loadMoreButton.classList.remove('hidden');

        loadMoreButton.addEventListener('click', loadMore)
    }
}

// Load 10 more articles when click the button
function loadMore() {

    currentPage++;

    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim(); // Remove whitespace from the input

    searchWikipedia(searchQuery, currentPage)
        .then(results => {
            if (results.query.searchinfo.totalhits === 0) {
                alert('No results found. Try different keywords');
                return;
            }

            displayResults(results);
        })
        .catch(err => {
            console.log(err)
            alert('Failed to fetch data')
        })
}

// Search Wikipedia
async function searchWikipedia(searchQuery) {
    const endPoint = 
    `
    https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchQuery}
    `;
    const response = await fetch(endPoint);
    if(!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}

// Display the results
function displayResults(results) {
    const searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = "";

    results.query.search.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
        searchResults.insertAdjacentHTML(  // Each result is appended to the searchResults element using the DOM insertAdjacentHTML method
            'beforeend',    // First argument: the position to append the element 
                            // Second argument: template literals used to present HTML text
            `
            <div class="result-item">   
                <h3 class="result-title">
                    <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                </h3>
                <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                <span class="result-snippet">${result.snippet}</span>
            </div>
            `
            )
    })
}


