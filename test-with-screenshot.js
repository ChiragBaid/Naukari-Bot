const { chromium } = require('playwright');

async function testWithScreenshot() {
  const browser = await chromium.launch({ 
    headless: false, // Run in visible mode to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Naukri.com login with screenshot...');
    
    // Navigate to login page
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📱 Navigated to login page');
    await page.screenshot({ path: '1-login-page.png' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Fill username
    console.log('🔍 Filling username...');
    const usernameField = await page.locator('input[id="usernameField"]').first();
    if (await usernameField.isVisible()) {
      await usernameField.fill('chiragbaid123@gmail.com');
      console.log('✅ Username filled');
    }
    
    // Fill password
    console.log('🔍 Filling password...');
    const passwordField = await page.locator('input[id="passwordField"]').first();
    if (await passwordField.isVisible()) {
      await passwordField.fill('Ch@140903');
      console.log('✅ Password filled');
    }
    
    await page.screenshot({ path: '2-credentials-filled.png' });
    
    // Click login button
    console.log('🔍 Clicking login button...');
    const loginButton = await page.locator('button:has-text("Login")').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      console.log('✅ Login button clicked');
      
      // Wait for login to process
      await page.waitForTimeout(5000);
      await page.screenshot({ path: '3-after-login-click.png' });
      
      // Try to access profile page
      console.log('🔍 Accessing profile page...');
      await page.goto('https://www.naukri.com/mnjuser/profile', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '4-profile-page.png' });
      
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('profile') && !currentUrl.includes('login')) {
        console.log('✅ Successfully accessed profile page!');
        
        // Take a full page screenshot
        await page.screenshot({ 
          path: '5-profile-page-full.png',
          fullPage: true 
        });
        
        console.log('📸 Screenshots saved:');
        console.log('  - 1-login-page.png');
        console.log('  - 2-credentials-filled.png');
        console.log('  - 3-after-login-click.png');
        console.log('  - 4-profile-page.png');
        console.log('  - 5-profile-page-full.png');
        
      } else {
        console.log('❌ Could not access profile page');
      }
      
    } else {
      console.log('❌ Login button not found');
    }
    
    console.log('\n⏳ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
}

testWithScreenshot()
  .then(() => {
    console.log('🎉 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }); 