function btn() {
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('errorMessage'); 
    const errorText = errorMessage.querySelector('span');
    const emailValue = emailInput.value.trim().toLowerCase();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|icloud|mail|[a-zA-Z0-9.-]+)\.com$/i;
    const allUserAccounts = JSON.parse(localStorage.getItem('allUserAccounts')) || [];
    const existingAccount = allUserAccounts.find(account => account.email === emailValue);
    const isCompletedAccount = existingAccount && existingAccount.firstName && existingAccount.password;
    
    if (emailValue === '') {
        setTimeout(() => {
            errorText.innerText = "Enter your email address.";
            errorMessage.style.display = 'block';
            emailInput.classList.add('error-field');
        }, 100); 
    } 

    else if (emailPattern.test(emailValue) === false) {
        setTimeout(() => {
            errorText.innerText = "Please check your email address.";
            errorMessage.style.display = 'block';
            emailInput.classList.add('error-field');
        }, 100); 
    } 

    else if (isCompletedAccount) {
        setTimeout(() => {
            errorText.innerText = "This email already has an account. Please sign in.";
            errorMessage.style.display = 'block';
            emailInput.classList.add('error-field');
        }, 100); 
    }

    else {
        errorMessage.style.display = 'none';
        emailInput.classList.remove('error-field');

        const signupData = {
            ...(existingAccount || {}),
            email: emailValue,
            isGoogleAuth: false
        };

        localStorage.setItem('userData', JSON.stringify(signupData));
        localStorage.setItem('userEmail', emailValue);

        if (window.showLoaderAndRedirect) {
            window.showLoaderAndRedirect("verificationpage.html");
        } else {
            window.location.href = "verificationpage.html";
        }
    }
}

  
    
  
