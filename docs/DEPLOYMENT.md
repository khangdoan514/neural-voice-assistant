# **Full Deployment Guide**

Both frontend and backend changed, or complete deployment needed.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Pull latest code**

```bash
cd ~/neural-voice-assistant
git pull origin main
```

### **3. Update and rebuild frontend**

```bash
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/neural-voice-assistant/
```

### **4. Update and restart backend**

```bash
cd ../backend
source ../venv/bin/activate
pip install -r ../requirements.txt
pm2 restart backend
```

### **5. Reload Nginx (if config changed)**

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### **6. Verify frontend is working**

```bash
curl -I https://etpoultry.com
```

### **7. Verify backend API is working**

```bash
curl https://etpoultry.com/api/conversations
```

### **8. Check PM2 status**

```bash
pm2 status
```