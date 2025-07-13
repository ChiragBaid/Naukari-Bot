# Naukari Bot 🤖

An automated GitHub Actions workflow that updates your Naukri.com profile by making a small change (adding and removing a space) to keep your profile active.

## ⚠️ Important Disclaimer

This automation is for educational purposes. Please ensure you comply with Naukri.com's Terms of Service. The script makes minimal changes to avoid detection, but use at your own risk.

## 🚀 Features

- **Automated Login**: Securely logs into Naukri.com using stored credentials
- **Profile Update**: Finds and updates your profile summary
- **Minimal Changes**: Adds and removes a space to trigger a "change" without affecting content
- **Scheduled Execution**: Runs daily at 9 AM UTC via GitHub Actions
- **Manual Trigger**: Can be run manually when needed
- **Error Handling**: Takes screenshots on failure for debugging

## 📋 Prerequisites

1. **GitHub Account**: To use GitHub Actions
2. **Naukri.com Account**: Active account with login credentials
3. **Repository**: This code in a GitHub repository

## 🔧 Setup Instructions

### 1. Repository Setup

1. Fork or clone this repository to your GitHub account
2. Ensure all files are present in your repository

### 2. GitHub Secrets Configuration

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:

- `NAUKRI_USERNAME`: Your Naukri.com username/email
- `NAUKRI_PASSWORD`: Your Naukri.com password

### 3. Verify File Structure

Your repository should have:
```
├── .github/workflows/naukari-bot.yml
├── src/naukari-bot.js
├── package.json
├── playwright.config.js
└── README.md
```

## 🎯 How It Works

1. **Login**: Navigates to Naukri.com and logs in using your credentials
2. **Profile Navigation**: Goes to your profile page
3. **Edit Mode**: Finds and clicks the edit button for your profile summary
4. **Update**: Adds a space to the end of your summary, then removes it
5. **Save**: Saves the changes to update your profile timestamp

## ⚙️ Configuration

### Schedule
The workflow runs daily at 9 AM UTC. To change this, edit the cron expression in `.github/workflows/naukari-bot.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # Change this to your preferred time
```

### Manual Execution
You can manually trigger the workflow:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Naukari Profile Updater**
4. Click **Run workflow**

## 🔍 Troubleshooting

### Common Issues

1. **Login Failed**: Check your credentials in GitHub Secrets
2. **Element Not Found**: Naukri.com may have updated their UI
3. **Timeout Errors**: Network issues or slow loading

### Debug Mode

If the automation fails:
1. Check the GitHub Actions logs
2. Look for error screenshots in the artifacts
3. Update selectors in `src/naukari-bot.js` if needed

## 🛡️ Security Notes

- Credentials are stored securely in GitHub Secrets
- The script runs in a headless environment
- No data is logged or stored outside of GitHub Actions
- Screenshots are only taken on failure for debugging

## 📝 Customization

### Changing Selectors
If Naukri.com updates their UI, you may need to update the selectors in `src/naukari-bot.js`:

```javascript
const editSelectors = [
  'button[data-testid="edit-summary"]',
  '.edit-summary-btn',
  // Add new selectors here
];
```

### Adding More Actions
You can extend the script to perform other profile updates by adding more steps after the summary update.

## 📄 License

MIT License - feel free to modify and use as needed.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This automation is designed to be respectful and make minimal changes. Please use responsibly and in accordance with Naukri.com's terms of service. 