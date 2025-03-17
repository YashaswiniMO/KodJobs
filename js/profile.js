// Profile management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load user profile data
    loadProfileData();
    
    // Add event listeners
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', addSkill);
    }
    
    const newSkillInput = document.getElementById('new-skill');
    if (newSkillInput) {
        newSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    
    const addExperienceBtn = document.getElementById('add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperience);
    }
    
    const addEducationBtn = document.getElementById('add-education-btn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducation);
    }
    
    const saveProfileBtn = document.getElementById('save-profile-btn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
});

// Load user profile data
function loadProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Basic info
    document.getElementById('fullName').value = currentUser.fullName;
    document.getElementById('email').value = currentUser.email;
    
    if (currentUser.profile) {
        document.getElementById('title').value = currentUser.profile.title || '';
        document.getElementById('bio').value = currentUser.profile.bio || '';
        
        // Load skills
        loadSkills(currentUser.profile.skills || []);
        
        // Load experience
        loadExperience(currentUser.profile.experience || []);
        
        // Load education
        loadEducation(currentUser.profile.education || []);
    }
}

// Load skills
function loadSkills(skills) {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = '';
    
    skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" data-skill="${skill}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        skillsContainer.appendChild(skillTag);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = skillsContainer.querySelectorAll('button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeSkill(this.dataset.skill);
        });
    });
}

// Add skill
function addSkill() {
    const newSkillInput = document.getElementById('new-skill');
    const skill = newSkillInput.value.trim();
    
    if (!skill) return;
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize profile and skills if they don't exist
    if (!currentUser.profile) {
        currentUser.profile = {};
    }
    
    if (!currentUser.profile.skills) {
        currentUser.profile.skills = [];
    }
    
    // Check if skill already exists
    if (currentUser.profile.skills.includes(skill)) {
        alert('This skill already exists!');
        return;
    }
    
    // Add skill
    currentUser.profile.skills.push(skill);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadSkills(currentUser.profile.skills);
    
    // Clear input
    newSkillInput.value = '';
}

// Remove skill
function removeSkill(skill) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.profile || !currentUser.profile.skills) return;
    
    // Remove skill
    currentUser.profile.skills = currentUser.profile.skills.filter(s => s !== skill);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadSkills(currentUser.profile.skills);
}

// Load experience
function loadExperience(experience) {
    const experienceContainer = document.getElementById('experience-container');
    const noExperienceMessage = document.getElementById('no-experience-message');
    
    if (!experienceContainer) return;
    
    // Clear container except for the empty message
    const items = experienceContainer.querySelectorAll('.experience-item');
    items.forEach(item => item.remove());
    
    if (experience.length === 0) {
        if (noExperienceMessage) noExperienceMessage.style.display = 'block';
        return;
    }
    
    if (noExperienceMessage) noExperienceMessage.style.display = 'none';
    
    experience.forEach((exp, index) => {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.dataset.id = exp.id;
        experienceItem.innerHTML = `
            <div class="item-header">
                <h3>Experience ${index + 1}</h3>
                <button type="button" class="remove-experience-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="item-form">
                <div class="form-group">
                    <label for="exp-title-${exp.id}">Job Title</label>
                    <input type="text" id="exp-title-${exp.id}" value="${exp.title || ''}" placeholder="e.g. Software Engineer">
                </div>
                <div class="form-group">
                    <label for="exp-company-${exp.id}">Company</label>
                    <input type="text" id="exp-company-${exp.id}" value="${exp.company || ''}" placeholder="e.g. Acme Inc.">
                </div>
                <div class="form-group">
                    <label for="exp-start-${exp.id}">Start Date</label>
                    <input type="text" id="exp-start-${exp.id}" value="${exp.startDate || ''}" placeholder="e.g. Jan 2020">
                </div>
                <div class="form-group">
                    <label for="exp-end-${exp.id}">End Date</label>
                    <input type="text" id="exp-end-${exp.id}" value="${exp.endDate || ''}" placeholder="e.g. Present">
                </div>
                <div class="form-group">
                    <label for="exp-desc-${exp.id}">Description</label>
                    <textarea id="exp-desc-${exp.id}" rows="3" placeholder="Describe your responsibilities and achievements">${exp.description || ''}</textarea>
                </div>
            </div>
        `;
        
        experienceContainer.appendChild(experienceItem);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = experienceContainer.querySelectorAll('.remove-experience-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const experienceItem = this.closest('.experience-item');
            removeExperience(experienceItem.dataset.id);
        });
    });
}

// Add experience
function addExperience() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize profile and experience if they don't exist
    if (!currentUser.profile) {
        currentUser.profile = {};
    }
    
    if (!currentUser.profile.experience) {
        currentUser.profile.experience = [];
    }
    
    // Create new experience
    const newExperience = {
        id: Date.now().toString(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
    };
    
    // Add to experience array
    currentUser.profile.experience.push(newExperience);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadExperience(currentUser.profile.experience);
}

