
const form = document.querySelector('.js-search-form');
form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault(); // Prevent page from reloading when the form is submitted

    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim(); // Remove whitespace from the input
    console.log(searchQuery);

    const searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = ''; // Clear the previous results

    const loadingIndicator = document.querySelector('.js-spinner');
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
        
        const loadMoreButton = document.querySelector('.js-loadMore');
        loadMoreButton.classList.remove('hidden');
    }
}
// Seearch Wikipedia
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

const loadMoreButton = document.querySelector('.js-loadMore');
loadMore.addEventListener('click', loadMore)

function loadMore() {

}
