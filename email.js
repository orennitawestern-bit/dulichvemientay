(function() {
  // Initialize EmailJS with your public key
  emailjs.init("OkCNQNl-or1BkmyJV"); // Replace with your actual EmailJS public key
})();

async function handleContactSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const spinner = submitBtn.querySelector('.spinner-border');
  const btnText = submitBtn.querySelector('.btn-text');
  
  // Show loading state
  spinner.classList.remove('d-none');
  btnText.textContent = 'Đang gửi...';
  submitBtn.disabled = true;

  const form = event.target;
  // Use FormData to reliably get values (avoid shadowing HTMLFormElement.name)
  const fd = new FormData(form);
  const from_name = (fd.get('name') || '').toString().trim();
  const from_email = (fd.get('email') || '').toString().trim();
  const from_phone = (fd.get('phone') || '').toString().trim();
  const message = (fd.get('message') || '').toString().trim();

  // Basic client-side validation
  if (!from_name || !from_email || !message) {
    alert('Vui lòng điền họ tên, email và nội dung phản hồi.');
    // Reset button state if validation fails
    spinner.classList.add('d-none');
    btnText.textContent = 'Gửi yêu cầu';
    submitBtn.disabled = false;
    return false;
  }

  const templateParams = {
    name: from_name,
    email: from_email,
    phone: from_phone,
    message,
    tour_code: 'NDSGN574'
  };

  try {
    // Send email using EmailJS
    await emailjs.send(
      'service_eou9jod', // Replace with your EmailJS service ID
      'template_9bum4nc', // Replace with your EmailJS template ID
      templateParams
    );

    // Success
    form.reset();
    alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.');
    
  // Close modal (match the modal id in the HTML)
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalContact'));
  if (modal) modal.hide();
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
  } finally {
    // Reset button state
    spinner.classList.add('d-none');
    btnText.textContent = 'Gửi yêu cầu';
    submitBtn.disabled = false;
  }

  return false;
}