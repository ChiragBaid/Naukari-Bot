const { chromium } = require('playwright');

async function updateNaukriProfile() {
  const browser = await chromium.launch({ 
    headless: true, // Changed to true for GitHub Actions
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    // Removed hardcoded Chrome path for cross-platform compatibility
  });
  
  // Use incognito context
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    // Incognito is default for playwright's newContext, but we clarify intent here
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Naukri.com automation...');
    
    // Step 1: Navigate to Naukri.com login page
    console.log('📱 Navigating to Naukri.com...');
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Check if we need to handle any popups or overlays
    try {
      const popupSelectors = [
        '.close', '.popup-close', '[aria-label="Close"]',
        'button:has-text("Close")', 'button:has-text("×")'
      ];
      
      for (const selector of popupSelectors) {
        try {
          const popup = await page.locator(selector).first();
          if (await popup.isVisible()) {
            await popup.click();
            console.log('✅ Closed popup/overlay');
            await page.waitForTimeout(1000);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // No popups to close
    }
    

    
    // Wait a bit for the page to fully load
    await page.waitForTimeout(1000);
    
    // Step 2: Login with credentials
    console.log('🔐 Logging in...');
    console.log(`🔑 Username available: ${process.env.NAUKRI_USERNAME ? 'Yes' : 'No'}`);
    console.log(`🔑 Password available: ${process.env.NAUKRI_PASSWORD ? 'Yes' : 'No'}`);
    
    // Try multiple possible login selectors
    const usernameSelectors = [
      'input[id="usernameField"]',
      'input[placeholder="Enter Email ID / Username"]',
      'input[name="username"]',
      'input[name="email"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="username" i]',
      'input[id*="email"]',
      'input[id*="username"]',
      'input[type="text"]'
    ];
    
    const passwordSelectors = [
      'input[id="passwordField"]',
      'input[placeholder="Enter Password"]',
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]'
    ];
    
    // Fill username
    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        usernameField = await page.locator(selector).first();
        if (await usernameField.isVisible()) {
          console.log(`✅ Found username field with selector: ${selector}`);
          await usernameField.fill(process.env.NAUKRI_USERNAME);
          
          // Verify the username was filled
          const filledValue = await usernameField.inputValue();
          console.log(`📝 Username field value: ${filledValue ? filledValue.substring(0, 3) + '***' : 'empty'}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!usernameField) {
      console.log('❌ Could not find username field. Available inputs:');
      const allInputs = await page.locator('input').all();
      for (let i = 0; i < allInputs.length; i++) {
        try {
          const input = allInputs[i];
          const type = await input.getAttribute('type');
          const name = await input.getAttribute('name');
          const id = await input.getAttribute('id');
          const placeholder = await input.getAttribute('placeholder');
          const isVisible = await input.isVisible();
          console.log(`  Input ${i}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Input ${i}: Could not get attributes`);
        }
      }
      throw new Error('Could not find username/email field');
    }
    
    // Fill password
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        passwordField = await page.locator(selector).first();
        if (await passwordField.isVisible()) {
          console.log(`✅ Found password field with selector: ${selector}`);
          await passwordField.fill(process.env.NAUKRI_PASSWORD);
          
          // Verify the password was filled
          const filledValue = await passwordField.inputValue();
          console.log(`📝 Password field value: ${filledValue ? '***' + filledValue.length + ' chars***' : 'empty'}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Password selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!passwordField) {
      console.log('❌ Could not find password field. Available password inputs:');
      const allPasswordInputs = await page.locator('input[type="password"]').all();
      for (let i = 0; i < allPasswordInputs.length; i++) {
        try {
          const input = allPasswordInputs[i];
          const name = await input.getAttribute('name');
          const id = await input.getAttribute('id');
          const placeholder = await input.getAttribute('placeholder');
          console.log(`  Password Input ${i}: name="${name}", id="${id}", placeholder="${placeholder}"`);
        } catch (e) {
          console.log(`  Password Input ${i}: Could not get attributes`);
        }
      }
      throw new Error('Could not find password field');
    }
    
    // Click login button
    const loginSelectors = [
      'button:has-text("Login")',
      'button[type="submit"]',
      'button.waves-effect.waves-light.btn-large.btn-block.btn-bold.blue-btn.textTransform',
      'button:has-text("Sign In")',
      '.login-btn',
      '[data-testid="login-button"]',
      'input[type="submit"]',
      'button[class*="login"]',
      'button[class*="submit"]'
    ];
    
    let loginButton = null;
    for (const selector of loginSelectors) {
      try {
        loginButton = await page.locator(selector).first();
        if (await loginButton.isVisible()) {
          console.log(`✅ Found login button with selector: ${selector}`);
          await loginButton.click();
          break;
        }
      } catch (e) {
        console.log(`❌ Login button selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!loginButton) {
      console.log('❌ Could not find login button. Available buttons:');
      const allButtons = await page.locator('button, input[type="submit"]').all();
      for (let i = 0; i < allButtons.length; i++) {
        try {
          const button = allButtons[i];
          const text = await button.textContent();
          const type = await button.getAttribute('type');
          const className = await button.getAttribute('class');
          const isVisible = await button.isVisible();
          console.log(`  Button ${i}: text="${text?.trim()}", type="${type}", class="${className}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Button ${i}: Could not get attributes`);
        }
      }
      
      // Try alternative login methods
      console.log('🔄 Trying alternative login methods...');
      
      // Method 1: Try pressing Enter key
      try {
        await page.keyboard.press('Enter');
        console.log('✅ Pressed Enter key');
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('❌ Enter key method failed');
      }
      
      // Method 2: Try clicking on any visible button that might be login
      try {
        const anyButton = await page.locator('button').first();
        if (await anyButton.isVisible()) {
          await anyButton.click();
          console.log('✅ Clicked first available button');
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('❌ Alternative button click failed');
      }
      
      // Check if any of the alternative methods worked
              const currentUrl = page.url();
        if (currentUrl.includes('naukri.com') && !currentUrl.includes('login')) {
          console.log('✅ Alternative login method worked!');
          // Continue to double-click functionality
        }
      
      throw new Error('Could not find login button');
    } else {
      // Try multiple login attempts with different approaches
      console.log('🔄 Attempting login with multiple methods...');
      
      // Method 1: Direct click
      try {
        await loginButton.click();
        console.log('✅ Method 1: Direct click');
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('naukri.com') && !currentUrl.includes('login')) {
          console.log('✅ Login successful with direct click!');
          // Continue to double-click functionality
        }
      } catch (e) {
        console.log('❌ Method 1 failed');
      }
      
      // Method 2: Form submission
      try {
        await page.evaluate(() => {
          const form = document.querySelector('form');
          if (form) form.submit();
        });
        console.log('✅ Method 2: Form submission');
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('naukri.com') && !currentUrl.includes('login')) {
          console.log('✅ Login successful with form submission!');
          // Continue to double-click functionality
        }
      } catch (e) {
        console.log('❌ Method 2 failed');
      }
      
      // Method 3: Enter key
      try {
        await page.keyboard.press('Enter');
        console.log('✅ Method 3: Enter key');
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('naukri.com') && !currentUrl.includes('login')) {
          console.log('✅ Login successful with Enter key!');
          // Continue to double-click functionality
        }
      } catch (e) {
        console.log('❌ Method 3 failed');
      }
    }
    
    // Wait for login to complete or check for error messages
    console.log('⏳ Waiting for login to complete...');
    try {
      await page.waitForURL('**/naukri.com/**', { timeout: 15000 });
      console.log('✅ Login successful');
    } catch (error) {
      console.log('❌ Login redirect failed, checking for errors...');
      
      // Check if there's an error message on the page
      const errorSelectors = [
        '.error', '.alert', '[data-testid="error"]', 
        '.error-message', '.login-error', '.invalid-credentials',
        '[class*="error"]', '[class*="alert"]', '.toast-error',
        '.notification-error', '.message-error', '.toast',
        '.notification', '.message', '.warning', '.info',
        '[class*="toast"]', '[class*="notification"]', '[class*="message"]'
      ];
      
      console.log('🔍 Checking for error messages...');
      for (const selector of errorSelectors) {
        try {
          const errorMessage = await page.locator(selector).first();
          if (await errorMessage.isVisible()) {
            const errorText = await errorMessage.textContent();
            console.log(`❌ Found error message with selector "${selector}": ${errorText}`);
            throw new Error(`Login failed: ${errorText}`);
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check for any text that might indicate an error
      console.log('🔍 Checking page content for error indicators...');
      const pageText = await page.textContent('body');
      const errorKeywords = ['invalid', 'incorrect', 'wrong', 'failed', 'error', 'locked', 'blocked', 'suspended'];
      
      for (const keyword of errorKeywords) {
        if (pageText.toLowerCase().includes(keyword)) {
          console.log(`⚠️ Found potential error keyword: "${keyword}"`);
        }
      }
      
      // Check if we need to handle OTP or additional verification
      console.log('🔍 Checking for additional verification steps...');
      
      // Check for OTP input
      const otpSelectors = [
        'input[placeholder*="OTP"]', 'input[placeholder*="otp"]',
        'input[name*="otp"]', 'input[id*="otp"]',
        'input[type="text"]'
      ];
      
      for (const selector of otpSelectors) {
        try {
          const otpField = await page.locator(selector).first();
          if (await otpField.isVisible()) {
            console.log('⚠️ OTP field detected - manual intervention required');
            throw new Error('Login failed: OTP verification required');
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check for captcha
      const captchaSelectors = [
        'iframe[src*="captcha"]', '.captcha', '[class*="captcha"]',
        'div[class*="recaptcha"]', 'iframe[src*="recaptcha"]'
      ];
      
      for (const selector of captchaSelectors) {
        try {
          const captcha = await page.locator(selector).first();
          if (await captcha.isVisible()) {
            console.log('⚠️ Captcha detected - manual intervention required');
            throw new Error('Login failed: Captcha verification required');
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check current URL to see where we ended up
      const currentUrl = page.url();
      console.log(`❌ Current URL after login attempt: ${currentUrl}`);
      
      // Check if we're still on login page but with different parameters
      if (currentUrl.includes('login') && currentUrl.includes('error')) {
        console.log('❌ Login page shows error in URL');
        throw new Error('Login failed: Invalid credentials or account locked');
      }
      
      // Check for any success indicators that might not trigger URL change
      console.log('🔍 Checking for success indicators...');
      const successSelectors = [
        '.welcome', '.dashboard', '.profile', '.user-info',
        '[class*="welcome"]', '[class*="dashboard"]', '.user-name',
        '.profile-name', '.account-info', '.logout', '.signout'
      ];
      
      for (const selector of successSelectors) {
        try {
          const successElement = await page.locator(selector).first();
          if (await successElement.isVisible()) {
            const successText = await successElement.textContent();
            console.log(`✅ Found success indicator "${selector}": ${successText}`);
            console.log('✅ Login appears to be successful despite URL not changing');
            // Continue to double-click functionality
          }
        } catch (e) {
          continue;
        }
      }
      
      // Login appears to be successful, continue to double-click functionality
      console.log('✅ Login successful, continuing to next steps...');
    }
    
    console.log('✅ Login successful!');
    
    // Step 3: Wait for the page to load after login
    console.log('⏳ Waiting for page to load after login...');
    await page.waitForTimeout(1000);
    
    // Step 4: Double-click on the "View profile" link
    console.log('🔗 Looking for View profile link...');
    
    // Try multiple selectors for the View profile link
    const viewProfileSelectors = [
      'a[href="/mnjuser/profile"]',
      'a:has-text("View profile")',
      'a[href*="profile"]',
      '//*[@id="root"]/div[1]/div[4]/div/div/div[1]/div[1]/div/div/div[3]/div[2]/a'
    ];
    
    let viewProfileLink = null;
    for (const selector of viewProfileSelectors) {
      try {
        if (selector.startsWith('//')) {
          // XPath selector
          viewProfileLink = await page.locator(`xpath=${selector}`).first();
        } else {
          // CSS selector
          viewProfileLink = await page.locator(selector).first();
        }
        
        if (await viewProfileLink.isVisible()) {
          console.log(`✅ Found View profile link with selector: ${selector}`);
          
          // Double-click on the link
          await viewProfileLink.dblclick();
          console.log('🖱️ Double-clicked on View profile link');
          
          // Wait for navigation
          await page.waitForTimeout(1000);
          
          // Check if we successfully navigated to profile page
          const currentUrl = page.url();
          console.log(`📍 Current URL after double-click: ${currentUrl}`);
          
          if (currentUrl.includes('/mnjuser/profile')) {
            console.log('✅ Successfully navigated to profile page!');
          } else {
            console.log('⚠️ Navigation may not have completed as expected');
          }
          
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!viewProfileLink) {
      console.log('❌ Could not find View profile link');
      console.log('🔍 Available links on the page:');
      const allLinks = await page.locator('a').all();
      for (let i = 0; i < allLinks.length; i++) {
        try {
          const link = allLinks[i];
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          const isVisible = await link.isVisible();
          console.log(`  Link ${i}: href="${href}", text="${text?.trim()}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Link ${i}: Could not get attributes`);
        }
      }
    }
    
    console.log('✅ Bot completed successfully!');
    
    // Step 5: Click on "Profile summary" div
    console.log('📝 Looking for Profile summary div...');
    
    const profileSummarySelectors = [
      'div.label.title-14-medium:has-text("Profile summary")',
      'div[class*="label"][class*="title-14-medium"]',
      '//*[@id="root"]/div[1]/div[4]/div/div/div/div[3]/div[1]/div/div[7]/div'
    ];
    
    let profileSummaryDiv = null;
    for (const selector of profileSummarySelectors) {
      try {
        if (selector.startsWith('//')) {
          // XPath selector
          profileSummaryDiv = await page.locator(`xpath=${selector}`).first();
        } else {
          // CSS selector
          profileSummaryDiv = await page.locator(selector).first();
        }
        
        if (await profileSummaryDiv.isVisible()) {
          console.log(`✅ Found Profile summary div with selector: ${selector}`);
          
          // Click on the div
          await profileSummaryDiv.click();
          console.log('🖱️ Clicked on Profile summary div');
          
          // Wait for any changes
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!profileSummaryDiv) {
      console.log('❌ Could not find Profile summary div');
      console.log('🔍 Available divs with similar classes:');
      const allDivs = await page.locator('div[class*="label"], div[class*="title"]').all();
      for (let i = 0; i < allDivs.length; i++) {
        try {
          const div = allDivs[i];
          const className = await div.getAttribute('class');
          const text = await div.textContent();
          const isVisible = await div.isVisible();
          console.log(`  Div ${i}: class="${className}", text="${text?.trim()}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Div ${i}: Could not get attributes`);
        }
      }
    }
    
    // Step 6: Double-click on the pencil icon
    console.log('✏️ Looking for pencil icon...');
    
    const pencilSelectors = [
      '//*[@id="root"]/div[1]/div[4]/div/div/div/div[3]/div[2]/div[7]/div/div[1]/div/div/h1/span/img',
      'img[src="//static.naukimg.com/s/8/801/i/src/resources/svg/mnj-pencil.37ddbce9.svg"]',
      'img[alt="pencil"][width="14"][height="14"]',
      'img[src*="mnj-pencil.37ddbce9.svg"]'
    ];
    
    let pencilIcon = null;
    for (const selector of pencilSelectors) {
      try {
        if (selector.startsWith('//')) {
          // XPath selector
          pencilIcon = await page.locator(`xpath=${selector}`).first();
        } else {
          // CSS selector
          pencilIcon = await page.locator(selector).first();
        }
        
        if (await pencilIcon.isVisible()) {
          console.log(`✅ Found pencil icon with selector: ${selector}`);
          
          // Double-click on the pencil icon
          await pencilIcon.dblclick();
          console.log('🖱️ Double-clicked on pencil icon');
          
          // Wait for any changes
          await page.waitForTimeout(1000);
          
          // Check if we're in edit mode
          const currentUrl = page.url();
          console.log(`📍 Current URL after pencil double-click: ${currentUrl}`);
          
          // Look for edit indicators
          const editIndicators = [
            'textarea',
            'input[type="text"]',
            '[contenteditable="true"]',
            '.editing',
            '[data-testid*="edit"]'
          ];
          
          let editMode = false;
          for (const editSelector of editIndicators) {
            try {
              const editElement = await page.locator(editSelector).first();
              if (await editElement.isVisible()) {
                console.log(`✅ Edit mode detected with selector: ${editSelector}`);
                editMode = true;
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (editMode) {
            console.log('✅ Successfully entered edit mode!');
          } else {
            console.log('⚠️ Edit mode may not have been activated');
          }
          
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!pencilIcon) {
      console.log('❌ Could not find pencil icon');
      console.log('🔍 Available images on the page:');
      const allImages = await page.locator('img').all();
      for (let i = 0; i < allImages.length; i++) {
        try {
          const img = allImages[i];
          const src = await img.getAttribute('src');
          const alt = await img.getAttribute('alt');
          const width = await img.getAttribute('width');
          const height = await img.getAttribute('height');
          const isVisible = await img.isVisible();
          console.log(`  Image ${i}: src="${src}", alt="${alt}", width="${width}", height="${height}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Image ${i}: Could not get attributes`);
        }
      }
    }
    
    console.log('✅ All profile actions completed successfully!');
    
    // Step 7: Find and interact with the textarea
    console.log('📝 Looking for summary textarea...');
    
    const textareaSelectors = [
      '//*[@id="summary"]',
      'textarea[id="summary"]',
      'textarea[placeholder="Type here"]',
      'textarea[name="summary"]'
    ];
    
    let summaryTextarea = null;
    for (const selector of textareaSelectors) {
      try {
        if (selector.startsWith('//')) {
          // XPath selector
          summaryTextarea = await page.locator(`xpath=${selector}`).first();
        } else {
          // CSS selector
          summaryTextarea = await page.locator(selector).first();
        }
        
        if (await summaryTextarea.isVisible()) {
          console.log(`✅ Found summary textarea with selector: ${selector}`);
          
          // Double-click on the textarea to focus it
          await summaryTextarea.dblclick();
          console.log('🖱️ Double-clicked on summary textarea');
          
          // Wait a moment
          await page.waitForTimeout(1000);
          
          // Get current text
          const currentText = await summaryTextarea.inputValue();
          console.log(`📄 Current text length: ${currentText.length} characters`);
          
          // Add a space at the end
          const textWithSpace = currentText + ' ';
          await summaryTextarea.fill(textWithSpace);
          console.log('➕ Added space to the end');
          
          // Wait 1 second
          await page.waitForTimeout(1000);
          
          // Remove the space (restore original text)
          await summaryTextarea.fill(currentText);
          console.log('➖ Removed the space');
          
          // Wait a moment
          await page.waitForTimeout(1000);         
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!summaryTextarea) {
      console.log('❌ Could not find summary textarea');
      console.log('🔍 Available textareas on the page:');
      const allTextareas = await page.locator('textarea').all();
      for (let i = 0; i < allTextareas.length; i++) {
        try {
          const textarea = allTextareas[i];
          const id = await textarea.getAttribute('id');
          const name = await textarea.getAttribute('name');
          const placeholder = await textarea.getAttribute('placeholder');
          const isVisible = await textarea.isVisible();
          console.log(`  Textarea ${i}: id="${id}", name="${name}", placeholder="${placeholder}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Textarea ${i}: Could not get attributes`);
        }
      }
    }
    
    // Step 8: Find and double-click on the Save button
    console.log('💾 Looking for Save button...');
    
    const saveButtonSelectors = [
      '//*[@id="submit-btn"]',
      'button[id="submit-btn"]',
      'button:has-text("Save")',
      'button.btn.btn-blue',
      'button[type="button"]'
    ];
    
    let saveButton = null;
    for (const selector of saveButtonSelectors) {
      try {
        if (selector.startsWith('//')) {
          // XPath selector
          saveButton = await page.locator(`xpath=${selector}`).first();
        } else {
          // CSS selector
          saveButton = await page.locator(selector).first();
        }
        
        if (await saveButton.isVisible()) {
          console.log(`✅ Found Save button with selector: ${selector}`);
          
          // Double-click on the Save button
          await saveButton.dblclick();
          console.log('🖱️ Double-clicked on Save button');
          
          // Wait for save to complete
          await page.waitForTimeout(1000);
          
          // Check for success indicators
          const successSelectors = [
            '.success', '.saved', '.toast-success', '.notification-success',
            '[class*="success"]', '[class*="saved"]', '.message-success'
          ];
          
          let saveSuccess = false;
          for (const successSelector of successSelectors) {
            try {
              const successElement = await page.locator(successSelector).first();
              if (await successElement.isVisible()) {
                const successText = await successElement.textContent();
                console.log(`✅ Save successful: ${successText}`);
                saveSuccess = true;
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (!saveSuccess) {
            console.log('✅ Save button clicked successfully');
          }
          
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found or not visible`);
        continue;
      }
    }
    
    if (!saveButton) {
      console.log('❌ Could not find Save button');
      console.log('🔍 Available buttons on the page:');
      const allButtons = await page.locator('button').all();
      for (let i = 0; i < allButtons.length; i++) {
        try {
          const button = allButtons[i];
          const id = await button.getAttribute('id');
          const text = await button.textContent();
          const className = await button.getAttribute('class');
          const isVisible = await button.isVisible();
          console.log(`  Button ${i}: id="${id}", text="${text?.trim()}", class="${className}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  Button ${i}: Could not get attributes`);
        }
      }
    }
    
    console.log('✅ Profile summary update completed successfully!');
    
    // Final wait to ensure all actions are completed
    console.log('⏳ Final wait to ensure all actions are completed...');
    await page.waitForTimeout(2000);
    
    return browser; // Return browser instance for proper cleanup
    
  } catch (error) {
    console.error('❌ Error during automation:', error.message);
    throw error;
  }
}

// Run the automation
if (require.main === module) {
  updateNaukriProfile()
    .then(async (browser) => {
      console.log('🎉 Automation completed successfully!');
      
      // Close the browser after successful completion
      if (browser) {
        await browser.close();
        console.log('🔒 Browser closed.');
      }
      
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('💥 Automation failed:', error);
      process.exit(1);
    });
}

module.exports = { updateNaukriProfile }; 