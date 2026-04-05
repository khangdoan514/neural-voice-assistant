# **Frontend Update Guide**

Only changed React components, CSS, or frontend JavaScript.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Navigate to frontend**

```bash
cd ~/neural-voice-assistant/frontend
```

### **3. Pull latest code (if using git)**

```bash
git pull origin main
```

### **4. Install new dependencies (if any)**

```bash
npm install
```

### **5. Rebuild the application**

```bash
npm run build
```

### **6. Deploy to web server**

```bash
sudo cp -r dist/* /var/www/neural-voice-assistant/
```

### **7. Verify deployment**

```bash
curl -I https://etpoultry.com
```