import dsheet from '../css/dark.css' with {type: 'css'}
import lsheet from '../css/light.css' with {type: 'css'}
import { saveTheme, getTheme } from './theme.js';
import { getProfile, getProfileV2 } from './githubapi.js';

// #region [Elements]
const $ = selector => document.querySelector(selector);
const btnSearch = $('#btnGitHubSearch');
const txtUser = $('#txtUser');
const searchLoading = $('#search-loading');
const noProfile = $('#no-profile');
const noProfileMsg = $('#no-profile-msg');
const profileResult = $('#profile-result');

const profileImg = $('#profile-img');
const profileName = $('#profile-name');
const profileHash = $('#profile-hash');
const profileDate = $('#profile-date');
const profileBio = $('#profile-bio');
const profileRepoCount = $('#profile-repo-count');
const profileFollowers = $('#profile-followers');
const profileFollowing = $('#profile-following');
const profileCity = $('#profile-city');
const profileWeb = $('#profile-web');
const profileTwitter = $('#profile-twitter');
const profileCompany = $('#profile-company');
const chkTheme = $(`#chkTheme`);
const icoTheme = $(`#theme-mode-icon`);
// #endregion


// #region [Theme Management]
let currentTheme = getTheme();

document.adoptedStyleSheets = currentTheme === 'dark' ? [dsheet] : [lsheet];
chkTheme.checked = currentTheme === 'light';

if (currentTheme === 'light') {
    icoTheme.classList.remove('fa-moon');
    icoTheme.classList.add('fa-sun');
}

chkTheme.addEventListener(`change`, evt => {
    setThemeIcon();
    document.adoptedStyleSheets = chkTheme.checked ? [lsheet] : [dsheet];

    if (chkTheme.checked) {
        saveTheme(`light`);
    } else {
        saveTheme(`dark`);
    }
});

function setThemeIcon() {
    icoTheme.classList.toggle('fa-moon');
    icoTheme.classList.toggle('fa-sun');
}
// #endregion

btnSearch.addEventListener('click', async () => {
    await searchGithubPrfile(txtUser.value.trim());
});

async function searchGithubPrfile(userName) {
    if (!!userName) {
        try {
            searching(true);     
            let user = await getProfileV2(userName);
            
            if (!!user) {
                loadProfile(user);
                txtUser.value = '';
            } else {
                noProfileMsg.innerHTML = `No profile found for search <b>${userName}</b>`;
                noProfile.classList.remove('hide');
                noProfile.classList.add('show');
                txtUser.select();
            }
            
        } catch (error) {
            noProfileMsg.innerHTML = error;
        } finally {
            searching(false);
        }
    }
};

// Listening to the enter key pressed
txtUser.addEventListener('keyup', evt => {
    // console.log(evt.keyCode);
    // read enter key
    if (evt.keyCode === 13)
        btnSearch.click();
});

txtUser.addEventListener('click', () => {
    txtUser.select();
});

/**
 * Load the profile to the UI
 * @param {object} user the github profile object
 */
function loadProfile(user) {
    profileResult.classList.remove('hide');

    profileImg.setAttribute('src', user.avatar_url)
    profileName.innerHTML = user.name;
    profileHash.innerHTML = user.login;
    profileHash.setAttribute('href', user.html_url);
    profileDate.innerHTML = `Joined ${new Date(user.created_at).toDateString()}`;
    profileBio.innerHTML = user.bio;
    profileRepoCount.innerHTML = user.public_repos;
    profileFollowers.innerHTML = user.followers;
    profileFollowing.innerHTML = user.following;
    profileCity.innerHTML = user.location;
    profileWeb.innerHTML = user.blog;
    profileTwitter.innerHTML = user.twitter_username;
    profileCompany.innerHTML = user.company;
}

/**
 * Searching UI. Handles the user interface display when searching and waiting for the GitHub API to return results
 * @param {Boolean} state Option of the search state, 
 * true to show searching UI (spinner on search button, hiding the profile card, hiding the failed search div)
 * false to turn off searching (spinner on search button)
 */
function searching(state) {
    if (state) {
        searchLoading.classList.add('show');
        searchLoading.classList.remove('hide');
        profileResult.classList.add('hide');
        noProfile.classList.remove('show');
        noProfile.classList.add('hide');
    } else {
        searchLoading.classList.add('hide');
        searchLoading.classList.remove('show');
    }
}