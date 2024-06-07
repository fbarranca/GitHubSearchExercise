/**
 * Search Github API for provided profile
 * @param {string} user
 * @returns {object} the github profile json object 
 */
export const getProfile = async user => {
    const githubApi = `https://api.github.com/users/${user}`;
    let data;

    try {
        if (!!localStorage.getItem('user')) {
            const profile = JSON.parse(localStorage.getItem('user')); //deserialize

            if (profile.login == user) {
                console.log('Profile found in local storage. Do not go to github');
                return profile;
            }
        }
        const response = await fetch(githubApi);

        if (response.status === 200) {
            data = await response.json();    
            localStorage.setItem('user', JSON.stringify(data)); //serialize
        } else {
            localStorage.removeItem('user');
        }

        return data;
    } catch (error) {
        console.log(error);
        throw new Error(`Unable to connect to Github API`);
    }
}

export const getProfileV2 = async user => {
    const githubApi = `https://api.github.com/users/${user}`;
    let data;

    try {
        if (!!localStorage.getItem('users')) {            
            const profiles = JSON.parse(localStorage.getItem('users')); //deserialize
            const profile = profiles.find(p => p.login === user);

            if (!!profile) {
                console.log('Profile found in local storage. Do not go to github');
                return profile;
            }
        }
        const response = await fetch(githubApi);

        if (response.status === 200) {
            data = await response.json();    
            let profiles = JSON.parse(localStorage.getItem('users')); //deserialize
            if (!profiles) {
                profiles = [];
            }
            
            profiles.push(data);
            
            localStorage.setItem('users', JSON.stringify(profiles)); //serialize                
        }

        return data;
    } catch (error) {
        console.log(error);
        throw new Error(`Unable to connect to Github API`);
    }


}