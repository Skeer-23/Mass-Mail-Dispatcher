let validEmails = [];

function sendEmails() {
    const csvInput = document.getElementById("csvFile").files[0];

    if (!csvInput) {
        alert("Please upload a csv file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const csvContent = event.target.result;
        const rows = csvContent.split("\n");
        const invalidEmails = [];

        validEmails = [];  // Reset valid emails each time we process the CSV file

        rows.forEach(row => {
            const emails = row.trim().split(/[,\t]+/);

            emails.forEach(email => {
                email = email.trim();
                if (email == "") return;

                // Email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (emailRegex.test(email)) {
                    validEmails.push(email); // Add to valid emails array
                } else {
                    invalidEmails.push(email); // Add to invalid emails array
                }
            });
        });

        // Update valid and invalid email count
        document.getElementById('validEmailCount').textContent = validEmails.length;
        document.getElementById('invalidEmailCount').textContent = invalidEmails.length;

        // Display valid emails as a list
        document.getElementById('validEmails').innerHTML = validEmails
            .map(email => `<div>${email}</div>`)
            .join("");

        // Display invalid emails as a list
        document.getElementById('invalidEmails').innerHTML = invalidEmails
            .map(email => `<div>${email}</div>`)
            .join("");

        // Enable the "Send Email" button if there are valid emails
        document.getElementById("sendButton").disabled = validEmails.length === 0;
    };

    reader.readAsText(csvInput);
}

function sendMailToUsers() {
    if (validEmails.length === 0) {
        alert("No valid emails to send!");
        return;
    }

    // Get the predefined subject and message from input fields
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    if (!subject || !message) {
        alert("Subject and message are required!");
        return;
    }

    // Example using EmailJS (replace with your own service if needed)
    validEmails.forEach((email) => {
        const templateParams = {
            to_name: email,
            from_name: "Your Name",
            message: message,
            subject: subject,
        };

        emailjs
            .send("default_service", "template_643tkoo", templateParams)
            .then(
                (response) => {
                    console.log("Email sent successfully to", email, response);
                },
                (error) => {
                    console.log("Failed to send email to", email, error);
                }
            );
    });

    alert("Emails have been sent to valid addresses!");
}
