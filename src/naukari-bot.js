const { chromium } = require('playwright');

async function updateNaukriProfile() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Naukri.com automation...');
    
    // Step 1: Navigate to Naukri.com login page
    console.log('📱 Navigating to Naukri.com...');
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: 'login-page.png' });
    console.log('📸 Login page screenshot saved');
    
    // Wait a bit for the page to fully load
    await page.waitForTimeout(3000);
    
    // Step 2: Login with credentials
    console.log('🔐 Logging in...');
    
    // Try multiple possible login selectors
    const usernameSelectors = [
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
          console.log(`  Input ${i}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}"`);
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
      'button[type="submit"]',
      'button:has-text("Login")',
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
          console.log(`  Button ${i}: text="${text?.trim()}", type="${type}", class="${className}"`);
        } catch (e) {
          console.log(`  Button ${i}: Could not get attributes`);
        }
      }
      throw new Error('Could not find login button');
    }
    
    // Wait for login to complete or check for error messages
    console.log('⏳ Waiting for login to complete...');
    try {
      await page.waitForURL('**/naukri.com/**', { timeout: 30000 });
      console.log('✅ Login successful');
    } catch (error) {
      console.log('❌ Login redirect failed, checking for errors...');
      
      // Take a screenshot to see what happened
      await page.screenshot({ path: 'login-error.png' });
      console.log('📸 Login error screenshot saved');
      
      // Check if there's an error message on the page
      const errorSelectors = [
        '.error', '.alert', '[data-testid="error"]', 
        '.error-message', '.login-error', '.invalid-credentials',
        '[class*="error"]', '[class*="alert"]'
      ];
      
      for (const selector of errorSelectors) {
        try {
          const errorMessage = await page.locator(selector).first();
          if (await errorMessage.isVisible()) {
            const errorText = await errorMessage.textContent();
            console.log(`❌ Found error message: ${errorText}`);
            throw new Error(`Login failed: ${errorText}`);
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check current URL to see where we ended up
      const currentUrl = page.url();
      console.log(`❌ Current URL after login attempt: ${currentUrl}`);
      
      throw new Error('Login failed: Could not redirect to dashboard');
    }
    
    // Step 3: Navigate to profile page
    console.log('👤 Navigating to profile...');
    await page.goto('https://www.naukri.com/mnjuser/profile', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Step 4: Wait for profile to load and find the summary section
    console.log('📝 Looking for profile summary...');
    await page.waitForSelector('.profile-summary, .summary-section, [data-testid="profile-summary"]', { 
      timeout: 30000 
    });
    
    // Step 5: Click on edit button for summary (try multiple possible selectors)
    const editSelectors = [
      'button[data-testid="edit-summary"]',
      '.edit-summary-btn',
      'button:has-text("Edit")',
      '.profile-edit-btn',
      '[aria-label="Edit summary"]'
    ];
    
    let editButton = null;
    for (const selector of editSelectors) {
      try {
        editButton = await page.locator(selector).first();
        if (await editButton.isVisible()) {
          await editButton.click();
          console.log('✏️ Edit button clicked');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!editButton) {
      throw new Error('Could not find edit button for profile summary');
    }
    
    // Step 6: Wait for the textarea/input to become editable
    await page.waitForTimeout(2000);
    
    // Step 7: Find the summary textarea/input
    const summarySelectors = [
      'textarea[name="summary"]',
      'textarea[data-testid="summary-input"]',
      '.summary-textarea',
      'textarea',
      'input[type="text"]'
    ];
    
    let summaryInput = null;
    for (const selector of summarySelectors) {
      try {
        summaryInput = await page.locator(selector).first();
        if (await summaryInput.isVisible()) {
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!summaryInput) {
      throw new Error('Could not find summary input field');
    }
    
    // Step 8: Get current summary text
    const currentText = await summaryInput.inputValue();
    console.log('📄 Current summary length:', currentText.length);
    
    // Step 9: Add a space at the end and then remove it
    const textWithSpace = currentText + '123';
    await summaryInput.fill(textWithSpace);
    await page.waitForTimeout(1000);
    
    const textWithoutSpace = currentText;
    await summaryInput.fill(textWithoutSpace);
    console.log('🔄 Summary updated (space added and removed)');
    
    // Step 10: Save changes
    const saveSelectors = [
      'button[data-testid="save-summary"]',
      'button:has-text("Save")',
      '.save-btn',
      'button[type="submit"]'
    ];
    
    let saveButton = null;
    for (const selector of saveSelectors) {
      try {
        saveButton = await page.locator(selector).first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          console.log('💾 Changes saved');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!saveButton) {
      throw new Error('Could not find save button');
    }
    
    // Step 11: Wait for save confirmation
    await page.waitForTimeout(3000);
    
    console.log('✅ Profile update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during automation:', error.message);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved as error-screenshot.png');
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the automation
if (require.main === module) {
  updateNaukriProfile()
    .then(() => {
      console.log('🎉 Automation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Automation failed:', error);
      process.exit(1);
    });
}

module.exports = { updateNaukriProfile }; 