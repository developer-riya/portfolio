// Frontend JS for portfolio
// - renders projects
// - handles theme toggle
// - handles navbar toggle and scroll effects
// - validates and submits contact form

document.addEventListener('DOMContentLoaded', () => {
  // Simple projects array; add your projects here
  // Projects pulled strictly from resume1 — GitHub links point to profile
  const projects = [
    {title: 'Finvoice (Aug 2025)', desc: 'Added voice bot and chatbot; implemented monthly expenditure tracking.', github:'https://github.com/developer-riya'},
    {title: 'Mobile Company Data Analysis (2025)', desc: 'Compared mobile brand prices year-wise.', github:'https://github.com/developer-riya'},
    {title: 'Portfolio Website (Sep 2024)', desc: 'Designed and deployed a personal portfolio website.', github:'https://github.com/developer-riya'},
    {title: 'Weather Detection App (Feb 2025)', desc: 'Python-based app using APIs for real-time weather updates.', github:'https://github.com/developer-riya'},
    {title: 'Book Storage System (Dec 2024)', desc: 'Web-based book cataloging system using HTML & CSS.', github:'https://github.com/developer-riya'},
    {title: 'Rock Paper Scissors Game', desc: 'Python-based logic-driven game.', github:'https://github.com/developer-riya'}
  ];

  // Render projects dynamically
  const projectsGrid = document.getElementById('projects-grid');
  projects.forEach(p => {
    const el = document.createElement('article');
    el.className = 'project reveal';
    // Build project card markup with safe links and attributes
    el.innerHTML = `
      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.desc)}</p>
      <div class="links">
        <a href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="${p.demo || '#'}" target="_blank" rel="noopener noreferrer">Live Demo</a>
      </div>`;
    projectsGrid.appendChild(el);
  });

  // Escape helper
  function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved) root.setAttribute('data-theme', saved);
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Navbar toggle for small screens
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  navToggle.addEventListener('click', ()=> navList.classList.toggle('show'));

  // Sticky nav shadow on scroll
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = a.getAttribute('href');
      if(target.length>1){
        e.preventDefault();
        document.querySelector(target).scrollIntoView({behavior:'smooth',block:'start'});
        if(navList.classList.contains('show')) navList.classList.remove('show');
      }
    });
  });

  // Reveal on scroll (IntersectionObserver)
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('show');
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  // Contact form handling
  const form = document.getElementById('contact-form');
  const loader = document.getElementById('form-loader');
  const alertBox = document.getElementById('form-alert');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    alertBox.textContent='';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Simple front-end validation
    if(!name || !email || !message){
      alertBox.textContent='Please fill in all fields.'; return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      alertBox.textContent='Please enter a valid email.'; return;
    }

    // Show loader
    loader.classList.remove('hidden');

    try{
      const res = await fetch('/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name,email,message})
      });
      const data = await res.json();
      if(res.ok){
        alertBox.textContent = data.message || 'Message sent — thank you!';
        form.reset();
      } else {
        alertBox.textContent = data.error || 'Could not send message.';
      }
    }catch(err){
      alertBox.textContent = 'Network error, please try later.';
    }finally{
      loader.classList.add('hidden');
    }
  });

  // set current year
  document.getElementById('year').textContent = new Date().getFullYear();
});
