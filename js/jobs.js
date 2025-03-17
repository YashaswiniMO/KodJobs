// Jobs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load and display jobs
    loadJobs();
    
    // Add event listener for job search
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterJobs();
        });
    }
    
    // Add event listener for toggle filters button
    const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
    if (toggleFiltersBtn) {
        toggleFiltersBtn.addEventListener('click', function() {
            const filtersContainer = document.getElementById('filters-container');
            if (filtersContainer.style.display === 'none') {
                filtersContainer.style.display = 'grid';
            } else {
                filtersContainer.style.display = 'none';
            }
        });
    }
    
    // Add event listeners for filters
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterJobs);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterJobs);
    }
});

// Load jobs from mock data
function loadJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    
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
        },
        {
            id: '6',
            title: 'Data Scientist',
            company: 'AnalyticsPro',
            location: 'Remote',
            type: 'Part-time',
            postedAt: '1 day ago',
            description: 'Analyze complex data sets to drive business decisions.',
            requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
            salary: '$50-70/hour'
        },
        {
            id: '7',
            title: 'Mobile Developer',
            company: 'AppWorks',
            location: 'Chicago, IL',
            type: 'Full-time',
            postedAt: '4 days ago',
            description: 'Build native mobile applications for iOS and Android.',
            requirements: ['Swift', 'Kotlin', 'React Native', '3+ years experience'],
            salary: '$110,000 - $140,000'
        },
        {
            id: '8',
            title: 'Technical Writer',
            company: 'DocuTech',
            location: 'Remote',
            type: 'Contract',
            postedAt: '1 week ago',
            description: 'Create clear, concise technical documentation for our products.',
            requirements: ['Technical Writing', 'Markdown', 'API Documentation', '2+ years experience']
        }
    ];
    
    // Store jobs in window object for filtering
    window.allJobs = jobs;
    
    // Get user's applications
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const applications = currentUser.applications || [];
    
    // Create job cards
    jobs.forEach(job => {
        const hasApplied = applications.includes(job.id);
        
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.dataset.jobId = job.id;
        jobCard.dataset.location = job.location;
        jobCard.dataset.type = job.type;
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
    
    // Populate location filter
    if (locationFilter) {
        const locations = [...new Set(jobs.map(job => job.location))];
        
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }
    
    // Populate type filter
    if (typeFilter) {
        const types = [...new Set(jobs.map(job => job.type))];
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }
}

// Filter jobs based on search term and filters
function filterJobs() {
    const jobCards = document.querySelectorAll('.job-card');
    const searchTerm = document.getElementById('job-search').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const noJobsMessage = document.getElementById('no-jobs-message');
    
    let visibleCount = 0;
    
    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const company = card.querySelector('.company').textContent.toLowerCase();
        const location = card.dataset.location;
        const type = card.dataset.type;
        const description = card.querySelector('p:not(.company):not(.location):not(.job-type):not(.posted)').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm) || 
                             company.includes(searchTerm) || 
                             description.includes(searchTerm);
                             
        const matchesLocation = locationFilter === '' || location === locationFilter;
        const matchesType = typeFilter === '' || type === typeFilter;
        
        if (matchesSearch && matchesLocation && matchesType) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no jobs message
    if (noJobsMessage) {
        noJobsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
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