const backendUrl = 'http://localhost:3000';
const apiKey = 'secret-chheanghok-key';
const TIMEOUT_MS = 5000;

// Throttle function to limit scroll event calls
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Toggle mobile menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// API client with timeout and error handling
async function fetchAPI(endpoint) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(`${backendUrl}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Error display function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Highlight Active Section on Scroll (throttled)
const highlightActiveSection = throttle(() => {
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
        link.classList.remove('underline', 'font-bold', 'text-blue-700');
        if (link.getAttribute('data-scroll-to') === currentSection) {
            link.classList.add('underline', 'font-bold', 'text-blue-700');
        }
    });
}, 100);

// Section loading states
function setLoadingState(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = isLoading ? '0.5' : '1';
        element.style.pointerEvents = isLoading ? 'none' : 'auto';
    }
}

// Fetch functions with loading states
async function fetchPersonalInfo() {
    setLoadingState('personal-info', true);
    try {
        const info = await fetchAPI('/api/personal-info');
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
        showError(`Failed to fetch personal info`);
    } finally {
        setLoadingState('personal-info', false);
    }
}

async function fetchProjects() {
    setLoadingState('projects', true);
    try {
        const projects = await fetchAPI('/api/projects');
        const projectsContainer = document.getElementById('projects-list');
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item border p-4 mb-4 rounded';
            projectDiv.innerHTML = `
                <h3 class="font-bold text-lg">${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" target="_blank" class="text-blue-500">View Project</a>
            `;
            projectsContainer.appendChild(projectDiv);
        });
    } catch (error) {
        showError(`Failed to fetch projects`);
    } finally {
        setLoadingState('projects', false);
    }
}

async function fetchSkills() {
    setLoadingState('skills', true);
    try {
        const skills = await fetchAPI('/api/skills');
        const skillsContainer = document.getElementById('skills-list');
        skillsContainer.innerHTML = '';
        skills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item border p-4 mb-4 rounded';
            skillDiv.innerHTML = `
                <h3 class="font-bold text-lg">${skill.skill_name}</h3>
            `;
            skillsContainer.appendChild(skillDiv);
        });
    } catch (error) {
        showError(`Failed to fetch skills`);
    } finally {
        setLoadingState('skills', false);
    }
}

async function fetchContactInfo() {
    setLoadingState('contact-info', true);
    try {
        const info = await fetchAPI('/api/personal-info');
        const contactContainer = document.getElementById('contact-info');
        contactContainer.innerHTML = `
            <h3 class="font-bold text-lg">Contact Information</h3>
            <p>Email: ${info.email}</p>
            <p>LinkedIn: ${info.linkedin || 'Not provided'}</p>
        `;
    } catch (error) {
        showError(`Failed to fetch contact info`);
    } finally {
        setLoadingState('contact-info', false);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-scroll-to]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-scroll-to');
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });

            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const navbarItem = document.getElementById('navbar-item');
        if (window.scrollY > 10) {
            navbar.classList.remove('text-white');
            navbar.classList.add('bg-white', 'text-black');
            navbarItem.classList.remove('border-b-2', 'border-dashed', 'border-white','md:h-24');
            navbarItem.classList.add('md:h-16');
        } else {
            navbar.classList.remove('bg-white', 'text-black');
            navbar.classList.add('text-white');
            navbarItem.classList.remove('md:h-16');
            navbarItem.classList.add('md:h-24', 'border-b-2', 'border-dashed', 'border-white');
        }
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
