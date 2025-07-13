const { chromium } = require('playwright');

async function testLogin() {
  const browser = await chromium.launch({ 
    headless: false, // Run in visible mode for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Naukri.com login selectors...');
    
    // Navigate to login page
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📱 Navigated to login page');
    await page.waitForTimeout(3000);
    
    // Test username field
    console.log('🔍 Testing username field...');
    const usernameField = await page.locator('input[id="usernameField"]').first();
    if (await usernameField.isVisible()) {
      console.log('✅ Username field found!');
      await usernameField.fill('test@example.com');
      console.log('✅ Username filled');
    } else {
      console.log('❌ Username field not visible');
    }
    
    // Test password field
    console.log('🔍 Testing password field...');
    const passwordField = await page.locator('input[id="passwordField"]').first();
    if (await passwordField.isVisible()) {
      console.log('✅ Password field found!');
      await passwordField.fill('testpassword');
      console.log('✅ Password filled');
    } else {
      console.log('❌ Password field not visible');
    }
    
    // Test login button
    console.log('🔍 Testing login button...');
    const loginButton = await page.locator('button:has-text("Login")').first();
    if (await loginButton.isVisible()) {
      console.log('✅ Login button found!');
      console.log('📸 Taking screenshot before clicking login...');
      await page.screenshot({ path: 'before-login.png' });
      
      // Click the login button
      await loginButton.click();
      console.log('✅ Login button clicked');
      
      // Wait and check what happens
      await page.waitForTimeout(5000);
      const currentUrl = page.url();
      console.log(`📍 Current URL after login click: ${currentUrl}`);
      
      // Take screenshot after login attempt
      await page.screenshot({ path: 'after-login.png' });
      console.log('📸 Screenshot after login saved');
      
      // Check for error messages
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
          }
        } catch (e) {
          continue;
        }
      }
      
    } else {
      console.log('❌ Login button not visible');
    }
    
    console.log('\n⏳ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
}

testLogin()
  .then(() => {
    console.log('🎉 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }); 