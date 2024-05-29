const themeName = document.querySelector('.theme-name');
const themeIcon = document.querySelector('.theme-icon');

const searchBtn = document.querySelector('.search-btn');
const closeBtn = document.querySelector('.close-btn');

const userImage = document.querySelector('.user-img');
const userName = document.querySelector('.user-name');
const joinDate = document.querySelector('.user-join-date');
const githubUsername = document.querySelector('.user-github-username');
const userBio = document.querySelector('.user-bio');
const userRepo = document.querySelector('.user-repo-num');
const userFollowers = document.querySelector('.user-followers-num');
const userFollowing = document.querySelector('.user-following-num');
const userLocation = document.querySelector('.user-location');
const userWebsite = document.querySelector('.user-website')
const userTwitter = document.querySelector('.user-twitter');
const userCompany = document.querySelector('.user-company');

const mainContainer = document.querySelector('.main-container');
const searchContainer = document.querySelector('.search-container');
const headContainer = document.querySelector('.head-container');
const errorContainer = document.querySelector('.error-container');
const loadingContainer = document.querySelector('.loading-container');

const searchInput = document.getElementById('searchName');
const wrapper = document.querySelector('.wrapper');

// fetchData("vishv0407");
mainContainer.classList.add("active");

themeIcon.addEventListener('click', () => {

    if(!mainContainer.classList.contains('activeDark')){
        themeName.innerText = "DARK";
        themeIcon.src = "/images/moon-icon.svg";
        mainContainer.classList.add('activeDark');
        searchContainer.classList.add('activeDark');
        headContainer.classList.add('activeDark');
        errorContainer.classList.add('activeDark');
        loadingContainer.classList.add('activeDark');
        wrapper.style.backgroundColor = "rgb(246,248,255)";
    }
    else {
        themeName.innerText = "LIGHT";
        themeIcon.src = "/images/sun-icon.svg";
        mainContainer.classList.remove('activeDark');
        searchContainer.classList.remove('activeDark');
        headContainer.classList.remove('activeDark');
        errorContainer.classList.remove('activeDark');
        loadingContainer.classList.remove('activeDark');
        wrapper.style.backgroundColor = "rgb(21,29,46)";
    }
})

closeBtn.addEventListener('click', () => {
    const tempSearch = document.getElementById('searchName');
    // tempSearch = "";
    tempSearch.value = "";
    closeBtn.classList.remove("active");
    // fetchData("vishv0407")
})

searchInput.addEventListener('input', () =>{
    if(searchInput.value !== ""){
        closeBtn.classList.add("active");
    }
    else{
        closeBtn.classList.remove("active");
    }
})

searchBtn.addEventListener('click', () => {
    const search = document.getElementById('searchName').value;
    loadingContainer.classList.add("active");
    mainContainer.classList.add("active");
    fetchData(search);
})

async function fetchData(githubUsername2) {
    // console.log(githubUsername2);
    try{
        const response = await fetch(`https://api.github.com/users/${githubUsername2}`);

        // Check if the response status is 404 (user not found)
        if (response.status === 404) {
            throw new Error('User not found');
        }

        loadingContainer.classList.remove("active");
        const result = await response.json();
        renderData(result);
    }
    catch(e){
        console.log("ye error aaya bhai" + e.message);
        mainContainer.classList.add("error");
        errorContainer.classList.add("active");
        loadingContainer.classList.remove("active");
    }
}

function renderData(result){

    mainContainer.classList.remove("active");
    errorContainer.classList.remove("active");

    userImage.src = result?.avatar_url;
    userName.innerText = result?.name || result?.login;
    joinDate.innerText = `Joined `+formatDate(result?.created_at);
    githubUsername.href = `https://github.com/${result.login}`;
    githubUsername.innerText = `@` + result.login;
    userBio.innerText = result?.bio || "this profile has no bio";
    userRepo.innerText = result?.public_repos;
    userFollowers.innerText = result?.followers;
    userFollowing.innerText = result?.following;
    userLocation.innerText = result?.location || "Not Available";
    userLocation.innerText = result?.location || "Not Available";
    setAnchor(userWebsite, result?.blog, result?.blog || "Not Available");
    setAnchor(userTwitter, `https://twitter.com/${result?.twitter_username}`, result?.twitter_username || "Not Available");
    userCompany.innerText = result?.company || "Not Available";

    const tempName = result?.name;
    if(tempName === null){
        userName.innerText = result?.login;
    }
    else{
        userName.innerText = result?.name;
    }

}

function setAnchor(element, href, text) {
    element.innerText = text;
    if (href && href !== "Not Available" && href !== "null" ) {
        element.href = href;
        element.classList.remove('not-available');
    } else {
        element.href = "#";
        element.classList.add('not-available');
    }
}

function formatDate(dateString){
    // Create a Date object
    const date = new Date(dateString);

    // Define an array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract day, month, and year
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format the date as "22 Feb 2023"
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate; 
    // Output: "22 Feb 2023"
}