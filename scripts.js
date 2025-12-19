const apikey = '2f8dbf4d5d4ef65d07c819e98d9cf370'; //  GNews API Key
const blogcontainer = document.getElementById('blog-container');
const searchField=document.getElementById('search_input')
const searchButton =document.getElementById('search_button')
const now = new Date();
const formattedDate = now.toISOString().split('T')[0];


async function fetchingRandomNews() {
    try {
        const api_url = `https://gnews.io/api/v4/top-headlines?token=${apikey}&country=in&lang=en&from=${formattedDate}&sortby=publishedAt`;
        const responses = await fetch(api_url);

        if (!responses.ok) throw new Error(`HTTP error! Status: ${responses.status}`);

        const data = await responses.json();
        return data.articles;
    } catch (error) {
        console.error("Error occurred while fetching random news:", error);
        return [];
    }
}

searchButton.addEventListener("click",async ()=>{
    const query=searchField.value.trim()
    if (query!==""){
       try{
        const articles=await fetchNewsQuery(query)
        displayBlog(articles)
       }
       catch(error){
        console.log("error on fetching news by query",error)
       }
    }
})


async function fetchNewsQuery(query){
    try{
        const api_url = `https://gnews.io/api/v4/search?q=${query}&token=${apikey}&country=in&lang=en`;
               const responses = await fetch(api_url);

        if (!responses.ok) throw new Error(`HTTP error! Status: ${responses.status}`);

        const data = await responses.json();
        return data.articles;
    }
    catch(error){
        console.log("error in fetching the query",error);
        return[];
    }
}


function displayBlog(articles) {
    blogcontainer.innerHTML = "";
    articles.forEach((article) => {
        const blogcard = document.createElement('div');
        blogcard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.image || 'fallback-image.jpg'; 
        img.alt = article.title || "News Image";

        const title = document.createElement("h2");
        const truncatedTitle=article.title.length>30? article.title.slice(0,30)+"......":article.title;
        title.textContent=truncatedTitle

        const description = document.createElement("p");
        const truncatedDescription=article.description.length>150? article.description.slice(0,150)+"....":article.description
        description.textContent = truncatedDescription

        blogcard.appendChild(title);
        blogcard.appendChild(img);
        blogcard.appendChild(description);
        blogcard.addEventListener('click',()=>{
            window.open(article.url,"_blank")
        })

        blogcontainer.appendChild(blogcard);
    });
}

(async () => {
    try {
        const articles = await fetchingRandomNews();
        displayBlog(articles);
    } catch (error) {
        console.error("Error fetching and displaying news:", error);
    }
})();
