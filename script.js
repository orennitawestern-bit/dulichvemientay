// Init AOS
    AOS.init({ duration:700, offset:100, once:true });

    // Progress bar logic
    const progress = document.getElementById('readingProgress');
    function updateProgress(){
      const h = document.documentElement;
      const docHeight = h.scrollHeight - h.clientHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      progress.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }
    window.addEventListener('scroll', updateProgress);
    updateProgress();

    // Nav scroll shadow toggle
    const nav = document.querySelector('.nav-scroll');
    window.addEventListener('scroll', () => {
      if(window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    });

    // Smooth scroll + active state on click
    document.querySelectorAll('.scroll-link').forEach(link=>{
      link.addEventListener('click', function(e){
        e.preventDefault();
        document.querySelectorAll('.scroll-link').forEach(a=>a.classList.remove('active'));
        this.classList.add('active');
        const target = document.querySelector(this.getAttribute('href'));
        if(!target) return;
        const topOffset = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      });
    });

    // IntersectionObserver to update nav active on scroll
    const sections = document.querySelectorAll('#tongquan, #lichtrinh, #luuy, #reviews, #map, #chuongtrinhkhac');
    const navLinks = document.querySelectorAll('.scroll-link');
    const obsOpts = { root:null, rootMargin:'-30% 0px -40% 0px', threshold:0 };
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          navLinks.forEach(a=>{
            if(a.getAttribute('href') === '#'+id) a.classList.add('active'); else a.classList.remove('active');
          });
        }
      });
    }, obsOpts);
    sections.forEach(s=> s && obs.observe(s));

    // Back to top
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', ()=> backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none');
    backBtn.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

    // Booking modal -> success modal with nice animation
    document.getElementById('btnConfirm').addEventListener('click', function(){
      const date = document.getElementById('bookDate').value;
      const qty = document.getElementById('bookQty').value;
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      if(!date || !qty || !name || !phone){
        // show inline validation simple
        alert('Vui lòng điền đầy đủ thông tin đặt tour.');
        return;
      }
      // Build booking object and persist
      const booking = createBooking({ date, qty, name, phone, tour_code: 'NDSGN574' });

      saveBooking(booking);

      // Close booking modal and show success modal with booking code
      const bookModalEl = document.getElementById('modalBooking');
      const bookModal = bootstrap.Modal.getInstance(bookModalEl) || new bootstrap.Modal(bookModalEl);
      bookModal.hide();

      const successModalEl = document.getElementById('modalSuccess');
      const successModal = new bootstrap.Modal(successModalEl);
      // set booking code in success modal
      const codeSpan = document.getElementById('successBookingCode');
      if (codeSpan) codeSpan.textContent = booking.code;
      successModal.show();
    });

    // Lightbox logic (click any carousel image with .lb-img)
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    document.querySelectorAll('.lb-img').forEach(img=>{
      img.addEventListener('click', function(){
        lbImg.src = this.src;
        lbImg.alt = this.alt || '';
        lbCaption.textContent = this.dataset.caption || '';
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden','false');
      });
    });
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox || e.target === lbImg){
        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden','true');
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') { lightbox.style.display = 'none'; lightbox.setAttribute('aria-hidden','true'); }
    });

    // Initialize chat widget elements
    const chatBtn = document.getElementById('chatBtn');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    if (!chatBtn || !chatPanel || !chatClose || !chatSend || !chatInput || !chatBody) {
        console.error('Chat elements not found');
    }


    chatBtn.addEventListener('click', () => {
  // CSS should define .open { display: flex; } and default hidden in stylesheet
  const opened = chatPanel.classList.toggle('open'); // true = panel is now open
  chatPanel.setAttribute('aria-hidden', String(!opened));
  chatBtn.setAttribute('aria-expanded', String(opened));

  if (opened) {
    const focusable = chatPanel.querySelector('input, textarea, button, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
  } else {
    chatBtn.focus();
  }
});
    // Handle closing the chat panel
    chatClose.addEventListener('click', () => {
        hidePanel();
    });

    // Set up chat send functionality
    chatSend.addEventListener('click', sendChat);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChat();
    });

    // Function to hide the chat panel
    function hidePanel() {
        chatPanel.classList.remove('open');
        chatPanel.setAttribute('aria-hidden', 'true');
        chatBtn.setAttribute('aria-expanded', 'false');
        chatBtn.focus();
    }

    // Function to create a message element
    function createMessageElement(text, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.style.textAlign = isUser ? 'right' : 'left';
        messageDiv.style.marginBottom = '8px';
        
        const messageBubble = `
            <div style="display:inline-block;
                        background:${isUser ? '#e9f2ff' : '#fff'};
                        padding:8px;
                        border-radius:8px;">
                ${escapeHtml(text)}
            </div>`;
        
        messageDiv.innerHTML = messageBubble;
        return messageDiv;
    }

    // Function to handle sending chat messages
    function sendChat() {
        // Get and validate input
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Create and add user message
        const userMessage = createMessageElement(messageText, true);
        chatBody.appendChild(userMessage);

        // Clear input and scroll to bottom
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
      // simulated reply
      setTimeout(()=> {
        const botMsg = document.createElement('div');
        botMsg.style.textAlign = 'left';
        botMsg.style.marginBottom = '8px';
        botMsg.innerHTML = '<div style="display:inline-block;background:#fff;padding:8px;border-radius:8px;border:1px solid #eef4ff;">Cám ơn quý khách. Chúng tôi sẽ phản hồi sớm nhất (trong giờ hành chính).</div>';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      },800);
    }
    function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

    /* Booking persistence helpers */
    function generateBookingCode() {
      // Simple code: BK- + 6 uppercase alnum
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let out = 'BK-';
      for (let i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
      return out;
    }

    // Generate a unique booking code by checking existing bookings in localStorage
    function generateUniqueBookingCode(maxAttempts = 1000) {
      const raw = localStorage.getItem('bookings');
      const arr = raw ? JSON.parse(raw) : [];
      const existing = new Set(arr.map(b => b.code));
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const code = generateBookingCode();
        if (!existing.has(code)) return code;
      }
      // Fallback: use timestamp-based code to guarantee uniqueness
      return 'BK-T' + Date.now().toString(36).toUpperCase();
    }

    function createBooking({ date, qty, name, phone, tour_code }){
      const code = generateUniqueBookingCode();
      return {
        code,
        tour_code: tour_code || 'NDSGN574',
        date,
        qty: Number(qty) || 1,
        name,
        phone,
        createdAt: new Date().toISOString()
      };
    }

    function saveBooking(booking){
      // save to localStorage
      try {
        const raw = localStorage.getItem('bookings');
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(booking);
        localStorage.setItem('bookings', JSON.stringify(arr));
        // Also trigger a download of bookings.json so user can keep a file copy
        downloadBookings(arr);
        console.log('Booking saved', booking);
      } catch (e) {
        console.error('Failed to save booking', e);
      }
    }

    function downloadBookings(bookings){
      try {
        const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) { console.error('Download failed', e); }
    }

    // Lookup booking by code (UI hookup below)
    function lookupBooking(code){
      const raw = localStorage.getItem('bookings');
      const arr = raw ? JSON.parse(raw) : [];
      return arr.find(b => b.code === (code || '').trim());
    }

    // Wire lookup UI (footer) — load modal from external fragment and show populated modal
    const lookupBtn = document.getElementById('lookupBtn');
    const lookupInput = document.getElementById('lookupCode');

    // Load the lookup modal fragment (if available) and inject into the DOM
    async function loadLookupModal(){
      try{
        // only fetch if not already present
        if (document.getElementById('modalLookup')) return;
        const resp = await fetch('lookup-modal.html', { cache: 'no-store' });
        if (!resp.ok) return console.warn('Lookup modal not found:', resp.status);
        const html = await resp.text();
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
      } catch (e){ console.error('Failed to load lookup modal', e); }
    }

    // preload modal (best-effort)
    loadLookupModal();

    if (lookupBtn && lookupInput) {
      lookupBtn.addEventListener('click', async function(){
        const code = lookupInput.value.trim();
        if (!code) { alert('Vui lòng nhập mã booking cần tra cứu.'); return; }
        const found = lookupBooking(code);
        if (!found) { alert('Không tìm thấy booking với mã này.'); return; }

        // Ensure modal exists (try to load if missing)
        if (!document.getElementById('modalLookup')){
          await loadLookupModal();
        }
        const modalEl = document.getElementById('modalLookup');
        if (!modalEl) { alert('Không thể hiển thị chi tiết.'); return; }

        // Populate modal fields
        const set = (id, v)=>{ const el = document.getElementById(id); if(el) el.textContent = v || '-'; };
        set('lmCode', found.code);
        set('lmTour', found.tour_code);
        set('lmDate', found.date);
        set('lmQty', String(found.qty));
        set('lmName', found.name);
        set('lmPhone', found.phone);
        set('lmCreated', new Date(found.createdAt).toLocaleString());

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
      });
    }

    // Contact form is handled by `handleContactSubmit` in email.js (EmailJS).
    // We avoid adding a duplicate submit handler here to prevent conflicts.

    // End script