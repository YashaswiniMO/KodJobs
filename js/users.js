// Users functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load and display users
    loadUsers();
    
    // Add event listener for user search
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
    
    // Add event listener for download JSON button
    const downloadJsonBtn = document.getElementById('download-json-btn');
    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener('click', downloadUsersJSON);
    }
});

// Load users from localStorage
function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    const usersCountElement = document.getElementById('users-count');
    
    if (!usersTableBody) return;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update users count
    if (usersCountElement) {
        usersCountElement.textContent = `${users.length} ${users.length === 1 ? 'user' : 'users'} found`;
    }
    
    // Clear table body
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="text-center">No users found</td>`;
        usersTableBody.appendChild(row);
        return;
    }
    
    // Create table rows
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.userId = user.id;
        
        const skills = user.profile?.skills || [];
        const skillsHtml = skills.length > 0 
            ? skills.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('') +
              (skills.length > 3 ? `<span class="tag">+${skills.length - 3} more</span>` : '')
            : '—';
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    ${user.fullName}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.profile?.title || '—'}</td>
            <td>${skillsHtml}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// Filter users based on search term
function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('#users-table-body tr');
    const usersCountElement = document.getElementById('users-count');
    searchTerm = searchTerm.toLowerCase();
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        if (row.querySelector('td[colspan="5"]')) return; // Skip "No users found" row
        
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const title = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm) || title.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update users count
    if (usersCountElement) {
        usersCountElement.textContent = `${visibleCount} ${visibleCount === 1 ? 'user' : 'users'} found`;
    }
}

// Download users JSON
function downloadUsersJSON() {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Create sanitized version without passwords
    const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    // Create JSON blob
    const blob = new Blob([JSON.stringify(sanitizedUsers, null, 2)], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kodjob-users.json';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}