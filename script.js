
// Initialize player data
let playerData = {
    level: 1,
    jobClass: 'None',
    classLevel: 5,
    titles: ['Player'],
    stats: {
        strength: 3,
        agility: 3,
        intelligence: 3,
        sense: 3,
        charisma: 3,     // New stat
        willpower: 3,    // New stat
        endurance: 3,    // New stat
        dexterity: 3     // New stat
    },
    activeEffects: [],
    passiveEffects: []
};


let quests = [
    {
        title: "Daily Quest: Train To Be A Skilled Combatant",
        description: "1. 100 Push-Ups 2. 100 Sit-Ups 3. 100 Squats 4. 10 Kilometer Run",
        reward: "3 Strength Points, 3 Agility Points",
        classTag: "Warrior",
        experience: 1200,
        status: "in-progress",
        recurs: true,
        recurrenceInterval: 5, // Recurs daily
        lastCompleted: null
    },
    {
        title: "Daily Quest: Train To Have An Indomitable Will",
        description: "Meditate for 5 minutes in silence.",
        reward: "1 Sense Points",
        classTag: "Monk",
        experience: 800,
        status: "in-progress",
        recurs: true,
        recurrenceInterval: 5, // Recurs weekly
        lastCompleted: null
    },
    {
        title: "Daily Quest: Train To Have A Brilliant Mind",
        description: "Study a topic for 1 hour.",
        reward: "3 Intelligence Points",
        classTag: "Scholar",
        experience: 1500,
        status: "in-progress",
        recurs: 5,
        lastCompleted: null
    }
];









// Function to handle input for job class
function onJobClassInput(event) {
    playerData.jobClass = event.target.value; // Update player data
    savePlayerData(); // Save to local storage
}

// Function to handle input for titles
function onTitleInput(event) {
    playerData.titles = event.target.value.split(',').map(title => title.trim()); // Update player data
    savePlayerData(); // Save to local storage
}

// Function to load player data from local storage
function loadPlayerData() {
    const savedPlayerData = localStorage.getItem('playerData');
    if (savedPlayerData) {
        playerData = JSON.parse(savedPlayerData);
    }
}

// Update player info display
function updatePlayerInfo() {
    document.getElementById('player-level').innerText = playerData.level;
    document.getElementById('job-class').value = playerData.jobClass; // Set input value
    document.getElementById('titles').value = playerData.titles.join(', '); // Set input value

    // Update stats display
    for (let stat in playerData.stats) {
        const statElement = document.getElementById(stat);
        if (statElement) {
            statElement.innerText = playerData.stats[stat];
        }
    }
}


