
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.tabs button');
        const forms = document.querySelectorAll('.registration-form');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const targetForm = document.getElementById(button.getAttribute('data-target'));

                // Hide all forms
                forms.forEach(form => form.style.display = 'none');

                // Show the target form
                targetForm.style.display = 'block';

                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));

                // Add active class to the clicked button
                button.classList.add('active');
            });
        });
    });