// Remove experience
function removeExperience(id) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.profile || !currentUser.profile.experience) return;
    
    // Remove experience
    currentUser.profile.experience = currentUser.profile.experience.filter(exp => exp.id !== id);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadExperience(currentUser.profile.experience);
}

// Load education
function loadEducation(education) {
    const educationContainer = document.getElementById('education-container');
    const noEducationMessage = document.getElementById('no-education-message');
    
    if (!educationContainer) return;
    
    // Clear container except for the empty message
    const items = educationContainer.querySelectorAll('.education-item');
    items.forEach(item => item.remove());
    
    if (education.length === 0) {
        if (noEducationMessage) noEducationMessage.style.display = 'block';
        return;
    }
    
    if (noEducationMessage) noEducationMessage.style.display = 'none';
    
    education.forEach((edu, index) => {
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.dataset.id = edu.id;
        educationItem.innerHTML = `
            <div class="item-header">
                <h3>Education ${index + 1}</h3>
                <button type="button" class="remove-education-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="item-form">
                <div class="form-group">
                    <label for="edu-degree-${edu.id}">Degree</label>
                    <input type="text" id="edu-degree-${edu.id}" value="${edu.degree || ''}" placeholder="e.g. Bachelor of Science in Computer Science">
                </div>
                <div class="form-group">
                    <label for="edu-institution-${edu.id}">Institution</label>
                    <input type="text" id="edu-institution-${edu.id}" value="${edu.institution || ''}" placeholder="e.g. University of Technology">
                </div>
                <div class="form-group">
                    <label for="edu-start-${edu.id}">Start Date</label>
                    <input type="text" id="edu-start-${edu.id}" value="${edu.startDate || ''}" placeholder="e.g. Sep 2016">
                </div>
                <div class="form-group">
                    <label for="edu-end-${edu.id}">End Date</label>
                    <input type="text" id="edu-end-${edu.id}" value="${edu.endDate || ''}" placeholder="e.g. Jun 2020">
                </div>
                <div class="form-group">
                    <label for="edu-desc-${edu.id}">Description</label>
                    <textarea id="edu-desc-${edu.id}" rows="3" placeholder="Describe your studies, achievements, or relevant activities">${edu.description || ''}</textarea>
                </div>
            </div>
        `;
        
        educationContainer.appendChild(educationItem);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = educationContainer.querySelectorAll('.remove-education-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const educationItem = this.closest('.education-item');
            removeEducation(educationItem.dataset.id);
        });
    });
}

// Add education
function addEducation() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize profile and education if they don't exist
    if (!currentUser.profile) {
        currentUser.profile = {};
    }
    
    if (!currentUser.profile.education) {
        currentUser.profile.education = [];
    }
    
    // Create new education
    const newEducation = {
        id: Date.now().toString(),
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: ''
    };
    
    // Add to education array
    currentUser.profile.education.push(newEducation);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadEducation(currentUser.profile.education);
}

// Remove education
function removeEducation(id) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.profile || !currentUser.profile.education) return;
    
    // Remove education
    currentUser.profile.education = currentUser.profile.education.filter(edu => edu.id !== id);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    loadEducation(currentUser.profile.education);
}

// Save profile
function saveProfile() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize profile if it doesn't exist
    if (!currentUser.profile) {
        currentUser.profile = {};
    }
    
    // Update basic info
    currentUser.profile.title = document.getElementById('title').value;
    currentUser.profile.bio = document.getElementById('bio').value;
    
    // Update experience
    if (currentUser.profile.experience) {
        currentUser.profile.experience.forEach(exp => {
            exp.title = document.getElementById(`exp-title-${exp.id}`).value;
            exp.company = document.getElementById(`exp-company-${exp.id}`).value;
            exp.startDate = document.getElementById(`exp-start-${exp.id}`).value;
            exp.endDate = document.getElementById(`exp-end-${exp.id}`).value;
            exp.description = document.getElementById(`exp-desc-${exp.id}`).value;
        });
    }
    
    // Update education
    if (currentUser.profile.education) {
        currentUser.profile.education.forEach(edu => {
            edu.degree = document.getElementById(`edu-degree-${edu.id}`).value;
            edu.institution = document.getElementById(`edu-institution-${edu.id}`).value;
            edu.startDate = document.getElementById(`edu-start-${edu.id}`).value;
            edu.endDate = document.getElementById(`edu-end-${edu.id}`).value;
            edu.description = document.getElementById(`edu-desc-${edu.id}`).value;
        });
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
        user.id === currentUser.id ? currentUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    alert('Profile saved successfully!');
}