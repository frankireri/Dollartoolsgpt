# Firebase Admin Setup Guide

## Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **dollartools-e36ab**
3. Click the gear icon ⚙️ → **Project settings**
4. Navigate to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file

## Add to `.env.local`

... (existing content)

## Paystack Subscription Setup

1. Go to your **Paystack Dashboard** -> **Plans**.
2. Click **Create Plan**.
3. Name: `Monthly Pro`
4. Interval: `Monthly`
5. Amount: `130` (KES) or equivalent to $1.
6. Copy the **Plan Code** (it looks like `PLN_xxxxxxxx`).
7. If your code is different from `PLN_MONTHLY_PRO`, update it in `src/components/shop/CreditShop.tsx`.

## Dispatcher Setup (For Multiple Apps)

**IMPORTANT:** Keep the quotes around `FIREBASE_PRIVATE_KEY` and preserve the `\n` characters.

## Virtualmin Server Setup

SSH into your Virtualmin server and run:

```bash
# Create directories
sudo mkdir -p /var/www/dollartoolsgpt/user-files/projects
sudo mkdir -p /var/www/dollartoolsgpt/user-files/temp

# Set ownership (replace 'nodejs' with your Node.js user)
sudo chown -R nodejs:nodejs /var/www/dollartoolsgpt/user-files

# Set permissions
sudo chmod -R 755 /var/www/dollartoolsgpt/user-files
```

## Verify Installation

1. Restart your Next.js dev server: `npm run dev`
2. Check that no errors appear in the console
3. Try uploading a file from a tool
4. Check the My Projects page to see it listed

## Troubleshooting

### "Unauthorized" errors
- Verify Firebase credentials are correct
- Check that the private key has `\n` preserved
- Ensure user is logged in with Google

### "Failed to upload file" errors
- Check directory permissions on server
- Verify `USER_FILES_PATH` points to correct directory
- Check file size limits

### Files not appearing
- Check Firestore rules allow read/write
- Verify API routes are accessible
- Check browser console for errors
