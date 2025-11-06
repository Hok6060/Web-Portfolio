const backendUrl = 'http://127.0.0.1:3000';
const apiKey = 'secret-chheanghok-key';

// Highlight Active Section on Scroll
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('underline');
        if (link.getAttribute('data-scroll-to') === currentSection) {
            link.classList.add('underline');
        }
    });
}

// Fetch Personal Info
async function fetchPersonalInfo() {
    try {
        const response = await fetch(`${backendUrl}/api/personal-info`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const info = await response.json();
        document.getElementById('personal-name').textContent = `Hi, I'm ${info.name}`;
        document.getElementById('personal-passionate').textContent = info.passionate || 'A Passionate Developer';
        document.getElementById('personal-email').textContent = `Email: ${info.email}`;
        document.getElementById('personal-phone').textContent = `Phone: ${info.phone || 'Not provided'}`;
        const linkedinLink = document.getElementById('personal-linkedin').querySelector('a');
        linkedinLink.href = info.linkedin || '#';
        linkedinLink.textContent = `LinkedIn: ${info.linkedin || 'Not provided'}`;
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
    } catch (error) {
        console.error('Error fetching personal info:', error);
    }
}

// Fetch Projects
async function fetchProjects() {
    try {
        const response = await fetch(`${backendUrl}/api/projects`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const projects = await response.json();
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = projects.map(project => `
            <div class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full w-full sm:w-96">
                <div>
                    <h3 class="text-xl font-bold">${project.title}</h3>
                    <p>${project.description}</p>
                </div>
                <br>
                <a href="${project.link}" class="text-blue-500 hover:underline mt-auto">View Project</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Fetch Skills
async function fetchSkills() {
    try {
        const response = await fetch(`${backendUrl}/api/skills`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const skills = await response.json();
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = skills.map(skill => `
            <span class="bg-blue-600 text-white px-4 py-2 rounded">${skill.skill_name}</span>
        `).join('');
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}

// Fetch Contact Info
async function fetchContactInfo() {
    try {
        const response = await fetch(`${backendUrl}/api/personal-info`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const contactInfoDiv = document.getElementById('contact-info');
        contactInfoDiv.innerHTML = `
            <p class="mb-4 sm:mb-0">Email: ${data.email}</p>
            <p>LinkedIn: <a href="${data.linkedin}" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">${data.linkedin}</a></p>
        `;
    } catch (error) {
        console.error('Error fetching contact info:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-scroll-to]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-scroll-to');
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const loadingDialog = document.createElement('div');
    loadingDialog.id = 'loading-dialog';
    loadingDialog.style.position = 'fixed';
    loadingDialog.style.top = '0';
    loadingDialog.style.left = '0';
    loadingDialog.style.width = '100%';
    loadingDialog.style.height = '100%';
    loadingDialog.style.backgroundColor = 'rgb(111, 111, 111)';
    loadingDialog.style.display = 'flex';
    loadingDialog.style.justifyContent = 'center';
    loadingDialog.style.alignItems = 'center';
    loadingDialog.style.zIndex = '1000';
    loadingDialog.innerHTML = 
        `<div class="text-gray-300 text-lg" style="backdrop-filter: blur(5px); padding: 20px; border-radius: 10px; background-color: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="margin-bottom: 10px;">Loading...</div>
            <div style="width: 50px; height: 50px; position: relative; margin-bottom: 30px; margin-left: 20px; margin-right: 20px;">
                <!-- Head -->
                <div style="width: 20px; height: 20px; background-color: white; border-radius: 50%; position: absolute; top: 0; left: 15px; animation: walk 0.5s linear infinite;"></div>
                <!-- Torso -->
                <div style="width: 10px; height: 30px; background-color: white; position: absolute; top: 20px; left: 20px;"></div>
                <!-- Left Hand -->
                <div style="width: 10px; height: 20px; background-color: white; position: absolute; top: 25px; left: 5px; transform-origin: top; animation: hand-move-left 0.5s linear infinite;"></div>
                <!-- Right Hand -->
                <div style="width: 10px; height: 20px; background-color: white; position: absolute; top: 25px; left: 35px; transform-origin: top; animation: hand-move-right 0.5s linear infinite reverse;"></div>
                <!-- Left Leg -->
                <div style="margin-top: 5px; width: 10px; height: 20px; background-color: white; position: absolute; top: 50px; left: 10px; transform-origin: top; animation: leg-move-left 0.5s linear infinite;"></div>
                <!-- Right Leg -->
                <div style="margin-top: 5px; width: 10px; height: 20px; background-color: white; position: absolute; top: 50px; left: 30px; transform-origin: top; animation: leg-move-right 0.5s linear infinite reverse;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes walk {
                0% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0); }
            }
            @keyframes leg-move-left {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(30deg); }
                100% { transform: rotate(0deg); }
            }
            @keyframes leg-move-right {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(-30deg); }
                100% { transform: rotate(0deg); }
            }
            @keyframes hand-move-left {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(30deg); }
                100% { transform: rotate(0deg); }
            }
            @keyframes hand-move-right {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(-30deg); }
                100% { transform: rotate(0deg); }
            }
        </style>`;
    document.body.appendChild(loadingDialog);

    Promise.all([
        fetchPersonalInfo(),
        fetchProjects(),
        fetchSkills(),
        fetchContactInfo()
    ]).finally(() => {
        loadingDialog.style.display = 'none';
    });

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
});