// Update navigateTo function to include the instructions page
function navigateTo(page) {
    // Hide all pages
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('player-status-page').style.display = 'none';
    document.getElementById('skills-dashboard').style.display = 'none';
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('make-quest-page').style.display = 'none';
    document.getElementById('job-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('work-log-page').style.display = 'none'; // Hide work log section

    // Show the requested page
    if (page === 'player-status') {
        document.getElementById('player-status-page').style.display = 'block';
        updatePlayerInfo();
    } else if (page === 'skills') {
        document.getElementById('skills-dashboard').style.display = 'block';
        showSkillList('mental');
    } else if (page === 'quests') {
        document.getElementById('quests-page').style.display = 'block';
    } else if (page === 'job') {
        document.getElementById('job-page').style.display = 'block';
        populateJobList();
    } else if (page === 'instructions') {
        document.getElementById('instructions-page').style.display = 'block';
    } else if (page === 'work-log') {  // Correct condition for work log
        document.getElementById('work-log-page').style.display = 'block';
        generateCalendar(); // Generate calendar when the work log is displayed
    }
}


function goBack() {
    // Hide all pages
    document.getElementById('player-status-page').style.display = 'none';
    document.getElementById('skills-dashboard').style.display = 'none';
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('make-quest-page').style.display = 'none';
    document.getElementById('job-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('work-log-page').style.display = 'none'; // Hide work log page
    document.getElementById('landing-page').style.display = 'block'; // Show landing page
}



function goBackToMenu() {
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('job-page').style.display = 'none';
  document.getElementById('work-log-page').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
}





// Define base stats per level and additional stats increment per 10 levels
const baseStatsPerLevel = 10;
const additionalStatsPerTenLevels = 2;
let statChangeInterval = null;  // To store the interval ID

// Function to calculate the stats needed for the next level
function calculateStatsForNextLevel(level) {
    // Every 10 levels, an additional 2 stats are required to level up
    const levelMultiplier = Math.floor(level / 10);
    const extraStats = additionalStatsPerTenLevels * levelMultiplier;
    return baseStatsPerLevel + extraStats;
}

// Function to calculate total experience based on stats
function calculateTotalExperience() {
    let totalExperience = 0;
    const stats = playerData.stats;
    for (let stat in stats) {
        totalExperience += stats[stat];
    }
    console.log('Total Experience:', totalExperience);
    return totalExperience;
}

// Function to update player level based on total experience
function updatePlayerLevel() {
    let totalExperience = calculateTotalExperience();
    let newLevel = 0;
    let experienceNeededForLevel = calculateStatsForNextLevel(newLevel);

    // Determine the player’s level by checking how much experience they have
    while (totalExperience >= experienceNeededForLevel) {
        totalExperience -= experienceNeededForLevel;
        newLevel++;
        experienceNeededForLevel = calculateStatsForNextLevel(newLevel);
    }

    playerData.level = newLevel;
    document.getElementById('player-level').innerText = newLevel;

    // Update progress bar
    const nextLevelExperience = calculateStatsForNextLevel(newLevel);
    const experienceForProgress = totalExperience;
    const experienceForNextLevel = nextLevelExperience;

    console.log('Experience For Progress:', experienceForProgress);
    console.log('Experience For Next Level:', experienceForNextLevel);

    updateProgressBar('player-level-progress-bar', experienceForProgress, experienceForNextLevel);
}

// Function to save player data to local storage
function savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Function to change stat and update player level accordingly
function changeStats(stat, amount) {
    playerData.stats[stat] += amount;
    document.getElementById(stat).innerText = playerData.stats[stat];
    updatePlayerLevel();
    savePlayerData(); // Save data after making changes
}

// Update the progress bar based on current experience
function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    if (!progressBar) {
        console.error(`Progress bar element with id ${id} not found.`);
        return;
    }
    const percentage = (value / maxValue) * 100;
    console.log('Progress Bar Percentage:', percentage);
    progressBar.style.width = `${percentage}%`;
}

// Function to handle the start of stat change
function startChangingStats(stat, change) {
    changeStats(stat, change);  // Immediate change on mousedown
    statChangeInterval = setInterval(() => changeStats(stat, change), 100); // Repeat every 100ms
}

// Function to stop the stat change
function stopChangingStats() {
    clearInterval(statChangeInterval);
}

// Initialize and update player info on page load
document.addEventListener('DOMContentLoaded', (event) => {
    loadPlayerData(); // Load player data from local storage
    updatePlayerInfo(); // Initialize player info display
    updatePlayerLevel(); // Update player level

    // Set up event listeners for stat buttons
    document.querySelectorAll('.stat-button').forEach(button => {
        const stat = button.getAttribute('data-stat');
        const change = parseInt(button.getAttribute('data-change'));

        // Start changing stats on mousedown
        button.addEventListener('mousedown', function() {
            startChangingStats(stat, change);
        });

        // Stop changing stats on mouseup or when the mouse leaves the button
        button.addEventListener('mouseup', stopChangingStats);
        button.addEventListener('mouseleave', stopChangingStats);
    });

    // Event listeners for editable fields
    document.getElementById('job-class').addEventListener('input', onJobClassInput);
    document.getElementById('titles').addEventListener('input', onTitleInput);
});































// Skill management
let skills = {
    mental: JSON.parse(localStorage.getItem('mentalSkills')) || ['Super Learning', 'Meditation', 'KOLBS'],
    physical: JSON.parse(localStorage.getItem('physicalSkills')) || ['Push ups', 'KOT Split Squats']
};

let currentSkill = '';
let experience = 0;
let level = 1;
const maxLevel = 100;
const maxExperience = 10000;
let interval;

function filterSkills(type) {
    const searchTerm = document.getElementById(`${type}-skill-search`).value.toLowerCase();
    const skillList = document.getElementById(`${type}-skill-list`);
    skillList.innerHTML = '';

    skills[type].forEach(skill => {
        if (skill.toLowerCase().includes(searchTerm)) {
            const li = document.createElement('li');
            li.innerHTML = `${skill} <button class="remove-skill-button" onclick="removeSkill('${type}', '${skill}')">Remove</button>`;
            li.onclick = () => showSkillDetails(skill);
            skillList.appendChild(li);
        }
    });
}

function showSkillList(type) {
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
    document.getElementById('skill-details').classList.add('hidden');
    document.getElementById('skill-management').classList.add('hidden');
    
    // Clear the search input when switching between skill types
    document.getElementById(`${type}-skill-search`).value = '';
    
    filterSkills(type);
    
    document.getElementById(`${type}-skills`).classList.remove('hidden');
}



function showSkillDetails(skill) {
    currentSkill = skill;
    const savedData = loadProgress(skill);
    experience = savedData.experience || 0;
    level = savedData.level || 1;
    
    document.getElementById('skill-details').classList.remove('hidden');
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
    document.getElementById('skill-name').innerText = skill;

    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
    
    loadSkillDescription(skill);
}

function saveSkillDescription() {
    const description = document.getElementById('skill-description').innerText;
    localStorage.setItem(`${currentSkill}-description`, description);
}

function loadSkillDescription(skill) {
    const savedDescription = localStorage.getItem(`${skill}-description`);
    document.getElementById('skill-description').innerText = savedDescription || '';
}

// Auto-save description on input
document.getElementById('skill-description').addEventListener('input', saveSkillDescription);


function startAddingPoints(hours) {
    addExperience(hours);
    interval = setInterval(() => addExperience(hours), 100);
}

function startRemovingPoints(hours) {
    removeExperience(hours);
    interval = setInterval(() => removeExperience(hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

function addExperience(hours) {
    experience += hours;
    saveProgress(currentSkill);
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}

function removeExperience(hours) {
    experience -= hours;
    if (experience < 0) experience = 0;
    saveProgress(currentSkill);
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}



function updateLevel() {
    let newLevel = 1;
    while (experience >= getLevelExperience(newLevel) && newLevel < maxLevel) {
        newLevel++;
    }
    level = newLevel;
    document.getElementById('level').innerText = level;
}

function getLevelExperience(level) {
    return Math.pow(level / maxLevel, 2) * maxExperience;
}



function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function saveProgress(skill) {
    localStorage.setItem(`${skill}-experience`, experience);
    localStorage.setItem(`${skill}-level`, level);
}

function loadProgress(skill) {
    const savedExperience = localStorage.getItem(`${skill}-experience`);
    const savedLevel = localStorage.getItem(`${skill}-level`);
    
    return {
        experience: savedExperience !== null ? parseFloat(savedExperience) : 0,
        level: savedLevel !== null ? parseInt(savedLevel) : 1
    };
}

function showSkillManagement(type) {
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '';
    
    skills[type].forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `${skill} <button class="remove-skill-button" onclick="removeSkill('${type}', '${skill}')">Remove</button>`;
        li.onclick = () => {
            const newName = prompt('Enter new skill name:', skill);
            if (newName) {
                renameSkill(type, skill, newName);
                showSkillManagement(type);
            }
        };
        skillList.appendChild(li);
    });
    
    document.getElementById('management-title').innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} Skills Management`;
    document.getElementById('skill-management').classList.remove('hidden');
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
}

function renameSkill(type, oldName, newName) {
    const index = skills[type].indexOf(oldName);
    if (index > -1) {
        skills[type][index] = newName;
        localStorage.setItem(`${newName}-experience`, localStorage.getItem(`${oldName}-experience`));
        localStorage.setItem(`${newName}-level`, localStorage.getItem(`${oldName}-level`));
        localStorage.removeItem(`${oldName}-experience`);
        localStorage.removeItem(`${oldName}-level`);
        saveSkills(type);
    }
}

function addSkill() {
    const newSkillName = document.getElementById('new-skill-name').value;
    if (newSkillName) {
        const type = document.getElementById('management-title').innerText.toLowerCase().includes('mental') ? 'mental' : 'physical';
        skills[type].push(newSkillName);
        saveSkills(type);
        document.getElementById('new-skill-name').value = '';
        showSkillList(type); // Automatically switch back to the skill list view
    }
}


function removeSkill(type, skill) {
    event.stopPropagation(); // Stop the event from propagating to the li element
    skills[type] = skills[type].filter(s => s !== skill);
    saveSkills(type);
    showSkillList(type); // Refresh the skill list to reflect the changes
}


function saveSkills(type) {
    localStorage.setItem(`${type}Skills`, JSON.stringify(skills[type]));
}

function addClassExperience(experience) {
    // Mock implementation for class experience
    console.log(`Added ${experience} class experience.`);
}





















// Quest management
function showQuestPage(page) {
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('make-quest-page').style.display = 'none';
    document.getElementById('landing-page').style.display = 'none';

    if (page === 'quest-log') {
        document.getElementById('quests-page').style.display = 'block';
        displayQuestLog();
    } else if (page === 'make-quest') {
        document.getElementById('make-quest-page').style.display = 'block';
    }
}

// Function to display quest logs with search filters
function displayQuestLog() {
    const questList = document.getElementById('quest-list');
    const completedQuestList = document.getElementById('completed-quest-list');
    const failedQuestList = document.getElementById('failed-quest-list');
    const searchActive = document.getElementById('search-active').value.toLowerCase();
    const searchCompleted = document.getElementById('search-completed').value.toLowerCase();
    const searchFailed = document.getElementById('search-failed').value.toLowerCase();
    
    questList.innerHTML = '';
    completedQuestList.innerHTML = '';
    failedQuestList.innerHTML = '';

    quests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';

        let countdownHtml = '';
        if (quest.oneOffEndTime) {
            const oneOffTimeLeft = calculateOneOffTimeLeft(quest.oneOffEndTime);
            countdownHtml += `<p><strong>One-Off Timer:</strong> ${oneOffTimeLeft}</p>`;
        }

        if (quest.activationTime) {
            const dailyTimeLeft = calculateDailyTimeLeft(quest.activationTime);
            countdownHtml += `<p><strong>Daily Timer:</strong> ${dailyTimeLeft}</p>`;
        }

        questItem.innerHTML = `
            <h3>${quest.title}</h3>
            <p><strong>Reward:</strong> ${quest.reward || 'None'}</p>
            <p><strong>Punishment:</strong> ${quest.punishment || 'None'}</p>
            ${quest.activationTime ? `<p><strong>Streak:</strong> ${quest.streakCount || 0}</p>` : ''}
            ${countdownHtml}
        `;

        questItem.onclick = () => showQuestInfo(quest);

        if (quest.status === 'in-progress') {
            if (quest.title.toLowerCase().includes(searchActive)) {
                questList.appendChild(questItem);
            }
        } else if (quest.status === 'completed') {
            if (quest.title.toLowerCase().includes(searchCompleted)) {
                completedQuestList.appendChild(questItem);
            }
        } else if (quest.status === 'failed') {
            if (quest.title.toLowerCase().includes(searchFailed)) {
                failedQuestList.appendChild(questItem);
            }
        }
    });

    updateCountdowns();
}



function updateCountdowns() {
    const questItems = document.querySelectorAll('.quest-item');
    questItems.forEach(item => {
        const questTitle = item.querySelector('h3').innerText;
        const quest = quests.find(q => q.title === questTitle);
        if (quest) {
            if (quest.oneOffEndTime) {
                const oneOffCountdownElement = item.querySelector('p strong'); // Adjust selector if necessary
                if (oneOffCountdownElement && oneOffCountdownElement.innerText.includes('One-Off Timer:')) {
                    const oneOffTimeLeft = calculateOneOffTimeLeft(quest.oneOffEndTime);
                    oneOffCountdownElement.innerText = `One-Off Timer: ${oneOffTimeLeft}`;
                }
            }

            if (quest.activationTime) {
                const dailyCountdownElement = item.querySelector('p strong'); // Adjust selector if necessary
                if (dailyCountdownElement && dailyCountdownElement.innerText.includes('Daily Timer:')) {
                    const dailyTimeLeft = calculateDailyTimeLeft(quest.activationTime);
                    dailyCountdownElement.innerText = `Daily Timer: ${dailyTimeLeft}`;
                }
            }
        }
    });
}


// Updated showQuestInfo function
function showQuestInfo(quest) {
    document.getElementById('quest-info-page').style.display = 'block';
    document.getElementById('quests-page').style.display = 'none';

    const questIndex = quests.indexOf(quest);

    const questTitleElement = document.getElementById('quest-title');
    const questDetailsElement = document.getElementById('quest-details');
    const questRewardElement = document.getElementById('quest-reward');
    const questClassTagElement = document.getElementById('quest-class-tag');
    const questPunishmentElement = document.getElementById('quest-punishment');
    const questStreakElement = document.getElementById('quest-streak');  // New

    // Set initial values
    questTitleElement.innerText = quest.title;
    questDetailsElement.innerText = quest.description;
    questRewardElement.innerText = `Reward: ${quest.reward || 'None'}`;
    questClassTagElement.innerText = `Class Tag: ${quest.classTag || 'None'}`;
    questPunishmentElement.innerText = `Punishment: ${quest.punishment || 'None'}`;
    questStreakElement.innerText = `Streak: ${quest.streakCount || 0}`;  // Set streak value

    // Attach quest index to each editable element
    questTitleElement.dataset.questIndex = questIndex;
    questDetailsElement.dataset.questIndex = questIndex;
    questRewardElement.dataset.questIndex = questIndex;
    questClassTagElement.dataset.questIndex = questIndex;
    questPunishmentElement.dataset.questIndex = questIndex;
    questStreakElement.dataset.questIndex = questIndex;  // New

    // Set the dataset quest index on the quest-info element
    document.getElementById('quest-info').dataset.questIndex = questIndex;

    const moveToActiveButton = document.querySelector('button[onclick="moveQuestToActive()"]');
    if (quest.status === 'completed' || quest.status === 'failed') {
        moveToActiveButton.style.display = 'block';
    } else {
        moveToActiveButton.style.display = 'none';
    }
}




function moveQuestToActive() {
    const questIndex = document.getElementById('quest-info').dataset.questIndex;
    const quest = quests[questIndex];

    if (quest.status === 'completed' || quest.status === 'failed') {
        quest.status = 'in-progress';
        quest.lastCompleted = null; // Reset the lastCompleted timestamp if it exists
        saveQuestsToLocalStorage();  // Save to localStorage
        updateQuestLogs();
        closeQuestInfo();
    }
}

function markQuestAsCompleted() {
    const questIndex = document.getElementById('quest-info').dataset.questIndex;
    const quest = quests[questIndex];
    const currentDateTime = new Date(); // Current date and time

    // Initialize streak and lastCompletedTime if not present
    if (!quest.streakCount) {
        quest.streakCount = 0;
    }
    if (!quest.lastCompletedTime) {
        quest.lastCompletedTime = null;
    }

    // Check if the quest has an activationTime (daily timer)
    if (quest.activationTime) {
        const [activationHours, activationMinutes] = quest.activationTime.split(':').map(Number);
        const lastCompletionDate = new Date(quest.lastCompletedTime || 0);
        const dailyResetTime = new Date();
        dailyResetTime.setHours(activationHours, activationMinutes, 0, 0);

        // If last completed time was before the daily reset and we're completing after, increment streak
        if (currentDateTime > dailyResetTime && lastCompletionDate < dailyResetTime) {
            quest.streakCount += 1;
        } else if (!quest.lastCompletedTime) {
            // If it's the first time completing this quest
            quest.streakCount = 1;
        }
    }

    // Update quest status and lastCompletedTime
    quest.status = 'completed';
    quest.lastCompleted = Date.now(); // Store the exact completion timestamp
    quest.lastCompletedTime = currentDateTime.toISOString(); // Save current timestamp for tracking

    saveQuestsToLocalStorage();  // Save to localStorage
    updateQuestLogs();
    closeQuestInfo();
}



function markQuestAsFailed() {
    const questIndex = document.getElementById('quest-info').dataset.questIndex;
    const quest = quests[questIndex];
    
    quest.status = 'failed';
    saveQuestsToLocalStorage();  // Save to localStorage
    updateQuestLogs();
    closeQuestInfo();
}


function deleteQuest() {
    const questIndex = document.getElementById('quest-info').dataset.questIndex;
    quests.splice(questIndex, 1); // Remove quest from array
    saveQuestsToLocalStorage();  // Save to localStorage
    updateQuestLogs();
    closeQuestInfo();
}

function closeQuestInfo() {
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('quests-page').style.display = 'block';
}

function submitQuest() {
    const title = document.getElementById('quest-title-input').value;
    const description = document.getElementById('quest-description-input').value;
    const reward = document.getElementById('quest-reward-input').value;
    const classTag = document.getElementById('quest-class-tag').value;
    const punishment = document.getElementById('quest-punishment-input').value;
    const activationTime = document.getElementById('quest-activation-time').value;
    const oneOffDuration = document.getElementById('quest-oneoff-duration').value; // New field for one-off duration

    if (title && description) {
        const newQuest = {
    title: title,
    description: description,
    reward: reward,
    classTag: classTag,
    punishment: punishment,
    experience: 1000,
    status: 'in-progress',
    lastCompleted: null,
    streakCount: 0,  // New field to track streaks
    lastCompletedDate: null,  // New field to store the date of the last completion
};


        if (activationTime) {
            newQuest.activationTime = activationTime;
        }

        if (oneOffDuration) {
            const now = new Date();
            const endTime = new Date(now.getTime() + oneOffDuration * 60 * 60 * 1000);
            newQuest.oneOffEndTime = endTime.toISOString();
        }

        quests.push(newQuest);
        saveQuestsToLocalStorage();
        showQuestPage('quest-log');
    }
}


function calculateOneOffTimeLeft(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const timeDiff = end - now;
    if (timeDiff <= 0) return 'Expired';

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}

function calculateDailyTimeLeft(activationTime) {
    const [activationHours, activationMinutes] = activationTime.split(':').map(Number);
    const now = new Date();
    const nextActivation = new Date(now.getFullYear(), now.getMonth(), now.getDate(), activationHours, activationMinutes);
    
    if (now > nextActivation) {
        nextActivation.setDate(nextActivation.getDate() + 1);
    }

    const timeDiff = nextActivation - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}





function cancelQuest() {
    showQuestPage('quest-log');
}

function updateQuestLogs() {
    displayQuestLog();
}

function saveQuestsToLocalStorage() {
    localStorage.setItem('quests', JSON.stringify(quests));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const storedQuests = localStorage.getItem('quests');
    if (storedQuests) {
        quests = JSON.parse(storedQuests);
    }

    // Initial setup
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('make-quest-page').style.display = 'none';
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
  


    // Event listeners for search inputs
    document.getElementById('search-active').addEventListener('input', displayQuestLog);
    document.getElementById('search-completed').addEventListener('input', displayQuestLog);
    document.getElementById('search-failed').addEventListener('input', displayQuestLog);

    resetRecurringQuests();
});







// Function to update quest logs and apply status changes based on timers
function resetRecurringQuests() {
    const currentTime = new Date();
    const today = currentTime.toDateString(); // Get today's date

    quests.forEach(quest => {
        // One-off quest handling (unchanged)
        if (quest.oneOffEndTime) {
            const endTime = new Date(quest.oneOffEndTime);
            if (currentTime > endTime && quest.status !== 'completed') {
                quest.status = 'failed';
            }
        }

        // Handle daily recurring quests
        if (quest.activationTime) {
            const [activationHours, activationMinutes] = quest.activationTime.split(':').map(Number);
            const activationToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), activationHours, activationMinutes);

            // Check if we passed the activation time and if the quest hasn't been completed today
            if (quest.lastResetDate !== today && currentTime >= activationToday) {
                // If the quest hasn't been completed by the reset time, reset streak to 0
                if (quest.status !== 'completed') {
                    quest.streakCount = 0;
                }

                // Set quest back to in-progress for the new day
                quest.status = 'in-progress';

                // Reset the quest only once per day
                quest.lastResetDate = today;
            }
        }
    });

    saveQuestsToLocalStorage();
    updateQuestLogs();
}






// Run the resetRecurringQuests function periodically
setInterval(resetRecurringQuests, 1000); // Check every second for testing

// Initialization and event listeners remain the same
document.addEventListener('DOMContentLoaded', () => {
    const storedQuests = localStorage.getItem('quests');
    if (storedQuests) {
        quests = JSON.parse(storedQuests);
    }

    // Initial setup
    document.getElementById('quests-page').style.display = 'none';
    document.getElementById('make-quest-page').style.display = 'none';
    document.getElementById('quest-info-page').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';

    // Event listeners for search inputs
    document.getElementById('search-active').addEventListener('input', displayQuestLog);
    document.getElementById('search-completed').addEventListener('input', displayQuestLog);
    document.getElementById('search-failed').addEventListener('input', displayQuestLog);

    resetRecurringQuests();
});






























let currentJobIndex = null; // Track the index of the current job
let jobExperienceInterval = null; // Track the interval for adding/subtracting experience

// Load jobs from localStorage or use default jobs if none are found
const savedJobs = JSON.parse(localStorage.getItem('jobs'));
const jobs = savedJobs || [
    { 
        title: "Data Analyst", 
        description: "Uncover insights from vast datasets to drive strategic decisions. Skills include statistical analysis, data visualization, and proficiency in tools like Excel and SQL.",
        experience: 0,  // Add experience
        level: 1         // Add level
    },
    { 
        title: "Lawyer", 
        description: "Advocate for clients in legal matters, crafting persuasive arguments and interpreting laws. Skills include critical thinking, negotiation, and expertise in legal research.",
        experience: 0,  // Add experience
        level: 1         // Add level
    },
    { 
        title: "Engineer", 
        description: "Design and build innovative solutions to complex problems. Skills include problem-solving, technical proficiency in fields such as software, civil, or mechanical engineering, and project management.",
        experience: 0,  // Add experience
        level: 1         // Add level
    },
    { 
        title: "Doctor", 
        description: "Diagnose and treat patients, improving their health and well-being. Skills include medical expertise, patient care, and proficiency with diagnostic tools and techniques.",
        experience: 0,  // Add experience
        level: 1         // Add level
    }
];

// Save jobs to localStorage
function saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}


// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('job-search');
    searchInput.addEventListener('input', filterJobs);
}

// Filter jobs based on search query
function filterJobs() {
    const query = document.getElementById('job-search').value.toLowerCase();
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query)
    );
    displayFilteredJobs(filteredJobs);
}

// Display filtered jobs
function displayFilteredJobs(filteredJobs) {
    const jobListContainer = document.getElementById('job-list-container');
    jobListContainer.innerHTML = ''; // Clear existing content

    filteredJobs.forEach((job, index) => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.innerHTML = `<strong>${job.title}</strong>`; // Only display the title
        jobItem.onclick = () => showJobInfo(job, index); // Pass the index to the showJobInfo function
        jobListContainer.appendChild(jobItem);
    });
}



// Show the relevant job page
function showJobPage(page) {
    document.getElementById('job-page').style.display = 'none';
    document.getElementById('job-info-page').style.display = 'none';
    document.getElementById('create-job-page').style.display = 'none';

    if (page === 'job-log') {
        document.getElementById('job-page').style.display = 'block';
        populateJobList();
    } else if (page === 'create-job') {
        document.getElementById('create-job-page').style.display = 'block';
    }
}

// Populate the job list
function populateJobList() {
    const jobListContainer = document.getElementById('job-list-container');
    jobListContainer.innerHTML = ''; // Clear existing content

    jobs.forEach((job, index) => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.innerHTML = `<strong>${job.title}</strong>`; // Only display the title
        jobItem.onclick = () => showJobInfo(job, index); // Pass the index to the showJobInfo function
        jobListContainer.appendChild(jobItem);
    });
}


// Show job information
function showJobInfo(job, index) {
    currentJobIndex = index; // Store the index of the current job

    document.getElementById('job-info-page').style.display = 'block';
    document.getElementById('job-page').style.display = 'none';

    document.getElementById('job-title').innerText = job.title;
    document.getElementById('job-description').innerText = job.description;
    
    // Display experience and level
    document.getElementById('job-experience').innerText = `Experience: ${job.experience}`;
    document.getElementById('job-level').innerText = `Level: ${job.level}`;
    
    updateJobProgressBar(job.experience, job.level);

    // Add event listeners for the buttons
    setupJobExperienceButtons();
}

// Add event listeners for the experience buttons
function setupJobExperienceButtons() {
    const addButton = document.querySelector('#job-info-page button:nth-of-type(1)');
    const subtractButton = document.querySelector('#job-info-page button:nth-of-type(2)');

    addButton.addEventListener('mousedown', startJobAddingPoints);
    subtractButton.addEventListener('mousedown', startJobRemovingPoints);

    addButton.addEventListener('mouseup', stopJobExperienceChange);
    subtractButton.addEventListener('mouseup', stopJobExperienceChange);

    addButton.addEventListener('mouseleave', stopJobExperienceChange);
    subtractButton.addEventListener('mouseleave', stopJobExperienceChange);
}

// Start adding experience points continuously
function startJobAddingPoints() {
    if (currentJobIndex !== null) {
        jobExperienceInterval = setInterval(() => {
            addJobExperience(1); // Add 1 point per interval
        }, 100); // Adjust the interval time as needed
    }
}

// Start subtracting experience points continuously
function startJobRemovingPoints() {
    if (currentJobIndex !== null) {
        jobExperienceInterval = setInterval(() => {
            subtractJobExperience(1); // Subtract 1 point per interval
        }, 100); // Adjust the interval time as needed
    }
}

// Stop adding or subtracting experience points
function stopJobExperienceChange() {
    clearInterval(jobExperienceInterval);
    jobExperienceInterval = null;
}




// Subtract experience points
function subtractJobExperience(points) {
    if (currentJobIndex !== null) {
        const job = jobs[currentJobIndex];
        if (job.experience - 1 >= 0) { // Ensure experience does not go below zero
            job.experience -= 1;
            updateJobLevel(currentJobIndex); // Update level based on new experience
            updateJobInfoPage(); // Refresh the job info page
        }
    }
}




// Add experience points
function addJobExperience(points) {
    if (currentJobIndex !== null) {
        const job = jobs[currentJobIndex];
        if (job.experience + 1 <= 10000) { // Ensure experience does not exceed maximum
            job.experience += 1;
            updateJobLevel(currentJobIndex); // Update level based on new experience
            updateJobInfoPage(); // Refresh the job info page
        }
    }
}



// Update job information page
function updateJobInfoPage() {
    if (currentJobIndex !== null) {
        updateJobLevel(currentJobIndex);  // Update level based on experience
        const job = jobs[currentJobIndex];
        document.getElementById('job-experience').innerText = `Experience: ${job.experience}`;
        document.getElementById('job-level').innerText = `Level: ${job.level}`;
        updateJobProgressBar(job.experience, job.level);
        saveJobs();
    }
}

// Update job level based on experience
function updateJobLevel(jobIndex) {
    const job = jobs[jobIndex];
    let newLevel = 1;
    while (job.experience >= getJobLevelExperience(newLevel) && newLevel < 100) {
        newLevel++;
    }
    job.level = newLevel;
}

// Calculate experience required for a given level
function getJobLevelExperience(level) {
    return Math.pow(level / 100, 2) * 10000;  // Assuming max level is 100 and max experience is 10000
}

// Update job progress bar
function updateJobProgressBar(experience, level) {
    const maxExperience = 10000;
    const levelExperience = getJobLevelExperience(level);
    const progress = experience - getJobLevelExperience(level - 1);
    const maxProgress = levelExperience - getJobLevelExperience(level - 1);

    updateJobProgressBarUI('job-experience-bar', progress, maxProgress);
}

// Update progress bar UI
function updateJobProgressBarUI(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function submitJob() {
    const title = document.getElementById('job-title-input').value;
    const description = document.getElementById('job-description-input').value;

    if (title && description) {
        jobs.push({ 
            title: title, 
            description: description, 
            experience: 0,  // Initialize experience
            level: 1         // Initialize level
        });
        saveJobs(); // Save the updated jobs array
        showJobPage('job-log'); // Show the job list page
    }
}

function deleteJob() {
    if (currentJobIndex !== null) {
        jobs.splice(currentJobIndex, 1); // Remove the job from the array
        saveJobs(); // Save the updated jobs array
        goBacktoJobPage(); // Go back to the job list page
        populateJobList(); // Refresh the job list
    }
}


// Close job info page and go back to job list
function closeJobInfoPage() {
    document.getElementById('job-info-page').style.display = 'none';
    document.getElementById('job-page').style.display = 'block';
}

// Cancel job creation
function cancelJobCreation() {
    showJobPage('job-log');
}


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Hide all pages initially
    document.getElementById('job-page').style.display = 'none';
    document.getElementById('job-info-page').style.display = 'none';
    document.getElementById('create-job-page').style.display = 'none';
    
    // Show the landing page or another default page
    document.getElementById('landing-page').style.display = 'block';
    
    // Load jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('jobs'));
    if (savedJobs) {
        jobs.splice(0, jobs.length, ...savedJobs); // Replace the current jobs with saved jobs
    }

    // Initialize search functionality
    initSearch();
});


function goBacktoJobPage() {
    const currentPage = document.querySelector('.container[style*="block"]');
    if (currentPage && currentPage.id === 'job-info-page') {
        closeJobInfoPage();
    } else if (currentPage && currentPage.id === 'create-job-page') {
        cancelJobCreation();
    } else {
        showJobPage('job-log');
    }
}









// Set the number of fairy lights to create
const numFairyLights = 25;
const container = document.querySelector('.fairy-lights-container');

// Array to hold fairy lights
const fairyLights = [];

// Create fairy lights
for (let i = 0; i < numFairyLights; i++) {
  let fairyLight = document.createElement('div');
  fairyLight.classList.add('fairy-light');

  let randomSize = 5 + Math.random() * 20;  // Random size between 5px and 25px
  let randomGlow = 20 + Math.random() * 30;  // Random glow between 20px and 50px
  fairyLight.style.width = `${randomSize}px`;
  fairyLight.style.height = `${randomSize}px`;
  fairyLight.style.boxShadow = `
    0 0 ${randomGlow}px rgba(0, 191, 255, 0.8), 
    0 0 ${randomGlow * 2}px rgba(0, 191, 255, 0.6), 
    0 0 ${randomGlow * 3}px rgba(0, 191, 255, 0.4),
    0 0 ${randomGlow * 4}px rgba(0, 191, 255, 0.2)`;
  
  let randomX = Math.random() * window.innerWidth;
  let randomY = Math.random() * window.innerHeight;
  fairyLight.style.left = `${randomX}px`;
  fairyLight.style.top = `${randomY}px`;

  let randomDuration = 8 + Math.random() * 10; // Duration between 8s and 18s
  let randomDelay = Math.random() * 5;  // Delay between 0s and 5s
  fairyLight.style.animationDuration = `${randomDuration}s`;
  fairyLight.style.animationDelay = `${randomDelay}s`;

  let randomDirectionX = (Math.random() - 0.5) * 200 + "vw"; // Random movement in X axis
  let randomDirectionY = (Math.random() - 0.5) * 200 + "vh"; // Random movement in Y axis
  fairyLight.style.setProperty('--randomX', randomDirectionX);
  fairyLight.style.setProperty('--randomY', randomDirectionY);

  let randomOpacity = 0.4 + Math.random() * 0.6;
  fairyLight.style.setProperty('--randomOpacity', randomOpacity);

  // Append fairy light to the container
  container.appendChild(fairyLight);

  // Add the fairy light to the array
  fairyLights.push(fairyLight);
}

// Mouse movement tracking
document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  fairyLights.forEach(light => {
    const rect = light.getBoundingClientRect();
    const lightX = rect.left + rect.width / 2;
    const lightY = rect.top + rect.height / 2;

    // Calculate distance between the mouse and the fairy light
    const dx = lightX - mouseX;
    const dy = lightY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Define avoidance range and strength
    const avoidanceRange = 100; // Distance at which lights start avoiding the mouse
    const avoidanceStrength = 0.05; // Lower strength for subtle movement
    const maxMovement = 5; // Maximum movement per frame in pixels

    if (distance < avoidanceRange) {
      // Calculate the direction to move the light away from the mouse
      const moveX = (dx / distance) * Math.min(avoidanceStrength * (avoidanceRange - distance), maxMovement);
      const moveY = (dy / distance) * Math.min(avoidanceStrength * (avoidanceRange - distance), maxMovement);

      // Smooth movement by updating position gradually
      const currentLeft = parseFloat(light.style.left) || 0;
      const currentTop = parseFloat(light.style.top) || 0;
      light.style.left = `${currentLeft + moveX}px`;
      light.style.top = `${currentTop + moveY}px`;
    }
  });
});



























//q



// DOM Elements
const worklog = document.getElementById('work-log-page');
const calendarBody = document.getElementById('calendar-body');
const currentMonthElement = document.getElementById('current-month');
let currentDate = new Date(); // Use current date for initialization





// Update the calendar view for a specific month and year
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Display the month and year
    currentMonthElement.innerText = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

    calendarBody.innerHTML = '';  // Clear the current calendar

    // Add day names (Monday to Sunday)
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.innerText = day;
        calendarBody.appendChild(dayHeader);
    });

    // Calculate the day of the week the first day of the month falls on
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert from Sun-Sat to Mon-Sun

    // Add empty days for the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarBody.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerHTML = `<div class="day-header">${day}</div><div class="work-block-container"></div>`;

        const workBlockContainer = dayElement.querySelector('.work-block-container');
        for (let block = 0; block < 16; block++) {
            const workBlock = document.createElement('div');
            workBlock.className = 'work-block';

            // Load any saved color data
            const workData = JSON.parse(localStorage.getItem('workData')) || {};
            const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
            const blockKey = `${block}`;
            const savedData = workData[dayKey] ? workData[dayKey][blockKey] : null;
            workBlock.style.backgroundColor = savedData ? savedData.color : 'black';

            workBlock.onclick = () => toggleBlockColor(day, block, workBlock);

            workBlockContainer.appendChild(workBlock);
        }

        calendarBody.appendChild(dayElement);
    }
}

// Toggle block color between black and default
function toggleBlockColor(day, block, blockElement) {
    const currentColor = blockElement.style.backgroundColor;
    const newColor = currentColor === 'black' ? '' : 'black';
    blockElement.style.backgroundColor = newColor;

    // Save the color data
    saveBlockColor(day, block, newColor);
}

// Save work block color data for a specific day and block in local storage
function saveBlockColor(day, block, color) {
    let workData = JSON.parse(localStorage.getItem('workData')) || {};

    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    if (!workData[dayKey]) {
        workData[dayKey] = {};
    }

    workData[dayKey][block] = { color };

    localStorage.setItem('workData', JSON.stringify(workData));
}

// Button event listeners for navigation
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
});





// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });

    // Service Worker Code (directly in the JS file)
    navigator.serviceWorker.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open('your-cache-name').then((cache) => {
                return cache.addAll([
                    './',               // Cache your main page
                    './index.html',     // Your main HTML file
                    './styles.css',     // Your CSS file
                    './script.js',      // Your JavaScript file
                    './icon.png'        // Your app icon
                ]);
            })
        );
    });

    navigator.serviceWorker.addEventListener('fetch', (event) => {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    });
}

