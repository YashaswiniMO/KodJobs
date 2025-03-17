// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load and display jobs
    loadJobs();
    
    // Add event listener for job search
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterJobs(this.value);
        });
    }
});

// Load jobs from mock data
function loadJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    if (!jobsContainer) return;
    
    // Clear loading message
    jobsContainer.innerHTML = '';
    
    // Mock job data
    const jobs = [
        {
            id: '1',
            title: 'Frontend Developer',
            company: 'TechCorp',
            location: 'San Francisco, CA',
            type: 'Full-time',
            postedAt: '2 days ago',
            description: 'We are looking for a skilled Frontend Developer to join our team.',
            requirements: ['React', 'TypeScript', 'CSS', '3+ years experience']
        },
        {
            id: '2',
            title: 'Backend Engineer',
            company: 'DataSystems',
            location: 'New York, NY',
            type: 'Full-time',
            postedAt: '1 week ago',
            description: 'Join our backend team to build scalable APIs and services.',
            requirements: ['Node.js', 'Python', 'SQL', '5+ years experience'],
            salary: '$120,000 - $150,000'
        },
        {
            id: '3',
            title: 'UX Designer',
            company: 'CreativeMinds',
            location: 'Remote',
            type: 'Contract',
            postedAt: '3 days ago',
            description: 'Design intuitive user experiences for our products.',
            requirements: ['Figma', 'User Research', 'Prototyping', '2+ years experience']
        },
        {
            id: '4',
            title: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'Seattle, WA',
            type: 'Full-time',
            postedAt: 'Just now',
            description: 'Manage our cloud infrastructure and CI/CD pipelines.',
            requirements: ['AWS', 'Docker', 'Kubernetes', '4+ years experience'],
            salary: '$130,000 - $160,000'
        },
        {
            id: '5',
            title: 'Product Manager',
            company: 'InnovateCo',
            location: 'Austin, TX',
            type: 'Full-time',
            postedAt: '5 days ago',
            description: 'Lead product development from conception to launch.',
            requirements: ['Product Strategy', 'Agile', 'Market Research', '5+ years experience']
        }
    ];
    
    // Get user's applications
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const applications = currentUser.applications || [];
    
    // Create job cards
    jobs.forEach(job => {
        const hasApplied = applications.includes(job.id);
        
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.dataset.jobId = job.id;
        jobCard.innerHTML = `
        <h3>${job.title}</h3>
        <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
        <p class="job-type"><i class="fas fa-briefcase"></i> ${job.type}</p>
        <p class="posted"><i class="fas fa-clock"></i> ${job.postedAt}</p>
        <p>${job.description}</p>
        <div class="requirements">
            ${job.requirements.map(req => `<span class="tag">${req}</span>`).join('')}
        </div>
        ${job.salary ? `<p><strong>${job.salary}</strong></p>` : ''}
        <button class="btn btn-primary apply-btn" ${hasApplied ? 'disabled' : ''}>
            ${hasApplied ? 'Applied' : 'Apply Now'}
        </button>
    `;
    
        
        jobsContainer.appendChild(jobCard);
    });
    
    // Add event listeners to apply buttons
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobId = jobCard.dataset.jobId;
            applyForJob(jobId);
        });
    });
}

// Filter jobs based on search term
function filterJobs(searchTerm) {
    const jobCards = document.querySelectorAll('.job-card');
    searchTerm = searchTerm.toLowerCase();
    
    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const company = card.querySelector('.company').textContent.toLowerCase();
        const location = card.querySelector('.location').textContent.toLowerCase();
        const description = card.querySelector('p:not(.company):not(.location):not(.job-type):not(.posted)').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || company.includes(searchTerm) || location.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Apply for a job
function applyForJob(jobId) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Add job to applications
    const applications = currentUser.applications || [];
    applications.push(jobId);
    currentUser.applications = applications;
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
        user.id === currentUser.id ? currentUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update UI
    const jobCard = document.querySelector(`.job-card[data-job-id="${jobId}"]`);
    if (jobCard) {
        const applyButton = jobCard.querySelector('.apply-btn');
        applyButton.textContent = 'Applied';
        applyButton.disabled = true;
    }
    
    alert('Application submitted successfully!');
}