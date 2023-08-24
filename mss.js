const fetchDataAndDisplay = () => {
  // Clear previous data
  document.getElementById('posts').innerHTML = '';

  const querykeys = ['rss', 'foss','opensource','mastodon',]; // replace these hashtag searches with your own
  
  const domains = ['mastodon.social', 'mstdn.social','mastodon.online','mastodon.world','techhub.social'];
  // Replace these instances with your own
  
  const corsProxyUrl = 'https://corsproxy.io/?';
  
  // Create an array to hold all the results
  let allPosts = [];

  // Create a Set to hold hashes of posts to track duplicates
  let seen = new Set();

  // Create an array to hold all the fetch promises
  let fetchPromises = [];

  // Iterate through each domain
  domains.forEach((domain) => {
    querykeys.forEach((querykey) => {
      const url = 'https://' + domain + '/api/v1/timelines/tag/' + querykey + '?limit=40';

      let fetchPromise = fetch(corsProxyUrl + url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
          }
          return response.json();
        })
        .then((json) => {
          json.forEach((post) => {
            const hash = post.uri;
            if (!seen.has(hash)) {
              allPosts.push(post);
              seen.add(hash);
            }
          });
        })
        .catch(function () {
          console.log('An error occurred while fetching the data.');
        });

      fetchPromises.push(fetchPromise);
    });
  });

  Promise.all(fetchPromises).then(() => {
    allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    let top15Posts = allPosts.slice(0, 15);

    // Inserting data into HTML
    const postsContainer = document.getElementById('posts');

    // Create two columns
    const column1Div = document.createElement('div');
    column1Div.className = 'column';

    const column2Div = document.createElement('div');
    column2Div.className = 'column';

    // Iterate through the top 15 posts, and append them to the appropriate column
    top15Posts.forEach((post, index) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
       if (index % 2 === 0) {
    postDiv.classList.add('shaded');  
  }

      // Create a temporary container to hold the HTML content
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
 
      // Append the manipulated content
      postDiv.innerHTML = tempDiv.innerHTML;

      // Depending on the index, append the post to the appropriate column
      if (index < 7) {
        column1Div.appendChild(postDiv);
      } else if (index < 14) {
        column2Div.appendChild(postDiv);
      }
    });

    // Append the two columns to the posts container
    postsContainer.appendChild(column1Div);
    postsContainer.appendChild(column2Div);
  });
};

// Call the function immediately to fetch and display data
fetchDataAndDisplay();

// Schedule the function to run every 90 seconds, you can of course adjust this
setInterval(fetchDataAndDisplay, 90000);
