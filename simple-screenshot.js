const { chromium } = require('playwright');

async function simpleScreenshot() {
  const browser = await chromium.launch({ 
    headless: false, // Run in visible mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Taking screenshot after login...');
    
    // Navigate to login page
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📱 On login page');
    await page.screenshot({ path: 'login-page.png' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Fill username
    const usernameField = await page.locator('input[id="usernameField"]').first();
    await usernameField.fill('chiragbaid123@gmail.com');
    console.log('✅ Username filled');
    
    // Fill password
    const passwordField = await page.locator('input[id="passwordField"]').first();
    await passwordField.fill('Ch@140903');
    console.log('✅ Password filled');
    
    // Click login button
    const loginButton = await page.locator('button:has-text("Login")').first();
    await loginButton.click();
    console.log('✅ Login button clicked');
    
    // Wait for login to process
    await page.waitForTimeout(8000);
    
    // Take screenshot after login
    await page.screenshot({ path: 'after-login.png' });
    console.log('📸 Screenshot after login saved as after-login.png');
    
    // Get current URL
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // Wait for manual inspection
    console.log('\n⏳ Waiting 15 seconds for manual inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
}

simpleScreenshot()
  .then(() => {
    console.log('🎉 Screenshot test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Screenshot test failed:', error);
    process.exit(1);
  }); 