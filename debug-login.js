const { chromium } = require('playwright');

async function debugLogin() {
  const browser = await chromium.launch({ 
    headless: false, // Run in visible mode for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Naukri.com login debug...');
    
    // Navigate to login page
    await page.goto('https://www.naukri.com/nlogin/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📱 Navigated to login page');
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'debug-login-page.png' });
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // List all input fields
    console.log('\n🔍 All input fields on the page:');
    const allInputs = await page.locator('input').all();
    for (let i = 0; i < allInputs.length; i++) {
      try {
        const input = allInputs[i];
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        const className = await input.getAttribute('class');
        const isVisible = await input.isVisible();
        console.log(`  Input ${i}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}", class="${className}", visible=${isVisible}`);
      } catch (e) {
        console.log(`  Input ${i}: Could not get attributes`);
      }
    }
    
    // List all buttons
    console.log('\n🔍 All buttons on the page:');
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
    
    // List all forms
    console.log('\n🔍 All forms on the page:');
    const allForms = await page.locator('form').all();
    for (let i = 0; i < allForms.length; i++) {
      try {
        const form = allForms[i];
        const action = await form.getAttribute('action');
        const method = await form.getAttribute('method');
        const className = await form.getAttribute('class');
        console.log(`  Form ${i}: action="${action}", method="${method}", class="${className}"`);
      } catch (e) {
        console.log(`  Form ${i}: Could not get attributes`);
      }
    }
    
    console.log('\n⏳ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error during debug:', error.message);
  } finally {
    await browser.close();
  }
}

debugLogin()
  .then(() => {
    console.log('🎉 Debug completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Debug failed:', error);
    process.exit(1);
  }); 